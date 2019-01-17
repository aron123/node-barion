const sanitization = require('../lib/sanitization');
const expect = require('chai').expect;

describe('lib/sanitization.js', function () {
    describe('#propsToPascalCase(obj)', function () {

        let propsToPascalCase = sanitization.propsToPascalCase;

        it('should not transform functions', function () {
            let target = function (a, b) { return a + b };

            expect( propsToPascalCase(target) ).to.be.a('function');
            expect( propsToPascalCase(target)(2, 3) ).to.equal(5);
        });

        it('should not transform arrays', function () {
            let target = [3, 8, 1];

            expect( propsToPascalCase(target) ).to.be.an('array');
            expect( propsToPascalCase(target)[0] ).to.equal(3);
            expect( propsToPascalCase(target)[1] ).to.equal(8);
            expect( propsToPascalCase(target)[2] ).to.equal(1);
        });

        it('should not transform numbers', function () {
            let target = 2;

            expect( propsToPascalCase(target) ).to.be.a('number');
            expect( propsToPascalCase(target) ).to.equal(2);
        });

        it('should not transform strings', function () {
            let target = 'simple';

            expect( propsToPascalCase(target) ).to.be.string;
            expect( propsToPascalCase(target) ).to.equal('simple');
        })

        it('should not transform booleans', function () {
            let target = false;

            expect( propsToPascalCase(target) ).to.be.a('boolean');
            expect( propsToPascalCase(target) ).to.be.false;
        });

        it('should not transform null', function () {
            let target = null;
            expect( propsToPascalCase(target) ).to.be.null;
        });

        it('should not transform undefined', function () {
            let target = undefined;
            expect( propsToPascalCase(target) ).to.be.undefined;
        });

        it('should PascalCase object properties', function () {
            let target = {
                'camelCased': 1,
                'PascalCased': 'did not change',
                'space separated': true,
                'hyphen-separated': null,
                'Very-.-.%!+diffuse__><-': 2,
                'very-:-...diffuse-with-numbers...7': 1
            };

            let actual = propsToPascalCase(target);

            expect(actual).does.not.have.all.keys('camelCased', 'space separated', 'hyphen-separated', 
                                                'Very-.-.%!+diffuse__><-', 'very-:-...diffuse-with-numbers...7' );
            expect(actual).to.include({ 
                'CamelCased': 1, 
                'PascalCased': 'did not change',
                'SpaceSeparated': true,
                'HyphenSeparated': null,
                'VeryDiffuse': 2,
                'VeryDiffuseWithNumbers7': 1
            });
        });
        
    });
});