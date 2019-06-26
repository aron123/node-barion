const Joi = require('@hapi/joi');

/**
 * This structure represents an included in a payment transaction. An item can describe a product or service. 
 * 
 * @see {@link https://docs.barion.com/Item|Barion API Documentation}
 */
const schema = Joi.object({
    Name: Joi.string().required()
        .max(250),
    Description: Joi.string().required()
        .max(500),
    ImageUrl: Joi.string().optional()
        .uri(),
    Quantity: Joi.number().required(),
    Unit: Joi.string().required()
        .max(50),
    UnitPrice: Joi.number().required(),
    ItemTotal: Joi.number().required(),
    SKU: Joi.string().optional()
        .max(100)
})
    .rename(/^Name$/i, 'Name', { override: true })
    .rename(/^Description$/i, 'Description', { override: true })
    .rename(/^ImageUrl$/i, 'ImageUrl', { override: true })
    .rename(/^Quantity$/i, 'Quantity', { override: true })
    .rename(/^Unit$/i, 'Unit', { override: true })
    .rename(/^UnitPrice$/i, 'UnitPrice', { override: true })
    .rename(/^ItemTotal$/i, 'ItemTotal', { override: true })
    .rename(/^SKU$/i, 'SKU', { override: true });

module.exports = schema;
