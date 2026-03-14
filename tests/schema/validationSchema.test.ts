import { expect } from 'chai'
import sinon from 'sinon'
import { JSONSchemaType } from 'ajv'
import { validateInputSchema } from '../../src/schema/validationSchema'

interface TestInput {
  name: string
  age: number
}

const schema: JSONSchemaType<TestInput> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name', 'age'],
  additionalProperties: false
}

describe('validateInputSchema', () => {
  let res: any
  let next: sinon.SinonSpy

  beforeEach(() => {
    next = sinon.spy()
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    }
  })

  afterEach(() => sinon.restore())

  it('returns 404 when required fields are missing from body', () => {
    const middleware = validateInputSchema(schema, 'body')
    middleware({ body: { name: 'Alice' } } as any, res, next)
    expect(res.status.calledWith(404)).to.be.true
    expect(next.called).to.be.false
  })

  it('returns 404 when body contains additional properties', () => {
    const middleware = validateInputSchema(schema, 'body')
    middleware({ body: { name: 'Alice', age: 30, extra: true } } as any, res, next)
    expect(res.status.calledWith(404)).to.be.true
  })

  it('does not send an error response for valid body data', () => {
    const middleware = validateInputSchema(schema, 'body')
    middleware({ body: { name: 'Alice', age: 30 } } as any, res, next)
    expect(res.status.called).to.be.false
  })

  it('validates params when type is "params"', () => {
    const middleware = validateInputSchema(schema, 'params')
    middleware({ params: { name: 'Alice' } } as any, res, next)
    expect(res.status.calledWith(404)).to.be.true
  })
})
