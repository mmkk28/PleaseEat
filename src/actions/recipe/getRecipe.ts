const { getRecipeById } = require('../../db/functionHandler')
import { type GetRecipeInput } from '../../schema/Recipe/getRecipe'
const { transformRecipe } = require('./utils')

export const getRecipe = async (id: GetRecipeInput) => {
  try {
    const result = await getRecipeById(id)
    if (!result) {
      return {
        status: 'status',
        message: 'Recipe not found'
      }
    }

    const recipe = transformRecipe(result)
    return {
      status: 'success',
      recipe: recipe
    }
  } catch (error: Error | any) {
    throw new Error('Error getting recipe: ' + error.message)
  }
}
