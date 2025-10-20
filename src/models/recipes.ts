const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    prepTime: { type: Number }, // in minutes
    cookTime: { type: Number }, // in minutes
    servings: { type: Number },
    imageUrl: { type: String },
    tags: { type: [String] }
  },
  {
    timestamps: true,
    unique: true,
    collection: 'recipes'
  }
)

module.exports = mongoose.model('recipes', RecipeSchema)
