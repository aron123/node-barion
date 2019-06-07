const Joi = require('@hapi/joi');

/**
 * A time range value represented in a string format of the ISO-8601 standard, like this: 3.14:15:28
 * 
 * @see {@link https://docs.barion.com/Calling_the_API|Barion API Documentation}
 */
const schema = Joi.string().regex(/^[0-9]{1,}\.[0-9]{2}:[0-9]{2}:[0-9]{2}$/, 'timespan');

module.exports = schema;