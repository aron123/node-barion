const Joi = require('@hapi/joi');
const TimeSpan = require('./common/TimeSpan');
const ShippingAddress = require('./common/ShippingAddress');
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
        .valid([ 'Immediate', 'Reservation' ]),
    ReservationPeriod: TimeSpan.optional()
        .when('PaymentType', {
            is: Joi.valid('Reservation'),
            then: Joi.required()
        }),
    PaymentWindow: TimeSpan.optional(),
    GuestCheckOut: Joi.boolean().required(),
    InitiateRecurrence: Joi.boolean().optional(),
    RecurrenceId: Joi.string().optional()
        .max(100),
    FundingSources: Joi.array().required()
        .items(Joi.string().valid('All', 'Balance'))
        .min(1)
        .max(2),
    PaymentRequestId: Joi.string().required()
        .max(100),
    PayerHint: Joi.string().optional()
        .max(256),
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
        .valid([
            'cs-CZ',
            'de-DE',
            'en-US',
            'es-ES',
            'fr-FR',
            'hu-HU',
            'sk-SK',
            'sl-SI',
            'el-GR'
        ]),
    Currency: Joi.string().required()
        .valid([
            'CZK',
            'EUR',
            'HUF',
            'USD'
        ]),
    PayerPhoneNumber: Joi.string().optional()
        .max(30)
        .regex(/^[0-9]{1,}$/, 'mobile')
})
    .unknown()
    .rename(/^POSKey$/i, 'POSKey')
    .rename(/^PaymentType$/i, 'PaymentType')
    .rename(/^ReservationPeriod$/i, 'ReservationPeriod')
    .rename(/^PaymentWindow$/i, 'PaymentWindow')
    .rename(/^GuestCheckOut$/i, 'GuestCheckOut')
    .rename(/^InitiateRecurrence$/i, 'InitiateRecurrence')
    .rename(/^RecurrenceId$/i, 'RecurrenceId')
    .rename(/^FundingSources$/i, 'FundingSources')
    .rename(/^PaymentRequestId$/i, 'PaymentRequestId')
    .rename(/^PayerHint$/i, 'PayerHint')
    .rename(/^RedirectUrl$/i, 'RedirectUrl')
    .rename(/^CallbackUrl$/i, 'CallbackUrl')
    .rename(/^Transactions$/i, 'Transactions')
    .rename(/^OrderNumber$/i, 'OrderNumber')
    .rename(/^ShippingAddress$/i, 'ShippingAddress')
    .rename(/^Locale$/i, 'Locale')
    .rename(/^Currency$/i, 'Currency')
    .rename(/^PayerPhoneNumber$/i, 'PayerPhoneNumber');

module.exports = schema;