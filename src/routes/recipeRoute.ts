const router = require('express').Router()
const RecipeController = require('../controllers/recipeController')
const { validateInputSchema } = require('../middleware/validationSchema')

//schema
const { createRecipeInputSchema } = require('../schema/Recipe/createRecipe')
const { getRecipeInputSchema } = require('../schema/Recipe/getRecipe')

router.post(
  '/create',
  validateInputSchema(createRecipeInputSchema),
  RecipeController.createRecipe
)

router.get(
  '/:id',
  validateInputSchema(getRecipeInputSchema, 'params'),
  RecipeController.getRecipe
)

module.exports = router
