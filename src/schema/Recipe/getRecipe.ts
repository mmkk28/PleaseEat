import type { JSONSchemaType } from 'ajv'

export interface GetRecipeInput {
  id: string
}

export interface GetRecipeOutput {
  status: 'success' | 'error'
  message?: string
  recipe?: {
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
}

export const getRecipeInputSchema: JSONSchemaType<GetRecipeInput> = {
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id'],
  additionalProperties: false
}

export const getRecipeOutputSchema: JSONSchemaType<GetRecipeOutput> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['success', 'error'] },
    message: { type: 'string', nullable: true },
    recipe: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        ingredients: { type: 'array', items: { type: 'string' } },
        instructions: { type: 'string' },
        prepTime: { type: 'number', nullable: true },
        cookTime: { type: 'number', nullable: true },
        servings: { type: 'number', nullable: true },
        imageUrl: { type: 'string', nullable: true },
        tags: { type: 'array', items: { type: 'string' }, nullable: true },
        createdAt: { type: 'string', format: 'date-time', nullable: true },
        updatedAt: { type: 'string', format: 'date-time', nullable: true }
      },
      required: ['title', 'ingredients', 'instructions'],
      additionalProperties: false,
      nullable: true
    }
  },
  required: ['status'],
  additionalProperties: false
}
