import { Error } from 'mongoose'

// Actions
import { RecipeActions } from '../actions/recipe'

const createRecipe = async (req: any, res: any, next: any) => {
  try {
    const recipeData = req.body
    const result = await RecipeActions.createRecipe(recipeData)
    res.status(201).json(result)
  } catch (error: Error | any) {
    error.status = 500
    next(error)
  }
}

const getRecipe = async (req: any, res: any, next: any) => {
  try {
    const recipeId = req.params.id
    const result = await RecipeActions.getRecipe(recipeId)
    res.status(200).json(result)
  } catch (error: Error | any) {
    error.status = 500
    next(error)
  }
}

const getAllRecipes = async (req: any, res: any, next: any) => {
  try {
    const result = await RecipeActions.getAllRecipe()
    res.status(200).json(result)
  } catch (error: Error | any) {
    error.status = 500
    next(error)
  }
}

export { createRecipe, getRecipe, getAllRecipes }
