/*
 * Assertion library.
 */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

/*
 * Mocking-related dependencies.
 */
const proxyquire = require('proxyquire');
const { BarionError } = require('../lib/errors');

/*
 * Mocks.
 */
let barionMocks = {
    /*
     * Request succeeded.
     */
    okBarion: proxyquire('../lib/barion', {
        './fetch-api': {
            postToBarion: () => Promise.resolve({ success: true, answer: 'example' }),
            getFromBarion: () => Promise.resolve({ success: true, answer: 'example' })
        }
    }),
    /*
     * Request ended in error.
     */
    errorBarion: proxyquire('../lib/barion', {
        './fetch-api': {
            postToBarion: () => Promise.reject(new BarionError('Barion request errored out', [
                { Title: 'Authentication failed.', HappenedAt: '2019-01-19T18:46:51.0808761Z' } 
            ])),
            getFromBarion: () => Promise.reject(new BarionError('Barion request errored out', [
                { Title: 'Authentication failed.', HappenedAt: '2019-01-19T18:46:51.0808761Z' } 
            ]))
        }
    }),
    /*
     * Error occured between client and server.
     */
    networkErrorBarion: proxyquire('../lib/barion', {
        './fetch-api': {
            postToBarion: () => Promise.reject(new Error('Failed to fetch data')),
            getFromBarion: () => Promise.reject(new Error('Failed to fetch data'))
        }
    })
};


/*
 * Tests.
 */
