const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');
const constraints = require('./_constraints');

const TimeSpan = require('./common/TimeSpan');
const ApplePayShippingContact = require('./applepay/ApplePayShippingContact');
const ApplePayBillingContact = require('./applepay/ApplePayBillingContact');
const ApplePayToken = require('./applepay/ApplePayToken');
const PaymentTransaction = require('./common/PaymentTransaction');

/**
 * Used to create a new payment in the Barion system using Apple Pay token.
 *
 * @see {@link https://docs.barion.com/ApplePay-StartPaymentWithAppleToken|Barion API: Start payment with Apple Pay}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    ShippingContact: ApplePayShippingContact.required(),
    BillingContact: ApplePayBillingContact.required(),
    ApplePayToken: ApplePayToken.required(),
    PaymentType: Joi.string().required()
        .valid(...constraints.PaymentType),
    ReservationPeriod: TimeSpan.optional()
        .when('PaymentType', {
            is: Joi.valid('Reservation'),
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
    DelayedCapturePeriod: TimeSpan.optional()
        .when('PaymentType', {
            is: Joi.valid('DelayedCapture'),
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
    PaymentRequestId: Joi.string().required()
        .max(100),
    CallbackUrl: Joi.string().required()
        .uri()
        .max(2000),
    Transactions: Joi.array().required()
        .items(PaymentTransaction)
        .min(1),
    OrderNumber: Joi.string().optional()
        .max(100),
    Currency: Joi.string().required()
        .valid(...constraints.Currency)
});

module.exports = new CaseInsensitiveSchema(schema);
