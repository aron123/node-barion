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
    .rename(/^POSTransactionId$/i, 'POSTransactionId')
    .rename(/^Payee$/i, 'Payee')
    .rename(/^Total$/i, 'Total')
    .rename(/^Comment$/i, 'Comment')
    .rename(/^PayeeTransactions$/i, 'PayeeTransactions')
    .rename(/^Items$/i, 'Items')

module.exports = schema;
