/* 
 * On CI system use environment variables,
 * locally use a json file. 
 */
let POSKey = process.env.BARION_POS_KEY || require('./credentials.json').POSKey;
let UserName = process.env.BARION_USER_NAME || require('./credentials.json').UserName;
let Password = process.env.BARION_PASSWORD || require('./credentials').Password;

module.exports = {
    initOptions: {
        POSKey,
        Environment: 'test'
    },
    startPayment: {
        successRequestBody: {
            PaymentType: 'Immediate',
            GuestCheckOut: true,
            FundingSources: [ 'All' ],
            OrderNumber: 'O-2019-0001',
            PaymentRequestId: 'O-2019-0001-1',
            Transactions: [
                {
                    POSTransactionId: 'O-2019-0001',
                    Payee: UserName,
                    Total: 50,
                    Items: []
                }
            ],
            Locale: 'hu-HU',
            Currency: 'HUF'
        },
        successResponseBody: {
            PaymentRequestId: 'O-2019-0001-1',
            Status: 'Prepared',
            RecurrenceResult: 'None',
            Errors: []
        },
        errorRequestBody: {
            PaymentType: 'Immediate',
            GuestCheckOut: true,
            FundingSources: [ 'All' ],
            OrderNumber: 'O-2019-0001',
            PaymentRequestId: 'O-2019-0001-1',
            Locale: 'hu-HU',
            Currency: 'HUF'
        },
        expectedError: {
            ErrorCode: 'ModelValidationError',
            AuthData: UserName
        }
    },
    getPaymentState: {
        //successRequestBody: to be defined runtime, before run the test
        successResponseBody: {
            PaymentRequestId: 'O-2019-0001-1',
            OrderNumber: 'O-2019-0001',
            POSOwnerEmail: UserName,
            Status: 'Prepared',
            PaymentType: 'Immediate',
            AllowedFundingSources: ['All'],
            GuestCheckout: true,
            Total: 50,
            SuggestedLocale: 'hu-HU',
            Currency: 'HUF',
            Errors: []
        },
        errorRequestBody: {},
        expectedErrors: [
            {
                ErrorCode: 'ModelValidationError',
                AuthData: UserName,
            },
            {
                ErrorCode: 'ModelValidationError',
                AuthData: UserName
            }
        ]
    },
    bankTransfer: {
        successRequestBody: {
            UserName: UserName,
            Password: Password,
            Currency: 'HUF',
            Amount: 1,
            RecipientName: 'xxxxx',
            BankAccount: {
                Country: 'HUN',
                Format: 'Giro',
                AccountNumber: '10032000-01076019'
            }
        },
        successResponseBody: {
            Currency: 'HUF',
            Amount: 1,
            RecipientName: 'xxxxx',
            Comment: null,
            BankAccount: {
                Country: 'HUN',
                Format: 'Giro',
                AccountNumber: '10032000-01076019',
                Address: null,
                BankName: null,
                BankAddress: null,
                SwiftCode: null
            },
            Errors: []
        },
        errorRequestBody: {
            UserName: UserName,
            Password: Password,
            Currency: 'HUF',
            Amount: 1,
            RecipientName: 'xxxxx',
            BankAccount: {
                Country: 'HUN',
                Format: 'Giro',
                AccountNumber: '10032000-01070000'
            }
        },
        expectedError: {
            ErrorCode: 'ModelValidationError',
            AuthData: UserName,
        }
    },
    barionTransfer: {
        successRequestBody: {
            UserName: UserName,
            Password: Password,
            Currency: 'HUF',
            Amount: 1,
            Recipient: 'info@example.com'
        },
        successResponseBody: {
            Amount: -1,
            ToName: 'info@example.com',
            Currency: 'HUF',
            TransactionType: 3,
            Direction: 0,
            ErrorList: []
        },
        errorRequestBody: {
            UserName,
            Password,
            Currency: 'HUF',
            Amount: 1,
            Recipient: 'info#example.com'
        },
        expectedError: {
            ErrorNumber: 2004,
            AuthData: UserName
        }
    }
};