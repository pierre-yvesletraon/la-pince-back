import Joi from "joi";

/**
 * Defines validation schemas for expense-related requests.
 */
export const createExpenseSchema = Joi.object({
  amount: Joi.number()
    .precision(2) // Autorise 2 décimales maximum
    .positive()
    .required()
    .messages({
      'number.base': 'Le montant doit être un nombre.',
      'number.positive': 'Le montant doit être positif.',
      'any.required': 'Le montant est obligatoire.',
      'number.precision': 'Maximum 2 décimales autorisées'
    }),
  description: Joi.string()
    .max(255)
    .allow('') // Autorise les chaînes vides
    .messages({
      'string.base': 'La description doit être du texte',
      'string.max': '255 caractères maximum'
    }),
  date: Joi.date()
    .iso() // Format ISO 8601 (YYYY-MM-DD)
    .messages({
      'date.base': 'Date invalide',
      'date.format': 'Format requis : AAAA-MM-JJ',
      'any.required': 'La date est obligatoire'
    }),
  category_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID catégorie invalide',
      'number.integer': 'Doit être un entier',
      'any.required': 'La catégorie est obligatoire',
      'number.positive': 'Doit être positif'
    })
});

export const updateExpenseSchema = Joi.object({
  amount: Joi.number()
    .precision(2)
    .positive()
    .messages({
      'number.base': 'Le montant doit être un nombre.',
      'number.positive': 'Le montant doit être positif.',
      'number.precision': 'Maximum 2 décimales autorisées'
    }),
  description: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.base': 'La description doit être du texte',
      'string.max': '255 caractères maximum'
    }),
  date: Joi.date()
    .iso()
    .messages({
      'date.base': 'Date invalide',
      'date.format': 'Format requis : AAAA-MM-JJ'
    }),
  category_id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'ID catégorie invalide',
      'number.integer': 'Doit être un entier',
      'number.positive': 'Doit être positif'
    })
}).min(1); // Au moins un champ doit être fourni