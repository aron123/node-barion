const { URL } = require('url');
const { initializationFields, baseUrls, endPoints } = require('./constants');
const { getFromBarion, postToBarion } = require('./fetch-api');

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
 * Searches a property's value inside an object (property naming is case insensitive).
 * @param {Object} obj - Object to search inside.
 * @param {String} propertyName - The searched value's key (case insensitive).
 * @returns {*} The searched value. If the value is not found, returns undefined.
 */
function getPropertyValueCaseInsensitive(obj, propertyName) {
    for (let key in obj) {
        if (key.toLowerCase() === propertyName.toLowerCase()) {
            return obj[key];
        }
    }
}

/**
 * Builds a request's body.
 * @param {String[]} expectedFields - Field names, that the body should contain.
 * @param {Object} defaults - Default values. 
 * @param {Object} customs - User-defined values.
 * @returns {Object} The request's body.
 */
function buildRequestBody (expectedFields, defaults, customs) {

    let options = {};

    //build request body
    for (let key of expectedFields) {
        //search in customs
        let value = getPropertyValueCaseInsensitive(customs, key);

        if (typeof value === 'undefined') { 
            //if not found, get from defaults
            value = getPropertyValueCaseInsensitive(defaults, key);
        }

        //set request object
        options[key] = value;
    }

    return options;
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
        return (callback) ? callback(null, value) : Promise.resolve(value);
    } else {
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
    if (getPropertyValueCaseInsensitive(options, 'POSKey')) {
        let error = new Error('POSKey can not overridden.');
        return handleReturn(error, null, callback);
    }

    if (getPropertyValueCaseInsensitive(options, 'Environment')) {
        let error = new Error('Environment can not overridden.');
        return handleReturn(error, null, callback);
    }

    let endpointUrl = getEndPointUrl.call(this, endpoint.path);
    let fetchBarion = (endpoint.method === 'GET') ? getFromBarion : postToBarion;
    let reqOptions = buildRequestBody.call(this, endpoint.properties, this.defaults, options);

    return fetchBarion(endpointUrl, reqOptions)
        .then(data => handleReturn(null, data, callback))
        .catch(err => handleReturn(err, null, callback));
}




/*____________________Public API____________________*/


/**
 * Initializes a Barion object, that represents a merchant with a given POSKey.
 * @param {Object} options - Default values for Barion API requests.
 * @param {String} options.Environment - The Barion environment to use ('test' or 'prod'). (default: 'test')
 * @param {String[]} options.FundingSources - The default funding sources. (default: [ 'All' ])
 * @param {Boolean} options.GuestCheckOut - Indicates if guest checkout is enabled. (default: true)
 * @param {String} options.Locale - Localization of Barion GUI. (default: 'hu-HU')
 * @param {String} options.Currency - Currency to use. (default: 'HUF')
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

    if (options.hasOwnProperty('Environment') && options.Environment !== 'prod' && options.Environment !== 'test') {
        throw new Error(`Environment property must be 'test' or 'prod' (got '${options.Environment}' instead)`);
    }

    this.defaults = buildRequestBody(initializationFields, initialDefaults, options);
}

/**
 * Starts a new payment in Barion, with the given options.
 * @param {Object} options - Options that are required to start new payment.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-Start-v2|Barion API Documentation}
 */
Barion.prototype.startPayment = function (options, callback) {
    return doRequestAndReturn.call(this, endPoints.startPayment, options, callback);
};

/**
 * Gets the state of a payment from Barion.
 * @param {Object} options - Options that are required to get payment state.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-GetPaymentState-v2|Barion API Documentation}
 */
Barion.prototype.getPaymentState = function (options, callback) {
    return doRequestAndReturn.call(this, endPoints.getPaymentState, options, callback);
};

/**
 * Finalizes a pending reservation in the Barion system. 
 * @param {Object} options - Options that are required to finish the reservation.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-FinishReservation-v2|Barion API Documentation}
 */
Barion.prototype.finishReservation = function (options, callback) {
    return doRequestAndReturn.call(this, endPoints.finishReservation, options, callback);
}

/**
 * Refunds a payment in Barion.
 * @param {Object} options - Options that are required to refund payment.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-Refund-v2|Barion API Documentation}
 */
Barion.prototype.refundPayment = function (options, callback) {
    return doRequestAndReturn.call(this, endPoints.refundPayment, options, callback);
}

/**
 * Sends money out of the Barion system via bank transfer.
 * @param {Object} options - Options that are required to send money to bank account.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Withdraw-BankTransfer-v2|Barion API Documentation}
 */
Barion.prototype.bankTransfer = function (options, callback) {
    return doRequestAndReturn.call(this, endPoints.bankTransfer, options, callback);
}

/**
 * Sends money between accounts in Barion.
 * @param {Object} options - Options that are required to send money to Barion user.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Transfer-Send-v1|Barion API Documentation}
 */
Barion.prototype.barionTransfer = function (options, callback) {
    return doRequestAndReturn.call(this, endPoints.barionTransfer, options, callback);
}

module.exports = Barion;