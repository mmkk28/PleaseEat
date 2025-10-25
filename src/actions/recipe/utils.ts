export const transformRecipe = (recipe: any) => {
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
