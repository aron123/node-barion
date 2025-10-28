const Joi = require('joi');
const CaseInsensitiveSchema = require('../schema');
const ShopCategory = require('./_constraints');
const { BaseContactSchema, NamedContactSchema } = require('./pos/BaseContact');
const ExpectedTurnover = require('./pos/ExpectedTurnover');

/**
 * Used to create a shop (POS) in Barion.
 *
 * Note: Uses API key authentication (wallet endpoint).
 *
 * @see {@link https://docs.barion.com/Pos-Create-v1|Barion API Documentation}
 */
const schema = Joi.object({
    ApiKey: Joi.string().required()
        .pattern(/^[0-9a-fA-F]{32}$/),
    Name: Joi.string().required()
        .max(200),
    Url: Joi.string().required()
        .max(2000)
        .uri({ scheme: [ 'https' ] }),
    Description: Joi.string().required()
        .min(20)
        .max(200),
    Logo: Joi.string().required(),
    Category: Joi.array().required()
        .items(Joi.string().valid(...ShopCategory))
        .min(1),
    BusinessContact: NamedContactSchema.required(),
    TechnicalContact: NamedContactSchema.required(),
    CustomerServiceContact: BaseContactSchema.required(),
    PrimaryCurrency: Joi.string().required()
        .valid('HUF', 'CZK', 'EUR', 'USD'),
    ExpectedTurnover: ExpectedTurnover.required(),
    AverageBasketValue: Joi.number().optional()
        .integer()
        .greater(0),
    PercentageOfB2BCustomers: Joi.number().optional()
        .min(0)
        .max(100),
    PercentageOfNonEuCards: Joi.number().optional()
        .min(0)
        .max(100),
    FullPixelImplemented: Joi.boolean().required(),
    UseForEInvoicing: Joi.boolean().required(),
    CallBackUrl: Joi.string().optional()
        .max(2000)
        .uri(),
    ReferenceId: Joi.string().optional(),
    NoteForApproval: Joi.string().optional(),
    CustomTemplate: Joi.string().optional(),
    CustomCss: Joi.string().optional()
});

module.exports = new CaseInsensitiveSchema(schema);
