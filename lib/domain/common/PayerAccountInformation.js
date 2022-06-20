const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../../schema');
const constraints = require('../_constraints');

/**
 * This structure represents information about the payer related to a payment.
 * The data provided here is used to analyze and avoid possible fraud attempts
 * and assure frictionless 3D secure flow.
 *
 * @see {@link https://docs.barion.com/PayerAccountInformation|Barion API Documentation}
 */
const schema = Joi.object({
    AccountId: Joi.string().optional()
        .max(64),
    AccountCreated: Joi.date().optional()
        .iso(),
    AccountCreationIndicator: Joi.string().optional()
        .valid(...constraints.AccountCreationIndicator),
    AccountLastChanged: Joi.date().optional()
        .iso(),
    AccountChangeIndicator: Joi.string().optional()
        .valid(...constraints.AccountChangeIndicator),
    PasswordLastChanged: Joi.date().optional()
        .iso(),
    PasswordChangeIndicator: Joi.string().optional()
        .valid(...constraints.PasswordChangeIndicator),
    PurchasesInTheLast6Months: Joi.number().optional()
        .min(0)
        .max(9999),
    ShippingAddressAdded: Joi.date().optional()
        .iso(),
    ShippingAddressUsageIndicator: Joi.string().optional()
        .valid(...constraints.ShippingAddressUsageIndicator),
    ProvisionAttempts: Joi.number().optional()
        .min(0)
        .max(999),
    TransactionalActivityPerDay: Joi.number().optional()
        .min(0)
        .max(999),
    TransactionalActivityPerYear: Joi.number().optional()
        .min(0)
        .max(999),
    PaymentMethodAdded: Joi.date().optional()
        .iso(),
    SuspiciousActivityIndicator: Joi.string().optional()
        .valid(...constraints.SuspiciousActivityIndicator)
}).meta({ className: 'PayerAccountInformation' });

module.exports = new CaseInsensitiveSchema(schema);
