const Joi = require('joi');

/**
 * Represents a postal address for Apple Pay.
 *
 * @see {@link https://docs.barion.com/ApplePay-PostalAddress|Barion API: Apple Pay Postal Address}
 */
const schema = Joi.object({
    Country: Joi.string().optional(),
    State: Joi.string().optional(),
    IsoCountryCode: Joi.string().optional(),
    Street: Joi.string().optional(),
    City: Joi.string().optional(),
    PostalCode: Joi.string().optional()
});

module.exports = schema;
