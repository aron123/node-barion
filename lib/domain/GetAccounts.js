const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');

/**
 * Used to query the existing accounts of the calling user.
 *
 * @see {@link https://docs.barion.com/Accounts-Get-v2|Barion API Documentation}
 */
const schema = Joi.object({
    UserName: Joi.string().optional()
        .email(),
    Password: Joi.string().optional(),
    ApiKey: Joi.string().optional()
}).or('UserName', 'ApiKey')
    .with('UserName', 'Password');

module.exports = new CaseInsensitiveSchema(schema);
