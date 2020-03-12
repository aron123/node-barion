const Joi = require('@hapi/joi');
const { CaseInsensitiveSchema } = require('../schema');

/**
 * Used to query the existing accounts of the calling user.
 *
 * @see {@link https://docs.barion.com/Accounts-Get-v2|Barion API Documentation}
 */
const schema = Joi.object({
    UserName: Joi.string().required()
        .email(),
    Password: Joi.string().required()
});

module.exports = new CaseInsensitiveSchema(schema);
