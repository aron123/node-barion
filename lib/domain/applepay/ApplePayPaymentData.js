const Joi = require('joi');
const ApplePayHeader = require('./ApplePayHeader');

/**
 * Represents the encrypted payment data for Apple Pay.
 *
 * @see {@link https://docs.barion.com/ApplePay-PaymentData|Barion API: Apple Pay Payment Data}
 */
const schema = Joi.object({
    Data: Joi.string().optional(),
    Signature: Joi.string().optional(),
    Header: ApplePayHeader.optional()
});

module.exports = schema;
