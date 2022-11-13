const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../../schema');

/**
 * This structure describes the gift cards purchased in a payment process.
 *
 * @see {@link https://docs.barion.com/GiftCardPurchase|Barion API Documentation}
 */
const schema = Joi.object({
    Amount: Joi.number().optional()
        .greater(0),
    Count: Joi.number().optional()
        .min(1)
        .max(99)
});

module.exports = new CaseInsensitiveSchema(schema);
