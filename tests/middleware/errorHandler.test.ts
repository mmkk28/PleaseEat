import { expect } from 'chai'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

describe('errorHandler', () => {
  let errorHandler: any
  let saveErrorLog: sinon.SinonStub
  let saveError: sinon.SinonStub
  let req: any
  let res: any
  let next: sinon.SinonSpy

  beforeEach(() => {
    saveErrorLog = sinon.stub()
    saveError = sinon.stub()
    const module = proxyquire('../../src/middleware/errorHandler', {
      '../db/functionHandler': { saveErrorLog },
      '../utils/offlineErrorLogger': { saveError }
    })
    errorHandler = module.errorHandler
    next = sinon.spy()
    req = { method: 'GET', originalUrl: '/test', user: null }
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    }
  })

  afterEach(() => sinon.restore())

  it('saves to DB and returns 500 for server errors', async () => {
    saveErrorLog.resolves()
    await errorHandler({ message: 'Crash', stack: 'stack', status: 500 }, req, res, next)
    expect(saveErrorLog.calledOnce).to.be.true
    expect(res.status.calledWith(500)).to.be.true
    expect(res.json.calledWith({ message: 'Internal Server Error' })).to.be.true
  })

  it('falls back to offline logger when DB fails', async () => {
    saveErrorLog.rejects(new Error('DB down'))
    saveError.resolves()
    await errorHandler({ message: 'Crash', stack: 'stack', status: 500 }, req, res, next)
    expect(saveError.calledOnce).to.be.true
    expect(res.status.calledWith(500)).to.be.true
  })

  it('returns a generic message for non-500 errors', async () => {
    saveErrorLog.resolves()
    await errorHandler({ message: 'Not found', stack: 'stack', status: 404 }, req, res, next)
    expect(res.status.calledWith(404)).to.be.true
    expect(res.json.calledWith({ message: 'something went wrong, please try again later' })).to.be.true
  })

  it('defaults to status 500 when error has no status', async () => {
    saveErrorLog.resolves()
    await errorHandler({ message: 'Unknown' }, req, res, next)
    expect(res.status.calledWith(500)).to.be.true
  })
})
