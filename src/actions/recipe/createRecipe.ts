const { createRecipe: createRecipeInDB } = require('../../db/functionHandler')
import { type CreateRecipeInput } from '../../schema/Recipe/createRecipe'

export const createRecipe = async (recipeData: CreateRecipeInput) => {
  try {
    await createRecipeInDB(recipeData)
    return {
      status: 'success',
      message: 'Recipe created successfully'
    }
  } catch {
    throw new Error('An error occurred (#RC01) Please try again')
  }
}
