const { expect } = require('chai');
const Joi = require('joi');
const { CaseInsensitiveSchema } = require('../lib/schema');

const validation = require('../lib/validate');

const validationSchema = new CaseInsensitiveSchema(
    Joi.object({
        id: Joi.string().optional(),
        name: Joi.string().required(),
        gender: Joi.string().required(),
        age: Joi.number().optional()
    })
);

describe('lib/validate.js', function () {
    describe('#sanitizeThenValidate(schema, object)', function () {
        it('should strip unknown fields from object', function () {
            const object = {
                id: 'def32g',
                name: 'bela',
                gender: 'male',
                age: 13,
                hair: 'brown',
                drink: 'beer'
            };

            expect(validation.sanitizeThenValidate(validationSchema, object)).to.deep.include({
                id: 'def32g',
                name: 'bela',
                gender: 'male',
                age: 13
            });
        });

        it('should throw BarionModelError on validation failure', function (done) {
            const object = {};

            try {
                validation.sanitizeThenValidate(validationSchema, object);
            } catch (err) {
                expect(err.name).to.equal('BarionModelError');
                done();
            }
        });

        it('should report all failures of validation', function (done) {
            const object = {
                id: '789',
                age: 16
            };

            try {
                validation.sanitizeThenValidate(validationSchema, object);
            } catch (err) {
                expect(err.errors).to.be.an('array');
                expect(err.errors).to.has.length.greaterThan(1);
                done();
            }
        });

        it('should report validation failures in string array', function (done) {
            const object = {
                id: '789',
                age: 16
            };

            try {
                validation.sanitizeThenValidate(validationSchema, object);
            } catch (err) {
                expect(err.errors).to.be.an('array');
                err.errors.forEach(elem => expect(elem).to.be.a('string'));
                done();
            }
        });

        it('should not mutate the input object', function () {
            const object = {
                id: 'def32g',
                name: 'bela',
                gender: 'male',
                age: 13,
                hair: 'brown',
                drink: 'beer'
            };

            const result = validation.sanitizeThenValidate(validationSchema, object);

            expect(result).to.not.equal(object);
            expect(object).to.deep.equal({
                id: 'def32g',
                name: 'bela',
                gender: 'male',
                age: 13,
                hair: 'brown',
                drink: 'beer'
            });
        });

        it('should sanitize casing of fields', function () {
            const object = {
                Id: 'def32g',
                NaMe: 'bela',
                gender: 'male',
                AGE: 13
            };

            const result = validation.sanitizeThenValidate(validationSchema, object);

            expect(result).to.deep.equal({
                id: 'def32g',
                name: 'bela',
                gender: 'male',
                age: 13
            });
        });
    });
});
