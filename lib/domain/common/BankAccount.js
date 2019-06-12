const Joi = require('@hapi/joi');

/**
 * This structure represents a bank account that is used as 
 * the recipient of an outgoing bank (wire) transfer from the Barion system. 
 * 
 * @see {@link https://docs.barion.com/BankAccount|Barion API Documentation}
 */
const schema = Joi.object({
    Country: Joi.string().required()
        .length(3),
    Format: Joi.string().required()
        .valid('Unknown', 'Giro', 'IBAN', 'Other'),
    AccountNumber: Joi.string().required()
        .max(34),
    Address: Joi.string().optional()
        .max(60),
    BankName: Joi.string().optional()
        .max(60),
    BankAddress: Joi.string().optional()
        .max(60),
    SwiftCode: Joi.string().optional()
        .min(8)
        .max(11)
})
    .rename(/^Country$/i, 'Country', { override: true })
    .rename(/^Format$/i, 'Format', { override: true })
    .rename(/^AccountNumber$/i, 'AccountNumber', { override: true })
    .rename(/^Address$/i, 'Address', { override: true })
    .rename(/^BankName$/i, 'BankName', { override: true })
    .rename(/^BankAddress$/i, 'BankAddress', { override: true })
    .rename(/^SwiftCode$/i, 'SwiftCode', { override: true });

module.exports = schema;
