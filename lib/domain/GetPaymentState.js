const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');

/**
 * Used to query the details and current state of a given payment.
 *
 * @see {@link https://docs.barion.com/Payment-GetPaymentState-v2|Barion API Documentation}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    PaymentId: Joi.string().required()
        .guid()
}).meta({ className: 'GetPaymentStateRequest' });

module.exports = new CaseInsensitiveSchema(schema);
