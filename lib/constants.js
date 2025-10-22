const {
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
    StartPaymentWithAppleToken
} = require('./domain');

/**
 * Information that are necessary to call Barion API.
 */
module.exports = {
    baseUrls: {
        test: 'https://api.test.barion.com',
        prod: 'https://api.barion.com'
    },
    immutableFields: [ 'POSKey' ],
    endPoints: {
        startPayment: {
            method: 'POST',
            path: '/v2/Payment/Start',
            model: StartPayment
        },
        getPaymentState: {
            method: 'GET',
            path: '/v2/Payment/GetPaymentState',
            model: GetPaymentState
        },
        finishReservation: {
            method: 'POST',
            path: '/v2/Payment/FinishReservation',
            model: FinishReservation
        },
        captureAuthorizedPayment: {
            method: 'POST',
            path: '/v2/Payment/Capture',
            model: CapturePayment
        },
        cancelAuthorizedPayment: {
            method: 'POST',
            path: '/v2/Payment/CancelAuthorization',
            model: CancelAuthorization
        },
        completePayment: {
            method: 'POST',
            path: '/v2/Payment/Complete',
            model: CompletePayment
        },
        refundPayment: {
            method: 'POST',
            path: '/v2/Payment/Refund',
            model: PaymentRefund
        },
        bankTransfer: {
            method: 'POST',
            path: '/v2/Withdraw/BankTransfer',
            model: BankTransfer
        },
        getAccounts: {
            method: 'GET',
            path: '/v2/Accounts/Get',
            model: GetAccounts
        },
        emailTransfer: {
            method: 'POST',
            path: '/v2/Transfer/Email',
            model: EmailTransfer
        },
        downloadStatement: {
            method: 'GET',
            path: '/v2/Statement/Download',
            model: StatementDownload,
            binary: true
        },
        startPaymentWithAppleToken: {
            method: 'POST',
            path: '/v2/ApplePay/StartPaymentWithAppleToken',
            model: StartPaymentWithAppleToken
        }
    }
};
