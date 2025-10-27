const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../../schema');

/**
 * This structure represents the expected turnover for a shop in Barion.
 *
 * @see {@link https://docs.barion.com/ExpectedTurnover|Barion API Documentation}
 */
const schema = Joi.object({
    MinAmount: Joi.number().optional()
        .min(0),
    MaxAmount: Joi.number().optional()
        .min(0),
    Amount: Joi.number().optional()
        .min(0)
});

module.exports = new CaseInsensitiveSchema(schema);
