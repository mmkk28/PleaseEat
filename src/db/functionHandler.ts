const Recipe = require('../models/recipes')

export const createRecipe = async (recipe: any): Promise<any> => {
  return await Recipe.create(recipe)
}

export const getRecipeById = async (id: string): Promise<any> => {
  return await Recipe.findById(id)
}
