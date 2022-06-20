const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../../schema');
const constraints = require('../_constraints');

const GiftCardPurchase = require('./GiftCardPurchase');

/**
 * This structure represents information about the purchase related to a payment.
 * The data provided here is used to analyze and avoid possible fraud attempts
 * and assure frictionless 3D secure flow.
 *
 * @see {@link https://docs.barion.com/PurchaseInformation|Barion API Documentation}
 */
const schema = Joi.object({
    DeliveryTimeframe: Joi.string().optional()
        .valid(...constraints.DeliveryTimeframe),
    DeliveryEmailAddress: Joi.string().optional()
        .email(),
    PreOrderDate: Joi.date().optional()
        .iso(),
    AvailabilityIndicator: Joi.string().optional()
        .valid(...constraints.AvailabilityIndicator),
    ReOrderIndicator: Joi.string().optional()
        .valid(...constraints.ReOrderIndicator),
    ShippingAddressIndicator: Joi.string().optional()
        .valid(...constraints.ShippingAddressIndicator),
    RecurringExpiry: Joi.date().optional()
        .iso(),
    RecurringFrequency: Joi.number().optional()
        .min(0)
        .max(9999),
    PurchaseType: Joi.string().optional()
        .valid(...constraints.PurchaseType),
    GiftCardPurchase: GiftCardPurchase.optional(),
    PurchaseDate: Joi.date().optional()
        .iso()
}).meta({ className: 'PurchaseInformation' });

module.exports = new CaseInsensitiveSchema(schema);
