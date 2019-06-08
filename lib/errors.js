/**
 * Represents error, sent by Barion API.
 * @param {String} message - Error message.
 * @param {Array} errors - Barion's "Errors" array.
 */
function BarionError (message, errors) {
    let error = new Error(message);
    error.name = 'BarionError';
    error.errors = Array.isArray(errors) ? errors : [];

    return error;
}

/**
 * Represents structural error in the passed object.
 * This error is thrown before even the request is sent to the Barion API.
 * @param {String} message - Error message. 
 * @param {Array} errors - Error messages of validation process. 
 */
function BarionModelError (message, errors) {
    let error = new Error(message);
    error.name = 'BarionModelError';
    error.errors = errors;

    return error;
}

module.exports = {
    BarionError,
    BarionModelError
};
