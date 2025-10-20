const router = require('express').Router()
const RecipeController = require('../controllers/recipeController')
const { validateInputSchema } = require('../middleware/validationSchema')
const { createRecipeSchema } = require('../schema/Recipe/createRecipe')

router.post(
  '/create',
  validateInputSchema(createRecipeSchema),
  RecipeController.createRecipe
)

module.exports = router
