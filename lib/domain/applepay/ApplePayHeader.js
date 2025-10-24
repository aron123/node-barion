const Joi = require('joi');

/**
 * Represents the header for Apple Pay payment data.
 *
 * @see {@link https://docs.barion.com/ApplePay-Header|Barion API: Apple Pay Header}
 */
const schema = Joi.object({
    EphemeralPublicKey: Joi.string().optional(),
    PublicKeyHash: Joi.string().optional(),
    TransactionId: Joi.string().optional()
});

module.exports = schema;
