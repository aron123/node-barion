const Joi = require('@hapi/joi');

/**
 * Object used, when instantiating new Barion object.
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    Environment: Joi.string().optional()
        .valid([
            'test',
            'prod'
        ])
        .default('test'),
    FundingSources: Joi.array().optional()
        .items(Joi.string().valid([ 'All', 'Balance' ]))
        .length(1)
        .default([ 'All' ]),
    GuestCheckOut: Joi.boolean().optional()
        .default(true),
    Locale: Joi.string().optional()
        .valid([
            'cs-CZ',
            'de-DE',
            'en-US',
            'es-ES',
            'fr-FR',
            'hu-HU',
            'sk-SK',
            'sl-SI',
            'el-GR'
        ])
        .default('hu-HU'),
    Currency: Joi.string().optional()
        .valid([
            'CZK',
            'EUR',
            'HUF',
            'USD'
        ])
        .default('HUF')
})
    .rename(/^POSKey$/i, 'POSKey')
    .rename(/^Environment$/i, 'Environment', { override: true })
    .rename(/^FundingSources$/i, 'FundingSources', { override: true })
    .rename(/^GuestCheckOut$/i, 'GuestCheckOut', { override: true })
    .rename(/^Locale$/i, 'Locale', { override: true })
    .rename(/^Currency$/i, 'Currency', { override: true });

module.exports = schema;
