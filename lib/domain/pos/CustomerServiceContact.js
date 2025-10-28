const { CaseInsensitiveSchema } = require('../../schema');
const { baseContactSchema } = require('./BaseContact');

/**
 * This structure represents the customer service contact details of a shop in Barion.
 *
 * @see {@link https://docs.barion.com/CustomerServiceContact|Barion API Documentation}
 */
module.exports = new CaseInsensitiveSchema(baseContactSchema);
