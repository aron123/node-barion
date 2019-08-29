const Joi = require('@hapi/joi');
const { CaseInsensitiveSchema } = require('../schema');

/**
 * Used to cancel an existing, previously authorized payment.
 *
 * @see {@link https://docs.barion.com/Payment-CancelAuthorization-v2|Barion API Documentation}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    PaymentId: Joi.string().required()
        .guid()
});

module.exports = new CaseInsensitiveSchema(schema);
