const { CaseInsensitiveSchema } = require('../../schema');
const { namedContactSchema } = require('./BaseContact');

/**
 * This structure represents the technical contact details of a shop in Barion.
 *
 * @see {@link https://docs.barion.com/TechnicalContact|Barion API Documentation}
 */
module.exports = new CaseInsensitiveSchema(namedContactSchema);
