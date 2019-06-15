let chai = require('chai');
chai.use(require('chai-as-promised'));
let expect = chai.expect;

let Barion = require('../../'); //index.js in root level
let testData = require('./test-data');

describe('Integration tests', function () {

    this.timeout(15000); 

    describe('Start payment', function () {

        let barion;
        let startPayment = testData.startPayment;
        
        beforeEach(function () {
            barion = new Barion(testData.initOptions);
        });

        describe('should respond with response body on success', function () {
            it('- Callback', function (done) {
                barion.startPayment(startPayment.successRequestBody, (err, data) => {
                    expect(data).to.deep.include(startPayment.successResponseBody);
                    done();
                });
            });

            it('- Promise', function () {
                return expect(barion.startPayment(startPayment.successRequestBody))
                    .to.eventually.deep.include(startPayment.successResponseBody);
            });
        });

        describe('should respond with BarionError on wrong request body', function () {
            it('- Callback', function (done) {
                barion.startPayment(startPayment.errorRequestBody, (err) => {
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.have.lengthOf(1);
                    expect(err.errors[0]).to.deep.include(startPayment.expectedError);
                    done();
                });
            });

            it('- Promise', function () {
                return barion.startPayment(startPayment.errorRequestBody)
                    .then(_ => { throw Error('Promise expected to reject, but resolved') })
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.have.lengthOf(1);
                        expect(err.errors[0]).to.deep.include(startPayment.expectedError);
                    });
            });
        });
    });

    describe('Get payment state', function () {

        let barion;
        let getPaymentState = testData.getPaymentState;
        let paymentId;

        beforeEach(function (done) {
            barion = new Barion(testData.initOptions);
            barion.startPayment(testData.startPayment.successRequestBody, function (err, data) {
                if (err) {
                    return done(err);
                }

                paymentId = data.PaymentId;
                done();
            });
        });

        afterEach(function () { 
            paymentId = null;
        });

        describe('should respond with response body on success', function () {
            it('- Callback', function (done) {
                barion.getPaymentState({ paymentId }, function (err, data) {
                    expect(data).to.deep.include(getPaymentState.successResponseBody);
                    done();
                });
            });

            it('- Promise', function () {
                return expect(barion.getPaymentState({ paymentId }))
                    .to.eventually.deep.include(getPaymentState.successResponseBody);
            });
        });

        describe('should respond with BarionError on wrong request body', function () {
            it('- Callback', function (done) {
                barion.getPaymentState(getPaymentState.errorRequestBody, function (err, data) {
                    expect(err.errors).to.have.lengthOf(2);
                    expect(err.errors[0]).to.deep.include(getPaymentState.expectedErrors[0]);
                    expect(err.errors[1]).to.deep.include(getPaymentState.expectedErrors[1]);
                    done();
                });
            });

            it('- Promise', function () {
                return barion.getPaymentState(getPaymentState.errorRequestBody)
                    .then(_ => {
                        throw Error('Promise expected to reject, but resolved');
                    })
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.have.lengthOf(2);
                        expect(err.errors[0]).to.deep.include(getPaymentState.expectedErrors[0]);
                        expect(err.errors[1]).to.deep.include(getPaymentState.expectedErrors[1]);
                    });
            });
        });
    });

    describe.skip('Finish reservation', function () {
        // can't be tested automatically, I think,
        // because typing bank card info on Barion GUI is required after the payment is started
    });

    describe.skip('Refund payment', function () {
        // can't be tested automatically, I think,
        // because typing bank card info on Barion GUI is required after the payment is started
    });

    describe('Bank transfer', function () {

        let barion;
        let bankTransfer = testData.bankTransfer;

        beforeEach(function () {
            barion = new Barion(testData.initOptions);
        });

        describe('should respond with response body on success', function () {
            it('- Callback', function (done) {
                barion.bankTransfer(bankTransfer.successRequestBody, (err, data) => {
                    if (err) {
                        return done(err);
                    }

                    expect(data).to.deep.include(bankTransfer.successResponseBody);
                    done();
                })
            });

            it('- Promise', function () {
                return expect(barion.bankTransfer(bankTransfer.successRequestBody))
                        .to.eventually.deep.include(bankTransfer.successResponseBody);
            });
        });

        describe('should respond with BarionError on wrong request body', function () {
            it('- Callback', function (done) {
                barion.bankTransfer(bankTransfer.errorRequestBody, (err, data) => {
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.have.lengthOf(1);
                    expect(err.errors[0]).to.deep.include(bankTransfer.expectedError);
                    done();
                });
            });

            it('- Promise', function () {
                return barion.bankTransfer(bankTransfer.errorRequestBody)
                    .then(() => {
                        throw Error('Promise expected to reject, but resolved');
                    })
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.have.lengthOf(1);
                        expect(err.errors[0]).to.deep.include(bankTransfer.expectedError);
                    });
            });
        });
    });

    describe('Barion transfer', function () {

        let barion;
        let barionTransfer = testData.barionTransfer;

        beforeEach(function () {
            barion = new Barion(testData.initOptions);
        });

        describe('should respond with response body on success', function () {
            it('- Callback', function (done) {
                barion.barionTransfer(barionTransfer.successRequestBody, (err, data) => {
                    if (err) {
                        return done(err);
                    }

                    expect(data).to.deep.include(barionTransfer.successResponseBody);
                    done();
                });
            });

            it('- Promise', function () {
                return expect(barion.barionTransfer(barionTransfer.successRequestBody))
                    .to.eventually.deep.include(barionTransfer.successResponseBody);
            });
        });

        describe('should respond with BarionError on wrong request body', function () {
            it('- Callback', function (done) {
                barion.barionTransfer(barionTransfer.errorRequestBody, (err, data) => {
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.have.lengthOf(1);
                    expect(err.errors[0]).to.deep.include(barionTransfer.expectedError);
                    done();
                });
            });

            it('- Promise', function () {
                return barion.barionTransfer(barionTransfer.errorRequestBody)
                    .then(() => {
                        throw Error('Promise expected to reject, but resolved');
                    })
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.have.lengthOf(1);
                        expect(err.errors[0]).to.deep.include(barionTransfer.expectedError);
                    });
            });
        });
    });
});