// Type definitions for node-barion {{ version }}
// Project: https://github.com/aron123/node-barion
// Definitions by: Áron Kiss <https://github.com/aron123>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export = Barion;

{{ schemaDefinitions }}

declare class Barion {
    constructor(options: InitialOptions);

    bankTransfer(options: Partial<BankTransferRequest>, callback: (err: Error, data: any) => void): void;
    bankTransfer(options: Partial<BankTransferRequest>): Promise<any>;

    cancelAuthorizedPayment(options: Partial<CancelAuthorizationRequest>, callback: (err: Error, data: any) => void): void;
    cancelAuthorizedPayment(options: Partial<CancelAuthorizationRequest>): Promise<any>;

    captureAuthorizedPayment(options: Partial<CapturePaymentRequest>, callback: (err: Error, data: any) => void): void;
    captureAuthorizedPayment(options: Partial<CapturePaymentRequest>): Promise<any>;

    completePayment(options: Partial<CompletePaymentRequest>, callback: (err: Error, data: any) => void): void;
    completePayment(options: Partial<CompletePaymentRequest>): Promise<any>;

    downloadStatement(options: Partial<StatementDownloadRequest>, callback: (err: Error, data: any) => void): void;
    downloadStatement(options: Partial<StatementDownloadRequest>): Promise<any>;

    emailTransfer(options: Partial<EmailTransferRequest>, callback: (err: Error, data: any) => void): void;
    emailTransfer(options: Partial<EmailTransferRequest>): Promise<any>;

    finishReservation(options: Partial<FinishReservationRequest>, callback: (err: Error, data: any) => void): void;
    finishReservation(options: Partial<FinishReservationRequest>): Promise<any>;

    getAccounts(options: Partial<GetAccountsRequest>, callback: (err: Error, data: any) => void): void;
    getAccounts(options: Partial<GetAccountsRequest>): Promise<any>;

    getPaymentState(options: Partial<GetPaymentStateRequest>, callback: (err: Error, data: any) => void): void;
    getPaymentState(options: Partial<GetPaymentStateRequest>): Promise<any>;

    refundPayment(options: Partial<PaymentRefundRequest>, callback: (err: Error, data: any) => void): void;
    refundPayment(options: Partial<PaymentRefundRequest>): Promise<any>;

    startPayment(options: Partial<StartPaymentRequest>, callback: (err: Error, data: any) => void): void;
    startPayment(options: Partial<StartPaymentRequest>): Promise<any>;
}
