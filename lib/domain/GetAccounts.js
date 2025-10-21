const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');

/**
 * Used to query the existing accounts of the calling user.
 *
 * Note: Username/Password authentication has been deprecated by Barion.
 * Only API key authentication is supported.
 *
 * @see {@link https://docs.barion.com/Accounts-Get-v2|Barion API Documentation}
 */
const schema = Joi.object({
    ApiKey: Joi.string().required()
});

module.exports = new CaseInsensitiveSchema(schema);
