const { createRecipe: createRecipeInDB } = require('../../db/functionHandler')
import { type CreateRecipeInput } from '../../schema/Recipe/createRecipe'

export const createRecipe = async (recipeData: CreateRecipeInput) => {
  try {
    const result = await createRecipeInDB(recipeData)
    return {
      status: 'success',
      message: 'Recipe created successfully with ID: ' + result._id
    }
  } catch (error: Error | any) {
    throw new Error('Error creating recipe: ' + error.message)
  }
}
