module.exports = {
    PaymentType: [
        'Immediate',
        'Reservation',
        'DelayedCapture'
    ],
    Currency: [
        'CZK',
        'EUR',
        'HUF',
        'USD'
    ],
    FundingSources: [
        'All',
        'Balance'
    ],
    Locale: [
        'cs-CZ',
        'de-DE',
        'en-US',
        'es-ES',
        'fr-FR',
        'hu-HU',
        'sk-SK',
        'sl-SI'
    ],
    BankAccountNumberFormat: [
        'Unknown',
        'Giro',
        'IBAN',
        'Czech',
        'Other'
    ],
    RecurrenceType: [
        'OneClickPayment',
        'MerchantInitiatedPayment',
        'RecurringPayment'
    ],
    Mobile: {
        RegExp: /^[0-9]{1,}$/,
        Name: 'mobile'
    },
    AccountCreationIndicator: [
        'NoAccount',
        'CreatedDuringThisTransaction',
        'LessThan30Days',
        'Between30And60Days',
        'MoreThan60Days'
    ],
    AccountChangeIndicator: [
        'ChangedDuringThisTransaction',
        'LessThan30Days',
        'Between30And60Days',
        'MoreThan60Days'
    ],
    PasswordChangeIndicator: [
        'NoChange',
        'ChangedDuringThisTransaction',
        'LessThan30Days',
        'Between30And60Days',
        'MoreThan60Days'
    ],
    ShippingAddressUsageIndicator: [
        'ThisTransaction',
        'LessThan30Days',
        'Between30And60Days',
        'MoreThan60Days'
    ],
    SuspiciousActivityIndicator: [
        'NoSuspiciousActivityObserved',
        'SuspiciousActivityObserved'
    ],
    DeliveryTimeframe: [
        'ElectronicDelivery',
        'SameDayShipping',
        'OvernightShipping',
        'TwoDayOrMoreShipping'
    ],
    AvailabilityIndicator: [
        'MerchandiseAvailable',
        'FutureAvailability'
    ],
    ReOrderIndicator: [
        'FirstTimeOrdered',
        'Reordered'
    ],
    ShippingAddressIndicator: [
        'ShipToCardholdersBillingAddress',
        'ShipToAnotherVerifiedAddress',
        'ShipToDifferentAddress',
        'ShipToStore',
        'DigitalGoods',
        'TravelAndEventTickets',
        'Other'
    ],
    PurchaseType: [
        'GoodsAndServicePurchase',
        'CheckAcceptance',
        'AccountFunding',
        'QuasiCashTransaction',
        'PrePaidVacationAndLoan'
    ],
    ChallengePreference: [
        'NoPreference',
        'ChallengeRequired',
        'NoChallengeNeeded'
    ]
};
