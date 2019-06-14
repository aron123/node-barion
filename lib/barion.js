const {
    InitialOptions,
    StartPayment,
    GetPaymentState,
    FinishReservation,
    PaymentRefund,
    BankTransfer,
    SendTransfer
} = require('./domain');
const { immutableFields } = require('./constants');
const services = require('./services');
const { BarionModelError } = require('./errors');
const Joi = require('@hapi/joi');

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
 * Returns intersection of two string arrays. The comparison is case insensitive.
 * @param {String[]} standardKeys - Array that contains the standard-cased field names (e.g. POSKey).
 * @param {String[]} untrustedKeys - Array that contains the keys defined by the user (e.g. poskey).
 */
function getCaseInsensitiveIntersection (standardKeys, untrustedKeys) {
    let intersection = [];
    
    if (!Array.isArray(standardKeys) || !Array.isArray(untrustedKeys)) {
        return intersection;
    }

    standardKeys.forEach(standard => {
        untrustedKeys.forEach(untrusted => {
            if (String(standard).toLowerCase() === String(untrusted).toLowerCase()) {
                intersection.push(standard);
            }
        })
    });

    return intersection;
}

/**
 * Picks off error messages from Joi's validation error object to an array.
 * @param {Object} details - The validation error object. 
 */
function marshalValidationError (error) {
    return error.details.map(error => error.message);
}

/**
 * Does a case-insensitive search. Returns if the value is presented in the given array.
 * @param {String[]} array - The set of strings to search between.
 * @param {String} value - The value to search for. 
 */
function containsCaseInsensitive (array, value) {
    if (!Array.isArray(array) || array.length === 0) {
        return false;
    }

    const regexp = new RegExp(value, 'i'); // case-insensitive match
    const matches = array.filter(value => regexp.test(value));

    return Boolean(matches.length);
}

/**
 * Builds request object, that could send to the Barion API without strict validation.
 * The function only checks if there is no forbidden override (e.g. of POSKey's value).
 * @param {Object} schema - Schema, which defines structure of the request object.
 * @param {Object} defaults - Default values from Barion instance.
 * @param {Object} options - User-defined values, that are override defaults.
 */
function buildRequestWithoutValidation (schema, defaults, customs) {
    const necessaryKeys = Object.keys(schema.describe().children);
    const actualKeys = Object.keys(customs);
    const request = Object.assign({}, customs);

    const invalidOverrides = getCaseInsensitiveIntersection(immutableFields, actualKeys);
    if (invalidOverrides.length > 0) {
        throw new Error(`Can not override key(s): ${JSON.stringify(invalidOverrides)}`);
    }

    for (const key of necessaryKeys) {
        if (!containsCaseInsensitive(actualKeys, key)) {
            request[key] = defaults[key];
        }
    }

    return request;
}

/**
 * Sanitizes, then validates request object with the given schema.
 * @param {Object} schema - Schema, which defines structure of the request object.
 * @param {Object} object - The request object, that is expected to send to API. 
 */
function sanitizeThenValidate (schema, object) {
    const { error, value } = Joi.validate(object, schema, { stripUnknown: true, abortEarly: false });

    if (error) {
        throw new BarionModelError('The given object is invalid.', marshalValidationError(error));
    }

    return value;
}

/**
 * Builds request object, that could send to the Barion API.
 * @param {Object} schema - Schema, which defines structure of the request object.
 * @param {Object} defaults - Default values from Barion instance.
 * @param {Object} options - User-defined values, that are override defaults.
 */
function buildRequest (schema, defaults, options) {
    const schemaFields = Object.keys(schema.describe().children);
    const immutablesInSchema = getCaseInsensitiveIntersection(schemaFields, immutableFields);
    const validationSchema = (immutablesInSchema.length > 0) ? schema.forbiddenKeys(...immutablesInSchema) : schema;

    const customs = sanitizeThenValidate(validationSchema, options);
    const merged = Object.assign({}, defaults, customs);
    
    return sanitizeThenValidate(schema, merged);
}

/**
 * Sends a request to Barion API, and handles the return process.
 * @param {Object} options - Contains data, that needed to send request to Barion API.
 * @param {Object} options.defaults - Default values from Barion instance.
 * @param {Object} options.customs - User-defined values, that are override defaults.
 * @param {Object} options.schema - Schema to validate the request object before the request.
 * @param {Function} options.service - The business-layer method to call.
 * @param {Function} [callback] - Function to call with the response.
 */
function doRequestAndReturn (options, callback) {
    const { defaults, customs, schema, service } = options;
    let request = {};

    if (defaults.ValidateModels) {
        try {
            request = buildRequest(schema, defaults, customs);
        } catch (err) {
            return handleReturn(err, null, callback);
        }
    } else {
        try {
            request = buildRequestWithoutValidation(schema, defaults, customs);
        } catch (err) {
            return handleReturn(err, null, callback);
        }
    }

    return service(defaults.Environment, request)
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
    this.defaults = sanitizeThenValidate(InitialOptions, options);
}

/**
 * Starts a new payment in Barion, with the given options.
 * @param {Object} options - Options that are required to start new payment.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-Start-v2|Barion API Documentation}
 */
Barion.prototype.startPayment = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: StartPayment,
        service: services.startPayment
    }, callback);
};

/**
 * Gets the state of a payment from Barion.
 * @param {Object} options - Options that are required to get payment state.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-GetPaymentState-v2|Barion API Documentation}
 */
Barion.prototype.getPaymentState = function (options, callback) {
    return doRequestAndReturn({
       defaults: this.defaults,
       customs: options,
       schema: GetPaymentState,
       service: services.getPaymentState
    }, callback);
};

/**
 * Finalizes a pending reservation in the Barion system. 
 * @param {Object} options - Options that are required to finish the reservation.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-FinishReservation-v2|Barion API Documentation}
 */
Barion.prototype.finishReservation = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: FinishReservation,
        service: services.finishReservation
    }, callback);
};

/**
 * Refunds a payment in Barion.
 * @param {Object} options - Options that are required to refund payment.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-Refund-v2|Barion API Documentation}
 */
Barion.prototype.refundPayment = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: PaymentRefund,
        service: services.refundPayment
    }, callback);
};

/**
 * Sends money out of the Barion system via bank transfer.
 * @param {Object} options - Options that are required to send money to bank account.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Withdraw-BankTransfer-v2|Barion API Documentation}
 */
Barion.prototype.bankTransfer = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: BankTransfer,
        service: services.bankTransfer
    }, callback);
};

/**
 * Sends money between accounts in Barion.
 * @param {Object} options - Options that are required to send money to Barion user.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Transfer-Send-v1|Barion API Documentation}
 */
Barion.prototype.barionTransfer = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: SendTransfer,
        service: services.barionTransfer
    }, callback);
};

module.exports = Barion;
