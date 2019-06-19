const Joi = require('@hapi/joi');
const proxyquire = require('proxyquire');
const { expect } = require('chai');

proxyquire('../lib/constants', {
    immutableFields: [ 'POSKey' ]
});

const builder = require('../lib/build');

const schema = Joi.object({
    POSKey: Joi.string().required().guid(),
    Email: Joi.string().required().email(),
    Priority: Joi.number().required(),
    OptionalInfo: Joi.string().optional()
});

const defaults = {
    Environment: 'test',
    POSKey: '75cd64eb-f337-4786-acc6-b93a64abdcf6'
};

describe('lib/build.js', function () {
    describe('#buildRequestWithoutValidation(schema, defaults, customs)', function () {
        it('should merge default values with customs', function () {
            const customs = {
                Email: 'abc@def.hu',
                Priority: 6,
                OptionalInfo: 'def'
            };

            const result = builder.buildRequestWithoutValidation(schema, defaults, customs);

            expect(result).to.deep.equal({
                POSKey: '75cd64eb-f337-4786-acc6-b93a64abdcf6',
                Email: 'abc@def.hu',
                Priority: 6,
                OptionalInfo: 'def'
            });
        });

        it('should not allow to override immutable fields', function () {
            expect(() => builder.buildRequestWithoutValidation(schema, defaults, {
                POSKey: '66cd64ebf3374786acc6b93a64abdcf7',
                Email: 'abc@def.hu',
                Priority: 6,
                OptionalInfo: 'def'
            })).to.throw(/override/i);
        });

        it('should not sanitize casing of fields', function () {
            const customs = {
                Email: 'info@example.com',
                pRiOrItY: 2,
                OPTIONALINFO: 'comment'
            };

            expect(builder.buildRequestWithoutValidation(schema, defaults, customs)).to.deep.equal({
                POSKey: '75cd64eb-f337-4786-acc6-b93a64abdcf6',
                Email: 'info@example.com',
                pRiOrItY: 2,
                OPTIONALINFO: 'comment'
            });
        });

        it('should not validate request object based on the given schema', function () {
            const customs = {};

            expect(builder.buildRequestWithoutValidation(schema, defaults, customs)).to.deep.equal({
                POSKey: '75cd64eb-f337-4786-acc6-b93a64abdcf6',
                Email: undefined,
                Priority: undefined,
                OptionalInfo: undefined
            });
        });

        it('should allow unknown fields in request body', function () {
            const customs = {
                Email: 'info@example.com',
                Priority: 2,
                OptionalInfo: 'comment',
                favGame: 'Minesweeper',
                color: 'blue'
            };

            expect(builder.buildRequestWithoutValidation(schema, defaults, customs)).to.deep.equals({
                POSKey: '75cd64eb-f337-4786-acc6-b93a64abdcf6',
                Email: 'info@example.com',
                Priority: 2,
                OptionalInfo: 'comment',
                favGame: 'Minesweeper',
                color: 'blue'
            });
        });
    });

    describe('#buildRequest(schema, defaults, customs)', function () {
        it('should merge default values with customs', function () {
            const customs = {
                Email: 'abc@def.hu',
                Priority: 6,
                OptionalInfo: 'def'
            };

            const result = builder.buildRequest(schema, defaults, customs);

            expect(result).to.deep.equal({
                POSKey: '75cd64eb-f337-4786-acc6-b93a64abdcf6',
                Email: 'abc@def.hu',
                Priority: 6,
                OptionalInfo: 'def'
            });
        });

        it('should not allow to override immutable fields', function () {
            expect(() => builder.buildRequest(schema, defaults, {
                POSKey: '66cd64ebf3374786acc6b93a64abdcf7',
                Email: 'abc@def.hu',
                Priority: 6,
                OptionalInfo: 'def'
            })).to.throw(/invalid/i);
        });

        it('should validate request object based on the given schema', function () {
            const customs = {
                Email: 'asd'
            };

            expect(() => builder.buildRequest(schema, defaults, customs)).to.throw(/invalid/i);
        });

        it('should strip unknown fields from request body', function () {
            const customs = {
                Email: 'info@example.com',
                Priority: 2,
                OptionalInfo: 'comment',
                favGame: 'Minesweeper',
                color: 'blue'
            };

            expect(builder.buildRequest(schema, defaults, customs)).to.deep.equals({
                POSKey: '75cd64eb-f337-4786-acc6-b93a64abdcf6',
                Email: 'info@example.com',
                Priority: 2,
                OptionalInfo: 'comment'
            });
        });
    });
});
