const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const spies = require('chai-spies');
chai.use(chaiAsPromised);
chai.use(spies);

const { URL } = require('url');

const { BarionError } = require('../lib/errors');
const { baseUrls } = require('../lib/constants');

/*
 * Mocks.
 */
const serviceMocks = {
    /*
     * Request succeeded.
     */
    okService: proxyquire('../lib/services', {
        '../lib/fetch-api': {
            postToBarion: () => Promise.resolve({ success: true, answer: 'example' }),
            getFromBarion: () => Promise.resolve({ success: true, answer: 'example' }),
            getBinaryFromBarion: () => Promise.resolve(Buffer.from('ABC'))
        }
    }),
    /*
     * Request ended in error.
     */
    errorService: proxyquire('../lib/services', {
        '../lib/fetch-api': {
            postToBarion: () => Promise.reject(new BarionError('Barion request errored out', [
                { Title: 'Authentication failed.', HappenedAt: '2019-01-19T18:46:51.0808761Z' }
            ])),
            getFromBarion: () => Promise.reject(new BarionError('Barion request errored out', [
                { Title: 'Authentication failed.', HappenedAt: '2019-01-19T18:46:51.0808761Z' }
            ])),
            getBinaryFromBarion: () => Promise.reject(new BarionError('Barion request errored out', [
                { Title: 'Authentication failed.', HappenedAt: '2019-01-19T18:46:51.0808761Z' }
            ]))
        }
    }),
    /*
     * Error occured between client and server.
     */
    networkErrorService: proxyquire('../lib/services', {
        '../lib/fetch-api': {
            postToBarion: () => Promise.reject(new Error('Failed to fetch data')),
            getFromBarion: () => Promise.reject(new Error('Failed to fetch data'))
        }
    })
};

describe('lib/services.js', function () {

    describe('#startPayment(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.startPayment('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.startPayment('test', {})
                .catch(() => done());
        });
    });

    describe('#getPaymentState(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.getPaymentState('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.getPaymentState('test', {})
                .catch(() => done());
        });
    });

    describe('#finishReservation(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.finishReservation('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.finishReservation('test', {})
                .catch(() => done());
        });
    });

    describe('#captureAuthorizedPayment(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.captureAuthorizedPayment('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.captureAuthorizedPayment('test', {})
                .catch(() => done());
        });
    });

    describe('#cancelAuthorizedPayment(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.cancelAuthorizedPayment('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.cancelAuthorizedPayment('test', {})
                .catch(() => done());
        });
    });

    describe('#completePayment(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.completePayment('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.completePayment('test', {})
                .catch(() => done());
        });
    });

    describe('#refundPayment(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.refundPayment('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.refundPayment('test', {})
                .catch(() => done());
        });
    });

    describe('#bankTransfer(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.bankTransfer('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.bankTransfer('test', {})
                .catch(() => done());
        });
    });

    describe('#getAccounts(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.getAccounts('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.getAccounts('test', {})
                .catch(() => done());
        });
    });

    describe('#emailTransfer(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.emailTransfer('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.emailTransfer('test', {})
                .catch(() => done());
        });
    });

    describe('#downloadStatement(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.downloadStatement('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.downloadStatement('test', {})
                .catch(() => done());
        });
    });

    describe('#startPaymentWithAppleToken(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.startPaymentWithAppleToken('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.startPaymentWithAppleToken('test', {})
                .catch(() => done());
        });
    });

    describe('#validateApplePaySession(environment, options)', function () {
        it('should return a Promise on success', function (done) {
            const services = serviceMocks.okService;
            services.validateApplePaySession('test', {})
                .then(() => done());
        });

        it('should return a Promise on failure', function (done) {
            const services = serviceMocks.errorService;
            services.validateApplePaySession('test', {})
                .catch(() => done());
        });
    });

    describe('#getBaseUrl', function () {
        it('should return test environment\'s URL to pointless input', function () {
            const services = serviceMocks.okService;
            const expectedUrl = baseUrls.test;

            expect(services._private.getBaseUrl()).to.equals(expectedUrl);
            expect(services._private.getBaseUrl(null)).to.equals(expectedUrl);
            expect(services._private.getBaseUrl('')).to.equals(expectedUrl);
            expect(services._private.getBaseUrl({})).to.equals(expectedUrl);
            expect(services._private.getBaseUrl([])).to.equals(expectedUrl);
            expect(services._private.getBaseUrl(5)).to.equals(expectedUrl);
        });

        it('should return the proper base URL to \'test\' and \'prod\'', function () {
            const services = serviceMocks.okService;

            expect(services._private.getBaseUrl('test')).to.equals(baseUrls.test);
            expect(services._private.getBaseUrl('prod')).to.equals(baseUrls.prod);
        });
    });

    describe('#doRequest', function () {

        const sandbox = chai.spy.sandbox();
        const fetchAPI = require('../lib/fetch-api');
        const getFromBarion = sandbox.on(fetchAPI, 'getFromBarion', () => Promise.resolve({ success: true }));
        const getBinaryFromBarion = sandbox.on(fetchAPI, 'getBinaryFromBarion', () => Promise.resolve(Buffer.from('ABC')));
        const postToBarion = sandbox.on(fetchAPI, 'postToBarion', () => Promise.resolve({ success: true }));
        const services = require('../lib/services');

        it('should create proper URL', function () {
            services._private.doRequest('test', { method: 'GET', path: '/api/test' }, { some: 'value' });
            expect(getFromBarion).to.have.been.called.with(new URL(`${baseUrls.test}/api/test`), { some: 'value' });
        });

        it('should call fetch-api modules functions based on the given HTTP method and binary option', function () {
            services._private.doRequest('test', { method: 'GET', path: '/api/get' }, { key: 'val1' });
            services._private.doRequest('test', { method: 'GET', path: '/api/get-binary', binary: true }, { key: 'val2' });
            services._private.doRequest('test', { method: 'POST', path: '/api/post' }, { key: 'val3' });

            expect(getFromBarion).to.have.been.called.with(new URL(`${baseUrls.test}/api/get`), { key: 'val1' });
            expect(getBinaryFromBarion).to.have.been.called.with(new URL(`${baseUrls.test}/api/get-binary`), { key: 'val2' });
            expect(postToBarion).to.have.been.called.with(new URL(`${baseUrls.test}/api/post`), { key: 'val3' });
        });

        it('should throw error on not supported HTTP method', function () {
            const doRequest = () => services._private.doRequest('test', {
                method: 'BAZINGA',
                path: '/api/dumb'
            }, {
                some: 'value'
            });

            expect(doRequest).to.throw(/HTTP method/);
        });
    });
});
