const Joi = require('@hapi/joi');
const { CaseInsensitiveSchema } = require('../../schema');

/**
 * This structure represents a shipping address related to a payment.
 *
 * @see {@link https://docs.barion.com/ShippingAddress|Barion API Documentation}
 */
const schema = Joi.object({
    Country: Joi.string().optional()
        .length(2),
    City: Joi.string().optional(),
    Region: Joi.string().optional()
        .length(2),
    Zip: Joi.string().optional(),
    Street: Joi.string().optional(),
    Street2: Joi.string().optional(),
    Street3: Joi.string().optional(),
    FullName: Joi.string().optional()
});

module.exports = new CaseInsensitiveSchema(schema);
