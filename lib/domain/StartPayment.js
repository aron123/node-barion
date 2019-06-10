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
    .rename(/^POSKey$/i, 'POSKey', { override: true })
    .rename(/^PaymentType$/i, 'PaymentType', { override: true })
    .rename(/^ReservationPeriod$/i, 'ReservationPeriod', { override: true })
    .rename(/^PaymentWindow$/i, 'PaymentWindow', { override: true })
    .rename(/^GuestCheckOut$/i, 'GuestCheckOut', { override: true })
    .rename(/^InitiateRecurrence$/i, 'InitiateRecurrence', { override: true })
    .rename(/^RecurrenceId$/i, 'RecurrenceId', { override: true })
    .rename(/^FundingSources$/i, 'FundingSources', { override: true })
    .rename(/^PaymentRequestId$/i, 'PaymentRequestId', { override: true })
    .rename(/^PayerHint$/i, 'PayerHint', { override: true })
    .rename(/^RedirectUrl$/i, 'RedirectUrl', { override: true })
    .rename(/^CallbackUrl$/i, 'CallbackUrl', { override: true })
    .rename(/^Transactions$/i, 'Transactions', { override: true })
    .rename(/^OrderNumber$/i, 'OrderNumber', { override: true })
    .rename(/^ShippingAddress$/i, 'ShippingAddress', { override: true })
    .rename(/^Locale$/i, 'Locale', { override: true })
    .rename(/^Currency$/i, 'Currency', { override: true })
    .rename(/^PayerPhoneNumber$/i, 'PayerPhoneNumber', { override: true });

module.exports = schema;