describe('lib/barion.js', function () {

    describe('#Barion(options)', function () {
        let Barion = barionMocks.okBarion;

        it('should throw error if POSKey property is not defined', function () {
            expect(() => new Barion({})).to.throw(/^At least POSKey is required to communicate with Barion API.$/);
        });

        it('should not set Environment property to other values than \'test\' and \'prod\'', function () {
            expect(() => new Barion({
                POSKey: 'aaaa',
                Environment: 'example'
            })).to.throw(Error);
        });

        it('should set Environment property to \'test\' by default', function () {
            let payment = new Barion({ POSKey: 'example' });
            expect(payment.defaults.Environment).to.be.equal('test');
        })

        it('should merge custom options with defaults successfully', function () {
            let payment = new Barion({
                POSKey: 'aaaaaa',
                Environment: 'test',
                GuestCheckOut: false,
                Locale: 'en-US'
            });

            expect(payment.defaults).to.deep.equals({
                POSKey: 'aaaaaa',
                Environment: 'test',
                FundingSources: [ 'All' ],
                GuestCheckOut: false,
                Locale: 'en-US',
                Currency: 'HUF'
            });
        });
    });

    describe('#startPayment, getPaymentState, finishReservation, refundPayment, ' + 
                    'bankTransfer, barionTransfer (options, [callback])', function () {

        describe('should respond with error if trying to override POSKey', function () {
            let Barion = barionMocks.okBarion;
            let barion = new Barion({ POSKey: 'aaaa' });
            let customs = { POSKey: 'bbbb' };
            let matcher = 'POSKey can not overridden.';
            
            it('- Callback', async function () {
                let callback = err => expect(err.message).to.equals(matcher);

                await barion.startPayment(customs, callback);
                await barion.getPaymentState(customs, callback);
                await barion.finishReservation(customs, callback);
                await barion.refundPayment(customs, callback);
                await barion.bankTransfer(customs, callback);
                await barion.barionTransfer(customs, callback);
            });

            it('- Promise', function () {
                return Promise.all([
                    expect(barion.startPayment(customs)).to.be.rejectedWith(matcher),
                    expect(barion.getPaymentState(customs)).to.be.rejectedWith(matcher),
                    expect(barion.finishReservation(customs)).to.be.rejectedWith(matcher),
                    expect(barion.refundPayment(customs)).to.be.rejectedWith(matcher),
                    expect(barion.bankTransfer(customs)).to.be.rejectedWith(matcher),
                    expect(barion.barionTransfer(customs)).to.be.rejectedWith(matcher)
                ]);
            })
        });

        describe('should respond with error if trying to override Environment', function () {
            let Barion = barionMocks.okBarion;
            let barion = new Barion({ POSKey: 'aaaa' });
            let customs = { Environment: 'prod' };
            let matcher = 'Environment can not overridden.';

            it('- Callback', async function () {
                let callback = err => expect(err.message).to.equals(matcher);

                await barion.startPayment(customs, callback);
                await barion.getPaymentState(customs, callback);
                await barion.finishReservation(customs, callback);
                await barion.refundPayment(customs, callback);
                await barion.bankTransfer(customs, callback);
                await barion.barionTransfer(customs, callback);
            });

            it('- Promise', function () {
                return Promise.all([
                    expect(barion.startPayment(customs)).to.be.rejectedWith(matcher),
                    expect(barion.getPaymentState(customs)).to.be.rejectedWith(matcher),
                    expect(barion.finishReservation(customs)).to.be.rejectedWith(matcher),
                    expect(barion.refundPayment(customs)).to.be.rejectedWith(matcher),
                    expect(barion.bankTransfer(customs)).to.be.rejectedWith(matcher),
                    expect(barion.barionTransfer(customs)).to.be.rejectedWith(matcher)
                ]);
            })
        });

        describe('should return the whole response body after successful HTTP request', function () {
            let Barion = barionMocks.okBarion;
            let barion = new Barion({ POSKey: 'aaaa' });
            let options = { a: 'b' };
            let expectedValue = { success: true, answer: 'example' };

            it('- Callback', async function () {
                let callback = (err, data) => expect(data).to.deep.equal(expectedValue);

                await barion.startPayment(options, callback);
                await barion.getPaymentState(options, callback);
                await barion.finishReservation(options, callback);
                await barion.refundPayment(options, callback);
                await barion.bankTransfer(options, callback);
                await barion.barionTransfer(options, callback);
            });

            it('- Promise', function () {
                return Promise.all([
                    expect(barion.startPayment(options)).to.eventually.deep.equals(expectedValue),
                    expect(barion.getPaymentState(options)).to.eventually.deep.equals(expectedValue),
                    expect(barion.finishReservation(options)).to.eventually.deep.equals(expectedValue),
                    expect(barion.refundPayment(options)).to.eventually.deep.equals(expectedValue),
                    expect(barion.bankTransfer(options)).to.eventually.deep.equals(expectedValue),
                    expect(barion.barionTransfer(options)).to.eventually.deep.equals(expectedValue)
                ]);
            });
        });

        describe('should return BarionError after not-ok HTTP response', function () {
            let Barion = barionMocks.errorBarion;
            let barion = new Barion({ POSKey: 'aaaa' });
            let options = { a: 'b' };
            let expectedError = { 
                name: 'BarionError', 
                message: 'Barion request errored out', 
                errors:  [
                    { Title: 'Authentication failed.', HappenedAt: '2019-01-19T18:46:51.0808761Z' }
                ]
            };

            it('- Callback', async function () {
                let callback = err => expect(err).to.deep.include(expectedError);

                await barion.startPayment(options, callback);
                await barion.getPaymentState(options, callback);
                await barion.finishReservation(options, callback);
                await barion.refundPayment(options, callback);
                await barion.bankTransfer(options, callback);
                await barion.barionTransfer(options, callback);
            });

            it('- Promise', function () {
                return Promise.all([
                    expect(barion.startPayment(options)).to.be.rejected.and.eventually.deep.include(expectedError),
                    expect(barion.getPaymentState(options)).to.be.rejected.and.eventually.deep.include(expectedError),
                    expect(barion.finishReservation(options)).to.be.rejected.and.eventually.deep.include(expectedError),
                    expect(barion.refundPayment(options)).to.be.rejected.and.eventually.deep.include(expectedError),
                    expect(barion.bankTransfer(options)).to.be.rejected.and.eventually.deep.include(expectedError),
                    expect(barion.barionTransfer(options)).to.be.rejected.and.eventually.deep.include(expectedError),
                ]);
            });
        });

        describe('should return error if network error occured', function () {
            let Barion = barionMocks.networkErrorBarion;
            let barion = new Barion({ POSKey: 'aaaa' });
            let options = { a: 'b' };
            let expected = /Failed to fetch data/;

            it('- Callback', async function () {
                let callback = err => expect(err).to.match(expected);

                await barion.startPayment(options, callback);
                await barion.getPaymentState(options, callback);
                await barion.finishReservation(options, callback);
                await barion.refundPayment(options, callback);
                await barion.bankTransfer(options, callback);
                await barion.barionTransfer(options, callback);
            });

            it('- Promise', function () {
                return Promise.all([
                    expect(barion.startPayment(options)).to.be.rejectedWith(expected),
                    expect(barion.getPaymentState(options)).to.be.rejectedWith(expected),
                    expect(barion.finishReservation(options)).to.be.rejectedWith(expected),
                    expect(barion.refundPayment(options)).to.be.rejectedWith(expected),
                    expect(barion.bankTransfer(options)).to.be.rejectedWith(expected),
                    expect(barion.barionTransfer(options)).to.be.rejectedWith(expected),
                ]);
            });
        });
    });
});