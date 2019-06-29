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
    transactions: [ { a: 'b' }, { a: 'c' } ]
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
            refundPayment: returnSuccess,
            bankTransfer: returnSuccess,
            barionTransfer: returnSuccess
        }
    }),
    ServiceErrorBarion: proxyquire('../lib/barion', {
        './services': {
            startPayment: returnError,
            getPaymentState: returnError,
            finishReservation: returnError,
            refundPayment: returnError,
            bankTransfer: returnError,
            barionTransfer: returnError
        }
    }),
    ValidationErrorBarion: proxyquire('../lib/barion', {
        './services': {
            startPayment: returnSuccess,
            getPaymentState: returnSuccess,
            finishReservation: returnSuccess,
            refundPayment: returnSuccess,
            bankTransfer: returnSuccess,
            barionTransfer: returnSuccess
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
            refundPayment: returnSuccess,
            bankTransfer: returnSuccess,
            barionTransfer: returnSuccess
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
                FundingSources: [ 'All' ],
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

    const ServiceErrorBarion = new Barions.ServiceErrorBarion({
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
            ServiceErrorBarion.startPayment(request, (err, res) => {
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
            const promise = ServiceErrorBarion.startPayment(request);
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
            ServiceErrorBarion.getPaymentState(request, (err, res) => {
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
            const promise = ServiceErrorBarion.getPaymentState(request);
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
            ServiceErrorBarion.finishReservation(request, (err, res) => {
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
            const promise = ServiceErrorBarion.finishReservation(request);
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
            ServiceErrorBarion.refundPayment(request, (err, res) => {
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
            const promise = ServiceErrorBarion.refundPayment(request);
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
            ServiceErrorBarion.bankTransfer(request, (err, res) => {
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
            const promise = ServiceErrorBarion.bankTransfer(request);
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
            ServiceErrorBarion.barionTransfer(request, (err, res) => {
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
            const promise = ServiceErrorBarion.barionTransfer(request);
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
});
