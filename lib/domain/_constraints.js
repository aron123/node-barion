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
        'USD',
        'RON',
        'PLN'
    ],
    FundingSources: [
        'All',
        'Balance',
        'BankCard',
        'GooglePay',
        'ApplePay',
        'BankTransfer'
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
    ],
    ShopStatus: [
        'Unspecified',
        'NewUnderApproval',
        'NewForbidden',
        'Open',
        'OpenWaitForModificationApproval',
        'OpenModificationForbidden',
        'TemporaryClosed',
        'TemporaryClosedWaitForModificationApproval',
        'TemporaryClosedModificationForbidden',
        'PermanentlyClosed',
        'PermanentlyClosedByUser',
        'PermanentlyClosedByOfficer',
        'ClosedByOfficer',
        'ReOpen_WaitingForApproval',
        'Draft'
    ],
    ShopCategory: [
        'Agriculture',
        'BookNewsPaper',
        'Ad',
        'BonusCoupon',
        'Dating',
        'Electronics',
        'FashionClothes',
        'FoodDrink',
        'FurnitureAntiquity',
        'GiftToyFlower',
        'BeautyHealth',
        'HomeDesignGarden',
        'JobEducation',
        'BuildingMaterialMachine',
        'Baby',
        'FilmMusic',
        'Other',
        'Pet',
        'Property',
        'Service',
        'SportLeisureTravel',
        'BettingGambling',
        'Tobacco',
        'Vehicle',
        'WatchJewelry'
    ]
};
