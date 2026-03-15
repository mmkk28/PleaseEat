import { expect } from 'chai'
import { transformRecipe } from '../../src/actions/recipe/utils'

describe('transformRecipe', () => {
  const makeDoc = (overrides: Record<string, any> = {}) => ({
    toObject: () => ({
      _id: 'some-id',
      __v: 0,
      title: 'Pasta',
      ingredients: ['pasta', 'water'],
      instructions: 'Boil pasta.',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
      ...overrides
    })
  })

  it('removes _id and __v', () => {
    const result = transformRecipe(makeDoc())
    expect(result).to.not.have.property('_id')
    expect(result).to.not.have.property('__v')
  })

  it('converts timestamps to ISO strings', () => {
    const result = transformRecipe(makeDoc())
    expect(result.createdAt).to.equal('2024-01-01T00:00:00.000Z')
    expect(result.updatedAt).to.equal('2024-01-02T00:00:00.000Z')
  })

  it('sets timestamps to null when absent', () => {
    const result = transformRecipe(makeDoc({ createdAt: null, updatedAt: null }))
    expect(result.createdAt).to.be.null
    expect(result.updatedAt).to.be.null
  })

  it('preserves other recipe fields', () => {
    const result = transformRecipe(makeDoc())
    expect(result.title).to.equal('Pasta')
    expect(result.ingredients).to.deep.equal(['pasta', 'water'])
    expect(result.instructions).to.equal('Boil pasta.')
  })
})
