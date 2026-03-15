import { expect } from 'chai'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

const makeDoc = (title: string) => ({
  toObject: () => ({
    title,
    ingredients: [],
    instructions: '',
    createdAt: null,
    updatedAt: null
  })
})

describe('getAllRecipe action', () => {
  let getAllRecipe: any
  let getAllRecipes: sinon.SinonStub

  beforeEach(() => {
    getAllRecipes = sinon.stub()
    const module = proxyquire('../../src/actions/recipe/getAllRecipes', {
      '../../db/functionHandler': { getAllRecipes }
    })
    getAllRecipe = module.getAllRecipe
  })

  afterEach(() => sinon.restore())

  it('returns no recipes message when DB returns null', async () => {
    getAllRecipes.resolves(null)
    const result = await getAllRecipe()
    expect(result).to.deep.equal({ status: 'status', message: 'There are no recipes available' })
  })

  it('returns all transformed recipes on success', async () => {
    getAllRecipes.resolves([makeDoc('Pasta'), makeDoc('Rice')])
    const result = await getAllRecipe()
    expect(result.status).to.equal('success')
    expect(result.recipe).to.have.lengthOf(2)
    expect(result.recipe[0].title).to.equal('Pasta')
  })

  it('throws on DB error', async () => {
    getAllRecipes.rejects(new Error('DB down'))
    try {
      await getAllRecipe()
      expect.fail('Should have thrown')
    } catch (err: any) {
      expect(err.message).to.equal('An error occurred (#RC02) Please try again')
    }
  })
})
