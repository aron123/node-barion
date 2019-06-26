const Joi = require('@hapi/joi');

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
        .valid('CZK', 'EUR', 'HUF', 'USD'),
    Amount: Joi.number().required()
        .greater(0),
    Recipient: Joi.string().required()
        .email(),
    Comment: Joi.string().optional()
        .max(1000)
})
    .rename(/^UserName$/i, 'UserName', { override: true })
    .rename(/^Password$/i, 'Password', { override: true })
    .rename(/^Currency$/i, 'Currency', { override: true })
    .rename(/^Amount$/i, 'Amount', { override: true })
    .rename(/^Recipient$/i, 'Recipient', { override: true })
    .rename(/^Comment$/i, 'Comment', { override: true });

module.exports = schema;
