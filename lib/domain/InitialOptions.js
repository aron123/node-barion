const Joi = require('@hapi/joi');
const constraints = require('./_constraints');

/**
 * Object used, when instantiating new Barion object.
 */
const schema = Joi.object({
    POSKey: Joi.string().required()
        .guid(),
    Environment: Joi.string().optional()
        .valid('test', 'prod')
        .default('test'),
    FundingSources: Joi.array().optional()
        .items(
            Joi.string().valid(...constraints.FundingSources)
        )
        .length(1)
        .default([ 'All' ]),
    GuestCheckOut: Joi.boolean().optional()
        .default(true),
    Locale: Joi.string().optional()
        .valid(...constraints.Locale)
        .default('hu-HU'),
    Currency: Joi.string().optional()
        .valid(...constraints.Currency)
        .default('HUF'),
    ValidateModels: Joi.boolean().optional()
        .default(true)
})
    .rename(/^POSKey$/i, 'POSKey', { override: true })
    .rename(/^Environment$/i, 'Environment', { override: true })
    .rename(/^FundingSources$/i, 'FundingSources', { override: true })
    .rename(/^GuestCheckOut$/i, 'GuestCheckOut', { override: true })
    .rename(/^Locale$/i, 'Locale', { override: true })
    .rename(/^Currency$/i, 'Currency', { override: true })
    .rename(/^ValidateModels$/i, 'ValidateModels', { override: true });

module.exports = schema;
