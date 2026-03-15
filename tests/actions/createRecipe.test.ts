import { expect } from 'chai'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

describe('createRecipe action', () => {
  let createRecipe: any
  let createRecipeInDB: sinon.SinonStub

  const validInput = { title: 'Pasta', ingredients: ['pasta'], instructions: 'Boil.' }

  beforeEach(() => {
    createRecipeInDB = sinon.stub()
    const module = proxyquire('../../src/actions/recipe/createRecipe', {
      '../../db/functionHandler': { createRecipe: createRecipeInDB }
    })
    createRecipe = module.createRecipe
  })

  afterEach(() => sinon.restore())

  it('returns success message with recipe ID on success', async () => {
    createRecipeInDB.resolves({ _id: 'abc123' })
    const result = await createRecipe(validInput)
    expect(result).to.deep.equal({
      status: 'success',
      message: 'Recipe created successfully with ID: abc123'
    })
  })

  it('throws on DB failure', async () => {
    createRecipeInDB.rejects(new Error('DB down'))
    try {
      await createRecipe(validInput)
      expect.fail('Should have thrown')
    } catch (err: any) {
      expect(err.message).to.equal('An error occurred (#RC01) Please try again')
    }
  })
})
