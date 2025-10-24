const Joi = require('joi');
const ApplePayPostalAddress = require('./ApplePayPostalAddress');

/**
 * Represents billing contact information for Apple Pay.
 *
 * @see {@link https://docs.barion.com/ApplePay-BillingContact|Barion API: Apple Pay Billing Contact}
 */
const schema = Joi.object({
    FamilyName: Joi.string().optional(),
    PhoneNumber: Joi.string().optional(),
    GivenName: Joi.string().optional(),
    EmailAddress: Joi.string().optional()
        .email(),
    PostalAddress: ApplePayPostalAddress.optional()
});

module.exports = schema;
