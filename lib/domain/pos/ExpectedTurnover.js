const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../../schema');

/**
 * This structure represents the expected turnover for a shop in Barion.
 *
 * The ExpectedTurnover field value represents predefined turnover ranges based on currency:
 * - For HUF: 1 (1-100K), 2 (100K-1M), 3 (1M-10M), 4 (10M-29M), 5 (29M-99M), 6 (99M+)
 * - For EUR: 1 (1-300), 2 (301-3K), 3 (3K-30K), 4 (30K-90K), 5 (90K-300K), 6 (300K+)
 * - For CZK: 1 (1-8K), 2 (8K-80K), 3 (80K-800K), 4 (800K-2.2M), 5 (2.2M-7.7M), 6 (7.7M+)
 * - For USD: 1 (1-350), 2 (351-3.5K), 3 (3.5K-35K), 4 (35K-100K), 5 (100K-345K), 6 (345K+)
 *
 * @see {@link https://docs.barion.com/ExpectedTurnover|Barion API Documentation}
 */
const schema = Joi.object({
    ExpectedTurnover: Joi.number().required()
        .integer()
        .min(1)
        .max(6)
});

module.exports = new CaseInsensitiveSchema(schema);
