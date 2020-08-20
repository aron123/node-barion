/*
 * On CI system use environment variables,
 * locally use a json file.
 */
const POSKey = process.env.BARION_POS_KEY || require('./credentials.json').POSKey;
const UserName = process.env.BARION_USER_NAME || require('./credentials.json').UserName;
const Password = process.env.BARION_PASSWORD || require('./credentials').Password;
const AccountId = process.env.BARION_ACCOUNT_ID || require('./credentials.json').AccountId;

module.exports = {
    initOptions: {
        withValidation: {
            POSKey,
            Environment: 'test',
            ValidateModels: true
        },
        withoutValidation: {
            POSKey,
            Environment: 'test',
            ValidateModels: false
        }
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
        // successRequestBody: to be defined runtime, before run the test
        successResponseBody: {
            PaymentRequestId: 'O-2019-0001-1',
            OrderNumber: 'O-2019-0001',
            POSOwnerEmail: UserName,
            Status: 'Prepared',
            PaymentType: 'Immediate',
            AllowedFundingSources: [ 'All' ],
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
            UserName,
            Password,
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
            UserName,
            Password,
            Currency: 'HUF',
            RecipientName: 'xxxxx',
            BankAccount: {
                Country: 'HUN',
                Format: 'Giro',
                AccountNumber: '10032000-00285135'
            }
        },
        expectedError: {
            ErrorCode: 'ModelValidationError',
            // TODO: Potential bug in Barion API (sets AuthData to empty string)
            // AuthData: UserName
        }
    },
    barionTransfer: {
        successRequestBody: {
            UserName,
            Password,
            Currency: 'HUF',
            Amount: 1,
            Recipient: 'info@example.com'
        },
        successResponseBody: {
            Amount: -1,
            ToName: 'info@example.com',
            Currency: 'HUF',
            TransactionType: 2,
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
    },
    getAccounts: {
        successRequestBody: {
            UserName,
            Password
        },
        successResponseBody: {
            Errors: []
        },
        errorRequestBody: {
            Password: 'appletree'
        },
        expectedError: {
            ErrorCode: 'AuthenticationFailed'
        }
    },
    emailTransfer: {
        successRequestBody: {
            UserName,
            Password,
            SourceAccountId: AccountId,
            Amount: {
                Currency: 'HUF',
                Value: 10
            },
            TargetEmail: 'info@example.com',
            Comment: 'Some really cool example comment.'
        },
        successResponseBody: {
            IsTransferSuccessful: true,
            Errors: []
        },
        errorRequestBody: {
            UserName,
            Password,
            SourceAccountId: 'appletree',
            Amount: {
                Currency: 'HUF',
                Value: 10
            },
            TargetEmail: 'info@example.com',
            Comment: 'Some really cool example comment.'
        },
        expectedError: {
            ErrorCode: 'ModelValidationError'
        }
    }
};
