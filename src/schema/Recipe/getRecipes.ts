import type { JSONSchemaType } from 'ajv'
import type { Recipe } from './commonType'

export interface GetRecipesOutput {
  status: 'success' | 'error'
  message?: string
  recipe?: Recipe[]
}

export const getRecipesOutputSchema: JSONSchemaType<GetRecipesOutput> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['success', 'error'] },
    message: { type: 'string', nullable: true },
    recipe: {
      type: 'array',
      items: {
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
        additionalProperties: false
      },
      nullable: true
    }
  },
  required: ['status'],
  additionalProperties: false
}
