const errors = require('../lib/errors');
const expect = require('chai').expect;

describe('lib/errors.js', function () {
    describe('#BarionError(message, errors)', function () {
        let BarionError = errors.BarionError;

        it('should set \'errors\' only to array type', function () {
            let e1 = new BarionError('aaa', null);
            let e2 = new BarionError('bbb');

            expect(e1.errors).to.be.an('array');
            expect(e1.message).to.equal('aaa');
            expect(e1.errors).to.be.empty;

            expect(e2.errors).to.be.an('array');
            expect(e2.message).to.equal('bbb');
            expect(e2.errors).to.be.empty;
        });

        it('should initialize successfully', function () {
            let problem = {
                Title: 'Model Validation Error',
                Description: 'The FundingSources field is required.',
                ErrorCode: 'ModelValidationError',
                HappenedAt: '2019-01-16T14:50:50.3228226Z',
                AuthData: 't.bela@example.com',
                EndPoint: 'https://api.test.barion.com/v2/Payment/Start'
            };

            let error = new BarionError('Some reasonable error occured.', [ problem ]);

            expect(error instanceof Error).to.be.true; 
            expect(error.name).to.equal('BarionError');
            expect(error.message).to.equal('Some reasonable error occured.');
            expect(error.errors).to.be.an('array');
            expect(error.errors).to.have.lengthOf(1);
            expect(error.errors[0]).to.include(problem);
        });
    });
});