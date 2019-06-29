const { immutableFields } = require('./constants');
const { sanitizeThenValidate } = require('./validate');

/**
 * Does a case-insensitive search. Returns if the value is presented in the given array.
 * @param {String[]} array - The set of strings to search between.
 * @param {String} value - The value to search for.
 */
function containsCaseInsensitive (array, value) {
    if (!Array.isArray(array) || array.length === 0) {
        return false;
    }

    const regexp = new RegExp(value, 'i'); // case-insensitive match
    const matches = array.filter(element => regexp.test(element));

    return Boolean(matches.length);
}

/**
 * Returns intersection of two string arrays. The comparison is case insensitive.
 * @param {String[]} standardKeys - Array that contains the standard-cased field names (e.g. POSKey).
 * @param {String[]} untrustedKeys - Array that contains the keys defined by the user (e.g. poskey).
 */
function getCaseInsensitiveIntersection (standardKeys, untrustedKeys) {
    const intersection = [];

    standardKeys.forEach(standard => {
        untrustedKeys.forEach(untrusted => {
            if (String(standard).toLowerCase() === String(untrusted).toLowerCase()) {
                intersection.push(standard);
            }
        });
    });

    return intersection;
}

/**
 * Builds request object without strict validation, that could send to the Barion API.
 * The function only checks if there is no forbidden override in the custom values (e.g. of POSKey's value).
 * @param {Object} schema - Schema, which defines structure of the request object.
 * @param {Object} defaults - Default values from Barion instance.
 * @param {Object} options - User-defined values, that are override defaults.
 */
function buildRequestWithoutValidation (schema, defaults, customs) {
    const necessaryKeys = Object.keys(schema.describe().children);
    const actualKeys = Object.keys(customs);
    const request = Object.assign({}, customs);

    const invalidOverrides = getCaseInsensitiveIntersection(immutableFields, actualKeys);
    if (invalidOverrides.length > 0) {
        throw new Error(`Can not override key(s): ${JSON.stringify(invalidOverrides)}`);
    }

    for (const key of necessaryKeys) {
        if (!containsCaseInsensitive(actualKeys, key)) {
            request[key] = defaults[key];
        }
    }

    return request;
}

/**
 * Builds request object, that could send to the Barion API.
 * @param {Object} schema - Schema, which defines structure of the request object.
 * @param {Object} defaults - Default values from Barion instance.
 * @param {Object} options - User-defined values, that are override defaults.
 */
function buildRequest (schema, defaults, options) {
    const schemaFields = Object.keys(schema.describe().children);
    const immutablesInSchema = getCaseInsensitiveIntersection(schemaFields, immutableFields);
    const validationSchema = (immutablesInSchema.length > 0) ? schema.forbiddenKeys(...immutablesInSchema) : schema;

    const customs = sanitizeThenValidate(validationSchema, options, true);
    const merged = Object.assign({}, defaults, customs);

    return sanitizeThenValidate(schema, merged);
}

module.exports = {
    buildRequest,
    buildRequestWithoutValidation
};
