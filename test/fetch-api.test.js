/*
 * Assertion library.
 */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

/*
 * Mocking-related dependencies.
 */
const proxyquire = require('proxyquire').noCallThru();
const fetchMock = require('fetch-mock');
const { fetchTest } = require('./test-data');

const barionMock = {
    default: fetchMock
        .mock('begin:http://example.com/success', fetchTest.successResponse)
        .mock('begin:http://example.com/binary-success', fetchTest.binarySuccessResponse, { sendAsJson: false })
        .mock('begin:http://example.com/error', fetchTest.errorResponse)
        .mock('begin:http://example.com/internal-server-error', fetchTest.internalErrorResponse)
        .mock('begin:http://example.com/not-valid-json', fetchTest.notJsonResponse)
        .mock('begin:http://example.com/network-error', fetchTest.networkErrorResponse)
        .sandbox()
};

/*
 * The module to test.
 */
const fetchBarion = proxyquire('../lib/fetch-api', {
    'node-fetch': barionMock,
    url: require('url'),
    './errors': require('../lib/errors')
});

describe('lib/fetch-api.js', function () {

    const barionErrorMessageMatcher = /^Barion request errored out$/;

    describe('#getFromBarion(url, params)', function () {

        const getFromBarion = fetchBarion.getFromBarion;

        it('should strip undefined query params', function () {
            getFromBarion('http://example.com/success', { a: 3, b: undefined, c: 'asd', d: undefined });
            expect(barionMock.default.lastUrl()).to.be.equal('http://example.com/success?a=3&c=asd');
        });

        it('should throw error if invalid URL is passed', function () {
            expect(() => getFromBarion('example')).to.throw();
        });

        it('should not throw error if no parameters are passed', function () {
            const endpoint = 'http://example.com/success';

            expect(() => getFromBarion(endpoint)).to.not.throw();
            expect(() => getFromBarion(endpoint, {})).to.not.throw();
            expect(() => getFromBarion(endpoint, null)).to.not.throw();
        });

        it('should reject if get response with error HTTP status', function () {
            return Promise.all([
                expect(getFromBarion('http://example.com/error')).to.be.rejectedWith(barionErrorMessageMatcher),
                expect(getFromBarion('http://example.com/internal-server-error'))
                    .to.be.rejectedWith(barionErrorMessageMatcher)
            ]);
        });

        it('should reject with empty errors array when no Errors array defined in response', function () {
            return getFromBarion('http://example.com/internal-server-error')
                .then(() => {
                    throw new Error('Promise have to reject, but resolved');
                })
                .catch(err => {
                    expect(err.errors).to.be.an('array').and.empty;
                });
        });

        it('should reject if the response is not valid JSON', function () {
            return expect(getFromBarion('http://example.com/not-valid-json')).to.be.rejected;
        });

        it('should reject on network errors', function () {
            return expect(getFromBarion('http://example.com/network-error')).to.be.rejectedWith('Failed to fetch data');
        });

        it('should resolve with data after successful response', function () {
            return expect(getFromBarion('http://example.com/success', { a: 'b', c: 5 }))
                .to.eventually.deep.include(fetchTest.successResponse);
        });

        it('should use credentials for Basic Authentication', async function () {
            await getFromBarion('http://example.com/success', { UserName: 'a', Password: 'b', Extra: true });
            expect(barionMock.default.lastOptions()).to.deep.include({
                headers: {
                    Authorization: 'Basic YTpi' // base64-encoded a:b
                }
            });
        });

        it('should not use credentials in query parameters', async function () {
            await getFromBarion('http://example.com/success', { UserName: 'a', Password: 'b', Extra: true });
            expect(barionMock.default.lastUrl()).to.equal('http://example.com/success?Extra=true');
        });

        it('should use API key for x-api-key header authentication', async function () {
            await getFromBarion('http://example.com/success', { ApiKey: 'test-api-key-123', Extra: true });
            expect(barionMock.default.lastOptions()).to.deep.include({
                headers: {
                    'x-api-key': 'test-api-key-123'
                }
            });
        });

        it('should not use API key in query parameters', async function () {
            await getFromBarion('http://example.com/success', { ApiKey: 'test-api-key-123', Extra: true });
            expect(barionMock.default.lastUrl()).to.equal('http://example.com/success?Extra=true');
        });
    });

    describe('#getBinaryFromBarion()', function () {

        const getBinaryFromBarion = fetchBarion.getBinaryFromBarion;

        it('should throw error if invalid URL is passed', function () {
            expect(() => getBinaryFromBarion('example')).to.throw();
        });

        it('should not throw error if empty request body is passed', function () {
            expect(() => getBinaryFromBarion('http://example.com/success')).to.not.throw();
            expect(() => getBinaryFromBarion('http://example.com/success'), null).to.not.throw();
            expect(() => getBinaryFromBarion('http://example.com/success'), {}).to.not.throw();
        });

        it('should reject if get HTTP error response', function () {
            return Promise.all([
                expect(getBinaryFromBarion('http://example.com/error')).to.be.rejectedWith(barionErrorMessageMatcher),
                expect(getBinaryFromBarion('http://example.com/internal-server-error'))
                    .to.be.rejectedWith(barionErrorMessageMatcher)
            ]);
        });

        it('should reject with empty errors array when no Errors array is defined in response', function () {
            return getBinaryFromBarion('http://example.com/internal-server-error')
                .then(() => {
                    throw new Error('Promise have to reject, but resolved');
                })
                .catch(err => {
                    expect(err.errors).to.be.an('array').and.empty;
                });
        });

        it('should reject on network error', function () {
            return expect(getBinaryFromBarion('http://example.com/network-error'))
                .to.be.rejectedWith('Failed to fetch data');
        });

        it('should resolve binary data after successful response', async function () {
            const res = await getBinaryFromBarion('http://example.com/binary-success');
            expect(Buffer.compare(fetchTest.binarySuccessResponse.body, res.Buffer)).to.equal(0);
        });

        it('should resolve correct content type after successful response', async function () {
            const res = await getBinaryFromBarion('http://example.com/binary-success');
            expect(fetchTest.binarySuccessResponse.headers['Content-Type']).to.equal(res.Type);
        });

        it('should use credentials for Basic Authentication', async function () {
            await getBinaryFromBarion('http://example.com/success', { UserName: 'a', Password: 'b', Extra: true });
            expect(barionMock.default.lastOptions()).to.deep.include({
                headers: {
                    Authorization: 'Basic YTpi' // base64-encoded a:b
                }
            });
        });

        it('should not use credentials in query parameters', async function () {
            await getBinaryFromBarion('http://example.com/success', { UserName: 'a', Password: 'b', Extra: true });
            expect(barionMock.default.lastUrl()).to.equal('http://example.com/success?Extra=true');
        });

        it('should use API key for x-api-key header authentication', async function () {
            await getBinaryFromBarion('http://example.com/success', { ApiKey: 'test-api-key-123', Extra: true });
            expect(barionMock.default.lastOptions()).to.deep.include({
                headers: {
                    'x-api-key': 'test-api-key-123'
                }
            });
        });

        it('should not use API key in query parameters', async function () {
            await getBinaryFromBarion('http://example.com/success', { ApiKey: 'test-api-key-123', Extra: true });
            expect(barionMock.default.lastUrl()).to.equal('http://example.com/success?Extra=true');
        });
    });

    describe('#postToBarion()', function () {

        const postToBarion = fetchBarion.postToBarion;

        it('should throw error if invalid URL is passed', function () {
            expect(() => postToBarion('example')).to.throw();
        });

        it('should not throw error if empty request body is passed', function () {
            expect(() => postToBarion('http://example.com/success')).to.not.throw();
            expect(() => postToBarion('http://example.com/success'), null).to.not.throw();
            expect(() => postToBarion('http://example.com/success'), {}).to.not.throw();
        });

        it('should reject if get HTTP error response', function () {
            return Promise.all([
                expect(postToBarion('http://example.com/error')).to.be.rejectedWith(barionErrorMessageMatcher),
                expect(postToBarion('http://example.com/internal-server-error'))
                    .to.be.rejectedWith(barionErrorMessageMatcher)
            ]);
        });

        it('should reject with empty errors array when no Errors array is defined in response', function () {
            return postToBarion('http://example.com/internal-server-error')
                .then(() => {
                    throw new Error('Promise have to reject, but resolved');
                })
                .catch(err => {
                    expect(err.errors).to.be.an('array').and.empty;
                });
        });

        it('should reject if the response is not valid JSON', function () {
            return expect(postToBarion('http://example.com/not-valid-json')).to.be.rejected;
        });

        it('should reject on network error', function () {
            return expect(postToBarion('http://example.com/network-error')).to.be.rejectedWith('Failed to fetch data');
        });

        it('should resolve data after successful response', function () {
            return expect(postToBarion('http://example.com/success', { a: 'b', c: 5 }))
                .to.eventually.deep.include(fetchTest.successResponse);
        });

        it('should use credentials for Basic Authentication', async function () {
            await postToBarion('http://example.com/success', { UserName: 'a', Password: 'b', Extra: true });
            expect(barionMock.default.lastOptions()).to.deep.include({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic YTpi' // base64-encoded a:b
                }
            });
        });

        it('should not use credentials in request body', async function () {
            await postToBarion('http://example.com/success', { UserName: 'a', Password: 'b', Extra: true });
            expect(barionMock.default.lastOptions()).to.deep.include({ body: '{"Extra":true}' });
        });

        it('should use API key for x-api-key header authentication', async function () {
            await postToBarion('http://example.com/success', { ApiKey: 'test-api-key-123', Extra: true });
            expect(barionMock.default.lastOptions()).to.deep.include({
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'test-api-key-123'
                }
            });
        });

        it('should not use API key in request body', async function () {
            await postToBarion('http://example.com/success', { ApiKey: 'test-api-key-123', Extra: true });
            expect(barionMock.default.lastOptions()).to.deep.include({ body: '{"Extra":true}' });
        });
    });
});
