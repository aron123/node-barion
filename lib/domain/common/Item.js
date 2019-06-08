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
    .unknown()
    .rename(/^Name$/i, 'Name')
    .rename(/^Description$/i, 'Description')
    .rename(/^ImageUrl$/i, 'ImageUrl')
    .rename(/^Quantity$/i, 'Quantity')
    .rename(/^Unit$/i, 'Unit')
    .rename(/^UnitPrice$/i, 'UnitPrice')
    .rename(/^ItemTotal$/i, 'ItemTotal')
    .rename(/^SKU$/i, 'SKU');

module.exports = schema;
