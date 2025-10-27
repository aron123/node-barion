const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');
const constraints = require('./_constraints');

/**
 * Used to query the transaction history from the Barion system for the authenticated wallet.
 *
 * Note: API key authentication is required.
 * This API should not be used for reconciliation, use the statement API instead.
 *
 * @see {@link https://docs.barion.com/UserHistory-GetHistory-v3|Barion API Documentation}
 */
const schema = Joi.object({
    ApiKey: Joi.string().required()
        .pattern(/^[0-9a-fA-F]{32}$/),
    LastVisibleItemId: Joi.string().optional().guid(),
    LastRequestTime: Joi.date().optional(),
    Limit: Joi.number().optional().integer().min(1).max(20),
    Currency: Joi.string().optional()
        .length(3)
        .valid(...constraints.Currency)
});

module.exports = new CaseInsensitiveSchema(schema);
