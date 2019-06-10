const Joi = require('@hapi/joi');

/**
 * This structure represents a shipping address related to a payment.
 * 
 * @see {@link https://docs.barion.com/ShippingAddress|Barion API Documentation}
 */
const schema = Joi.object({
    DeliveryMethod: Joi.string().optional(),
    Country: Joi.string().optional()
        .length(2),
    City: Joi.string().optional(),
    Region: Joi.string().optional()
        .length(2),
    Zip: Joi.string().optional(),
    Street: Joi.string().optional(),
    Street2: Joi.string().optional(),
    FullName: Joi.string().optional(),
    Phone: Joi.string().optional()
})
    .unknown()
    .rename(/^DeliveryMethod$/i, 'DeliveryMethod', { override: true })
    .rename(/^Country$/i, 'Country', { override: true })
    .rename(/^City$/i, 'City', { override: true })
    .rename(/^Region$/i, 'Region', { override: true })
    .rename(/^Zip$/i, 'Zip', { override: true })
    .rename(/^Street$/i, 'Street', { override: true })
    .rename(/^Street2$/i, 'Street2', { override: true })
    .rename(/^FullName$/i, 'FullName', { override: true })
    .rename(/^Phone$/i, 'Phone', { override: true });

module.exports = schema;