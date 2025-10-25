const { getAllRecipes } = require('../../db/functionHandler')

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
