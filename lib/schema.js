/**
 * Makes the given keys optional in the given Joi-schema.
 * @param {Object} schema - The Joi-schema object to modify.
 * @param {String[]} optionalFields - The optional keys.
 */
function setFieldsOptional (schema, optionalFields) {
    return schema.fork(optionalFields, field => field.optional());
}

/**
 * Makes the given keys forbidden in the given Joi-schema.
 * @param {Object} schema - The Joi-schema to modify.
 * @param {String[]} forbiddenFields - The forbidden keys.
 */
function setFieldsForbidden (schema, forbiddenFields) {
    return schema.fork(forbiddenFields, field => field.forbidden());
}

/**
 * Collects keys, that are required in schema.
 * @param {Object} schema - The Joi-schema to search in.
 */
function getRequiredFields (schema) {
    const schemaConfig = schema.describe();

    if (!Object.hasOwnProperty.call(schemaConfig, 'keys')) {
        return [];
    }

    const schemaFields = Object.keys(schemaConfig.keys);
    const requiredFields = [];

    for (const field of schemaFields) {
        if (schemaConfig.keys[field].flags.presence === 'required') {
            requiredFields.push(field);
        }
    }

    return requiredFields;
}

/**
 * Creates case-insensitive regexp pattern to the given string.
 * @param {String} str - The given string.
 */
function getCaseInsensitiveRegExp (str) {
    return new RegExp(`^${str}$`, 'i');
}

/**
 * Makes a schema case-insensitive to field naming (e.g. name, Name and NaMe can be used in objects).
 * @param {Object} schema - The schema to modify.
 */
function CaseInsensitiveSchema (schema) {
    const schemaConfig = schema.describe();
    const keys = schemaConfig.keys ? Object.keys(schemaConfig.keys) : [];

    for (const key of keys) {
        schema = schema.rename(getCaseInsensitiveRegExp(key), key, { override: true });
    }

    return schema;
}

module.exports = {
    setFieldsOptional,
    setFieldsForbidden,
    getRequiredFields,
    CaseInsensitiveSchema
};
