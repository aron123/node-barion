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
function CaseInsensitiveSchema (schema) { // TODO: do not mutate input
    // TODO: switch back to the implementation commented out, when Joi will be fixed:
    // https://github.com/hapijs/joi/issues/2068

    // const schemaConfig = schema.describe();
    // const keys = schemaConfig.keys ? Object.keys(schemaConfig.keys) : [];
    const keys = [ ...schema._ids._map.keys() ];

    for (const key of keys) {
        schema = schema.rename(getCaseInsensitiveRegExp(key), key, { override: true });
    }

    return schema;
}

module.exports = {
    setFieldsOptional,
    setFieldsForbidden,
    CaseInsensitiveSchema
};
