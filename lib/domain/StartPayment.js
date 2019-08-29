const Joi = require('@hapi/joi');
const { CaseInsensitiveSchema } = require('../schema');
const constraints = require('./_constraints');

const TimeSpan = require('./common/TimeSpan');
const ShippingAddress = require('./common/ShippingAddress');
const BillingAddress = require('./common/BillingAddress');
const PayerAccountInformation = require('./common/PayerAccountInformation');
const PurchaseInformation = require('./common/PurchaseInformation');
const PaymentTransaction = require('./common/PaymentTransaction');

/**
 * Used to create a new payment in the Barion system.
 *
 * @see {@link https://docs.barion.com/Payment-Start-v2|Barion API Documentation}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
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
    PaymentWindow: TimeSpan.optional(),
    GuestCheckOut: Joi.boolean().required(),
    InitiateRecurrence: Joi.boolean().optional(),
    RecurrenceId: Joi.string().optional()
        .max(100),
    FundingSources: Joi.array().required()
        .items(Joi.string().valid(...constraints.FundingSources))
        .min(1)
        .max(2),
    PaymentRequestId: Joi.string().required()
        .max(100),
    PayerHint: Joi.string().optional()
        .max(256),
    CardHolderNameHint: Joi.string().optional()
        .min(2)
        .max(45),
    RecurrenceType: Joi.string().optional()
        .valid(...constraints.RecurrenceType)
        .when('RecurrenceId', {
            is: Joi.exist(),
            then: Joi.optional(), // required just for 3DS compliance
            otherwise: Joi.forbidden() 
        }),
    RedirectUrl: Joi.string().optional()
        .uri(),
    CallbackUrl: Joi.string().optional()
        .uri(),
    Transactions: Joi.array().required()
        .items(PaymentTransaction)
        .min(1),
    OrderNumber: Joi.string().optional()
        .max(100),
    ShippingAddress: ShippingAddress.optional(),
    Locale: Joi.string().required()
        .valid(...constraints.Locale),
    Currency: Joi.string().required()
        .valid(...constraints.Currency),
    PayerPhoneNumber: Joi.string().optional()
        .max(30)
        .regex(constraints.Mobile.RegExp, constraints.Mobile.Name),
    PayerWorkPhoneNumber: Joi.string().optional()
        .max(30)
        .regex(constraints.Mobile.RegExp, constraints.Mobile.Name),
    PayerHomeNumber: Joi.string().optional()
        .max(30)
        .regex(constraints.Mobile.RegExp, constraints.Mobile.Name),
    BillingAddress: BillingAddress.optional(),
    PayerAccount: PayerAccountInformation.optional(),
    PurchaseInformation: PurchaseInformation.optional(),
    ChallengePreference: Joi.string().optional()
        .valid(...constraints.ChallengePreference)
});

module.exports = new CaseInsensitiveSchema(schema);
