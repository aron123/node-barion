const proxyquire = require('proxyquire');
const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const Barion = require('../lib/barion');
const { BarionError, BarionModelError } = require('../lib/errors');

/**
 * Mocks.
 */
const successObject = {
    success: true,
    paymentId: 'abcdefg',
    transactions: [{ a: 'b' }, { a: 'c' }]
};
const returnSuccess = () => Promise.resolve(successObject);

const errorObject = new BarionError('Request errored out.', [
    'something went wrong',
    'but others are not'
]);
const returnError = () => Promise.reject(errorObject);

const validationErrorObject = new BarionModelError('Invalid object given.', [
    '"something" is required',
    'dnt frget to feed yr cat evrydai'
]);
const throwValidationError = () => {
    throw validationErrorObject;
};

const sanitizationErrorObject = new Error('Goulash is so delicious.');
const throwSanitizationError = () => {
    throw sanitizationErrorObject;
};

/**
 * Mock injections.
 */
const Barions = {
    OkBarion: proxyquire('../lib/barion', {
        './services': {
            startPayment: returnSuccess,
            getPaymentState: returnSuccess,
            finishReservation: returnSuccess,
            captureAuthorizedPayment: returnSuccess,
            cancelAuthorizedPayment: returnSuccess,
            refundPayment: returnSuccess,
            bankTransfer: returnSuccess,
            barionTransfer: returnSuccess,
            getAccounts: returnSuccess,
            emailTransfer: returnSuccess,
            downloadStatement: returnSuccess
        }
    }),
    ServiceErrorBarion: proxyquire('../lib/barion', {
        './services': {
            startPayment: returnError,
            getPaymentState: returnError,
            finishReservation: returnError,
            captureAuthorizedPayment: returnError,
            cancelAuthorizedPayment: returnError,
            refundPayment: returnError,
            bankTransfer: returnError,
            barionTransfer: returnError,
            getAccounts: returnError,
            emailTransfer: returnError,
            downloadStatement: returnError
        }
    }),
    ValidationErrorBarion: proxyquire('../lib/barion', {
        './services': {
            startPayment: returnSuccess,
            getPaymentState: returnSuccess,
            finishReservation: returnSuccess,
            captureAuthorizedPayment: returnSuccess,
            cancelAuthorizedPayment: returnSuccess,
            refundPayment: returnSuccess,
            bankTransfer: returnSuccess,
            barionTransfer: returnSuccess,
            getAccounts: returnSuccess,
            emailTransfer: returnSuccess,
            downloadStatement: returnSuccess
        },
        './build': {
            buildRequest: throwValidationError
        }
    }),
    SanitizationErrorBarion: proxyquire('../lib/barion', {
        './services': {
            startPayment: returnSuccess,
            getPaymentState: returnSuccess,
            finishReservation: returnSuccess,
            captureAuthorizedPayment: returnSuccess,
            cancelAuthorizedPayment: returnSuccess,
            refundPayment: returnSuccess,
            bankTransfer: returnSuccess,
            barionTransfer: returnSuccess,
            getAccounts: returnSuccess,
            emailTransfer: returnSuccess,
            downloadStatement: returnSuccess
        },
        './build': {
            buildRequestWithoutValidation: throwSanitizationError
        }
    })
};

