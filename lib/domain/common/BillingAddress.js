const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../../schema');

/**
 * This structure represents a billing address related to a payment.
 * The data provided here is used to analyze and avoid possible fraud attempts
 * and assure frictionless 3D secure flow.
 *
 * @see {@link https://docs.barion.com/BillingAddress|Barion API Documentation}
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
    Street3: Joi.string().optional()
});

module.exports = new CaseInsensitiveSchema(schema);
