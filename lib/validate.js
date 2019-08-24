const { BarionModelError } = require('./errors');
const { immutableFields } = require('./constants');
const { setFieldsOptional } = require('./schema');

/**
 * Creates A\B (a.k.a. A-B) relation of two arrays.
 * @param {Array} setA - *A* array.
 * @param {Array} setB - *B* array.
 */
function difference (setA, setB) {
    return setA.filter(element => !setB.includes(element));
}

/**
 * Picks off error messages from Joi's validation error object to an array.
 * @param {Object} details - The validation error object.
 */
function marshalValidationError (error) {
    return error.details.map(err => err.message);
}

/**
 * Sanitizes, then validates request object with the given schema.
 * @param {Object} schema - Schema, which defines structure of the request object.
 * @param {Object} object - The request object, that is expected to send to API.
 * @param {Boolean} justSanitize - Indicates if only sanitization of field names is necessary.
 * @throws {BarionModelError}
 */
function sanitizeThenValidate (schema, object, justSanitize) {
    let schemaKeys = [];
    let optionalKeys = [];

    if (justSanitize) { // TODO: put sanitize-only mode to other function
        schemaKeys = Object.keys(schema.describe().keys);
        optionalKeys = difference(schemaKeys, immutableFields);
    }

    const validationSchema = justSanitize ? setFieldsOptional(schema, optionalKeys) : schema;

    const { error, value } = validationSchema.validate(
        object,
        {
            stripUnknown: true,
            abortEarly: false
        }
    );

    if (error) {
        throw new BarionModelError('The given object is invalid.', marshalValidationError(error));
    }

    return value;
}

module.exports = {
    sanitizeThenValidate
};
