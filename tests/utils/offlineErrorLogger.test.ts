import { expect } from 'chai'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

describe('offlineErrorLogger', () => {
  let saveError: any
  let getUnsavedErrors: any
  let clearErrors: any
  let appendFile: sinon.SinonStub
  let readFile: sinon.SinonStub
  let unlink: sinon.SinonStub
  let existsSync: sinon.SinonStub

  beforeEach(() => {
    appendFile = sinon.stub().resolves()
    readFile = sinon.stub()
    unlink = sinon.stub().resolves()
    existsSync = sinon.stub()

    // fs/promises is used as a default import, so proxyquire injects the module
    // object directly (esModuleInterop's __importDefault will wrap it as { default: ... })
    const module = proxyquire('../../src/utils/offlineErrorLogger', {
      'fs/promises': { appendFile, readFile, unlink },
      'fs': { existsSync }
    })
    saveError = module.saveError
    getUnsavedErrors = module.getUnsavedErrors
    clearErrors = module.clearErrors
  })

  afterEach(() => sinon.restore())

  describe('saveError', () => {
    it('appends a JSON line with a generated localId to the file', async () => {
      await saveError({ message: 'test error', statusCode: 500 })
      expect(appendFile.calledOnce).to.be.true
      const written = appendFile.firstCall.args[1]
      const parsed = JSON.parse(written.trim())
      expect(parsed.localId).to.be.a('string')
      expect(parsed.message).to.equal('test error')
      expect(parsed.statusCode).to.equal(500)
    })
  })

  describe('getUnsavedErrors', () => {
    it('returns empty array when the file does not exist', async () => {
      existsSync.returns(false)
      const result = await getUnsavedErrors()
      expect(result).to.deep.equal([])
    })

    it('parses a JSONL file and returns all error objects', async () => {
      existsSync.returns(true)
      const line1 = JSON.stringify({ localId: '1', message: 'err1' })
      const line2 = JSON.stringify({ localId: '2', message: 'err2' })
      readFile.resolves(`${line1}\n${line2}\n`)
      const result = await getUnsavedErrors()
      expect(result).to.have.lengthOf(2)
      expect(result[0].message).to.equal('err1')
      expect(result[1].message).to.equal('err2')
    })

    it('skips corrupted lines without throwing', async () => {
      existsSync.returns(true)
      const good = JSON.stringify({ localId: '1', message: 'err1' })
      readFile.resolves(`${good}\nnot-valid-json\n`)
      const result = await getUnsavedErrors()
      expect(result).to.have.lengthOf(1)
      expect(result[0].message).to.equal('err1')
    })
  })

  describe('clearErrors', () => {
    it('deletes the file when it exists', async () => {
      existsSync.returns(true)
      await clearErrors()
      expect(unlink.calledOnce).to.be.true
    })

    it('does nothing when the file does not exist', async () => {
      existsSync.returns(false)
      await clearErrors()
      expect(unlink.called).to.be.false
    })
  })
})
