const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../schema');

/**
 * Used to retrieve all details and the current state of a point of sale (POS).
 *
 * Note: Uses API key authentication (wallet endpoint).
 *
 * @see {@link https://docs.barion.com/Pos-Get-v1|Barion API: Request all details of a POS}
 */
const schema = Joi.object({
    ApiKey: Joi.string().required()
        .pattern(/^[0-9a-fA-F]{32}$/),
    PublicKey: Joi.string().required()
        .guid()
});

module.exports = new CaseInsensitiveSchema(schema);
