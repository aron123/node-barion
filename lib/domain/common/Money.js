const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../../schema');

const constraints = require('../_constraints');

/**
 * This structure represents an amount of money in the Barion system.
 *
 * @see {@link https://docs.barion.com/Money|Barion API Documentation}
 */
const schema = Joi.object({
    Currency: Joi.string().required()
        .valid(...constraints.Currency),
    Value: Joi.number().required()
        .greater(0)
});

module.exports = new CaseInsensitiveSchema(schema);
