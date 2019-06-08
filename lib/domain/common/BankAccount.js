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
        .valid([
            'Unknown',
            'Giro',
            'IBAN',
            'Other'
        ]),
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
    .rename(/^Country$/i, 'Country')
    .rename(/^Format$/i, 'Format')
    .rename(/^AccountNumber$/i, 'AccountNumber')
    .rename(/^Address$/i, 'Address')
    .rename(/^BankName$/i, 'BankName')
    .rename(/^BankAddress$/i, 'BankAddress')
    .rename(/^SwiftCode$/i, 'SwiftCode');

module.exports = schema;
