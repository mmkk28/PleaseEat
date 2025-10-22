const router = require('express').Router()
const RecipeController = require('../controllers/recipeController')
const { validateInputSchema } = require('../middleware/validationSchema')
const { createRecipeInputSchema } = require('../schema/Recipe/createRecipe')

router.post(
  '/create',
  validateInputSchema(createRecipeInputSchema),
  RecipeController.createRecipe
)

module.exports = router
