const fetch = require('node-fetch').default;
const { URL, URLSearchParams } = require('url');
const { BarionError } = require('./errors');

/**
 * Handles errors during fetch.
 * @param {Error} err - The error that should have been handled.
 */
function handleError (err) {
    throw err;
}

/**
 * Checks that response is binary or not.
 * @param {Object} res - Response data from Barion API.
 */
function isBinaryResponse (res) {
    return res.buffer instanceof Buffer;
}

/**
 * Checks that response does contain error indicator field or not.
 * @param {Object} res - Response data from Barion API.
 */
function containsErrorIndicator (res) {
    return res.Errors || res.ErrorList;
}

/**
 * Checks that response does contain v2 API-style error.
 * @param {Object} res - Response data from Barion API.
 */
function hasV2Errors (res) {
    return res.Errors && res.Errors.length > 0;
}

/**
 * Checks that response does contain v1 API-style error.
 * @param {Object} res - Response data from Barion API.
 */
function hasV1Errors (res) {
    return res.ErrorList && res.ErrorList.length > 0;
}

/**
 * Checks if response from Barion indicates error.
 * @param {Object} res - Response data from Barion API.
 */
function isErrorResponse (res) {
    return !isBinaryResponse(res) && (!containsErrorIndicator(res) || hasV2Errors(res) || hasV1Errors(res));
}

/**
 * Sends request to Barion API with the given data.
 * @param {String} url - URL of the endpoint to send request to.
 * @param {Object} options - Settings of the request (see: documentation of Fetch API).
 * @returns {Promise} Promise with the response.
 * @throws {BarionError}
 */
function fetchBarion (url, options, binary = false) {
    let success;

    return fetch(url, options)
        .then(res => {
            success = res.ok;
            
            if (binary && success) {
                return res.buffer().then(buffer => {
                    return {
                        buffer,
                        type: res.headers.get('Content-Type')
                    };
                });
            }

            return res.json();
        })
        .catch(handleError) // response is not a valid JSON or network error occured
        .then(data => {
            if (!success || isErrorResponse(data)) {
                throw new BarionError('Barion request errored out', data.Errors || data.ErrorList);
            }

            return data;
        });
}

/**
 * Gets information from Barion API.
 * @param {String} url - URL of the endpoint to send request to.
 * @param {Object} params - Query params of the endpoint.
 * @returns {Promise} Promise with the response.
 */
function getFromBarion (url, params) {
    url = new URL(url);
    url.search = new URLSearchParams(params).toString();
    return fetchBarion(url);
}

/**
 * Gets binary encoded information from Barion API.
 * @param {String} url - URL of the endpoint to send request to.
 * @param {Object} params - Search params of the endpoint.
 * @returns {Promise} Promise with the response (Buffer).
 */
function getBinaryFromBarion (url, params) {
    url = new URL(url);
    url.search = new URLSearchParams(params).toString();
    return fetchBarion(url, undefined, true);
}

/**
 * Posts information to Barion API.
 * @param {String} url - URL of the endpoint to send request to.
 * @param {Object} body - Body of the request.
 * @returns {Promise} Promise with the response.
 */
function postToBarion (url, body) {
    url = new URL(url);

    return fetchBarion(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

module.exports = {
    getFromBarion,
    getBinaryFromBarion,
    postToBarion
};
