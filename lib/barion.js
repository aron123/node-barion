const { URL } = require('url');
const { baseUrls, endPoints } = require('./constants');
const { getFromBarion, postToBarion } = require('./fetch-api');
const { propsToPascalCase } = require('./sanitization');

/**
 * Default values for requests to Barion API.
 */
const initialDefaults = {
    Environment: 'test',
    FundingSources: [ 'All' ],
    GuestCheckOut: true,
    Locale: 'hu-HU',
    Currency: 'HUF'
};

/**
 * Returns the base URL based on environment setting.
 */
function getBaseUrl () {
    return baseUrls[this.defaults.Environment];
}

/**
 * Returns the absolute URL of an endpoint.
 * @param {String} path - The relative endpoint.
 */
function getEndPointUrl (path) {
    let base = getBaseUrl.call(this);
    let url = new URL(base);
    url.pathname = path;

    return url.href; 
}

/**
 * Merges custom options with the current defaults and sanitizes objects.
 * @param {Object} customs - Custom options to set. 
 * @returns {Object} Object, containing new default values.
 */
function requestOptions (customs) {
    return Object.assign(
        {}, 
        propsToPascalCase(this.defaults), 
        propsToPascalCase(customs)
    );
}

/**
 * Handles the returning process. 
 * If callback is specified, calls it with the appropriate signature, based on the results.
 * Else it returns a Promise, based on the results.
 * @param {Object} value - Value to return.
 * @param {*} error - Error to return.
 * @param {Function} callback - Function to call, with (err, data) signature.
 */
function handleReturn (error, value, callback) {
    if (!error) {
        //success
        return (callback) ? callback(null, value) : Promise.resolve(value);
    } else {
        //error
        return (callback) ? callback(error, null) : Promise.reject(error);
    }
}

/**
 * Sends a request to Barion API, and handles the return process.
 * @param {Object} endpoint - Endpoint object from contants.js (method, and relative path). 
 * @param {Object} options - Options of the request.
 * @param {Function} callback - Function to call, with results.
 */
function doRequestAndReturn (endpoint, options, callback) {
    let endpointUrl = getEndPointUrl.call(this, endpoint.path);
    let fetchBarion = (endpoint.method === 'GET') ? getFromBarion : postToBarion;
    let reqOptions = requestOptions.call(this, options);

    return fetchBarion(endpointUrl, reqOptions)
        .then(data => handleReturn(null, data, callback))
        .catch(err => handleReturn(err, null, callback));
}




/*____________________Public API____________________*/


/**
 * Initializes a Barion object, that represents a merchant with a given POSKey.
 * @param {Object} options - Default values for Barion API requests. 
 * @author Kiss, Aron <aron123dev&#64;gmail.com>
 */
function Barion (options) {
    /**
     * Default values to call the Barion API with.
     */
    this.defaults = {};

    if (!options.POSKey) {
        throw new Error('At least POSKey is required to communicate with Barion API.');
    }

    if (options.hasOwnProperty('Environment') && options.Environment != 'prod' && options.Environment != 'test') {
        throw new Error(`Environment property must be 'test' or 'prod' (got '${options.Environment}' instead)`);
    }

    this.defaults = Object.assign({}, initialDefaults, options);
}

/**
 * Starts a new payment in Barion, with the given options.
 * @param {Object} options - Options that are required to start new payment.
 * @param {Function} [callback] - Callback that handles the response.
 * @see {@link https://docs.barion.com/Payment-Start-v2|Barion API Documentation}
 */
Barion.prototype.startPayment = function (options, callback) {
    return doRequestAndReturn(endPoints.startPayment, options, callback);
};

/**
 * Gets the state of a payment from Barion.
 * @param {Object} options - Options that are required to get payment state.
 * @param {Function} [callback] - Callback that handles the response.
 * @see {@link https://docs.barion.com/Payment-GetPaymentState-v2|Barion API Documentation}
 */
Barion.prototype.getPaymentState = function (options, callback) {
    return doRequestAndReturn(endPoints.getPaymentState, options, callback);
};

/**
 * Finalizes a pending reservation in the Barion system. 
 * @param {Object} options - Options that are required to finish the reservation.
 * @param {Function} [callback] - Callback that handles the response.
 * @see {@link https://docs.barion.com/Payment-FinishReservation-v2|Barion API Documentation}
 */
Barion.prototype.finishReservation = function (options, callback) {
    return doRequestAndReturn(endPoints.finishReservation, options, callback);
}

/**
 * Refunds a payment in Barion.
 * @param {Object} options - Options that are required to refund payment.
 * @param {Function} [callback] - Callback that handles the response.
 * @see {@link https://docs.barion.com/Payment-Refund-v2|Barion API Documentation}
 */
Barion.prototype.refundPayment = function (options, callback) {
    return doRequestAndReturn(endPoints.refundPayment, options, callback);
}

/**
 * Sends money out of the Barion system via bank transfer.
 * @param {Object} options - Options that are required to send money to bank account.
 * @param {Function} [callback] - Callback that handles the response.
 * @see {@link https://docs.barion.com/Withdraw-BankTransfer-v2|Barion API Documentation}
 */
Barion.prototype.bankTransfer = function (options, callback) {
    return doRequestAndReturn(endPoints.bankTransfer, options, callback);
}

/**
 * Sends money between accounts in Barion.
 * @param {Object} options - Options that are required to send money to Barion user.
 * @param {Function} [callback] - Callback that handles the response.
 * @see {@link https://docs.barion.com/Transfer-Send-v1|Barion API Documentation}
 */
Barion.prototype.barionTransfer = function (options, callback) {
    return doRequestAndReturn(endPoints.barionTransfer, options, callback);
}

module.exports = Barion;