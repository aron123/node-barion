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
    .rename(/^TransacionId$/i, 'TransacionId')
    .rename(/^Total$/i, 'Total')
    .rename(/^Comment$/i, 'Comment')
    .rename(/^PayeeTransactions$/i, 'PayeeTransactions')
    .rename(/^Items$/i, 'Items')

module.exports = schema;
