const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../../schema');

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
        .greater(-1),
    Comment: Joi.string().optional(),
    PayeeTransactions: Joi.array().optional()
        .items(PayeeTransaction),
    Items: Joi.array().optional()
        .items(Item)
});

module.exports = new CaseInsensitiveSchema(schema);
