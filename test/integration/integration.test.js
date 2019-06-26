const { expect } = require('chai');

const Barion = require('../../'); //index.js in root level

const testData = require('./test-data');

describe('Integration tests', function () {

    this.timeout(15000); 

    let validatedBarion;
    let notValidatedBarion;

    beforeEach(function () {
        validatedBarion = new Barion(testData.initOptions.withValidation);
        notValidatedBarion = new Barion(testData.initOptions.withoutValidation);
    });

    describe('Start payment (callback)', function () {
        it('should initialize payment when validation is turned on', function (done) {
            validatedBarion.startPayment(testData.startPayment.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.startPayment.successResponseBody);
                done();
            });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on', 
            function (done) {
            validatedBarion.startPayment(testData.startPayment.errorRequestBody, (err, res) => {
                expect(res).to.be.null;
                expect(err.name).to.equal('BarionModelError');
                expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                done();
            });
        });

        it('should initialize payment when validation is turned off', function (done) {
            notValidatedBarion.startPayment(testData.startPayment.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.startPayment.successResponseBody);
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off', function (done) {
            notValidatedBarion.startPayment(testData.startPayment.errorRequestBody, (err, res) => {
                expect(res).to.be.null;
                expect(err.name).to.equal('BarionError');
                expect(err.errors).to.be.an('array');
                expect(err.errors[0]).to.deep.include(testData.startPayment.expectedError);
                done();
            });
        });
    });

    describe('Start payment (Promise)', function () {
        it('should initialize payment when validation is turned on', function (done) {
            validatedBarion.startPayment(testData.startPayment.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.startPayment.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on', function (done) {
            validatedBarion.startPayment(testData.startPayment.errorRequestBody)
                .catch(err => {
                    expect(err.name).to.equal('BarionModelError');
                    expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                    done();
                });
        });

        it('should initialize payment when validation is turned off', function (done) {
            notValidatedBarion.startPayment(testData.startPayment.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.startPayment.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off', function (done) {
            notValidatedBarion.startPayment(testData.startPayment.errorRequestBody)
                .catch(err => {
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.startPayment.expectedError);
                    done();
                });
        });
    });

    describe('Get payment state (callback)', function () {

        let successRequestBody = {};

        beforeEach(function (done) {
            notValidatedBarion.startPayment(testData.startPayment.successRequestBody, function (err, data) {
                if (err) {
                    return done(err);
                }

                successRequestBody = { PaymentId: data.PaymentId };
                done();
            });
        });

        afterEach(function () { 
            successRequestBody = null;
        });

        it('should get payment state when validation is turned on', function (done) {
            validatedBarion.getPaymentState(successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.getPaymentState.successResponseBody);
                done();
            });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on', function (done) {
            validatedBarion.getPaymentState(testData.getPaymentState.errorRequestBody, (err, res) => {
                expect(res).to.be.null;
                expect(err.name).to.equal('BarionModelError');
                expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                done();
            });
        });

        it('should get payment state when validation is turned off', function (done) {
            notValidatedBarion.getPaymentState(successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.getPaymentState.successResponseBody);
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off', function (done) {
            notValidatedBarion.getPaymentState(testData.getPaymentState.errorRequestBody, (err, res) => {
                expect(res).to.be.null;
                expect(err.name).to.equal('BarionError');
                expect(err.errors).to.be.an('array');
                expect(err.errors[0]).to.deep.include(testData.getPaymentState.expectedErrors[0]);
                expect(err.errors[1]).to.deep.include(testData.getPaymentState.expectedErrors[1]);
                done();
            });
        });
    });

    describe('Get payment state (Promise)', function () {

        let successRequestBody = {};

        beforeEach(function (done) {
            notValidatedBarion.startPayment(testData.startPayment.successRequestBody, function (err, data) {
                if (err) {
                    return done(err);
                }

                successRequestBody = { PaymentId: data.PaymentId };
                done();
            });
        });

        afterEach(function () { 
            successRequestBody = null;
        });

        it('should get payment state when validation is turned on', function (done) {
            validatedBarion.getPaymentState(successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.getPaymentState.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on', function (done) {
            validatedBarion.getPaymentState(testData.getPaymentState.errorRequestBody)
                .catch(err => {
                    expect(err.name).to.equal('BarionModelError');
                    expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                    done();
                });
        });

        it('should get payment state when validation is turned off', function (done) {
            notValidatedBarion.getPaymentState(successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.getPaymentState.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off', function (done) {
            notValidatedBarion.getPaymentState(testData.getPaymentState.errorRequestBody)
                .catch(err => {
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.getPaymentState.expectedErrors[0]);
                    expect(err.errors[1]).to.deep.include(testData.getPaymentState.expectedErrors[1]);
                    done();
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

    describe('Bank transfer (callback)', function () {
        it('should start bank transfer when validation is turned on', function (done) {
            validatedBarion.bankTransfer(testData.bankTransfer.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.bankTransfer.successResponseBody);
                done();
            });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on', function (done) {
            validatedBarion.bankTransfer(testData.bankTransfer.errorRequestBody, (err, res) => {
                expect(res).to.be.null;
                expect(err.name).to.equal('BarionModelError');
                expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                done();
            });
        });

        it('should start bank transfer when validation is turned off', function (done) {
            notValidatedBarion.bankTransfer(testData.bankTransfer.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.bankTransfer.successResponseBody);
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off', function (done) {
            notValidatedBarion.bankTransfer(testData.bankTransfer.errorRequestBody, (err, res) => {
                expect(res).to.be.null;
                expect(err.name).to.equal('BarionError');
                expect(err.errors).to.be.an('array');
                expect(err.errors[0]).to.deep.include(testData.bankTransfer.expectedError);
                done();
            });
        });
    });

    describe('Bank transfer (Promise)', function () {
        it('should start bank transfer when validation is turned on', function (done) {
            validatedBarion.bankTransfer(testData.bankTransfer.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.bankTransfer.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on', function (done) {
            validatedBarion.bankTransfer(testData.bankTransfer.errorRequestBody)
                .catch(err => {
                    expect(err.name).to.equal('BarionModelError');
                    expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                    done();
                });
        });

        it('should start bank transfer when validation is turned off', function (done) {
            notValidatedBarion.bankTransfer(testData.bankTransfer.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.bankTransfer.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off', function (done) {
            notValidatedBarion.bankTransfer(testData.bankTransfer.errorRequestBody)
                .catch(err => {
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.bankTransfer.expectedError);
                    done();
                });
        });
    });

    describe('Barion transfer (callback)', function () {
        it('should start Barion transfer when validation is turned on', function (done) {
            validatedBarion.barionTransfer(testData.barionTransfer.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.barionTransfer.successResponseBody);
                done();
            });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on', function (done) {
            validatedBarion.barionTransfer(testData.barionTransfer.errorRequestBody, (err, res) => {
                expect(res).to.be.null;
                expect(err.name).to.equal('BarionModelError');
                expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                done();
            });
        });

        it('should start Barion transfer when validation is turned off', function (done) {
            notValidatedBarion.barionTransfer(testData.barionTransfer.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.barionTransfer.successResponseBody);
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off', function (done) {
            notValidatedBarion.barionTransfer(testData.barionTransfer.errorRequestBody, (err, res) => {
                expect(res).to.be.null;
                expect(err.name).to.equal('BarionError');
                expect(err.errors).to.be.an('array');
                expect(err.errors[0]).to.deep.include(testData.barionTransfer.expectedError);
                done();
            });
        });
    });

    describe('Barion transfer (Promise)', function () {
        it('should start Barion transfer when validation is turned on', function (done) {
            validatedBarion.barionTransfer(testData.barionTransfer.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.barionTransfer.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on', function (done) {
            validatedBarion.barionTransfer(testData.barionTransfer.errorRequestBody)
                .catch(err => {
                    expect(err.name).to.equal('BarionModelError');
                    expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                    done();
                });
        });

        it('should start Barion transfer when validation is turned off', function (done) {
            notValidatedBarion.barionTransfer(testData.barionTransfer.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.barionTransfer.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off', function (done) {
            notValidatedBarion.barionTransfer(testData.barionTransfer.errorRequestBody)
                .catch(err => {
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.barionTransfer.expectedError);
                    done();
                });
        });
    });
});
