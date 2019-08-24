const Joi = require('@hapi/joi');
const { CaseInsensitiveSchema } = require('../schema');

const constraints = require('./_constraints');

/**
 * Used to send e-money between Barion users or outside Barion.
 *
 * @see {@link https://docs.barion.com/Transfer-Send-v1|Barion API Documentation}
 */
const schema = Joi.object({
    UserName: Joi.string().required()
        .email(),
    Password: Joi.string().required(),
    Currency: Joi.string().required()
        .valid(...constraints.Currency),
    Amount: Joi.number().required()
        .greater(0),
    Recipient: Joi.string().required()
        .email(),
    Comment: Joi.string().optional()
        .max(1000)
});

module.exports = new CaseInsensitiveSchema(schema);
