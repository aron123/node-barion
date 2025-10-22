const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');
const constraints = require('./_constraints');

const PaymentTransaction = require('./common/PaymentTransaction');

/**
 * Used to create a new payment in the Barion system.
 *
 * @see {@link https://docs.barion.com/Payment-StartPaymentWithGoogleToken-v3|Barion API: Start payment with Google Pay?}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    PaymentType: Joi.string().required()
        .valid(...constraints.PaymentType),
    FundingSources: Joi.array().required()
        .items(Joi.string().valid(...constraints.FundingSources))
        .min(1),
    PaymentRequestId: Joi.string().required()
        .max(100),
    RedirectUrl: Joi.string().required()
        .uri()
        .max(2000),
    CallbackUrl: Joi.string().required()
        .uri()
        .max(2000),
    Transactions: Joi.array().required()
        .items(PaymentTransaction)
        .min(1),
    Currency: Joi.string().required()
        .valid(...constraints.Currency),
    PayerEmailAddress: Joi.string().required()
        .email(),
    GooglePayToken: Joi.string().required()
});

module.exports = new CaseInsensitiveSchema(schema);
