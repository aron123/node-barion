const Joi = require('@hapi/joi');
const { CaseInsensitiveSchema } = require('../../schema');

/**
 * A time range value represented in a string format of the ISO-8601 standard,
 * like these: 3.14:15:28, 3:14:15:28
 *
 * @see {@link https://docs.barion.com/Calling_the_API|Barion API Documentation}
 */
const schema = Joi.string().regex(/^[0-9]{1,}(\.|:)(0[0-9]|1[0-9]|2[0-3]):[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1}$/, 'timespan');

module.exports = new CaseInsensitiveSchema(schema);
