const { URL } = require('url');
const { getFromBarion, postToBarion } = require('./fetch-api');
const { baseUrls, endPoints } = require('./constants');

/**
 * Returns the base URL based on environment setting.
 * @param {String} environment - The environment to use ('prod' or 'test').
 */
function getBaseUrl (environment) {
    if (!environment || typeof environment !== 'string') {
        return baseUrls.test;
    }

    return baseUrls[environment];
}

/**
 * Sends the request to Barion API based on given information.
 * @param {String} environment - The environment to use ('prod' or 'test').
 * @param {Object} endpoint - The endpoint to use (at least with 'method' and 'path' fields). 
 * @param {Object} options - The request object to send.
 */
function doRequest (environment, endpoint, options) {
    const { method, path } = endpoint;
    let url = new URL(getBaseUrl(environment));

    url.pathname = path;

    switch (method) {
        case 'GET':
            return getFromBarion(url, options);
        case 'POST':
            return postToBarion(url, options);
        default:
            throw new Error(`Not supported HTTP method: ${method}`);
    }
}

/**
 * Starts a new payment in Barion.
 * @param {String} environment - The environment to use ('test' or 'prod'). 
 * @param {Object} options - The final request body to send to the Barion API.
 */
function startPayment (environment, options) {
    return doRequest(environment, endPoints.startPayment, options);
}

/**
 * Gets the state of a payment from Barion.
 * @param {String} environment - The environment to use ('test' or 'prod'). 
 * @param {Object} options - The final request body to send to the Barion API.
 */
function getPaymentState (environment, options) {
    return doRequest(environment, endPoints.getPaymentState, options);
}

/**
 * Finalizes a pending reservation in the Barion system. 
 * @param {String} environment - The environment to use ('test' or 'prod'). 
 * @param {Object} options - The final request body to send to the Barion API.
 */
function finishReservation (environment, options) {
    return doRequest(environment, endPoints.finishReservation, options);
}

/**
 * Refunds a payment in Barion.
 * @param {String} environment - The environment to use ('test' or 'prod'). 
 * @param {Object} options - The final request body to send to the Barion API.
 */
function refundPayment (environment, options) {
    return doRequest(environment, endPoints.refundPayment, options);
}

/**
 * Sends money out of the Barion system via bank transfer.
 * @param {String} environment - The environment to use ('test' or 'prod'). 
 * @param {Object} options - The final request body to send to the Barion API.
 */
function bankTransfer (environment, options) {
    return doRequest(environment, endPoints.bankTransfer, options);
}

/**
 * Sends money between accounts in Barion.
 * @param {String} environment - The environment to use ('test' or 'prod'). 
 * @param {Object} options - The final request body to send to the Barion API.
 */
function barionTransfer (environment, options) {
    return doRequest(environment, endPoints.barionTransfer, options);
}

module.exports = {
    startPayment,
    getPaymentState,
    finishReservation,
    refundPayment,
    bankTransfer,
    barionTransfer
};
