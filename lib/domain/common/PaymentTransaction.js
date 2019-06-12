const Joi = require('@hapi/joi');
const PayeeTransaction = require('./PayeeTRansaction');
const Item = require('./Item');

/**
 * This structure represents a payment transaction related to a payment.
 * 
 * @see {@link https://docs.barion.com/PaymentTransaction|Barion API Documentation}
 */
const schema = Joi.object({
    POSTransactionId: Joi.string().required(),
    Payee: Joi.string().required()
        .email(),
    Total: Joi.number().required()
        .greater(0),
    Comment: Joi.string().optional(),
    PayeeTransactions: Joi.array().optional()
        .items(PayeeTransaction),
    Items: Joi.array().optional()
        .items(Item),
})
    .rename(/^POSTransactionId$/i, 'POSTransactionId', { override: true })
    .rename(/^Payee$/i, 'Payee', { override: true })
    .rename(/^Total$/i, 'Total', { override: true })
    .rename(/^Comment$/i, 'Comment', { override: true })
    .rename(/^PayeeTransactions$/i, 'PayeeTransactions', { override: true })
    .rename(/^Items$/i, 'Items', { override: true });

module.exports = schema;
