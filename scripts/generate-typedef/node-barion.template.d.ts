// Type definitions for node-barion {{ version }}
// Project: https://github.com/aron123/node-barion
// Definitions by: Áron Kiss <https://github.com/aron123>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export = Barion;

{{ schemaDefinitions }}

declare class Barion {
    constructor(options: InitialOptions);

    bankTransfer(options: BankTransferRequest, callback: (err: Error, data: any) => void): void;
    bankTransfer(options: BankTransferRequest): Promise<object>;

    cancelAuthorizedPayment(options: CancelAuthorizationRequest, callback: (err: Error, data: any) => void): void;
    cancelAuthorizedPayment(options: CancelAuthorizationRequest): Promise<object>;

    captureAuthorizedPayment(options: CapturePaymentRequest, callback: (err: Error, data: any) => void): void;
    captureAuthorizedPayment(options: CapturePaymentRequest): Promise<object>;

    completePayment(options: CompletePaymentRequest, callback: (err: Error, data: any) => void): void;
    completePayment(options: CompletePaymentRequest): Promise<object>;

    downloadStatement(options: StatementDownloadRequest, callback: (err: Error, data: any) => void): void;
    downloadStatement(options: StatementDownloadRequest): Promise<object>;

    emailTransfer(options: EmailTransferRequest, callback: (err: Error, data: any) => void): void;
    emailTransfer(options: EmailTransferRequest): Promise<object>;

    finishReservation(options: FinishReservationRequest, callback: (err: Error, data: any) => void): void;
    finishReservation(options: FinishReservationRequest): Promise<object>;

    getAccounts(options: GetAccountsRequest, callback: (err: Error, data: any) => void): void;
    getAccounts(options: GetAccountsRequest): Promise<object>;

    getPaymentState(options: GetPaymentStateRequest, callback: (err: Error, data: any) => void): void;
    getPaymentState(options: GetPaymentStateRequest): Promise<object>;

    refundPayment(options: PaymentRefundRequest, callback: (err: Error, data: any) => void): void;
    refundPayment(options: PaymentRefundRequest): Promise<object>;

    startPayment(options: StartPaymentRequest, callback: (err: Error, data: any) => void): void;
    startPayment(options: StartPaymentRequest): Promise<object>;
}