describe('lib/barion.js', function () {
    describe('#Barion(options)', function () {
        it('should throw error if POSKey property is not defined', function () {
            expect(() => new Barion({})).to.throw();
        });

        it('should not set Environment property to other values than \'test\' and \'prod\'', function () {
            expect(() => new Barion({
                POSKey: '277a6ae1-12b0-4192-8e6c-bc7d0612afa1',
                Environment: 'example'
            })).to.throw();
        });

        it('should set Environment property to \'test\' by default', function () {
            const barion = new Barion({ POSKey: '277a6ae1-12b0-4192-8e6c-bc7d0612afa1' });
            expect(barion.defaults.Environment).to.be.equal('test');
        });

        it('should merge custom options with defaults successfully', function () {
            const barion = new Barion({
                POSKey: '277a6ae1-12b0-4192-8e6c-bc7d0612afa1',
                Environment: 'test'
            });

            expect(barion.defaults).to.deep.include({
                POSKey: '277a6ae1-12b0-4192-8e6c-bc7d0612afa1',
                Environment: 'test',
                FundingSources: ['All'],
                GuestCheckOut: true,
                Locale: 'hu-HU',
                Currency: 'HUF'
            });
        });
    });

    const okBarion = new Barions.OkBarion({
        POSKey: '277a6ae1-12b0-4192-8e6c-bc7d0612afa1'
    });

    const okBarionWithoutValidation = new Barions.OkBarion({
        POSKey: '277a6ae1-12b0-4192-8e6c-bc7d0612afa1',
        ValidateModels: false
    });

    const serviceErrorBarion = new Barions.ServiceErrorBarion({
        POSKey: '277a6ae1-12b0-4192-8e6c-bc7d0612afa1'
    });

    const validationErrorBarion = new Barions.ValidationErrorBarion({
        POSKey: '277a6ae1-12b0-4192-8e6c-bc7d0612afa1'
    });

    const sanitizationErrorBarion = new Barions.SanitizationErrorBarion({
        POSKey: '277a6ae1-12b0-4192-8e6c-bc7d0612afa1',
        ValidateModels: false
    });

    describe('#startPayment(options, [callback])', function () {
        const request = {
            PaymentRequestId: 'ORDER#6409-1',
            PaymentType: 'Immediate',
            RedirectUrl: 'https://shop.example.com/redirect',
            CallbackUrl: 'https://shop.example.com/api/barion-callback',
            Transactions: [
                {
                    POSTransactionId: 'ORDER#6409',
                    Payee: 'info@example.com',
                    Total: 256
                }
            ]
        };

        it('should answer with callback on success', function (done) {
            okBarion.startPayment(request, (err, res) => {
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.startPayment(request, (err, res) => {
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.startPayment(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.startPayment(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.startPayment(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.startPayment(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.startPayment(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.startPayment(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.startPayment(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.startPayment(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });

    describe('#getPaymentState(options, [callback])', function () {
        const request = {
            PaymentId: '277a6ae1-12b0-4192-8e6c-bc7d0612afa2'
        };

        it('should answer with callback on success', function (done) {
            okBarion.getPaymentState(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.getPaymentState(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.getPaymentState(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.getPaymentState(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.getPaymentState(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.getPaymentState(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.getPaymentState(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.getPaymentState(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.getPaymentState(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.getPaymentState(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });

    describe('#finishReservation(options, [callback])', function () {
        const request = {
            PaymentId: '277a6ae1-12b0-4192-8e6c-bc7d0612afa2',
            Transactions: [
                {
                    TransactionId: '277a6ae1-12b0-4192-8e6c-bc7d0612afa3',
                    Total: 256
                }
            ]
        };

        it('should answer with callback on success', function (done) {
            okBarion.finishReservation(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.finishReservation(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.finishReservation(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.finishReservation(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.finishReservation(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.finishReservation(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.finishReservation(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.finishReservation(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.finishReservation(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.finishReservation(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });

    describe('#captureAuthorizedPayment(options, [callback])', function () {
        const request = {
            PaymentId: '277a6ae1-12b0-4192-8e6c-bc7d0612afa2',
            Transactions: [
                {
                    TransactionId: '277a6ae1-12b0-4192-8e6c-bc7d0612afa3',
                    Total: 256
                }
            ]
        };

        it('should answer with callback on success', function (done) {
            okBarion.captureAuthorizedPayment(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.captureAuthorizedPayment(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.captureAuthorizedPayment(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.captureAuthorizedPayment(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.captureAuthorizedPayment(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.captureAuthorizedPayment(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.captureAuthorizedPayment(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.captureAuthorizedPayment(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.captureAuthorizedPayment(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.captureAuthorizedPayment(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });

    describe('#cancelAuthorizedPayment(options, [callback])', function () {
        const request = {
            PaymentId: '277a6ae1-12b0-4192-8e6c-bc7d0612afa2'
        };

        it('should answer with callback on success', function (done) {
            okBarion.cancelAuthorizedPayment(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.cancelAuthorizedPayment(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.cancelAuthorizedPayment(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.cancelAuthorizedPayment(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.cancelAuthorizedPayment(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.cancelAuthorizedPayment(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.cancelAuthorizedPayment(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.cancelAuthorizedPayment(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.cancelAuthorizedPayment(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.cancelAuthorizedPayment(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });

    describe('#refundPayment(options, [callback])', function () {
        const request = {
            PaymentId: '277a6ae1-12b0-4192-8e6c-bc7d0612afa2',
            TransactionsToRefund: [
                {
                    TransactionId: '277a6ae1-12b0-4192-8e6c-bc7d0612afa3',
                    POSTransactionId: 'ORDER#6409',
                    AmountToRefund: 256
                }
            ]
        };

        it('should answer with callback on success', function (done) {
            okBarion.refundPayment(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.refundPayment(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.refundPayment(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.refundPayment(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.refundPayment(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.refundPayment(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.refundPayment(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.refundPayment(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.refundPayment(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.refundPayment(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });

    describe('#bankTransfer(options, [callback])', function () {
        const request = {
            UserName: 'info@example.com',
            Password: 'admin1234',
            Currency: 'HUF',
            Amount: 1500,
            RecipientName: 'Jacob Gypsum',
            BankAccount: {
                Country: 'HUN',
                Format: 'Giro',
                AccountNumber: '12345678-12345678'
            }
        };

        it('should answer with callback on success', function (done) {
            okBarion.bankTransfer(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.bankTransfer(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.bankTransfer(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.bankTransfer(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.bankTransfer(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.bankTransfer(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.bankTransfer(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.bankTransfer(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.bankTransfer(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.bankTransfer(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });

    describe('#barionTransfer(options, [callback])', function () {
        const request = {
            UserName: 'info@example.com',
            Password: 'admin1234',
            Currency: 'HUF',
            Amount: 1500,
            Recipient: 'admin@example.com'
        };

        it('should answer with callback on success', function (done) {
            okBarion.barionTransfer(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.barionTransfer(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.barionTransfer(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.barionTransfer(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.barionTransfer(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.barionTransfer(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.barionTransfer(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.barionTransfer(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.barionTransfer(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.barionTransfer(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });

    describe('#getAccounts(options, [callback])', function () {
        const request = {
            UserName: 'info@example.com',
            Password: 'admin1234'
        };

        it('should answer with callback on success', function (done) {
            okBarion.getAccounts(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.getAccounts(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.getAccounts(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.getAccounts(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.getAccounts(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.getAccounts(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.getAccounts(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.getAccounts(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.getAccounts(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.getAccounts(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });

    describe('#emailTransfer(options, [callback])', function () {
        const request = {
            UserName: 'info@example.com',
            Password: 'admin1234',
            SourceAccountId: 'b57f2259-c36c-4a24-a571-c16ec36cbde0',
            Amount: {
                Currency: 'HUF',
                Value: 50
            },
            TargetEmail: 'hello@example.com',
            Comment: 'Some really cool example comment.'
        };

        it('should answer with callback on success', function (done) {
            okBarion.emailTransfer(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.emailTransfer(request, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.emailTransfer(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.emailTransfer(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.emailTransfer(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.emailTransfer(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.emailTransfer(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.emailTransfer(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.emailTransfer(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.emailTransfer(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });

    describe('#downloadStatement(options, [callback])', function () {
        const request = {
            UserName: 'info@example.com',
            Password: 'admin1234',
            Year: 2020,
            Month: 12
        };

        it('should answer with callback on success', function (done) {
            okBarion.downloadStatement(request, (err, res) => {
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on success when validation is turned off', function (done) {
            okBarionWithoutValidation.downloadStatement(request, (err, res) => {
                expect(res).to.deep.equal(successObject);
                done();
            });
        });

        it('should answer with callback on error', function (done) {
            serviceErrorBarion.downloadStatement(request, (err, res) => {
                expect(err).to.deep.equal(errorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on validation error', function (done) {
            validationErrorBarion.downloadStatement(request, (err, res) => {
                expect(err).to.deep.equal(validationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with callback on sanitization error when validation is turned off', function (done) {
            sanitizationErrorBarion.downloadStatement(request, (err, res) => {
                expect(err).to.deep.equal(sanitizationErrorObject);
                expect(res).to.be.null;
                done();
            });
        });

        it('should answer with Promise on success', function (done) {
            const promise = okBarion.downloadStatement(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on success when validation is turned off', function (done) {
            const promise = okBarionWithoutValidation.downloadStatement(request);
            expect(promise).to.eventually.deep.equal(successObject).notify(done);
        });

        it('should answer with Promise on error', function (done) {
            const promise = serviceErrorBarion.downloadStatement(request);
            expect(promise).to.eventually.rejectedWith(errorObject).notify(done);
        });

        it('should answer with Promise on validation error', function (done) {
            const promise = validationErrorBarion.downloadStatement(request);
            expect(promise).to.eventually.rejectedWith(validationErrorObject).notify(done);
        });

        it('should answer with Promise on sanitization error when validation is turned off', function (done) {
            const promise = sanitizationErrorBarion.downloadStatement(request);
            expect(promise).to.eventually.rejectedWith(sanitizationErrorObject).notify(done);
        });
    });
});
