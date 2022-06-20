const Joi = require('@hapi/joi');
const { CaseInsensitiveSchema } = require('../schema');

const Money = require('./common/Money');

/**
 * Used to send e-money to a given e-mail address.
 *
 * @see {@link https://docs.barion.com/Transfer-Email-v2|Barion API Documentation}
 */
const schema = Joi.object({
    UserName: Joi.string().required()
        .email(),
    Password: Joi.string().required(),
    SourceAccountId: Joi.string().required()
        .guid(),
    Amount: Money.required(),
    TargetEmail: Joi.string().required()
        .email(),
    Comment: Joi.string().optional()
        .max(1000)
}).meta({ className: 'EmailTransferRequest' });

module.exports = new CaseInsensitiveSchema(schema);
