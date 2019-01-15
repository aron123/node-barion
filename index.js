function Barion (options) {
    this.options = options || {};

    if (!this.options.POSKey) {
        throw new Error('POSKey is required to communicate with Barion API.');
    }

    if (!this.options.environment) {
        this.options.environment = 'test';
    }
}

module.exports = Barion;