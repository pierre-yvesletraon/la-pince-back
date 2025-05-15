import Joi from 'joi';

export const createBudgetSchema = Joi.object({
  amount: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Le montant doit être un nombre entier.',
      'number.integer': 'Le montant doit être un entier.',
      'any.required': 'Le montant est obligatoire.',
      'number.positive': 'Le montant doit être positif.'
    }),
  category_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'L\'ID de la catégorie doit être un nombre entier.',
      'number.integer': 'L\'ID de la catégorie doit être un entier.',
      'any.required': 'L\'ID de la catégorie est obligatoire.',
      'number.positive': 'L\'ID de la catégorie doit être positif.'
    })
});

export const updateBudgetSchema = Joi.object({
  amount: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'Le montant doit être un nombre entier.',
      'number.integer': 'Le montant doit être un entier.',
      'number.positive': 'Le montant doit être positif.'
    }),
  category_id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'L\'ID de la catégorie doit être un nombre entier.',
      'number.integer': 'L\'ID de la catégorie doit être un entier.',
      'number.positive': 'L\'ID de la catégorie doit être positif.'
    })
}).min(1);