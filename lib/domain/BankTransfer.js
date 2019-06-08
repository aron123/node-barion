const Joi = require('@hapi/joi');
const BankAccount = require('./common/BankAccount');

/**
 * Used to send money out of the Barion system via bank (wire) transfer.
 * 
 * @see {@link https://docs.barion.com/Withdraw-BankTransfer-v2|Barion API Documentation}
 */
const schema = Joi.object({
    UserName: Joi.string().required()
        .email(),
    Password: Joi.string().required(),
    Currency: Joi.string().required()
        .valid([
            'CZK',
            'EUR',
            'HUF',
            'USD'
        ]),
    Amount: Joi.number().required()
        .greater(0),
    RecipientName: Joi.string().required(),
    Comment: Joi.string().optional()
        .max(90),
    BankAccount: BankAccount.required()
})
    .rename(/^UserName$/i, 'UserName')
    .rename(/^Password$/i, 'Password')
    .rename(/^Currency$/i, 'Currency')
    .rename(/^Amount$/i, 'Amount')
    .rename(/^RecipientName$/i, 'RecipientName')
    .rename(/^Comment$/i, 'Comment')
    .rename(/^BankAccount$/i, 'BankAccount');

module.exports = schema;
