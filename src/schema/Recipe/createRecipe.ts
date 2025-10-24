import type { JSONSchemaType } from 'ajv'
import type { Recipe } from './commonType'

export type CreateRecipeInput = Omit<Recipe, 'createdAt' | 'updatedAt'>

export interface CreateRecipeOutput {
  status: 'success' | 'error'
  message: string
}

export const createRecipeInputSchema: JSONSchemaType<CreateRecipeInput> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    ingredients: { type: 'array', items: { type: 'string' } },
    instructions: { type: 'string' },
    prepTime: { type: 'number', nullable: true },
    cookTime: { type: 'number', nullable: true },
    servings: { type: 'number', nullable: true },
    imageUrl: { type: 'string', nullable: true },
    tags: { type: 'array', items: { type: 'string' }, nullable: true }
  },
  required: ['title', 'ingredients', 'instructions'],
  additionalProperties: false
}

export const createRecipeOutputSchema: JSONSchemaType<CreateRecipeOutput> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['success', 'error'] },
    message: { type: 'string' }
  },
  required: ['status', 'message'],
  additionalProperties: false
}
