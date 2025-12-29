# node-barion
[![Build Status](https://github.com/aron123/node-barion/actions/workflows/main.yml/badge.svg)](https://github.com/aron123/node-barion/actions/workflows/main.yml)
[![Coverage Status](https://coveralls.io/repos/github/aron123/node-barion/badge.svg?branch=master)](https://coveralls.io/github/aron123/node-barion?branch=master)
[![npm version](http://img.shields.io/npm/v/node-barion.svg?style=flat)](https://npmjs.org/package/node-barion "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Helps manage e-payment transactions through the [Barion Smart Gateway](https://www.barion.com/).

## Table of contents
  - [Install](#install)

  - [Usage](#usage)

  - [Documentation](#documentation)
    - [Instantiate new Barion object](#instantiate-new-barion-object---barionoptions)
    - [Start new payment](#start-new-payment---barionstartpaymentoptions-callback)
    - [Get payment state](#get-payment-state---bariongetpaymentstateoptions-callback)
    - [Finish pending reservation](#finish-pending-reservation---barionfinishreservationoptions-callback)
    - [Refund payment partially or completely](#refund-payment-partially-or-completely---barionrefundpaymentoptions-callback)
    - [Capture a previously authorized payment](#capture-a-previously-authorized-payment---barioncaptureauthorizedpaymentoptions-callback)
    - [Cancel a previously authorized payment](#cancel-a-previously-authorized-payment---barioncancelauthorizedpaymentoptions-callback)
    - [Complete a formerly prepared and 3DS authenticated One-Click payment](#complete-a-formerly-prepared-and-3ds-authenticated-one-click-payment---barioncompletepaymentoptions-callback)
    - [Send money to a bank account](#send-money-to-a-bank-account---barionbanktransferoptions-callback)
    - [Get existing accounts of the user](#get-existing-accounts-of-the-user---bariongetaccountsoptions-callback)
    - [Send money to a Barion user or email address](#send-e-money-to-an-email-address---barionemailtransferoptions-callback)
    - [Download statement files](#download-statement-files---bariondownloadstatementoptions-callback)
    - [Get transaction history](#get-transaction-history---bariongethistoryoptions-callback)
    - [Handling errors](#handling-errors)
    - [Secure vs. insecure mode](#secure-vs-insecure-mode)

  - [Future improvements](#future-improvements)

  - [Contributions](#contributions)

  - [License](#license)

## Install
To add ``node-barion`` to your project, run this command inside your workspace directory:

```
npm install node-barion --save
```

## Usage
This simple example shows how to use ``node-barion``:

```js
// 1) Import the 'node-barion' module
const Barion = require('node-barion');

// 2) Instantiate a Barion object
let barion = new Barion({
    POSKey: '21ec20203aea4069a2dd08002b30',
    Environment: 'test'
});

// 3) Query the Barion API

// 3.a) using callback
barion.getPaymentState({ 
    PaymentId: '046a46b98838473684da452da7' 
}, function (err, data) {
    //handle the result
});

// 3.b) or using promise
barion.getPaymentState({
    PaymentId: '046a46b98838473684da452da7'
}).then(data => {
    //handle data
}).catch(err => {
    //handle error
});
```

## Documentation
``node-barion`` provides all the functionality of Barion API:
- start new payment, reservation or delayed capture
- get the state of an already started payment
- finish a pending reservation
- capture or cancel a previously authorized payment
- complete a formerly prepared One-Click payment
- refund a completed payment
- send money out of Barion via international bank transfer
- get existing accounts of the user
- send money to existing Barion account or email address
- download monthly or daily statements of your account
- get transaction history for wallet accounts.

> **IMPORTANT**: ``node-barion`` is completely consistent with [Barion Docs](https://docs.barion.com/Main_Page), so you can use exactly the same field names, that are specified in it. **Reading the official Barion documentation is highly recommended** before starting to use ``node-barion`` module.<br>
> **IMPORTANT**: Barion uses *PascalCased* field naming, but **node-barion is case insensitive** (this means that if Barion Docs mention a field name *PaymentId*, you can either use *PaymentId*, *paymentId*, *paymentid* or *paymentID* notation in your application, as ``node-barion`` converts these to the standard *PaymentId* name).

The signature for every instance method is ``(options, [callback])``, where ``options`` is an object which contains the input parameters and ``callback`` is a function which processes the response.<br>
If no callback is defined, the methods return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), which resolves with data or rejects with error.

### Instantiate new Barion object - Barion(options)
A Barion instance represents a merchant that accepts e-payment transactions through Barion.

In the constructor, you can define default values that can be overridden later in certain queries (except ``POSKey`` and ``Environment``):
  - ``POSKey``: POSKey of the merchant (string). (required)

  - ``Environment``: Environment to use, ``'test'`` or ``'prod'`` (string). (optional, default: ``'test'``)

    > **IMPORTANT**: To use the production environment, you have to explicitly assign ``'prod'`` to this field. Otherwise, the environment is set to ``'test'`` by default.

  - ``Secure``: Indicates how ``node-barion`` should handle input objects before sending them to the Barion API. [Read more](#secure-vs-insecure-mode) (boolean). (optional, default: ``true``)

  - ``FundingSources``: Array with the allowed [funding sources](https://docs.barion.com/FundingSources) (string[]). (optional, default: ``['All']``)

  - ``GuestCheckOut``: Indicates if guest checkout is enabled (boolean). (optional, default: ``true``)

  - ``Locale``: Localization of Barion GUI (string). (optional, default: ``'hu-HU'``)<br>
    Allowed values are:
    - ``'cs-CZ'`` (Czech)
    - ``'de-DE'`` (German)
    - ``'en-US'`` (English)
    - ``'es-ES'`` (Spanish)
    - ``'fr-FR'`` (French)
    - ``'hu-HU'`` (Hungarian)
    - ``'sk-SK'`` (Slovakian)
    - ``'sl-SI'`` (Slovenian)

  - ``Currency``: The default currency to use (string). (optional, default: ``'HUF'``)<br>
    Allowed values are:
    - ``'CZK'`` (Czech crown)
    - ``'EUR'`` (Euro)
    - ``'HUF'`` (Hungarian forint)
    - ``'USD'`` (U.S. dollar)

#### Usage example
```js
const Barion = require('node-barion');

const barion = new Barion({
    POSKey: '21ec20203aea4069a2dd08002b30',
    Environment: 'test',
    FundingSources: [ 'Balance' ],
    Locale: 'en-US'
});
```

### Start new payment - barion.startPayment(options, \[callback\])
To create a new payment, call the ``startPayment`` function. [[Barion Docs](https://docs.barion.com/Payment-Start-v2)]

**Parameters**:

![][3DS] - Properties marked with this badge must be provided to comply with 3D Secure authentication. Provide as many attributes as you can to avoid 3DS challenge flow for your customers. If the merchant does not provide 3DS-related properties, that does not mean that the payment will fail. It means that the payer will have a higher chance of getting a challenge during payment.

  - ``PaymentType``: Type of the payment, ``'Immediate'`` (classic),  ``'Reservation'`` or ``'DelayedCapture'`` ([read more](https://docs.barion.com/Reservation_payment)) (string). (required)
    
  - ``ReservationPeriod``: Time window allowed by the shop to finalize the payment (string in 'd:hh:mm:ss' format). (required, if the payment type is reservation)

  - ``DelayedCapturePeriod``: Time window allowed by the shop to capture or cancel the payment (string in 'd:hh:mm:ss' format). (required, if the payment type is delayed capture)
    
  - ``PaymentWindow``: Time window allowed for the customer to complete the payment (string in 'd:hh:mm:ss' format). (optional, default: 30 minutes)
  
  - ``GuestCheckOut``: Indicates if guest checkout is enabled (boolean). (optional, because it is assigned in the constructor)
  
  - ``InitiateRecurrence``: Indicates that the shop would like to initialize a [token payment](https://docs.barion.com/Token_payment) (e.g. for subscription) (boolean). (optional) 
  
  - ``RecurrenceId``: A string used to identify a given authorized payment ([read more](https://docs.barion.com/Token_payment#Using_the_token)) (string). (optional)
  
  - ``FundingSources``: Array, that contains the allowed funding sources (string[]). (optional, because it is assigned in the constructor)
  
  - ``PaymentRequestId``: The unique identifier for the payment generated by the shop (string). (required)
  
  - ``PayerHint``: ![][3DS] Email address of the customer. Barion use this to fill email field automatically in login form (string). (optional)
  
  - ``CardHolderNameHint``: ![][3DS] Full name of the customer. Barion use this to prefill the payment form (string). (optional)
  
  - ``RecurrenceType``: ![][3DS] Indiates the nature of the recurrence ([RecurrenceType](https://docs.barion.com/RecurrenceType) string). (optional, must be defined only when ``RecurrenceId`` is specified)

  - ``TraceId``: ![][3DS] Identifies the nature of the token payment (string). (optional, must be defined when executing token payments)
  
  - ``RedirectUrl``: URL to redirect the user after the payment is completed (string). (required)
  
  - ``CallbackUrl``: URL that Barion should call, when the payment state changes (string). (required)
  
  - ``Transactions``: Array of transactions contained by the payment ([PaymentTransaction](https://docs.barion.com/PaymentTransaction)[]). (required)
  
  - ``OrderNumber``: Order number generated by the shop (string). (optional)
  
  - ``ShippingAddress``: ![][3DS] Address of the user ([ShippingAddress](https://docs.barion.com/ShippingAddress)). (optional)
  
  - ``Locale``: Localization of Barion GUI (string). (optional, because it is assigned in the constructor)
  
  - ``Currency``: The currency to use (string). (optional, because it is assigned in the constructor)
  
  - ``PayerPhoneNumber``: ![][3DS] The mobile phone number of the payer (string in '36301234567' format, where ``36`` is the country code). (optional)
  
  - ``PayerWorkPhoneNumber``: ![][3DS] The work phone number of the payer (string in '36301234567' format, where ``36`` is the country code). (optional)
  
  - ``PayerHomeNumber``: ![][3DS] The home number of the payer (string in '36301234567' format, where ``36`` is the country code). (optional)
  
  - ``BillingAddress``: ![][3DS] The billing address associated with the payment, if applicable ([BillingAddress](https://docs.barion.com/BillingAddress)). (optional)
  
  - ``PayerAccount``: ![][3DS] Information about the payer's account ([PayerAccountInformation](https://docs.barion.com/PayerAccountInformation)). (optional)
  
  - ``PurchaseInformation``: ![][3DS] Information about the purchase ([PurchaseInformation](https://docs.barion.com/PurchaseInformation)). (optional)
  
  - ``ChallengePreference``: ![][3DS] The merchant's preference about the 3DS challenge ([ChallengePreference](https://docs.barion.com/ChallengePreference) string). (optional)

**Output**: [Read at Barion Docs](https://docs.barion.com/Payment-Start-v2#Output_properties)

#### Usage example
Example order data: 
```js
let orderPayment = {
    OrderNumber: 'O-2019-0001',
    PaymentRequestId: 'O-2019-0001-1',
    PaymentType: 'Immediate',
    Transactions: [
        {
            POSTransactionId: 'O-2019-0001',
            Payee: 'info@example.com',
            Total: 210,
            Items: [
                {
                    Name: 'Egg',
                    Description: 'Child of chicken',
                    Quantity: 3,
                    Unit: 'pcs',
                    UnitPrice: 70,
                    ItemTotal: 210
                }    
            ]
        }
    ],
    ShippingAddress: {
        FullName: 'Andrew Jones',
        Zip: '1000',
        City: 'Budapest',
        Street: 'Kossuth Street 2.'
    },
    Currency: 'HUF',
    RedirectUrl: 'https://example.com/payment-result',
    CallbackUrl: 'https://example.com/api/barion/callback/',
};
```

##### With callback
Use the object, initialized above:
```js
barion.startPayment(orderPayment, function (err, data) {
    //handle error / process data
});
```
##### With promise
Use the object, initialized above:
```js
barion.startPayment(orderPayment).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Get payment state - barion.getPaymentState(options, \[callback\])
To get the state of a payment, use ``getPaymentState`` function. [[Barion Docs](https://docs.barion.com/Payment-GetPaymentState-v2)]

**Parameter**:
- ``PaymentId``: ID of the payment in the Barion system (string). (required)

**Output**: [Read at Barion Docs](https://docs.barion.com/Payment-GetPaymentState-v2#Output_properties)

#### Usage example
##### With callback
```js
barion.getPaymentState({
    PaymentId: '15c1071df3ea4289996ead6ae17'
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.getPaymentState({
    PaymentId: '15c1071df3ea4289996ead6ae17'
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Finish pending reservation - barion.finishReservation(options, \[callback\])
To finish a pending reservation, use the ``finishReservation`` function. [[Barion Docs](https://docs.barion.com/Payment-FinishReservation-v2)]

**Parameters**:
- ``PaymentId``: ID of the payment in Barion system (string). (required)
- ``Transactions``: Payment transactions to finish ([TransactionToFinish](https://docs.barion.com/TransactionToFinish)[]). The array should only contain the initial payment transactions. (required)

**Output**: [Read at Barion Docs](https://docs.barion.com/Payment-FinishReservation-v2#Output_properties)

#### Usage example
##### With callback
```js
barion.finishReservation({
    PaymentId: '15c1071df3ea4289996ead6ae17',
    Transactions: [
        {
            TransactionId: 'c9daac12c9154ce3a0c6a1a3',
            Total: 50
        }
    ]
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.finishReservation({
    PaymentId: '15c1071df3ea4289996ead6ae17',
    Transactions: [
        {
            TransactionId: 'c9daac12c9154ce3a0c6a1a3',
            Total: 50
        }
    ]
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Capture a previously authorized payment - barion.captureAuthorizedPayment(options, \[callback\])
 
To capture (finish) a previously authorized payment, use the ``captureAuthorizedPayment`` function. [[Barion Docs](https://docs.barion.com/Payment-Capture-v2)]

**Parameters**:
- ``PaymentId``: The payment's ID in the Barion system (string). (required)
- ``Transactions``: Payment transactions to capture ([TransactionToFinish](https://docs.barion.com/TransactionToFinish)[]). (required)

**Output**: [Read at Barion Docs](https://docs.barion.com/Payment-Capture-v2#Output_properties)

#### Usage example
##### With callback
```js
barion.captureAuthorizedPayment({
    PaymentId: '15c1071df3ea4289996ead6ae17',
    Transactions: [
        {
            TransactionId: 'c9daac12c9154ce3a0c6a1a3',
            Total: 50
        }
    ]
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.captureAuthorizedPayment({
    PaymentId: '15c1071df3ea4289996ead6ae17',
    Transactions: [
        {
            TransactionId: 'c9daac12c9154ce3a0c6a1a3',
            Total: 50
        }
    ]
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Cancel a previously authorized payment - barion.cancelAuthorizedPayment(options, \[callback\])
 
To cancel a previously authorized payment, use the ``cancelAuthorizedPayment`` function. [[Barion Docs](https://docs.barion.com/Payment-CancelAuthorization-v2)]

**Parameters**:
- ``PaymentId``: The payment's ID in the Barion system (string). (required)

**Output**: [Read at Barion Docs](https://docs.barion.com/Payment-CancelAuthorization-v2#Output_properties)

#### Usage example
##### With callback
```js
barion.cancelAuthorizedPayment({
    PaymentId: '15c1071df3ea4289996ead6ae17'
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.cancelAuthorizedPayment({
    PaymentId: '15c1071df3ea4289996ead6ae17'
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Complete a formerly prepared and 3DS authenticated One-Click payment - barion.completePayment(options, \[callback\])
 
To complete a formerly prepared and 3DS authenticated payment in the Barion system, use the ``completePayment`` function. [[Barion Docs](https://docs.barion.com/Payment-Complete-v2)]

**Parameters**:
- ``PaymentId``: The payment's ID in the Barion system (string). (required)

**Output**: [Read at Barion Docs](https://docs.barion.com/Payment-Complete-v2#Output_properties)

#### Usage example
##### With callback
```js
barion.completePayment({
    PaymentId: '15c1071df3ea4289996ead6ae17'
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.completePayment({
    PaymentId: '15c1071df3ea4289996ead6ae17'
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Refund payment partially or completely - barion.refundPayment(options, \[callback\])
To refund a completed payment, use the ``refundPayment`` function. [[Barion Docs](https://docs.barion.com/Payment-Refund-v2)]

**Parameters**:
- ``PaymentId``: ID of the payment in Barion system (string). (required)
- ``Transactions``: Payment transactions to refund ([TransactionToRefund](https://docs.barion.com/TransactionToRefund)[]). (required)

**Output**: [Read at Barion Docs](https://docs.barion.com/Payment-Refund-v2#Output_properties)

#### Usage example
##### With callback
```js
barion.refundPayment({
    PaymentId: '15c1071df3ea4289996ead6ae17',
    TransactionsToRefund: [
        {
            POSTransactionId: 'O-2019-0001',
            TransactionId: 'c9daac12c9154ce3a0c6a1a3',
            AmountToRefund: 50,
            Comment: 'Keep the change you filthy animal!'
        }
    ]
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.refundPayment({
    PaymentId: '15c1071df3ea4289996ead6ae17',
    TransactionsToRefund: [
        {
            POSTransactionId: 'O-2019-0001',
            TransactionId: 'c9daac12c9154ce3a0c6a1a3',
            AmountToRefund: 50,
            Comment: 'Sorry for the inconvenience.'
        }
    ]
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Send money to a bank account - barion.bankTransfer(options, \[callback\])
To send money to a bank account internationally, call the ``bankTransfer`` function. [[Barion Docs](https://docs.barion.com/Withdraw-BankTransfer-v2)]

**Authentication**: This endpoint requires Api Key authentication.

> **NOTE**: Username/Password authentication is no longer supported. You must use Api Key authentication.

**Parameters**:
  - ``ApiKey``: Api Key for authentication (string). (required)

  - ``Currency``: The currency to use (string). (optional, because it is assigned in the constructor)<br>
    Allowed values are:
    - ``'CZK'`` (Czech crown)
    - ``'EUR'`` (Euro)
    - ``'HUF'`` (Hungarian forint)
    - ``'USD'`` (U.S. dollar)

  - ``Amount``: Amount of the money to send (number). (required)

  - ``RecipientName``: Full name of the recipient (string). (required)

  - ``BankAccount``: The recipient's bank account ([BankAccount](https://docs.barion.com/BankAccount)). (required)

  - ``Comment``: Comment about the transfer (string). (optional)

**Output**: [Read at Barion Docs](https://docs.barion.com/Withdraw-BankTransfer-v2#Output_properties)

#### Usage example
##### With callback
```js
barion.bankTransfer({
    ApiKey: 'your-api-key-here',
    Currency: 'HUF',
    Amount: 1,
    RecipientName: 'Example Company',
    BankAccount: {
        Country: 'HUN',
        Format: 'Giro',
        AccountNumber: '10032000-01076019'
    },
    Comment: 'Keep the change you filthy animal!'
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.bankTransfer({
    ApiKey: 'your-api-key-here',
    Currency: 'HUF',
    Amount: 1,
    RecipientName: 'Example Company',
    BankAccount: {
        Country: 'HUN',
        Format: 'Giro',
        AccountNumber: '10032000-01076019'
    },
    Comment: 'Keep the change you filthy animal!'
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Get existing accounts of the user - barion.getAccounts(options, \[callback\])
To query the existing accounts of a user, call the ``getAccounts`` function. [[Barion Docs](https://docs.barion.com/Accounts-Get-v2)]

**Authentication**: This endpoint requires Api Key authentication.

> **NOTE**: Username/Password authentication is no longer supported. You must use Api Key authentication.

**Parameters**:
  - ``ApiKey``: Api Key for authentication (string). (required)

**Output**: [Read at Barion Docs](https://docs.barion.com/Accounts-Get-v2#Output_properties)

#### Usage example
##### With callback
```js
barion.getAccounts({
    ApiKey: 'your-api-key-here'
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.getAccounts({
    ApiKey: 'your-api-key-here'
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Send e-money to an email address - barion.emailTransfer(options, \[callback\])
To send money to a Barion user or to an email address, call the ``emailTransfer`` function. [[Barion Docs](https://docs.barion.com/Transfer-Email-v2)]

**Authentication**: This endpoint requires Api Key authentication.

> **NOTE**: Username/Password authentication is no longer supported. You must use Api Key authentication.

**Parameters**:
  - ``ApiKey``: Api Key for authentication (string). (required)

  - ``SourceAccountId``: The identifier of the Barion wallet. Must be an account of the authenticating user. It can be determined using the [getAccounts](#get-existing-accounts-of-the-user---bariongetaccountsoptions-callback) function (string). (required)

  - ``Amount``: The total amount to transfer ([Money](https://docs.barion.com/Money)). (required)

  - ``TargetEmail``: The recipient's email address. If they are an active Barion user, they receive the money instantly. If the e-mail address is not registered in Barion, they must register in 7 days  to claim the money (string). (required)

  - ``Comment``: Comment of the transfer (string). (optional)

**Output**: [Read at Barion Docs](https://docs.barion.com/Transfer-Email-v2#Output_properties)

#### Usage example
##### With callback
```js
barion.emailTransfer({
    ApiKey: 'your-api-key-here',
    SourceAccountId: 'bdf45c1d-bb98-4fee-bbf1-62411fb26b86',
    Amount: {
        Currency: 'HUF',
        Value: 50
    },
    TargetEmail: 'hello@example.com',
    Comment: 'Buy some milk please.'
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.emailTransfer({
    ApiKey: 'your-api-key-here',
    SourceAccountId: 'bdf45c1d-bb98-4fee-bbf1-62411fb26b86',
    Amount: {
        Currency: 'HUF',
        Value: 50
    },
    TargetEmail: 'hello@example.com',
    Comment: 'Buy some milk please.'
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Download statement files - barion.downloadStatement(options, \[callback\])
To download monthly or daily statement files generated by the Barion system, call the ``downloadStatement`` function. [[Barion Docs](https://docs.barion.com/Statement-Download-v2)]

**Authentication**: This endpoint requires Api Key authentication.

> **NOTE**: Username/Password authentication is no longer supported. You must use Api Key authentication.

**Parameters**:
  - ``ApiKey``: Api Key for authentication (string). (required)

  - ``Year``: Year of statement (number). (required)
  
  - ``Month``: Month of statement (number). (required)

  - ``Day``: Day of statement. To get daily statement files, contact Barion from the Customer Center in your Barion wallet (number). (optional)

  - ``Currency``: The currency of the statement's account. (optional, because it is assigned in the constructor)<br>
    Allowed values are:
      - ``'CZK'`` (Czech crown)
      - ``'EUR'`` (Euro)
      - ``'HUF'`` (Hungarian forint)
      - ``'USD'`` (U.S. dollar)

**Output**: [Read at Barion Docs](https://docs.barion.com/Statement-Download-v2#Output_and_response)
  - ``Type``: A valid content type from the HTTP response of the Barion API (string).
  
  - ``Buffer``: A `Buffer` object with the file data (Buffer).

#### Usage example
##### With callback
```js
barion.downloadStatement({
    ApiKey: 'your-api-key-here',
    Year: 2020,
    Month: 1
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.downloadStatement({
    ApiKey: 'your-api-key-here',
    Year: 2020,
    Month: 1
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Get transaction history - barion.getHistory(options, \[callback\])
To query the transaction history of a wallet account, call the ``getHistory`` function. [[Barion Docs](https://docs.barion.com/UserHistory-GetHistory-v3)]

**Authentication**: This endpoint requires Api Key authentication.

> **NOTE**: This API should not be used for reconciliation purposes. Use the [statement API](#download-statement-files---bariondownloadstatementoptions-callback) instead.

**Parameters**:
  - ``ApiKey``: Api Key for authentication (string). (required)

  - ``LastVisibleItemId``: The ID of the last visible transaction item. Use this for pagination to get the next set of transactions (string, GUID format). (optional)

  - ``LastRequestTime``: The timestamp of the last request. Use this along with ``LastVisibleItemId`` for pagination (Date). (optional)

  - ``Limit``: The maximum number of transactions to return. Must be between 1 and 20 (number). (optional, default: 20)

  - ``Currency``: Filter transactions by currency (string). (optional)<br>
    Allowed values are:
      - ``'CZK'`` (Czech crown)
      - ``'EUR'`` (Euro)
      - ``'HUF'`` (Hungarian forint)
      - ``'USD'`` (U.S. dollar)

**Output**: [Read at Barion Docs](https://docs.barion.com/UserHistory-GetHistory-v3#Output_properties)

#### Usage example
##### With callback
```js
barion.getHistory({
    ApiKey: 'your-api-key-here',
    Limit: 10,
    Currency: 'HUF'
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.getHistory({
    ApiKey: 'your-api-key-here',
    Limit: 10,
    Currency: 'HUF'
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Handling errors
There are 3 main types of errors that can be thrown when you use the ``node-barion`` module:
  - ``BarionError``: Thrown when the Barion system responds with errors.

    This error has a ``name`` field, set to ``'BarionError'``.

    This error has an ``errors`` array which contains the returned errors. Every error has the following fields: ``Title``, ``Description``, ``ErrorCode``, ``HappenedAt``, ``AuthData``, ``EndPoint`` ([read more](https://docs.barion.com/Calling_the_API#Handling_the_response)).<br>
    > **NOTE**: The ``errors`` array is set to ``[]`` (empty array), when the Barion API responds with:
    > - generic error (such as ``{'Message': 'An error has occurred.'}``),
    > - invalid JSON (such as an HTML maintenance page)

  - ``BarionModelError``: Thrown when the prevalidation of the request is failed. ``node-barion`` can throw this type of error only if ``Secure`` option is set to ``true`` on [instantiation](#instantiate-new-barion-object---barionoptions).
    > **NOTE**: ``Secure`` option is set to ``true`` by default.

    This error has a ``name`` field, set to ``'BarionModelError'``.

    This error has an ``errors`` array, which contains the returned errors as strings.

  - ``Other errors``: Common Javascript errors, such as ``Error`` or ``TypeError`` (thrown e.g. when network error occurred).

#### Usage example
You are able to distinguish types of errors based on their names, but it is not required. Instead, you can simply log them without any condition checking.

##### With callback
```js
barion.startPayment(someObj, function (err, data) {
    if (err) {
        if (err.name === 'BarionModelError') {
            //prevalidation of request object found errors
            return console.log(err.errors);
        } else if (err.name === 'BarionError') {
            //Barion API responded with error
            return console.log(err.errors);
        } else {
            //other error occured
            return console.log(err);
        }
    }

    // if no error occured, process data
});
```
##### With promise
```js
barion.startPayment(someObj)
    .then(data => {
        //process data
    })
    .catch(err => {
        if (err.name === 'BarionModelError') {
            //prevalidation of request object found errors
            console.log(err.errors);
        } else if (err.name === 'BarionError') {
            //Barion API responded with error
            console.log(err.errors);
        } else {
            //other error occured
            console.log(err);
        }
    });
```

### Secure vs. insecure mode
The `node-barion` module can work in 2 different modes that can be set with the `Secure` (boolean) field when instantiating a new Barion object. The field's default value is `true` (Secure Mode).

When the `Secure` field's value is `true`, the module works in "Secure Mode". In this mode, the module does some checks and transformations (if necessary and possible) on the given object before sending it to the Barion API. If it finds any error, that cannot be fixed automatically, it throws `BarionModelError`.

In Secure Mode, the following steps are applied to all input objects:

  1) **Sanitizing the object**:

  - The module strips any unknown fields from the input object (just the documented fields are transmitted to the Barion API).

  - The module converts every field names to PascalCase (as you can see in the Barion Docs).

  - If there are ambiguous field names (e.g. paymentid and PaymentId too), the module throws an error.

  1) **Validating the object**: The module runs syntactic and semantic checks on the given values (e.g. checks if PaymentId is a string and a valid GUID). For wallet endpoints (``bankTransfer``, ``getAccounts``, ``emailTransfer``, ``downloadStatement``), it validates that an Api Key is provided. If something is wrong, it throws `BarionModelError`.

  2) **Building the request object**: The module produces the object that will be transmitted to the Barion API. It merges the Barion instance's default values with values in the input object. Fields in the given object are override default values (except the `POSKey` field).

  3) **Sending the request to the Barion API**: If building the request object was successful, the module sends the request to the Barion API, and returns its response. The module handles Api Key authentication securely by sending the Api Key via the `x-api-key` HTTP header (not as query parameters), ensuring that credentials are never transmitted as URL parameters and are protected from being logged by proxies, firewalls, or web servers.

When the `Secure` field's value is `false`, the module works in "Insecure Mode". This means that the module does not run any checks and transformations on the input object. In this mode, the module merges the Barion instance's default values with values in the input object and sends it to the Barion API "as is". As in this mode, `node-barion` does not know any semantic meaning of the input object's fields, it can send credentials (e.g. Api Key) as query parameters to the Barion API. **This is not secure**, because these parameters can be logged by servers (e.g. proxies and firewalls) in plain text, even if HTTPS connection is used.

## Future improvements
  - Make available to set optional fields as defaults (e.g. ``callbackUrl``).
  - Support automatic reservation finalization / payment refund (fill the ``Transactions`` field via ``getPaymentState``)

## Contributions
Contributions are welcome.

If you report a bug, please provide the simplest example code where the error is reproducible (of course, without any confidential data) and describe the environment, where you run ``node-barion``. 

If you find a security issue, please contact me at [email](mailto:aron123dev@gmail.com) and I will get back to you as soon as possible.

I do not merge any PRs that break the build success. To test your changes before sending a PR, you should follow the instructions below:

0) Make sure you have a test Barion account, with at least 300 HUF balance.
1) Add your credentials to Barion in ``test/integration/credentials.json`` (there is an EXAMPLE in the directory with the required JSON structure).
2) Run the tests: ``npm run test``
3) To check coverage, run: ``npm run coverage``
4) Run integration tests: ``npm run integration-test``

## License

Copyright (c) 2019-present, Kiss Aron &lt;aron123dev@gmail.com&gt;

Unless otherwise stated in sources, the terms specified in LICENSE file are applicable.

<!-- References -->
[3DS]: https://img.shields.io/badge/-3DS-yellow "Required for 3DS"
[TEST-ONLY]: https://img.shields.io/badge/-TEST%20ONLY-red "Feature is currently only available on the sandox server"
[DEPRECATED]: https://img.shields.io/badge/-deprecated-red "Deprecated feature"
