const { getAllRecipes } = require('../../db/functionHandler')
const { transformRecipe } = require('./utils')

export const getAllRecipe = async () => {
  try {
    const result = await getAllRecipes()
    if (!result) {
      return {
        status: 'status',
        message: 'There are no recipes available'
      }
    }

    const recipes = result.map((recipe: any) => transformRecipe(recipe))
    return {
      status: 'success',
      recipe: recipes
    }
  } catch (error: Error | any) {
    throw new Error('An error occurred (#RC02) Please try again')
  }
}
