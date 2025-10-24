const {
    InitialOptions,
    StartPayment,
    GetPaymentState,
    FinishReservation,
    CapturePayment,
    CancelAuthorization,
    PaymentRefund,
    BankTransfer,
    GetAccounts,
    EmailTransfer,
    StatementDownload,
    CompletePayment,
    StartPaymentWithAppleToken,
    ValidateApplePaySession
} = require('./domain');
const { buildRequest, buildRequestWithoutValidation } = require('./build');
const { sanitizeThenValidate } = require('./validate');
const services = require('./services');

/**
 * Handles the returning process.
 * If callback is specified, calls it with the appropriate signature, based on the results.
 * Else it returns a Promise, based on the results.
 * @param {Object} value - Value to return.
 * @param {*} error - Error to return.
 * @param {Function} callback - Function to call, with (err, data) signature.
 */
function handleReturn (error, value, callback) {
    if (error) {
        return (callback) ? callback(error, null) : Promise.reject(error);
    }

    return (callback) ? callback(null, value) : Promise.resolve(value);
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

    if (defaults.Secure) {
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


/* ____________________Public API____________________*/

/**
 * Initializes a Barion object, that represents a merchant with a given POSKey.
 * @param {Object} options - Default values for Barion API requests.
 * @param {String} options.Environment - The Barion environment to use ('test' or 'prod'). (default: 'test')
 * @param {Boolean} options.Secure - Indicates whether the module should sanitize and validate input before
 * sending to the Barion API. When set to *false*, the module does not do any validation, and can send
 * private data (such as username and password) in query parameters, rather than in HTTP headers. (default: true)
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
 * Captures (finishes) a previously authorized delayed capture payment.
 * @param {Object} options - Options that are required to capture the payment.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-Capture-v2|Barion API Documentation}
 */
Barion.prototype.captureAuthorizedPayment = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: CapturePayment,
        service: services.captureAuthorizedPayment
    }, callback);
};

/**
 * Cancels a previously authorized delayed capture payment.
 * @param {Object} options - Options that are required to cancel the payment.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-CancelAuthorization-v2|Barion API Documentation}
 */
Barion.prototype.cancelAuthorizedPayment = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: CancelAuthorization,
        service: services.cancelAuthorizedPayment
    }, callback);
};

/**
 * Completes a formerly prepared and 3DS authenticated payment in the Barion system.
 * @param {Object} options - Options that are required to complete the payment.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Payment-Complete-v2|Barion API Documentation}
 */
Barion.prototype.completePayment = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: CompletePayment,
        service: services.completePayment
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
 * Queries the existing accounts of the calling user.
 * @param {Object} options - Options that are required to query the existing accounts.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Accounts-Get-v2|Barion API Documentation}
 */
Barion.prototype.getAccounts = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: GetAccounts,
        service: services.getAccounts
    }, callback);
};

/**
 * Sends e-money to a given e-mail address.
 * @param {Object} options - Options that are required to send money.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Transfer-Email-v2|Barion API Documentation}
 */
Barion.prototype.emailTransfer = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: EmailTransfer,
        service: services.emailTransfer
    }, callback);
};

/**
 * Downloads monthly or daily statement generated by the Barion system.
 * @param {Object} options - Options that are required to download statement.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/Statement-Download-v2|Barion API Documentation}
 */
Barion.prototype.downloadStatement = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: StatementDownload,
        service: services.downloadStatement
    }, callback);
};

/**
 * Starts a new payment in Barion using Apple Pay token.
 * @param {Object} options - Options that are required to start payment with Apple Pay.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/ApplePay-StartPaymentWithAppleToken|Barion API Documentation}
 */
Barion.prototype.startPaymentWithAppleToken = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: StartPaymentWithAppleToken,
        service: services.startPaymentWithAppleToken
    }, callback);
};

/**
 * Validates an Apple Pay session.
 * @param {Object} options - Options that are required to validate Apple Pay session.
 * @param {Function} [callback] - Callback that handles the response. If not passed, the function returns a *Promise*.
 * @see {@link https://docs.barion.com/ApplePay-ValidateSession|Barion API Documentation}
 */
Barion.prototype.validateApplePaySession = function (options, callback) {
    return doRequestAndReturn({
        defaults: this.defaults,
        customs: options,
        schema: ValidateApplePaySession,
        service: services.validateApplePaySession
    }, callback);
};

module.exports = Barion;
