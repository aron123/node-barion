const { expect } = require('chai');
const StartPayment = require('../lib/domain/StartPayment');

const Transactions = [
    {
        POSTransactionId: '2019-001-1',
        Payee: 'info@example.com',
        Total: 5
    }
];

const reservationStandard = {
    POSKey: '4ab71f10-5ba2-4c9b-b2b0-f365b6bdfee2',
    PaymentType: 'Reservation',
    ReservationPeriod: '00:00:01:00',
    Locale: 'hu-HU',
    Currency: 'HUF',
    GuestCheckOut: true,
    FundingSources: [ 'All' ],
    PaymentRequestId: '2019-001',
    Transactions
};

const immediateStandard = {
    POSKey: '4ab71f10-5ba2-4c9b-b2b0-f365b6bdfee2',
    PaymentType: 'Immediate',
    Locale: 'hu-HU',
    Currency: 'HUF',
    GuestCheckOut: true,
    FundingSources: [ 'All' ],
    PaymentRequestId: '2019-001',
    Transactions
};

describe('lib/domain/StartPayment.js', function () {

    let reservationPayment;
    let immediatePayment;

    beforeEach(() => {
        reservationPayment = Object.assign({}, reservationStandard);
        immediatePayment = Object.assign({}, immediateStandard);
    });


    it('should not strip ReservationPeriod field on reservation payment initialization', function () {
        const { error, value } = StartPayment.validate(reservationPayment);

        expect(error).to.be.undefined;
        expect(value).to.deep.equal(reservationStandard);
    });

    it('should require ReservationPeriod field on reservation payment initialization', function () {
        delete reservationPayment.ReservationPeriod;
        const { error } = StartPayment.validate(reservationPayment);

        expect(error.details).to.be.an('array').and.have.lengthOf(1);
        expect(error.details[0]).to.deep.include({ message: '"ReservationPeriod" is required' });
    });

    it('should forbid ReservationPeriod field on immediate payment initialization', function () {
        immediatePayment.ReservationPeriod = '00:00:01:00';
        const { error } = StartPayment.validate(immediatePayment);

        expect(error.details).to.be.an('array').and.have.lengthOf(1);
        expect(error.details[0]).to.deep.include({ message: '"ReservationPeriod" is not allowed' });
    });

    it('should validate correct immediate payment initialization', function () {
        const { error, value } = StartPayment.validate(immediatePayment);

        expect(error).to.be.undefined;
        expect(value).to.deep.equal(immediateStandard);
    });
});
