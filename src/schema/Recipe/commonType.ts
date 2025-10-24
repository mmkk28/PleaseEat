export interface Recipe {
  title: string
  ingredients: string[]
  instructions: string
  prepTime?: number // in minutes
  cookTime?: number // in minutes
  servings?: number
  imageUrl?: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}
