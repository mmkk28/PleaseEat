const Recipe = require('../models/recipes')
import ErrorLog from '../models/errorlog'

export const createRecipe = async (recipe: any): Promise<any> => {
  return await Recipe.create(recipe)
}

export const getRecipeById = async (id: string): Promise<any> => {
  return await Recipe.findById(id)
}

export const getAllRecipes = async (): Promise<any> => {
  return await Recipe.find()
}

// === Error Logging Database Actions ===
export const saveErrorLog = async (errorData: any): Promise<any> => {
  return await ErrorLog.create(errorData)
}

export const saveMultipleErrorLogs = async (errorsArray: any[]): Promise<any> => {
  return await ErrorLog.insertMany(errorsArray, { ordered: false })
}
