const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');

const Money = require('./common/Money');

/**
 * Used to send e-money to a given e-mail address.
 *
 * Note: Username/Password authentication has been deprecated by Barion.
 * Only API key authentication is supported.
 *
 * @see {@link https://docs.barion.com/Transfer-Email-v2|Barion API Documentation}
 */
const schema = Joi.object({
    ApiKey: Joi.string().required(),
    SourceAccountId: Joi.string().required()
        .guid(),
    Amount: Money.required(),
    TargetEmail: Joi.string().required()
        .email(),
    Comment: Joi.string().optional()
        .max(1000)
});

module.exports = new CaseInsensitiveSchema(schema);
