const Joi = require('@hapi/joi');
const { CaseInsensitiveSchema } = require('../../schema');

const PayeeTransaction = require('./PayeeTransaction');
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
        .items(Item)
});

module.exports = new CaseInsensitiveSchema(schema);
