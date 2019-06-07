const Joi = require('@hapi/joi');

/**
 * This structure represents a payment transaction that is to be refunded completely or partially.
 * Such transactions must be associated with a completed payment.
 * 
 * @see {@link https://docs.barion.com/TransactionToRefund|Barion API Documentation}
 */
const schema = Joi.object({
    TransactionId: Joi.string().required()
        .guid(),
    POSTransactionId: Joi.string().required(),
    AmountToRefund: Joi.number().required()
        .greater(0),
    Comment: Joi.string().optional()
});

module.exports = schema;
