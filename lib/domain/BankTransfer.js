const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');

const BankAccount = require('./common/BankAccount');
const constraints = require('./_constraints');

/**
 * Used to send money out of the Barion system via bank (wire) transfer.
 *
 * @see {@link https://docs.barion.com/Withdraw-BankTransfer-v2|Barion API Documentation}
 */
const schema = Joi.object({
    UserName: Joi.string().optional()
        .email(),
    Password: Joi.string().optional(),
    ApiKey: Joi.string().optional(),
    Currency: Joi.string().required()
        .valid(...constraints.Currency),
    Amount: Joi.number().required()
        .greater(0),
    RecipientName: Joi.string().required(),
    Comment: Joi.string().optional()
        .max(90),
    BankAccount: BankAccount.required()
}).or('UserName', 'ApiKey')
    .with('UserName', 'Password');

module.exports = new CaseInsensitiveSchema(schema);
