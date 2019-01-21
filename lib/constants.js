/**
 * Information that are necessary to call Barion API.
 */
module.exports = {
    baseUrls: {
        test: 'https://api.test.barion.com',
        prod: 'https://api.barion.com'
    },
    initializationFields: [ 'POSKey', 'Environment', 'FundingSources', 'GuestCheckOut', 'Locale', 'Currency' ],
    endPoints: {
        startPayment: { 
            method: 'POST', 
            path: '/v2/Payment/Start',
            properties: [ 
                'POSKey', 'PaymentType', 'ReservationPeriod', 'PaymentWindow', 'GuestCheckOut',  'InitiateRecurrence', 
                'RecurrenceId', 'FundingSources', 'PaymentRequestId', 'PayerHint', 'RedirectUrl', 'CallbackUrl', 
                'Transactions', 'OrderNumber', 'ShippingAddress', 'Locale', 'Currency'
            ]
        },
        getPaymentState: { 
            method: 'GET', 
            path: '/v2/Payment/GetPaymentState',
            properties: [ 'POSKey', 'PaymentId' ]
        },
        finishReservation: { 
            method: 'POST', 
            path: '/v2/Payment/FinishReservation',
            properties: [ 'POSKey', 'PaymentId', 'Transactions' ]
        },
        refundPayment: { 
            method: 'POST', 
            path: '/v2/Payment/Refund',
            properties: [ 'POSKey', 'PaymentId', 'TransactionsToRefund' ]
        },
        bankTransfer: { 
            method: 'POST', 
            path: '/v2/Withdraw/BankTransfer',
            properties: [ 'UserName', 'Password', 'Currency', 'Amount', 'RecipientName', 'Comment', 'BankAccount' ]
        },
        barionTransfer: {
            method: 'POST',
            path: '/v1/Transfer/Send',
            properties: [ 'UserName', 'Password', 'Currency', 'Amount', 'Recipient', 'Comment' ]
        }
    }
};