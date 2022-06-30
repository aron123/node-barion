// Type definitions for node-barion {{ version }}
// Project: https://github.com/aron123/node-barion
// Definitions by: Áron Kiss <https://github.com/aron123>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export = Barion;

{{ schemaDefinitions }}

declare class Barion {
    constructor(options: InitialOptions);

    bankTransfer(options: Partial<BankTransferRequest>, callback: (err: Error, data: any) => void): void;
    bankTransfer(options: Partial<BankTransferRequest>): Promise<object>;

    cancelAuthorizedPayment(options: Partial<CancelAuthorizationRequest>, callback: (err: Error, data: any) => void): void;
    cancelAuthorizedPayment(options: Partial<CancelAuthorizationRequest>): Promise<object>;

    captureAuthorizedPayment(options: Partial<CapturePaymentRequest>, callback: (err: Error, data: any) => void): void;
    captureAuthorizedPayment(options: Partial<CapturePaymentRequest>): Promise<object>;

    completePayment(options: Partial<CompletePaymentRequest>, callback: (err: Error, data: any) => void): void;
    completePayment(options: Partial<CompletePaymentRequest>): Promise<object>;

    downloadStatement(options: Partial<StatementDownloadRequest>, callback: (err: Error, data: any) => void): void;
    downloadStatement(options: Partial<StatementDownloadRequest>): Promise<object>;

    emailTransfer(options: Partial<EmailTransferRequest>, callback: (err: Error, data: any) => void): void;
    emailTransfer(options: Partial<EmailTransferRequest>): Promise<object>;

    finishReservation(options: Partial<FinishReservationRequest>, callback: (err: Error, data: any) => void): void;
    finishReservation(options: Partial<FinishReservationRequest>): Promise<object>;

    getAccounts(options: Partial<GetAccountsRequest>, callback: (err: Error, data: any) => void): void;
    getAccounts(options: Partial<GetAccountsRequest>): Promise<object>;

    getPaymentState(options: Partial<GetPaymentStateRequest>, callback: (err: Error, data: any) => void): void;
    getPaymentState(options: Partial<GetPaymentStateRequest>): Promise<object>;

    refundPayment(options: Partial<PaymentRefundRequest>, callback: (err: Error, data: any) => void): void;
    refundPayment(options: Partial<PaymentRefundRequest>): Promise<object>;

    startPayment(options: Partial<StartPaymentRequest>, callback: (err: Error, data: any) => void): void;
    startPayment(options: Partial<StartPaymentRequest>): Promise<object>;
}
