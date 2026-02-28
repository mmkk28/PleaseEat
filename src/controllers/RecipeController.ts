import { Error } from 'mongoose'

// Actions
import { RecipeActions } from '../actions/recipe'

// Schemas
import { createRecipeOutputSchema } from '../schema/Recipe/createRecipe'
import { getRecipeOutputSchema } from '../schema/Recipe/getRecipe'
import { getRecipesOutputSchema } from '../schema/Recipe/getRecipes'

const createRecipe = async (req: any, res: any) => {
  try {
    const recipeData = req.body
    const result = await RecipeActions.createRecipe(recipeData)
    res.status(201).json(result)
  } catch (error: Error | any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getRecipe = async (req: any, res: any) => {
  try {
    const recipeId = req.params.id
    const result = await RecipeActions.getRecipe(recipeId)
    res.status(200).json(result)
  } catch (error: Error | any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getAllRecipes = async (req: any, res: any) => {
  try {
    const result = await RecipeActions.getAllRecipe()
    res.status(200).json(result)
  } catch (error: Error | any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export { createRecipe, getRecipe, getAllRecipes }
