const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../../schema');

/**
 * This structure represents the business contact details of a shop in Barion.
 *
 * @see {@link https://docs.barion.com/BusinessContact|Barion API Documentation}
 */
const schema = Joi.object({
    Name: Joi.string().optional(),
    PhoneNumber: Joi.string().optional()
        .max(30),
    Email: Joi.string().optional()
        .email()
});

module.exports = new CaseInsensitiveSchema(schema);
