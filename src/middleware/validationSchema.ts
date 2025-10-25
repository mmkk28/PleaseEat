import { Request, Response, NextFunction } from 'express'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

export const validateInputSchema = <T>(
  schema: JSONSchemaType<T>,
  type: 'body' | 'params'
) => {
  const validate = ajv.compile(schema)
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = type === 'body' ? req.body : req.params
    const valid = validate(dataToValidate)
    if (!valid) {
      console.log('Validation errors:', validate.errors)
      return res.status(400).json({
        message: 'Validation failed',
        errors: validate.errors
      })
    }
    next()
  }
}

export const validateOutputSchema = <T>(
  schema: JSONSchemaType<T>,
  data: any
): boolean => {
  const validate = ajv.compile(schema)
  return validate(data) as boolean
}
