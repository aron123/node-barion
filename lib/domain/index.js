const InitialOptions = require('./InitialOptions');
const StartPayment = require('./StartPayment');
const GetPaymentState = require('./GetPaymentState');
const FinishReservation = require('./FinishReservation');
const CapturePayment = require('./CapturePayment');
const CancelAuthorization = require('./CancelAuthorization');
const CompletePayment = require('./CompletePayment');
const PaymentRefund = require('./PaymentRefund');
const BankTransfer = require('./BankTransfer');
const GetAccounts = require('./GetAccounts');
const EmailTransfer = require('./EmailTransfer');
const StatementDownload = require('./StatementDownload');

module.exports = {
    InitialOptions,
    StartPayment,
    GetPaymentState,
    FinishReservation,
    CapturePayment,
    CancelAuthorization,
    PaymentRefund,
    BankTransfer,
    GetAccounts,
    EmailTransfer,
    StatementDownload,
    CompletePayment
};
