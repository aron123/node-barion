const Joi = require('@hapi/joi');
const { CaseInsensitiveSchema } = require('../../schema');
const constraints = require('../_constraints');

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
        .valid(...constraints.BankAccountNumberFormat),
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
});

module.exports = new CaseInsensitiveSchema(schema);
