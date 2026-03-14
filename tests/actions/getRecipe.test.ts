import { expect } from 'chai'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

const makeDoc = (title = 'Pasta') => ({
  toObject: () => ({
    title,
    ingredients: ['pasta'],
    instructions: 'Boil.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  })
})

describe('getRecipe action', () => {
  let getRecipe: any
  let getRecipeById: sinon.SinonStub

  beforeEach(() => {
    getRecipeById = sinon.stub()
    const module = proxyquire('../../src/actions/recipe/getRecipe', {
      '../../db/functionHandler': { getRecipeById }
    })
    getRecipe = module.getRecipe
  })

  afterEach(() => sinon.restore())

  it('returns not found when DB returns null', async () => {
    getRecipeById.resolves(null)
    const result = await getRecipe('some-id')
    expect(result).to.deep.equal({ status: 'status', message: 'Recipe not found' })
  })

  it('returns transformed recipe on success', async () => {
    getRecipeById.resolves(makeDoc())
    const result = await getRecipe('some-id')
    expect(result.status).to.equal('success')
    expect(result.recipe).to.not.have.property('_id')
    expect(result.recipe.title).to.equal('Pasta')
  })

  it('throws on DB error', async () => {
    getRecipeById.rejects(new Error('DB down'))
    try {
      await getRecipe('some-id')
      expect.fail('Should have thrown')
    } catch (err: any) {
      expect(err.message).to.equal('An error occurred (#RC03) Please try again')
    }
  })
})
