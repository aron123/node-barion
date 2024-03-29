const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');

const TransactionToRefund = require('./common/TransactionToRefund');

/**
 * Used to execute a refund of an existing, completed payment.
 *
 * @see {@link https://docs.barion.com/Payment-Refund-v2|Barion API Documentation}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    PaymentId: Joi.string().required()
        .guid(),
    TransactionsToRefund: Joi.array().required()
        .items(TransactionToRefund)
});

module.exports = new CaseInsensitiveSchema(schema);
