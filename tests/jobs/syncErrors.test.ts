import { expect } from 'chai'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

describe('startErrorSyncJob', () => {
  let clock: sinon.SinonFakeTimers
  let startErrorSyncJob: any
  let getUnsavedErrors: sinon.SinonStub
  let clearErrors: sinon.SinonStub
  let saveMultipleErrorLogs: sinon.SinonStub

  // Minimal fake class to simulate MongoBulkWriteError
  class FakeMongoBulkWriteError extends Error {
    writeErrors: { code: number }[]
    constructor(writeErrors: { code: number }[]) {
      super('bulk write error')
      this.writeErrors = writeErrors
    }
  }

  beforeEach(() => {
    clock = sinon.useFakeTimers()
    getUnsavedErrors = sinon.stub()
    clearErrors = sinon.stub().resolves()
    saveMultipleErrorLogs = sinon.stub()

    const module = proxyquire('../../src/jobs/syncErrors', {
      '../utils/offlineErrorLogger': { getUnsavedErrors, clearErrors },
      '../db/functionHandler': { saveMultipleErrorLogs },
      mongoose: {
        mongo: { MongoBulkWriteError: FakeMongoBulkWriteError },
        '@noCallThru': true
      }
    })
    startErrorSyncJob = module.startErrorSyncJob
  })

  afterEach(() => {
    clock.restore()
    sinon.restore()
  })

  it('does nothing when there are no offline errors', async () => {
    getUnsavedErrors.resolves([])
    startErrorSyncJob()
    await clock.tickAsync(60000)
    expect(saveMultipleErrorLogs.called).to.be.false
    expect(clearErrors.called).to.be.false
  })

  it('syncs errors to DB and clears the file on success', async () => {
    const errors = [{ localId: 'abc', message: 'err1' }]
    getUnsavedErrors.resolves(errors)
    saveMultipleErrorLogs.resolves()
    startErrorSyncJob()
    await clock.tickAsync(60000)
    expect(saveMultipleErrorLogs.calledOnceWith(errors)).to.be.true
    expect(clearErrors.calledOnce).to.be.true
  })

  it('clears the file when all errors are already in DB (duplicates only)', async () => {
    getUnsavedErrors.resolves([{ localId: 'abc', message: 'err1' }])
    saveMultipleErrorLogs.rejects(new FakeMongoBulkWriteError([{ code: 11000 }]))
    startErrorSyncJob()
    await clock.tickAsync(60000)
    expect(clearErrors.calledOnce).to.be.true
  })

  it('does not clear the file when DB fails with a non-duplicate error', async () => {
    getUnsavedErrors.resolves([{ localId: 'abc', message: 'err1' }])
    saveMultipleErrorLogs.rejects(new Error('connection timeout'))
    startErrorSyncJob()
    await clock.tickAsync(60000)
    expect(clearErrors.called).to.be.false
  })

  it('does not clear the file when only some errors are duplicates', async () => {
    getUnsavedErrors.resolves([{ localId: 'abc' }, { localId: 'def' }])
    saveMultipleErrorLogs.rejects(
      new FakeMongoBulkWriteError([{ code: 11000 }, { code: 11001 }])
    )
    startErrorSyncJob()
    await clock.tickAsync(60000)
    expect(clearErrors.called).to.be.false
  })

  it('retries on the next tick after a failed sync', async () => {
    const errors = [{ localId: 'abc', message: 'err1' }]
    getUnsavedErrors.resolves(errors)
    saveMultipleErrorLogs.onFirstCall().rejects(new Error('temporary failure'))
    saveMultipleErrorLogs.onSecondCall().resolves()

    startErrorSyncJob()

    await clock.tickAsync(60000) // first tick — fails
    expect(clearErrors.called).to.be.false

    await clock.tickAsync(60000) // second tick — succeeds
    expect(saveMultipleErrorLogs.callCount).to.equal(2)
    expect(clearErrors.calledOnce).to.be.true
  })
})
