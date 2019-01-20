/**
 * Information that are necessary to call Barion API.
 */
module.exports = {
    baseUrls: {
        test: 'https://api.test.barion.com',
        prod: 'https://api.barion.com'
    },
    endPoints: {
        startPayment: { method: 'POST', path: '/v2/Payment/Start' },
        getPaymentState: { method: 'GET', path: '/v2/Payment/GetPaymentState' },
        finishReservation: { method: 'POST', path: '/v2/Payment/FinishReservation' },
        refundPayment: { method: 'POST', path: '/v2/Payment/Refund' },
        bankTransfer: { method: 'POST', path: '/v2/Withdraw/BankTransfer' },
        barionTransfer: { method: 'POST', path: '/v1/Transfer/Send' }
    }
};