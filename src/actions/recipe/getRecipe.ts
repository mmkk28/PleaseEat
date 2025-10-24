const { getRecipeById } = require('../../db/functionHandler')
import { type GetRecipeInput } from '../../schema/Recipe/getRecipe'

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

const transformRecipe = (recipe: any) => {
  let recipeObj = recipe.toObject()
  delete recipeObj._id
  delete recipeObj.__v
  return {
    ...recipeObj,
    createdAt: recipeObj.createdAt
      ? new Date(recipeObj.createdAt).toISOString()
      : null,
    updatedAt: recipeObj.updatedAt
      ? new Date(recipeObj.updatedAt).toISOString()
      : null
  }
}
