# node-barion
[![Build Status](https://travis-ci.org/aron123/node-barion.svg?branch=master)](https://travis-ci.org/aron123/node-barion)
[![Coverage Status](https://coveralls.io/repos/github/aron123/node-barion/badge.svg?branch=master)](https://coveralls.io/github/aron123/node-barion?branch=master)
[![npm version](http://img.shields.io/npm/v/node-barion.svg?style=flat)](https://npmjs.org/package/node-barion "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Helps you to manage e-payment transactions through the [Barion Smart Gateway](https://www.barion.com/).

## Table of contents
  - [Install](#install)

  - [Usage](#usage)

  - [Documentation](#documentation)
    - [Instantiate new Barion object](#instantiate-new-barion-object---barionoptions)
    - [Start new payment](#start-new-payment---barionstartpaymentoptions-callback)
    - [Get payment state](#get-payment-state---bariongetpaymentstateoptions-callback)
    - [Finish pending reservation](#finish-pending-reservation---barionfinishreservationoptions-callback)
    - [Refund payment partially or completely](#refund-payment-partially-or-completely---barionrefundpaymentoptions-callback)
    - [Send money to bank account](#send-money-to-bank-account---barionbanktransferoptions-callback)
    - [Send money to Barion user or email address](#send-money-to-barion-user-or-email-address---barionbariontransferoptions-callback)
    - [Handle errors](#handle-errors)

  - [Future improvements](#future-improvements)

  - [Contributions](#contributions)

  - [License](#license)

## Install
To add node-barion to your project, run this command inside your workspace directory:

```
npm install node-barion --save
```

## Usage
This simple example shows, how to use node-barion:

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

If you are not familiar with Promise and other ES6 stuff, [get closer to it](https://udacity.com/course/es6-javascript-improved--ud356).

## Documentation
``node-barion`` provides all the functionality of Barion API:
- start new payment or reservation
- get the state of an already started payment
- finish a pending reservation
- refund a completed payment
- send money out of Barion via international bank transfer
- send money to existing Barion account or email address

> **IMPORTANT**: Node-barion is fully consistent with [Barion Docs](https://docs.barion.com/Main_Page), so you can use exactly the same field names, that are specified in it. **It is highly recommended, to read the official Barion documentation** before start to use the node-barion module.<br>
> **IMPORTANT**: Barion uses *PascalCased* field naming, but **node-barion is case insensitive** (this means that if Barion Docs mentions a field name *PaymentId*, you can either use *PaymentId*, *paymentId*, *paymentid* or *paymentID* notation in your application).

The signature for every instance method is ``(options, [callback])``, where ``options`` is an object, which contains the input parameters, and ``callback`` is a function, which processes the response.<br>
If no callback is defined, the methods return a *Promise*, which resolves with data or rejects with error.

### Instantiate new Barion object - Barion(options)
A Barion instance represents a merchant, that accepts e-payment through Barion.

In the constructor, you can define default values, that can be overridden later in certain queries (except ``POSKey`` and ``Environment``):
  - ``POSKey``: POSKey of the merchant (string). (required)

  - ``Environment``: Environment to use, ``'test'`` or ``'prod'`` (string). (optional, default: ``'test'``)

    > **IMPORTANT**: To use the production environment, you have to explicitly assign ``'prod'`` to this field. Otherwise, the environment is set to ``'test'`` by default.

  - ``ValidateModels``: Indicates if ``node-barion`` have to validate ``options`` object of method calls before sending the request to the Barion API, when it is set to ``true``, the module is prevalidates the request (boolean). (optional, default: ``true``)

  - ``FundingSources``: The allowed funding sources, ``[ 'All' ]`` or ``[ 'Balance' ]`` (string[]). (optional, default: ``[ 'All' ]``)

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

let barion = new Barion({
    POSKey: '21ec20203aea4069a2dd08002b30',
    Environment: 'test',
    FundingSources: [ 'Balance' ],
    Locale: 'en-US'
});
```

### Start new payment - barion.startPayment(options, \[callback\])
To create a new payment, call the ``startPayment`` function. [[Barion Docs](https://docs.barion.com/Payment-Start-v2)]

**Parameters**:

  - ``PaymentType``: Type of the payment, ``'Immediate'`` (classic) or ``'Reservation'`` ([read more](https://docs.barion.com/Reservation_payment)) (string). (required) 
  - ``ReservationPeriod``: Time window allowed by the shop to finalize the payment (string in 'd:hh:mm:ss' format). (required, if the payment type is reservation)
  - ``PaymentWindow``: Time window allowed for the customer to complete the payment (string in 'd:hh:mm:ss' format). (optional, default: 30 minutes)
  - ``GuestCheckOut``: Indicates if guest checkout is enabled (boolean). (optional, because it is assigned in the constructor)
  - ``InitiateRecurrence``: Indicates that the shop would like to initialize a [token payment](https://docs.barion.com/Token_payment) (e.g. for subscription) (boolean). (optional) 
  - ``RecurrenceId``: A string used to identify a given authorized payment ([read more](https://docs.barion.com/Token_payment#Using_the_token)) (string). (optional)
  - ``FundingSources``: Array, that contains the allowed funding sources (string[]). (optional, because it is assigned in the constructor)
  - ``PaymentRequestId``: The unique identifier for the payment generated by the shop (string). (required)
  - ``PayerHint``: Email address of the customer. Barion use this to fill email field automatically in login form (string). (optional)
  - ``RedirectUrl``: URL to redirect the user after the payment is completed (string). (optional)
  - ``CallbackUrl``: URL that Barion should call, when the payment state changes (string). (optional)
  - ``Transactions``: Array of transactions contained by the payment ([PaymentTransaction](https://docs.barion.com/PaymentTransaction)[]). (required)
  - ``OrderNumber``: Order number generated by the shop (string). (optional)
  - ``ShippingAddress``: Address of the user ([ShippingAddress](https://docs.barion.com/ShippingAddress)[]). (optional)
  - ``Locale``: Localization of Barion GUI (string). (optional, because it is assigned in the constructor)
  - ``Currency``: The currency to use (string). (optional, because it is assigned in the constructor)

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
    Currency: 'HUF'
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
    PaymentId: '15c1071df3ea4289996ead6ae17'
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
    PaymentId: '15c1071df3ea4289996ead6ae17'
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

### Send money to bank account - barion.bankTransfer(options, \[callback\])
To send money to a bank account internationally, call the ``bankTransfer`` function. [[Barion Docs](https://docs.barion.com/Withdraw-BankTransfer-v2)]

**Parameters**:
  - ``UserName``: Email address of the shop in the Barion system (string). (required)

  - ``Password``: Password of the shop in the Barion system (string). (required)

  - ``Currency``: The currency to use (string). (optional, because it is assigned in the constructor)<br>
    Allowed values are:
    - ``'CZK'`` (Czech crown)
    - ``'EUR'`` (Euro)
    - ``'HUF'`` (Hungarian forint)
    - ``'USD'`` (U.S. dollar)

  - ``Amount``: Amount of the money to send (number). (required)

  - ``RecipientName``: Full name of the recipient (string). (required)

  - ``BankAccount``: The recipient's bank account ([BankAccount](https://docs.barion.com/BankAccount)). (required)

  - ``Comment``: Comment of the transfer (string). (optional)

**Output**: [Read at Barion Docs](https://docs.barion.com/Withdraw-BankTransfer-v2#Output_properties)

#### Usage example
##### With callback
```js
barion.bankTransfer({
    UserName: 'info@example.com',
    Password: 'someRlyStrongP4ss#!',
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
    UserName: 'info@example.com',
    Password: 'someRlyStrongP4ss#!',
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

### Send money to Barion user or email address - barion.barionTransfer(options, \[callback\])
To send money to a Barion user or to an email address, call the ``barionTransfer`` function. [[Barion Docs](https://docs.barion.com/Transfer-Send-v1)]

**Parameters**:
  - ``UserName``: Email address of the shop in the Barion system (string). (required)

  - ``Password``: Password of the shop in the Barion system (string). (required)

  - ``Currency``: The currency to use (string). (optional, because it is assigned in the constructor)<br>
    Allowed values are:
    - ``'CZK'`` (Czech crown)
    - ``'EUR'`` (Euro)
    - ``'HUF'`` (Hungarian forint)
    - ``'USD'`` (U.S. dollar)

  - ``Amount``: Amount of the money to send (number). (required)

  - ``Recipient``: Email address of the recipient (string). (required)

  - ``Comment``: Comment of the transfer (string). (optional)

**Output**: [Read at Barion Docs](https://docs.barion.com/Transfer-Send-v1#Output_properties)

#### Usage example
##### With callback
```js
barion.barionTransfer({
    UserName: 'info@example.com',
    Password: 'someRlyStrongP4ss#!',
    Currency: 'HUF',
    Amount: 1,
    Recipient: 'info@example.com',
    Comment: 'Have a nice party'
}, function (err, data) {
    //handle error / process data
});
```
##### With promise
```js
barion.barionTransfer({
    UserName: 'info@example.com',
    Password: 'someRlyStrongP4ss#!',
    Currency: 'HUF',
    Amount: 1,
    Recipient: 'info@example.com',
    Comment: 'Have a nice party'
}).then(data => {
    //process data
}).catch(err => {
    //handle error
});
```

### Handle errors
There are 3 main types of errors can thrown, when you use the ``node-barion`` module:
  - ``BarionError``: Thrown, when the Barion system responds with errors.

    This error has a ``name`` field, set to ``'BarionError'``.

    This error has an ``errors`` array, which contains the returned errors. Every error has the following fields: ``Title``, ``Description``, ``ErrorCode``, ``HappenedAt``, ``AuthData``, ``EndPoint`` ([read more](https://docs.barion.com/Calling_the_API#Handling_the_response)).<br>
    > **NOTE**: The ``errors`` array is set to ``[]`` (empty array), when the Barion API responds with:
    > - generic error (such as ``{'Message': 'An error has occurred.'}``),
    > - invalid JSON (such as an HTML maintenance page)

  - ``BarionModelError``: Thrown, when the prevalidation of the request is failed. ``node-barion`` can throw this type of error only if ``ValidateModels`` option is set to ``true`` on [instantiation](#instantiate-new-barion-object---barionoptions).
    > **NOTE**: ``ValidateModels`` option is set to true by default on instantiation.

    This error has a ``name`` field, set to ``'BarionModelError'``.

    This error has an ``errors`` array, which contains the returned errors as strings.

  - ``Other errors``: Common Javascript errors, such as ``Error`` or ``TypeError`` (thrown e.g. when network error occured).

#### Usage example
You can distinguish types of errors based on their names, but it is not a must. Instead, you can simply log them to the database or to the console without any condition checking.

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

## Future improvements
  - Make available to set optional fields as defaults (e.g. ``callbackUrl``).
  - Support automatic reservation finalization / payment refund (fill the ``Transactions`` field via ``getPaymentState``)

## Contributions
Contributions are welcome.

If you report a bug/issue, please provide as detailed code to reproduce as possible (of course, without any confidential data), and describe the environment, where you run ``node-barion``. 

I do not merge any PR that break the build success. To test your changes, before send a PR, you should follow the instructions below:

0) Make sure you have a test Barion account, with at least 1000 HUF balance.
1) Add your credentials to Barion in ``test/integration/credentials.json`` (there is an EXAMPLE in the directory, with the required format).
2) Run the tests: ``npm run test``
3) To check coverage, run: ``npm run coverage``
4) Run integration tests: ``npm run integration-test``

## License

Copyright (c) 2019-present, Kiss Aron &lt;aron123dev@gmail.com&gt;

Unless otherwise stated in sources, the terms specified in LICENSE file are applicable.
