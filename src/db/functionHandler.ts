const Recipe = require('../models/recipes')

export const createRecipe = async (recipe: any): Promise<any> => {
  return await Recipe.create(recipe)
}
