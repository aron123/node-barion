const Joi = require('@hapi/joi');
const schemaUtils = require('../lib/schema');
const expect = require('chai').expect;

describe('lib/schema.js', function () {

    let schema;
    const { setFieldsOptional, setFieldsForbidden, CaseInsensitiveSchema } = schemaUtils;

    beforeEach(() => {
        schema = Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            age: Joi.number().required()
        });
    });

    describe('#setFieldsOptional(schema, optionalFields)', function () {
        it('should not mutate the given object', function () {
            const result = setFieldsOptional(schema, [ 'id', 'name' ]);
            expect(result).to.not.equals(schema);
        });

        it('should set the given fields optional', function () {
            const validationSchema = setFieldsOptional(schema, [ 'id' ]);
            const object = {
                name: 'Mallory',
                age: -666
            };

            const { error } = validationSchema.validate(object);
            expect(error).to.be.undefined;
        });

        it('should not set fields that are not passed as optional', function () {
            const validationSchema = setFieldsOptional(schema, [ 'id' ]);
            const object = {
                id: 1,
                age: 66
            };

            const { error } = validationSchema.validate(object);
            expect(error.details).to.be.an('array').and.have.lengthOf(1);
            expect(error.details[0].message).to.match(/name.*is required/);
        });
    });

    describe('#setFieldsForbidden(schema, optionalFields)', function () {
        it('should not mutate the given object', function () {
            const result = setFieldsForbidden(schema, [ 'id', 'name' ]);
            expect(result).to.not.equals(schema);
        });

        it('should set the given fields forbidden', function () {
            const validationSchema = setFieldsForbidden(schema, [ 'id' ]);
            const object = {
                id: 1,
                name: 'Mallory',
                age: -666
            };

            const { error } = validationSchema.validate(object);
            expect(error.details).to.be.an('array').and.have.lengthOf(1);
            expect(error.details[0].message).to.match(/id.*is not allowed/);
        });

        it('should not set fields that are not passed as forbidden', function () {
            const validationSchema = setFieldsForbidden(schema, [ 'id' ]);
            const object = {
                name: 'Mallory',
                age: -666
            };

            const { error } = validationSchema.validate(object);
            expect(error).to.be.undefined;
        });
    });

    describe('#CaseInSensitiveSchema(schema)', function() {
        it('should ignore schemas that are not objects', function () {
            const stringSchema = Joi.string().required();
            const result = new CaseInsensitiveSchema(stringSchema);
            expect(result).to.deep.equal(stringSchema);
        });

        it('should not mutate the given object', function () {
            const result = new CaseInsensitiveSchema(schema);
            expect(result).to.not.equal(schema);
        });

        it('should set all fields of schema case-insensitive', function () {
            const schemaToUse = new CaseInsensitiveSchema(schema);
            const object = {
                iD: 1,
                Name: 'Bob',
                aGe: 12
            };

            const { error, value } = schemaToUse.validate(object);
            expect(error).to.be.undefined;
            expect(value).to.deep.equal({
                id: 1,
                name: 'Bob',
                age:12
            });
        });
    });
});
