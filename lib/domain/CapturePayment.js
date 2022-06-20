const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');

const TransactionToFinish = require('./common/TransactionToFinish');

/**
 * Used to capture (finish) an existing, previously authorized payment.
 *
 * @see {@link https://docs.barion.com/Payment-Capture-v2|Barion API Documentation}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    PaymentId: Joi.string().required()
        .guid(),
    Transactions: Joi.array().required()
        .items(TransactionToFinish)
        .min(1)
}).meta({ className: 'CapturePaymentRequest' });

module.exports = new CaseInsensitiveSchema(schema);
