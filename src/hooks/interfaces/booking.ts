export type BookingTourFilters = {
    strUserGUID?: string;
    strCompanyAgentGUID?: string;
    strCompanyOwnerGUID?: string;

    strTourGUID?: string;
    strTourPriceItemLevelGUID?: string;
    strDepartureTourLevelGUID?: string | null;

    intAdult?: number;
    strListChildAge?: string | null;

    intSGL?: number;
    intDBL?: number;
    intTWN?: number;
    intTPL?: number;

    dtmDateFrom?: string | null;
    dtmDateTo?: string | null;

    intCurrencyID?: number;

    strPaidRemark?: string | null;

    intSaluteID?: number | null;
    intAgeID?: number | null;
    intPassengerAges?: number | null;

    strPassengerFirstName?: string | null;
    strPassengerLastName?: string | null;

    dtmPassengerBirthday?: string | null;
    dtmPasspostExpirationDate?: string | null;

    strPassengerEmail?: string | null;
    strPassengerPhone?: string | null;
    strPassengerRemark?: string | null;

    strPassport?: string | null;
    strCountryGUID?: string | null;

    IsTraveller?: boolean;

    intPaymentMethodID?: number | null;

    strCompanyBankAccountGUID?: string | null;

    VoucherCode?: string | null;

    enabled?: boolean;
};