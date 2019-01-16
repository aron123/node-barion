/**
 * Represents error, sent by Barion API.
 * @param {String} message - Error message.
 * @param {Array} errors - Barion's "Errors" array.
 */
function BarionError (message, errors) {
    let error = new Error(message);
    error.name = 'BarionError';
    error.errors = errors;

    return error;
}

module.exports = {
    BarionError
};