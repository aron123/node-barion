const { expect } = require('chai');

describe('index.js', function () {
    it('should export Barion constructor from library', function () {
        const Barion = require('../lib/barion');
        const exported = require('../');

        expect(exported).to.be.equal(Barion);
        expect(exported).to.be.a('function');
    });
});
