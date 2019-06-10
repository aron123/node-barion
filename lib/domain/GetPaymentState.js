const Joi = require('@hapi/joi');

/**
 * Used to query the details and current state of a given payment. 
 * 
 * @see {@link https://docs.barion.com/Payment-GetPaymentState-v2|Barion API Documentation}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    PaymentId: Joi.string().required()
        .guid()
})
    .unknown()
    .rename(/^POSKey$/i, 'POSKey', { override: true })
    .rename(/^PaymentId$/i, 'PaymentId', { override: true });

module.exports = schema;
