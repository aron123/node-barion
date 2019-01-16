module.exports = {
    baseUrl: {
        test: ' https://api.test.barion.com',
        prod: ' https://api.barion.com'
    },
    endPoints: {
        startPayment: '/v2/Payment/Start',
        getPaymentState: '/v2/Payment/GetPaymentState',
        finishReservation: '/v2/Payment/FinishReservation',
        refundPayment: '/v2/Payment/Refund',
        bankTransfer: '/v2/Withdraw/BankTransfer',
        sendInBarion: '/v1/Transfer/Send'
    }
};