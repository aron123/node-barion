const { BarionModelError } = require('./errors');
const Joi = require('@hapi/joi');

/**
 * Picks off error messages from Joi's validation error object to an array.
 * @param {Object} details - The validation error object. 
 */
function marshalValidationError (error) {
    return error.details.map(error => error.message);
}

/**
 * Sanitizes, then validates request object with the given schema.
 * @param {Object} schema - Schema, which defines structure of the request object.
 * @param {Object} object - The request object, that is expected to send to API.
 * @throws {BarionModelError}
 */
function sanitizeThenValidate (schema, object) {
    const { error, value } = Joi.validate(object, schema, { stripUnknown: true, abortEarly: false });

    if (error) {
        throw new BarionModelError('The given object is invalid.', marshalValidationError(error));
    }

    return value;
}

module.exports = {
    sanitizeThenValidate
};
