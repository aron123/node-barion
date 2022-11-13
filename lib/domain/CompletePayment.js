const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');

/**
 *  Used to complete a formerly prepared and 3DS authenticated payment in the Barion system.
 *
 * @see {@link https://docs.barion.com/Payment-Complete-v2|Barion API Documentation}
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    PaymentId: Joi.string().required()
        .guid()
});

module.exports = new CaseInsensitiveSchema(schema);