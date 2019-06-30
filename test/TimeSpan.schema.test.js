const { expect } = require('chai');
const Joi = require('@hapi/joi');
const TimeSpan = require('../lib/domain/common/TimeSpan');

describe('lib/domain/common/TimeSpan.js', function () {
    it('should allow time span with day-dot notation (3.14:15:28)', function () {
        const { error, value } = Joi.validate('3.14:15:28', TimeSpan);

        expect(error).to.be.null;
        expect(value).to.equal('3.14:15:28');
    });

    it('should allow time span with day-colon notation (3:14:15:28)', function () {
        const { error, value } = Joi.validate('3:14:15:28', TimeSpan);

        expect(error).to.be.null;
        expect(value).to.equal('3:14:15:28');
    });

    it('should allow multi-digit days', function () {
        const { error, value } = Joi.validate('365:14:15:28', TimeSpan);

        expect(error).to.be.null;
        expect(value).to.equal('365:14:15:28');
    });

    it('should not allow hours greater than 23', function () {
        const { error } = Joi.validate('365:24:15:28', TimeSpan);

        expect(error.details).to.be.an('array').and.have.lengthOf(1);
        expect(error.details[0].message).to.match(/timespan/);
    });

    it('should not allow minutes greater than 59', function () {
        const { error } = Joi.validate('365:22:60:28', TimeSpan);

        expect(error.details).to.be.an('array').and.have.lengthOf(1);
        expect(error.details[0].message).to.match(/timespan/);
    });

    it('should not allow seconds greater than 59', function () {
        const { error } = Joi.validate('365:22:15:60', TimeSpan);

        expect(error.details).to.be.an('array').and.have.lengthOf(1);
        expect(error.details[0].message).to.match(/timespan/);
    });

    it('should not allow strings with less than 4 part', function () {
        const { error } = Joi.validate('22:15', TimeSpan);

        expect(error.details).to.be.an('array').and.have.lengthOf(1);
        expect(error.details[0].message).to.match(/timespan/);
    });

    it('should not allow strings with more than 4 part', function () {
        const { error } = Joi.validate('22:15:22:22:22:22', TimeSpan);

        expect(error.details).to.be.an('array').and.have.lengthOf(1);
        expect(error.details[0].message).to.match(/timespan/);
    });
});
