import { Error } from 'mongoose'
import { createRecipe as createRecipeAction } from '../actions/recipe/createRecipe'
import { createRecipeOutputSchema } from '../schema/Recipe/createRecipe'
import { validateOutputSchema } from '../middleware/validationSchema'

const createRecipe = async (req: any, res: any) => {
  try {
    const recipeData = req.body
    const result = await createRecipeAction(recipeData)

    if (!validateOutputSchema(createRecipeOutputSchema, result)) {
      return res.status(500).json({
        status: 'error',
        message: 'Output validation failed'
      })
    }
    res.status(201).json(result)
  } catch (error: Error | any) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export { createRecipe }
