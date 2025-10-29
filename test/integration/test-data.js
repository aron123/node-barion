/*
 * On CI system use environment variables,
 * locally use a json file.
 */
const POSKey = process.env.BARION_POS_KEY || require('./credentials.json').POSKey;
const UserName = process.env.BARION_USER_NAME || require('./credentials.json').UserName;
const ApiKey = process.env.BARION_API_KEY || require('./credentials.json').ApiKey;
const AccountId = process.env.BARION_ACCOUNT_ID || require('./credentials.json').AccountId;
const CallbackUrl = process.env.BARION_CALLBACK_URL || require('./credentials.json').CallbackUrl;
const RedirectUrl = process.env.BARION_REDIRECT_URL || require('./credentials.json').RedirectUrl;
const StatementYear = process.env.BARION_STATEMENT_YEAR || require('./credentials.json').StatementDownload.Year;
const StatementMonth = process.env.BARION_STATEMENT_MONTH || require('./credentials.json').StatementDownload.Month;

module.exports = {
    initOptions: {
        withValidation: {
            POSKey,
            Environment: 'test',
            Secure: true
        },
        withoutValidation: {
            POSKey,
            Environment: 'test',
            Secure: false
        }
    },
    startPayment: {
        successRequestBody: {
            PaymentType: 'Immediate',
            GuestCheckOut: true,
            FundingSources: [ 'All', 'Balance' ],
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
            Currency: 'HUF',
            CallbackUrl,
            RedirectUrl
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
            AuthData: POSKey.replace(/-/g, '')
        }
    },
    getPaymentState: {
        // successRequestBody: to be defined runtime, before running the test
        successResponseBody: {
            PaymentRequestId: 'O-2019-0001-1',
            OrderNumber: 'O-2019-0001',
            POSOwnerEmail: UserName,
            Status: 'Prepared',
            PaymentType: 'Immediate',
            AllowedFundingSources: [ 'All', 'Balance' ],
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
                AuthData: POSKey.replace(/-/g, '')
            }
        ]
    },
    bankTransfer: {
        successRequestBody: {
            ApiKey,
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
            ApiKey,
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
    getAccounts: {
        successRequestBody: {
            ApiKey
        },
        successResponseBody: {
            Errors: []
        },
        errorRequestBody: {
            ApiKey: 'invalid-api-key'
        },
        expectedError: {
            ErrorCode: 'AuthenticationFailed'
        }
    },
    emailTransfer: {
        successRequestBody: {
            ApiKey,
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
            ApiKey,
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
    },
    downloadStatement: {
        successRequestBody: {
            ApiKey,
            Year: StatementYear,
            Month: StatementMonth,
            Currency: 'HUF'
        },
        // successResponseBody: buffer with length larger than 0
        errorRequestBody: {
            ApiKey,
            Year: -2020,
            Month: 1,
            Currency: 'HUF'
        },
        expectedError: {
            ErrorCode: 'StatementNotFound'
        }
    },
    createPos: {
        successRequestBody: {
            ApiKey,
            Name: `Test Shop ${Date.now()}`,
            Url: 'https://example.com',
            Description: 'Integration test shop for automated testing purposes.',
            Logo: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            Category: [ 'Other' ],
            BusinessContact: {
                Name: 'Test Business Contact',
                PhoneNumber: '36301234567',
                Email: 'business@example.com'
            },
            TechnicalContact: {
                Name: 'Test Technical Contact',
                PhoneNumber: '36301234568',
                Email: 'tech@example.com'
            },
            CustomerServiceContact: {
                Name: 'Test Support Team',
                PhoneNumber: '36301234569',
                Email: 'support@example.com'
            },
            PrimaryCurrency: 'HUF',
            ExpectedTurnover: 3,
            FullPixelImplemented: false,
            UseForEInvoicing: false,
            CallBackUrl: 'https://example.com/callback'
        },
        successResponseBody: {
            Errors: []
        },
        errorRequestBody: {
            ApiKey,
            Name: 'Test Shop',
            Url: 'https://example.com',
            Description: 'Too short'
        },
        expectedError: {
            ErrorCode: 'ModelValidationError'
        }
    },
    getPosDetails: {
        // successRequestBody: to be defined runtime, after creating a POS
        successResponseBody: {
            Errors: []
        },
        errorRequestBody: {
            ApiKey,
            PublicKey: '00000000-0000-0000-0000-000000000000'

        },
        expectedError: {
            StatusCode: '404'
        }
    }
};
