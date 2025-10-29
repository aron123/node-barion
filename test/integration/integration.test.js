const { expect } = require('chai');

const Barion = require('../../'); // index.js in root level

const testData = require('./test-data');

describe('Integration tests', function () {

    this.timeout(60000);

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
            }
        );

        it('should initialize payment when validation is turned off', function (done) {
            notValidatedBarion.startPayment(testData.startPayment.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.startPayment.successResponseBody);
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.startPayment(testData.startPayment.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.startPayment.expectedError);
                    done();
                });
            }
        );
    });

    describe('Start payment (Promise)', function () {
        it('should initialize payment when validation is turned on', function (done) {
            validatedBarion.startPayment(testData.startPayment.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.startPayment.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.startPayment(testData.startPayment.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionModelError');
                        expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                        done();
                    });
            }
        );

        it('should initialize payment when validation is turned off', function (done) {
            notValidatedBarion.startPayment(testData.startPayment.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.startPayment.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.startPayment(testData.startPayment.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.be.an('array');
                        expect(err.errors[0]).to.deep.include(testData.startPayment.expectedError);
                        done();
                    });
            }
        );
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

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.getPaymentState(testData.getPaymentState.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionModelError');
                    expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                    done();
                });
            }
        );

        it('should get payment state when validation is turned off', function (done) {
            notValidatedBarion.getPaymentState(successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.getPaymentState.successResponseBody);
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.getPaymentState(testData.getPaymentState.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.getPaymentState.expectedErrors[0]);
                    done();
                });
            }
        );
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

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.getPaymentState(testData.getPaymentState.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionModelError');
                        expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                        done();
                    });
            }
        );

        it('should get payment state when validation is turned off', function (done) {
            notValidatedBarion.getPaymentState(successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.getPaymentState.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.getPaymentState(testData.getPaymentState.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.be.an('array');
                        expect(err.errors[0]).to.deep.include(testData.getPaymentState.expectedErrors[0]);
                        done();
                    });
            }
        );
    });

    describe.skip('Finish reservation', function () {
        // not trivial how to test automatically,
        // because typing bank card info on Barion GUI is required after the payment is started
    });

    describe.skip('Capture authorized payment', function () {
        // not trivial how to test automatically,
        // because typing bank card info on Barion GUI is required after the payment is started
    });

    describe.skip('Cancel authorized payment', function () {
        // not trivial how to test automatically,
        // because typing bank card info on Barion GUI is required after the payment is started
    });

    describe.skip('Complete One-Click payment', function () {
        // not trivial how to test automatically,
        // because typing bank card info on Barion GUI is required after the payment is started
    });

    describe.skip('Refund payment', function () {
        // not trivial how to test automatically,
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

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.bankTransfer(testData.bankTransfer.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionModelError');
                    expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                    done();
                });
            }
        );

        it('should start bank transfer when validation is turned off', function (done) {
            notValidatedBarion.bankTransfer(testData.bankTransfer.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.bankTransfer.successResponseBody);
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.bankTransfer(testData.bankTransfer.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.bankTransfer.expectedError);
                    done();
                });
            }
        );
    });

    describe('Bank transfer (Promise)', function () {
        it('should start bank transfer when validation is turned on', function (done) {
            validatedBarion.bankTransfer(testData.bankTransfer.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.bankTransfer.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.bankTransfer(testData.bankTransfer.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionModelError');
                        expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                        done();
                    });
            }
        );

        it('should start bank transfer when validation is turned off', function (done) {
            notValidatedBarion.bankTransfer(testData.bankTransfer.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.bankTransfer.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.bankTransfer(testData.bankTransfer.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.be.an('array');
                        expect(err.errors[0]).to.deep.include(testData.bankTransfer.expectedError);
                        done();
                    });
            }
        );
    });

    describe('Get accounts (callback)', function () {
        it('should query accounts when validation is turned on', function (done) {
            validatedBarion.getAccounts(testData.getAccounts.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.getAccounts.successResponseBody);
                done();
            });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.getAccounts(testData.getAccounts.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionModelError');
                    expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                    done();
                });
            }
        );

        it('should query accounts when validation is turned off', function (done) {
            notValidatedBarion.getAccounts(testData.getAccounts.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.getAccounts.successResponseBody);
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.getAccounts(testData.getAccounts.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.getAccounts.expectedError);
                    done();
                });
            }
        );
    });

    describe('Get accounts (Promise)', function () {
        it('should query accounts when validation is turned on', function (done) {
            validatedBarion.getAccounts(testData.getAccounts.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.getAccounts.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.getAccounts(testData.getAccounts.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionModelError');
                        expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                        done();
                    });
            }
        );

        it('should query accounts when validation is turned off', function (done) {
            notValidatedBarion.getAccounts(testData.getAccounts.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.getAccounts.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.getAccounts(testData.getAccounts.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.be.an('array');
                        expect(err.errors[0]).to.deep.include(testData.getAccounts.expectedError);
                        done();
                    });
            }
        );
    });

    describe('Email transfer (callback)', function () {
        it('should start email transfer when validation is turned on', function (done) {
            validatedBarion.emailTransfer(testData.emailTransfer.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.emailTransfer.successResponseBody);
                done();
            });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.emailTransfer(testData.emailTransfer.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionModelError');
                    expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                    done();
                });
            }
        );

        it('should start email transfer when validation is turned off', function (done) {
            notValidatedBarion.emailTransfer(testData.emailTransfer.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.emailTransfer.successResponseBody);
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.emailTransfer(testData.emailTransfer.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.emailTransfer.expectedError);
                    done();
                });
            }
        );
    });

    describe('Email transfer (Promise)', function () {
        it('should start email transfer when validation is turned on', function (done) {
            validatedBarion.emailTransfer(testData.emailTransfer.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.emailTransfer.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.emailTransfer(testData.emailTransfer.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionModelError');
                        expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                        done();
                    });
            }
        );

        it('should start email transfer when validation is turned off', function (done) {
            notValidatedBarion.emailTransfer(testData.emailTransfer.successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.emailTransfer.successResponseBody);
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.emailTransfer(testData.emailTransfer.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.be.an('array');
                        expect(err.errors[0]).to.deep.include(testData.emailTransfer.expectedError);
                        done();
                    });
            }
        );
    });

    describe('Download statement (callback)', function () {
        it('should download monthly statement when validation is turned on', function (done) {
            validatedBarion.downloadStatement(testData.downloadStatement.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.be.an('object');
                expect(res.Buffer).to.be.instanceOf(Buffer);
                expect(res.Buffer.length).to.be.greaterThan(0);
                expect(res.Type).to.equal('application/pdf');
                done();
            });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.downloadStatement(testData.downloadStatement.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionModelError');
                    expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                    done();
                });
            }
        );

        it('should download statement when validation is turned off', function (done) {
            notValidatedBarion.downloadStatement(testData.downloadStatement.successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.be.an('object');
                expect(res.Buffer).to.be.instanceOf(Buffer);
                expect(res.Buffer.length).to.be.greaterThan(0);
                expect(res.Type).to.equal('application/pdf');
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.downloadStatement(testData.downloadStatement.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.downloadStatement.expectedError);
                    done();
                });
            }
        );
    });

    describe('Statement download (Promise)', function () {
        it('should download statement when validation is turned on', function (done) {
            validatedBarion.downloadStatement(testData.downloadStatement.successRequestBody)
                .then(res => {
                    expect(res).to.be.an('object');
                    expect(res.Buffer).to.be.instanceOf(Buffer);
                    expect(res.Buffer.length).to.be.greaterThan(0);
                    expect(res.Type).to.equal('application/pdf');
                    done();
                });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.downloadStatement(testData.downloadStatement.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionModelError');
                        expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                        done();
                    });
            }
        );

        it('should download statement when validation is turned off', function (done) {
            notValidatedBarion.downloadStatement(testData.downloadStatement.successRequestBody)
                .then(res => {
                    expect(res).to.be.an('object');
                    expect(res.Buffer).to.be.instanceOf(Buffer);
                    expect(res.Buffer.length).to.be.greaterThan(0);
                    expect(res.Type).to.equal('application/pdf');
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.downloadStatement(testData.downloadStatement.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.be.an('array');
                        expect(err.errors[0]).to.deep.include(testData.downloadStatement.expectedError);
                        done();
                    });
            }
        );
    });

    describe('Create POS (callback)', function () {
        it('should create a POS when validation is turned on', function (done) {
            const requestBody = {
                ...testData.createPos.successRequestBody,
                Name: `Test Shop ${Date.now()}`
            };
            validatedBarion.createPos(requestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.createPos.successResponseBody);
                expect(res.PublicKey).to.be.a('string');
                expect(res.SecretKey).to.be.a('string');
                expect(res.Name).to.equal(requestBody.Name);
                done();
            });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.createPos(testData.createPos.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionModelError');
                    expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                    done();
                });
            }
        );

        it('should create a POS when validation is turned off', function (done) {
            const requestBody = {
                ...testData.createPos.successRequestBody,
                Name: `Test Shop ${Date.now()}`
            };
            notValidatedBarion.createPos(requestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.createPos.successResponseBody);
                expect(res.PublicKey).to.be.a('string');
                expect(res.SecretKey).to.be.a('string');
                expect(res.Name).to.equal(requestBody.Name);
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.createPos(testData.createPos.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionError');
                    expect(err.errors).to.be.an('array');
                    expect(err.errors[0]).to.deep.include(testData.createPos.expectedError);
                    done();
                });
            }
        );
    });

    describe('Create POS (Promise)', function () {
        it('should create a POS when validation is turned on', function (done) {
            const requestBody = {
                ...testData.createPos.successRequestBody,
                Name: `Test Shop ${Date.now()}`
            };
            validatedBarion.createPos(requestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.createPos.successResponseBody);
                    expect(res.PublicKey).to.be.a('string');
                    expect(res.SecretKey).to.be.a('string');
                    expect(res.Name).to.equal(requestBody.Name);
                    done();
                });
        });

        it('should answer with BarionModelError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.createPos(testData.createPos.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionModelError');
                        expect(err.errors).to.be.an('array').and.have.length.greaterThan(0);
                        done();
                    });
            }
        );

        it('should create a POS when validation is turned off', function (done) {
            const requestBody = {
                ...testData.createPos.successRequestBody,
                Name: `Test Shop ${Date.now()}`
            };
            notValidatedBarion.createPos(requestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.createPos.successResponseBody);
                    expect(res.PublicKey).to.be.a('string');
                    expect(res.SecretKey).to.be.a('string');
                    expect(res.Name).to.equal(requestBody.Name);
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.createPos(testData.createPos.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.errors).to.be.an('array');
                        expect(err.errors[0]).to.deep.include(testData.createPos.expectedError);
                        done();
                    });
            }
        );
    });

    describe('Get POS details (callback)', function () {

        let successRequestBody = {};

        beforeEach(function (done) {
            const createPosRequest = {
                ...testData.createPos.successRequestBody,
                Name: `Test Shop ${Date.now()}`
            };
            notValidatedBarion.createPos(createPosRequest, function (err, data) {
                if (err) {
                    return done(err);
                }

                successRequestBody = {
                    ApiKey: testData.createPos.successRequestBody.ApiKey,
                    PublicKey: data.PublicKey
                };
                done();
            });
        });

        afterEach(function () {
            successRequestBody = null;
        });

        it('should get POS details when validation is turned on', function (done) {
            validatedBarion.getPosDetails(successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.getPosDetails.successResponseBody);
                expect(res.PublicKey).to.equal(successRequestBody.PublicKey);
                expect(res.Name).to.be.a('string');
                expect(res.Status).to.be.a('string');
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.getPosDetails(testData.getPosDetails.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionError');
                    expect(err.statusCode).to.equal(testData.getPosDetails.expectedError.StatusCode);
                    done();
                });
            }
        );

        it('should get POS details when validation is turned off', function (done) {
            notValidatedBarion.getPosDetails(successRequestBody, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.include(testData.getPosDetails.successResponseBody);
                expect(res.PublicKey).to.equal(successRequestBody.PublicKey);
                expect(res.Name).to.be.a('string');
                expect(res.Status).to.be.a('string');
                done();
            });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.getPosDetails(testData.getPosDetails.errorRequestBody, (err, res) => {
                    expect(res).to.be.null;
                    expect(err.name).to.equal('BarionError');
                    expect(err.statusCode).to.equal(testData.getPosDetails.expectedError.StatusCode);
                    done();
                });
            }
        );
    });

    describe('Get POS details (Promise)', function () {

        let successRequestBody = {};

        beforeEach(function (done) {
            const createPosRequest = {
                ...testData.createPos.successRequestBody,
                Name: `Test Shop ${Date.now()}`
            };
            notValidatedBarion.createPos(createPosRequest, function (err, data) {
                if (err) {
                    return done(err);
                }

                successRequestBody = {
                    ApiKey: testData.createPos.successRequestBody.ApiKey,
                    PublicKey: data.PublicKey
                };
                done();
            });
        });

        afterEach(function () {
            successRequestBody = null;
        });

        it('should get POS details when validation is turned on', function (done) {
            validatedBarion.getPosDetails(successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.getPosDetails.successResponseBody);
                    expect(res.PublicKey).to.equal(successRequestBody.PublicKey);
                    expect(res.Name).to.be.a('string');
                    expect(res.Status).to.be.a('string');
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned on',
            function (done) {
                validatedBarion.getPosDetails(testData.getPosDetails.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.statusCode).to.equal(testData.getPosDetails.expectedError.statusCode);
                        done();
                    });
            }
        );

        it('should get POS details when validation is turned off', function (done) {
            notValidatedBarion.getPosDetails(successRequestBody)
                .then(res => {
                    expect(res).to.deep.include(testData.getPosDetails.successResponseBody);
                    expect(res.PublicKey).to.equal(successRequestBody.PublicKey);
                    expect(res.Name).to.be.a('string');
                    expect(res.Status).to.be.a('string');
                    done();
                });
        });

        it('should answer with BarionError when request object is not proper and validation is turned off',
            function (done) {
                notValidatedBarion.getPosDetails(testData.getPosDetails.errorRequestBody)
                    .catch(err => {
                        expect(err.name).to.equal('BarionError');
                        expect(err.statusCode).to.equal(testData.getPosDetails.expectedError.statusCode);
                        done();
                    });
            }
        );
    });
});
