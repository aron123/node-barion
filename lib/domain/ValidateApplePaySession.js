const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');

/**
 * Used to validate an Apple Pay session in the Barion system.
 *
 * @see {@link https://docs.barion.com/ApplePay-ValidateSession|Barion API: Validate Apple Pay session}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    SessionRequestUrl: Joi.string().required()
        .uri(),
    ShopUrl: Joi.string().required()
        .uri()
});

module.exports = new CaseInsensitiveSchema(schema);
