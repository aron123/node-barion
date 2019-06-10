const Joi = require('@hapi/joi');
const PayeeTransaction = require('./PayeeTransaction');
const Item = require('./Item');

/**
 * This structure represents a payment transaction related to a payment, when used for finishing pending reservations. 
 * 
 * @see {@link https://docs.barion.com/TransactionToFinish|Barion API Documentation}
 */
const schema = Joi.object({
    TransactionId: Joi.string().required()
        .guid(),
    Total: Joi.number().required()
        .greater(0),
    Comment: Joi.string().optional(),
    PayeeTransactions: Joi.array().optional()
        .items(PayeeTransaction),
    Items: Joi.array().optional()
        .items(Item)
})
    .unknown()
    .rename(/^TransacionId$/i, 'TransacionId', { override: true })
    .rename(/^Total$/i, 'Total', { override: true })
    .rename(/^Comment$/i, 'Comment', { override: true })
    .rename(/^PayeeTransactions$/i, 'PayeeTransactions', { override: true })
    .rename(/^Items$/i, 'Items', { override: true });

module.exports = schema;
