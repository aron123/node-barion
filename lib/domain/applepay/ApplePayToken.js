const Joi = require('joi');
const ApplePayPaymentData = require('./ApplePayPaymentData');

/**
 * Represents the Apple Pay token structure.
 *
 * @see {@link https://docs.barion.com/ApplePay-Token|Barion API: Apple Pay Token}
 */
const schema = Joi.object({
    TransactionIdentifier: Joi.string().optional(),
    PaymentData: ApplePayPaymentData.optional()
});

module.exports = schema;
