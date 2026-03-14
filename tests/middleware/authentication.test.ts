import { expect } from 'chai'
import sinon from 'sinon'
import { authenticateCookie } from '../../src/middleware/authentication'

describe('authenticateCookie', () => {
  let req: any
  let res: any
  let next: sinon.SinonSpy

  beforeEach(() => {
    next = sinon.spy()
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      cookie: sinon.stub()
    }
  })

  afterEach(() => sinon.restore())

  it('rejects non-GET requests without a session token with 401', () => {
    req = { cookies: {}, method: 'POST' }
    authenticateCookie(req, res, next)
    expect(res.status.calledWith(401)).to.be.true
    expect(next.called).to.be.false
  })

  it('generates a new PE-prefixed token for GET requests without a session token', () => {
    req = { cookies: {}, method: 'GET' }
    authenticateCookie(req, res, next)
    const [cookieName, cookieValue] = res.cookie.firstCall.args
    expect(cookieName).to.equal('sessionToken')
    expect(cookieValue).to.match(/^PE/)
    expect(next.calledOnce).to.be.true
  })

  it('calls next without touching cookies for already-authenticated requests', () => {
    req = { cookies: { sessionToken: 'PEexisting-token' }, method: 'POST' }
    authenticateCookie(req, res, next)
    expect(next.calledOnce).to.be.true
    expect(res.status.called).to.be.false
    expect(res.cookie.called).to.be.false
  })
})
