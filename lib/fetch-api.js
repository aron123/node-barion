const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');
const { BarionError } = require('./errors');

/**
 * Gets information from Barion API.
 * @param {String} url - URL of the endpoint to send request to.
 * @param {Object} params - Search params of the endpoint. 
 * @returns {Promise} Promise with the response.
 */
function getFromBarion (url, params) {
    url = new URL(url);
    url.search = new URLSearchParams(params).toString();
    return fetchBarion(url.href);
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

/**
 * Sends request to Barion API with the given data.
 * @param {String} url - URL of the endpoint to send request to.
 * @param {Object} options - Settings of the request (see: documentation of Fetch API).
 * @returns {Promise} Promise with the response. 
 */
function fetchBarion (url, options) {
    return fetch(url, options)
        .then(res => {
            let success = res.ok;
            return res.json().then(data => {
                if (!success || !data.Errors || data.Errors.length > 0) {
                    throw new BarionError('Barion request errored out', data.Errors || []);
                } else {
                    return data;
                }
            });
        })
        .catch(err => { //network-related error occured
            throw err; 
        });
}

module.exports = {
    getFromBarion,
    postToBarion
};