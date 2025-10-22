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
 * Deletes undefined fields from an object.
 * @param {Object} object - The object to strip undefined values from.
 */
function stripUndefined (object) {
    for (const key in object) {
        if (object[key] === undefined) {
            delete object[key];
        }
    }
}

/**
 * Returns API key from request params or body.
 * @param {Object} params - Request params.
 */
function getApiKey (params) {
    if (!params || !params.ApiKey) {
        return;
    }

    return params.ApiKey;
}

/**
 * Deletes API key from request parameters.
 * @param {Object} params - Parameters of the request.
 */
function deleteApiKey (params) {
    if (params) {
        delete params.ApiKey;
    }
}

/**
 * Sets API key authentication.
 * @param {Object} options - Fetch options.
 * @param {String} apiKey - API key for authentication.
 */
function setApiKeyAuthentication (options, apiKey) {
    if (!apiKey) {
        return options;
    }

    options = options || {};
    if (!Object.prototype.hasOwnProperty.call(options, 'headers')) {
        options.headers = {};
    }

    options.headers['x-api-key'] = apiKey;
    return options;
}

/**
 * Checks that response is binary or not.
 * @param {Object} res - Response data from Barion API.
 */
function isBinaryResponse (res) {
    return res.Buffer instanceof Buffer;
}

/**
 * Checks that response does contain error indicator field or not.
 * @param {Object} res - Response data from Barion API.
 */
function containsErrorIndicator (res) {
    return Object.prototype.hasOwnProperty.call(res, 'Errors');
}

/**
 * Checks that response does contain error.
 * @param {Object} res - Response data from Barion API.
 */
function hasErrors (res) {
    return res.Errors && res.Errors.length > 0;
}

/**
 * Checks if response from Barion indicates error.
 * @param {Object} res - Response data from Barion API.
 */
function isErrorResponse (res) {
    return !isBinaryResponse(res) && (!containsErrorIndicator(res) || hasErrors(res));
}

/**
 * Sends request to Barion API with the given data.
 * @param {String} url - URL of the endpoint to send request to.
 * @param {Object} options - Settings of the request (see: documentation of Fetch API).
 * @param {String} apiKey - API key for authentication.
 * @returns {Promise} Promise with the response.
 * @throws {BarionError}
 */
function fetchBarion (url, options, apiKey, binary = false) {
    let success;

    if (apiKey) {
        options = setApiKeyAuthentication(options, apiKey);
    }

    return fetch(url, options)
        .then(res => {
            success = res.ok;

            if (binary && success) {
                return res.buffer().then(buffer => {
                    return {
                        Buffer: buffer,
                        Type: res.headers.get('Content-Type')
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
    stripUndefined(params);
    const apiKey = getApiKey(params);
    deleteApiKey(params);

    url = new URL(url);
    url.search = new URLSearchParams(params).toString();

    return fetchBarion(url, undefined, apiKey);
}

/**
 * Gets binary encoded information from Barion API.
 * @param {String} url - URL of the endpoint to send request to.
 * @param {Object} params - Search params of the endpoint.
 * @returns {Promise} Promise with the response (Buffer).
 */
function getBinaryFromBarion (url, params) {
    stripUndefined(params);
    const apiKey = getApiKey(params);
    deleteApiKey(params);

    url = new URL(url);
    url.search = new URLSearchParams(params).toString();
    return fetchBarion(url, undefined, apiKey, true);
}

/**
 * Posts information to Barion API.
 * @param {String} url - URL of the endpoint to send request to.
 * @param {Object} body - Body of the request.
 * @returns {Promise} Promise with the response.
 */
function postToBarion (url, body) {
    url = new URL(url);
    const apiKey = getApiKey(body);
    deleteApiKey(body);

    return fetchBarion(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        },
        apiKey
    );
}

module.exports = {
    getFromBarion,
    getBinaryFromBarion,
    postToBarion
};
