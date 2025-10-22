const Joi = require('joi');
const ApplePayPostalAddress = require('./ApplePayPostalAddress');

/**
 * Represents shipping contact information for Apple Pay.
 *
 * @see {@link https://docs.barion.com/ApplePay-ShippingContact|Barion API: Apple Pay Shipping Contact}
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
