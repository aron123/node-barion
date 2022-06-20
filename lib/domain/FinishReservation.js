const Joi = require('@hapi/joi');
const { CaseInsensitiveSchema } = require('../schema');

const TransactionToFinish = require('./common/TransactionToFinish');

/**
 * Used to finalize a pending reservation in the Barion system.
 *
 * @see {@link https://docs.barion.com/Payment-FinishReservation-v2|Barion API Documentation}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    PaymentId: Joi.string().required()
        .guid(),
    Transactions: Joi.array().required()
        .items(TransactionToFinish)
        .min(1)
}).meta({ className: 'FinishReservationRequest' });

module.exports = new CaseInsensitiveSchema(schema);
