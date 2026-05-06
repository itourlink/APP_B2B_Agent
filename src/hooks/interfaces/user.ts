export interface IListUserInCompanyOwner {
  IsActive: boolean;
  IsEnable: boolean;
  IsRcvEmailBk: boolean;
  No: number;

  dtmCreatedDate: string;
  dtmLastUpdatedDate: string;

  intMemberRoleID: number;
  intSaluteID: number;
  intTotalRecords: number;

  strCompanyName: string;
  strCreatedBy: string;
  strUpdatedBy: string;

  strEmail: string;
  strFirstName: string;
  strLastName: string;
  strFullName: string;

  strMemberGUID: string;
  strMemberRoleName: string;

  strMobile: string;
  strSearchText: string | null;
}


export interface IReportPendingApproval {
  IsActive: boolean;
  IsHold: boolean;
  IsManual: boolean;
  IsPaid: boolean;
  No: number;

  dblBankFee: number | Record<string, any>;
  dblInvoiceBalance: number | Record<string, any>;
  dblInvoiceEquivalent: number | Record<string, any>;
  dblInvoiceExchangeRate: number | Record<string, any>;
  dblPaid: number;
  dblPayableAdjustment: number;
  dblPayableAmount: number;
  dblPayableBalance: number;
  dblPayableTotal: number;
  dblPriceTotal: number;
  dblSurcharge: number | Record<string, any>;

  dtmCreatedDate: string;
  dtmDateDeadlineToCheck: string;
  dtmDateFrom: string;
  dtmDateTo: string;
  dtmLastUpdatedDate: string;

  intAgentHostPaymentTypeID: number;
  intInvoiceCurrencyID: number;
  intInvoicePaymentMethodID: number | Record<string, any>;
  intInvoiceTypetID: number | Record<string, any>;
  intOrderStatusID: number | Record<string, any>;
  intPayableStatusID: number;
  intPayableTypeID: number;
  intPaymentMethodID: number | Record<string, any>;
  intPaymentStatusID: number;
  intPaymentTypeID: number | Record<string, any>;
  intTotalPax: number;
  intTotalRecords: number;

  strAgentCode: string;
  strAgentHostPaymentTypeName: string;
  strAgentName: string;
  strBookingByAgentHostGUID: string;
  strBookingGUID: string;
  strBookingItemGUID: string;
  strCompanyBankAccountGUID: string | Record<string, any>;
  strCompanyName: string;
  strCreatedBy: string;
  strGroupName: string;
  strOrderAgentHostCode: string;
  strPaidBookingItemGUID: string;
  strParentPayableBookingItemGUID: string | Record<string, any>;
  strPayableBookingGUID: string | Record<string, any>;
  strPayableBookingItemGUID: string;
  strPayableBookingItemName: string | Record<string, any>;
  strPayableBookingPeriodGUID: string | Record<string, any>;
  strPayablePaymentTermCode: string;
  strPayableStatusName: string;
  strPaymentStatusName: string;
  strRemark: string | Record<string, any>;
  strServiceName: string;
  strUpdatedBy: string;
}


export interface ITourCustomized {
  IsActive: boolean;
  IsEnable: boolean;
  IsLastVersion: boolean;
  IsSent: number;

  LinkImgBannerTCM: Record<string, any>;
  No: number;

  dblMarkupService: number;
  dblTotalCostPrice: number;
  dblTotalMarkupPrice: number;

  dtmCreatedDate: string;
  dtmDateFrom: string;
  dtmDateTo: string;
  dtmLastUpdatedDate: string;

  intAdult: number;
  intCurrencyID: number;
  intDBL: number;
  intEasiaCateID: Record<string, any>;
  intMarkupTypeID: number;
  intNoOfChild: number;
  intNoOfDay: number;
  intSGL: number;
  intTPL: number;
  intTWN: number;
  intTotalPax: number;
  intTotalRecords: number;
  intTourStepID: number;
  intVersionID: number;

  strAgentHostServiceItemGUID: string;
  strCompanyAgentHostGUID: string;
  strCompanyAgentHostName: string;
  strCompanyGUID: string;
  strCompanyName: string;
  strCountryGUID: string;
  strCountryName: string;
  strCreatedBy: string;
  strEasiaCateName: string;
  strFullName: string;
  strListEasiaCateID: string;
  strRemark: string;
  strServiceName: string;
  strTourCode: string;
  strTourCustomizedGUID: string;
  strUpdatedBy: string;
}

export interface ICompanyBankAccount {
  No: number;

  dtmCreatedDate: string;
  dtmLastUpdatedDate: string;

  intTotalRecords: number;

  strBankAddress: string;
  strCompanyBankAccountCode: string;
  strCompanyBankAccountGUID: string;
  strCompanyBankAccountInfo: string;
  strCompanyBankAccountName: string;

  strCreatedBy: string;
  strUpdatedBy: string;

  strLinkQRCode: Record<string, any>;
  strRemark: Record<string, any>;

  strNameDisplay: string;
  strSwiftCode: string;
}

export interface IAgent {
  No: number;

  IsActive: boolean;
  IsEnable: boolean;
  IsTMSConnected: boolean;

  dblCreditRemain: number;

  dtmCreatedDate: string;
  dtmLastUpdatedDate: string;

  intCompanyTypeID: number;
  intTotalRecords: number;

  strCompanyGUID: string;
  strCompanyName: string;
  strCompanyCode: string;

  strCompanyAddr: string;
  strCompanyPhone: string;
  strCompanyEmail: string;
  strCompanyWeb: string;

  strCompanyLogo: string;
  strDescription: string;

  strLinkName: string;
  strUrlLink: string;

  strSearchText: string;
  strPriceLevelGUID: string;

  strUpdatedBy: string;

  intLangID: Record<string, any>;
  strCompanyPostCode: Record<string, any>;
  strCreatedBy: Record<string, any>;
  strLocationCode: Record<string, any>;
  strMainFolderPath: Record<string, any>;
  strTMSClientGUID: Record<string, any>;
  strUrlDefault: Record<string, any>;
}

export interface ISaleRequest {
  IsActive: boolean;
  IsHasFeedback: Record<string, any>;
  IsLastVersion: boolean;
  IsLocked: Record<string, any>;
  IsRequestAssigned: Record<string, any>;

  No: number;

  dblTotalPrice: number | null;

  dtmCreatedDate: string;
  dtmDateEnd: string;
  dtmDateStart: string;
  dtmLastFileUpdatedDate: string | null;
  dtmLastUpdatedDate: string;

  intAdult: number;
  intClientTypeID: number | null;
  intCurrencyID: number | null;
  intDuration: number;
  intFromPax: number | null;
  intLangID: number | null;
  intNoOfChild: number;
  intRequestStatusID: number;
  intToPax: number | null;
  intTotalPax: number | null;
  intTotalRecords: number;
  intUrgentID: number | null;

  strAgentCode: string;
  strAgentMemberGUID: string;
  strAssignedBy: string | null;
  strBookingFile: string | null;
  strCompanyGUID: string;
  strCompanyName: string;
  strCountryGUID: string;
  strCreatedBy: string;
  strCurrencyCode: string | null;
  strGroupName: string | null;
  strItineraryBrief: string | null;
  strMemberCode: string;
  strOpUserCode: string | null;
  strRemark: string;
  strRequestCode: string;
  strRequestTitle: string;
  strSaleRequestGUID: string;
  strStatusName: string;
  strTourBaseGUID: string | null;
  strTourCode: string | null;
  strUpdatedBy: string;
}

export interface IQuoteGroup {
  IsActive: boolean;
  IsEnable: boolean;

  No: number;

  dblPriceTotal: number;
  dblPriceTotalAgentCom: number;

  dtmCreatedDate: string;
  dtmLastUpdatedDate: string;

  intCurrencyID: number;
  intTotalChild: number;
  intTotalPax: number;
  intTotalRecords: number;

  strAgentForGroupGUID: string;
  strAgentGroupName: string;
  strCreatedBy: string;
  strCustomerName: string;
  strGroupCode: string;
  strOnlineAgentBookingGUID: string;

  strRemark: Record<string, any>; // {}
  strUpdatedBy: string;
}

export interface IFeedBack {
  IsActive: boolean;
  IsEnable: boolean;
  IsRead: boolean;

  No: number;

  dtmCreateDate: string;
  dtmLastUpdatedDate: string;

  intClientTypeID: Record<string, any>;
  intNoOfUnRead: number;
  intNoOfUnReadPartner: number;
  intRequestTypeID: Record<string, any>;
  intSupportStatusID: number;
  intTotalRecords: number;
  intTotalRespond: number;

  strAgentRequestCode: string;
  strAgentRequestFrom: string;
  strAgentRequestGUID: string;

  strCompanyGUID: Record<string, any>;
  strCompanyName: string;
  strContent: string;
  strCreatedBy: string;
  strGroupName: string;

  strMemberGUID: Record<string, any>;
  strPartnerCompanyGUID: string;
  strPassengerGUID: Record<string, any>;

  strSupportStatusName: string;
  strTitle: string;
  strUpdatedBy: string;
}


export interface IReportCommission {
  No: number;
  strPayableBookingItemGUID: string;
  strPayableBookingGUID: Record<string, any>;
  strPayableBookingPeriodGUID: Record<string, any>;
  strPayablePaymentTermCode: string;
  strBookingItemGUID: string;
  strBookingGUID: string;
  strCompanyBankAccountGUID: Record<string, any>;
  strBookingByAgentHostGUID: string;
  intAgentHostPaymentTypeID: number;
  intPaymentMethodID: Record<string, any>;
  intPaymentTypeID: Record<string, any>;
  intOrderStatusID: Record<string, any>;
  intInvoicePaymentMethodID: Record<string, any>;
  intInvoiceTypetID: Record<string, any>;
  intPayableStatusID: number;
  intPayableTypeID: number;
  strPayableBookingItemName: Record<string, any>;
  dblPayableTotal: number;
  dblSurcharge: Record<string, any>;
  dblBankFee: Record<string, any>;
  dblPayableBalance: number;
  intInvoiceCurrencyID: number;
  dblInvoiceExchangeRate: Record<string, any>;
  dblInvoiceEquivalent: Record<string, any>;
  dblInvoiceBalance: Record<string, any>;
  strRemark: Record<string, any>;
  IsPaid: boolean;
  IsActive: boolean;
  dblPayableAmount: number;
  intPaymentStatusID: number;
  strCreatedBy: string;
  strUpdatedBy: string;
  dtmCreatedDate: string;
  dtmLastUpdatedDate: string;
  strPayableStatusName: string;
  strGroupName: string;
  strOrderAgentHostCode: string;
  dtmDateFrom: string;
  dtmDateTo: string;
  intTotalPax: number;
  dblPriceTotal: number;
  strCompanyName: string;
  strPaymentStatusName: string;
  intTotalRecords: number;
  dblSumPayableAmount: number;
}

export interface IReportCost {
  IsActive: boolean;
  IsPaid: boolean;
  IsSent: Record<string, any>;
  No: number;

  dblBankFee: Record<string, any>;
  dblInvoiceBalance: Record<string, any>;
  dblInvoiceEquivalent: Record<string, any>;
  dblInvoiceExchangeRate: Record<string, any>;
  dblPayableAmount: number;
  dblPayableBalance: Record<string, any>;
  dblPayableTotal: Record<string, any>;
  dblSumPayableAmount: number;
  dblSurcharge: Record<string, any>;

  dtmCreatedDate: string;
  dtmDateFrom: string;
  dtmDateTo: string;
  dtmLastUpdatedDate: string;

  intAgentTypeID: Record<string, any>;
  intAgentTypeToID: Record<string, any>;
  intInvoiceCurrencyID: Record<string, any>;
  intInvoicePaymentMethodID: Record<string, any>;
  intInvoiceTypetID: Record<string, any>;
  intOrderStatusID: Record<string, any>;
  intPayableStatusID: number;
  intPaymentMethodID: Record<string, any>;
  intPaymentTypeID: Record<string, any>;
  intTotalRecords: number;

  strAgentHostBookingGUID: string;
  strAgentHostName: string;
  strBookingGUID: string;
  strCompanyBankAccountGUID: Record<string, any>;
  strCompanyGUID: string;
  strCompanyToGUID: string;
  strCreatedBy: string;
  strGroupName: string;
  strMemberGUID: string;
  strMemberToGUID: Record<string, any>;
  strOrderAgentHostCode: string;
  strOrderBookingCode: string;
  strPayableBookingGUID: Record<string, any>;
  strPayableBookingItemGUID: string;
  strPayablePaymentTermCode: string;
  strPaymentBookingPeriodCode: Record<string, any>;
  strPaymentBookingPeriodGUID: Record<string, any>;
  strRemark: Record<string, any>;
  strUpdatedBy: string;
}

export interface IReportRevenue {
  IsActive: boolean;
  IsPaid: boolean;
  No: number;

  dblBankFee: Record<string, any>;
  dblInvoiceBalance: Record<string, any>;
  dblInvoiceEquivalent: Record<string, any>;
  dblInvoiceExchangeRate: Record<string, any>;
  dblPayableAmount: number;
  dblPayableBalance: Record<string, any>;
  dblPayableTotal: Record<string, any>;
  dblPriceTotal: number;
  dblSumPayableAmount: number;
  dblSurcharge: Record<string, any>;

  dtmCreatedDate: string;
  dtmDateFrom: string;
  dtmDateTo: string;
  dtmLastUpdatedDate: string;

  intAgentHostPaymentTypeID: number;
  intInvoiceCurrencyID: Record<string, any>;
  intInvoicePaymentMethodID: Record<string, any>;
  intInvoiceTypetID: Record<string, any>;
  intOrderStatusID: Record<string, any>;
  intPayableStatusID: number;
  intPayableTypeID: number;
  intPaymentMethodID: Record<string, any>;
  intPaymentTypeID: Record<string, any>;
  intTotalPax: number;
  intTotalRecords: number;

  strBookingByAgentHostGUID: string;
  strBookingGUID: string;
  strBookingItemGUID: string;
  strCompanyBankAccountGUID: Record<string, any>;
  strCompanyName: string;
  strCreatedBy: string;
  strGroupName: string;
  strOrderAgentHostCode: string;
  strPayableBookingGUID: Record<string, any>;
  strPayableBookingItemGUID: string;
  strPayableBookingItemName: Record<string, any>;
  strPayableBookingPeriodGUID: Record<string, any>;
  strPayablePaymentTermCode: string;
  strPayableStatusName: string;
  strRemark: Record<string, any>;
  strUpdatedBy: string;
}


export interface IReportPayReview {
  IsActive: boolean;
  IsAgentConfirmed: boolean;
  IsPaid: boolean;
  No: number;

  dblPaidAmount: number;

  dtmCreatedDate: string;
  dtmDatePaid: string;
  dtmLastUpdatedDate: string;

  intPaymentMethodID: number;
  intTotalRecords: number;

  strAgentCode: string;
  strAgentName: string;

  strBookingGUID: Record<string, any>;
  strBookingItemGUID: Record<string, any>;

  strCompanyBankAccountGUID: string;
  strCompanyGUID: string;
  strCompanyName: string;

  strCreatedBy: string;

  strPaidBookingItemGUID: string;
  strPaidDescription: string;
  strPaidTitle: string;

  strPayableBookingGUID: Record<string, any>;
  strPayableBookingPeriodGUID: Record<string, any>;
  strPayablePaymentTermCode: Record<string, any>;

  strPaymentMethodName: string;

  strUpdatedBy: string;
}

export interface IServicePropose {
  IsActive: boolean;
  IsEnable: boolean;
  IsHasPriceKid: boolean;
  IsMaster: number;

  IsNotCombinedFOC: Record<string, any>;
  IsPromotion: Record<string, any>;

  No: number;

  dblPaymentAmount: Record<string, any>;
  dblPrice: Record<string, any>;
  dblPriceAgent: Record<string, any>;
  dblPriceAgentCom: Record<string, any>;
  dblPriceAgentComUnit: Record<string, any>;
  dblPriceBalance: number;
  dblPriceCost: Record<string, any>;
  dblPricePaid: number;
  dblPriceTotal: number;
  dblPriceTotalAgent: number;
  dblPriceTotalAgentCom: Record<string, any>;
  dblPriceTotalCost: number;
  dblPriceTotalProfit: Record<string, any>;
  dblPriceTotalProfitAgent: Record<string, any>;
  dblPriceUnit: Record<string, any>;
  dblPriceUnitAgent: Record<string, any>;
  dblPriceUnitCost: Record<string, any>;
  dblQuantity: number;

  dtmCreatedDate: string;
  dtmDateDeadline: Record<string, any>;
  dtmDateFrom: string;
  dtmDateTo: string;
  dtmLastUpdatedDate: string;

  intAdult: number;
  intAdultsInService: number;
  intBookingStatusID: number;
  intCateID: Record<string, any>;
  intChildOptionID: Record<string, any>;
  intChildren: number;
  intCommissionTypeID: Record<string, any>;
  intCurrencyID: number;
  intDBL: number;
  intEasiaCateID: Record<string, any>;
  intFOCSelecting: Record<string, any>;
  intJoinTypeID: Record<string, any>;
  intLevel: Record<string, any>;
  intMealIncludedTypeID: Record<string, any>;
  intMealTypeID: Record<string, any>;
  intMemberTypeID: number;
  intNoOfChild: number;
  intNoOfDay: Record<string, any>;
  intNoOfMainServiceConfirmed: number;
  intNoOfMainServiceNeedConfirmed: number;
  intOrder: Record<string, any>;
  intQuantity: string;
  intRemain: Record<string, any>;
  intSGL: number;
  intTPL: number;
  intTWN: number;
  intTotalPax: number;
  intTotalRecords: number;
  intTransportOptionID: Record<string, any>;

  strAgentHostBookingGUID: string;
  strAgentHostCompanyGUID: string;
  strAgentHostGroupGUID: Record<string, any>;
  strAgentHostName: string;
  strAgentHostServiceItemCode: string;
  strAgentHostServiceItemGUID: string;
  strAgentName: string;

  strBookingStatusName: string;
  strBookingSubStatusName: string;

  strCreatedBy: string;

  strDepartureTourLevelGUID: Record<string, any>;
  strFocGUID: Record<string, any>;
  strGroupAgentBookingCode: Record<string, any>;
  strGroupAgentBookingCode_View: Record<string, any>;
  strItemTypeDetailGUID: Record<string, any>;
  strItemTypeGUID: Record<string, any>;
  strItemTypeName: Record<string, any>;
  strItineraryGUID: Record<string, any>;

  strLinkUrl: string;
  strMemberTypeName: string;

  strPaxBookingTourCode: Record<string, any>;
  strPaxDailyBookingTourCode: Record<string, any>;
  strPayableRemark: Record<string, any>;
  strPriceLevelGUID: Record<string, any>;
  strPriceListGUID: Record<string, any>;
  strRemark: Record<string, any>;

  strServiceName: string;
  strServiceNameUrl: Record<string, any>;

  strSourceBookingGUID: string;

  strSupplierChildAgeGUID: Record<string, any>;
  strSupplierGUID: Record<string, any>;
  strSupplierMappingGUID: Record<string, any>;
  strSupplierName: Record<string, any>;
  strSurchargeDateGUID: Record<string, any>;

  strTourCustomizedGUID: string;
  strTourGUID: Record<string, any>;
  strTourPriceItemLevelGUID: Record<string, any>;

  strType: string;
  strUpdatedBy: string;

  strUserEmail: string;
  strUserFirstName: string;
  strUserLastName: string;

  strVoucherByLevelGUID: Record<string, any>;
}

export interface IServiceReverHold {
  IsActive: boolean;
  IsEnable: boolean;
  IsHasPriceKid: boolean;
  IsMaster: number;

  IsNotCombinedFOC: Record<string, any>;
  IsPromotion: Record<string, any>;

  No: number;

  dblPaymentAmount: Record<string, any>;
  dblPrice: Record<string, any>;
  dblPriceAgent: Record<string, any>;
  dblPriceAgentCom: Record<string, any>;
  dblPriceAgentComUnit: Record<string, any>;

  dblPriceBalance: number;
  dblPriceCost: Record<string, any>;
  dblPricePaid: number;
  dblPriceTotal: number;
  dblPriceTotalAgent: number;
  dblPriceTotalAgentCom: Record<string, any>;
  dblPriceTotalCost: number;
  dblPriceTotalProfit: Record<string, any>;
  dblPriceTotalProfitAgent: Record<string, any>;

  dblPriceUnit: Record<string, any>;
  dblPriceUnitAgent: Record<string, any>;
  dblPriceUnitCost: Record<string, any>;

  dblQuantity: number;

  dtmCreatedDate: string;
  dtmDateDeadline: string | null;
  dtmDateFrom: string;
  dtmDateTo: string;
  dtmLastUpdatedDate: string;

  intAdult: number;
  intAdultsInService: number;
  intBookingStatusID: number;

  intCateID: Record<string, any>;
  intChildOptionID: Record<string, any>;
  intChildren: number;

  intCommissionTypeID: Record<string, any>;
  intCurrencyID: number;

  intDBL: number;
  intEasiaCateID: Record<string, any>;
  intFOCSelecting: Record<string, any>;
  intJoinTypeID: Record<string, any>;
  intLevel: Record<string, any>;
  intMealIncludedTypeID: Record<string, any>;
  intMealTypeID: Record<string, any>;

  intMemberTypeID: number;

  intNoOfChild: number;
  intNoOfDay: Record<string, any>;

  intNoOfMainServiceConfirmed: number;
  intNoOfMainServiceNeedConfirmed: number;

  intOrder: Record<string, any>;

  intQuantity: string;

  intRemain: Record<string, any>;

  intSGL: number;
  intTPL: number;
  intTWN: number;

  intTotalPax: number;
  intTotalRecords: number;

  intTransportOptionID: Record<string, any>;

  strAgentHostBookingGUID: string;
  strAgentHostCompanyGUID: string;
  strAgentHostGroupGUID: Record<string, any>;
  strAgentHostName: string;
  strAgentHostServiceItemCode: string;
  strAgentHostServiceItemGUID: string;

  strAgentName: string;

  strBookingStatusName: string;
  strBookingSubStatusName: string;

  strCreatedBy: string;

  strDepartureTourLevelGUID: Record<string, any>;
  strFocGUID: Record<string, any>;

  strGroupAgentBookingCode: Record<string, any>;
  strGroupAgentBookingCode_View: Record<string, any>;

  strItemTypeDetailGUID: Record<string, any>;
  strItemTypeGUID: Record<string, any>;
  strItemTypeName: Record<string, any>;
  strItineraryGUID: Record<string, any>;

  strLinkUrl: string;

  strMemberTypeName: string;

  strPaxBookingTourCode: Record<string, any>;
  strPaxDailyBookingTourCode: Record<string, any>;

  strPayableRemark: Record<string, any>;
  strPriceLevelGUID: Record<string, any>;
  strPriceListGUID: Record<string, any>;
  strRemark: Record<string, any>;

  strServiceName: string;
  strServiceNameUrl: Record<string, any>;

  strSourceBookingGUID: string;

  strSupplierChildAgeGUID: Record<string, any>;
  strSupplierGUID: Record<string, any>;
  strSupplierMappingGUID: Record<string, any>;
  strSupplierName: Record<string, any>;

  strSurchargeDateGUID: Record<string, any>;

  strTourCustomizedGUID: string;
  strTourGUID: Record<string, any>;
  strTourPriceItemLevelGUID: Record<string, any>;

  strType: string;

  strUpdatedBy: string;

  strUserEmail: string;
  strUserFirstName: string;
  strUserLastName: string;

  strVoucherByLevelGUID: Record<string, any>;
}

export interface IServiceBooked {
  No: number;
  strAgentHostServiceItemGUID: string;
  intMemberTypeID: number;
  strGroupAgentBookingCode?: string | null;
  strGroupAgentBookingCode_View?: string | null;
  strMemberTypeName: string;
  strAgentName: string;
  strAgentHostName: string;
  strAgentHostCompanyGUID: string;
  strUserEmail: string;
  strUserFirstName: string;
  strUserLastName: string;
  strServiceNameUrl?: string | null;
  strAgentHostBookingGUID: string;
  intQuantity: string;
  strLinkUrl: string;
  strType: string;
  intRemain: number;
  strSourceBookingGUID: string;
  strAgentHostGroupGUID?: string | null;
  strTourCustomizedGUID?: string | null;
  strTourGUID?: string | null;
  strTourPriceItemLevelGUID?: string | null;
  strDepartureTourLevelGUID?: string | null;
  strVoucherByLevelGUID?: string | null;
  strSupplierGUID: string;
  strItemTypeGUID: string;
  strItineraryGUID?: string | null;
  strSupplierMappingGUID: string;
  strSupplierChildAgeGUID?: string | null;
  strSurchargeDateGUID?: string | null;
  strPriceLevelGUID: string;
  strFocGUID?: string | null;
  strPriceListGUID: string;
  strItemTypeDetailGUID: string;
  intBookingStatusID: number;
  intJoinTypeID?: number | null;
  intCateID: number;
  intTransportOptionID?: number | null;
  intEasiaCateID?: number | null;
  intMealTypeID?: number | null;
  intMealIncludedTypeID: number;
  intChildOptionID?: number | null;
  strPaxBookingTourCode?: string | null;
  strPaxDailyBookingTourCode?: string | null;
  strAgentHostServiceItemCode: string;
  dtmDateFrom: string;
  dtmDateTo: string;
  intNoOfDay?: number | null;
  intTotalPax: number;
  intAdult: number;
  intAdultsInService: number;
  intNoOfChild: number;
  intChildren: number;
  intSGL?: number | null;
  intDBL: number;
  intTWN?: number | null;
  intTPL?: number | null;
  strSupplierName: string;
  strItemTypeName: string;
  strServiceName: string;
  dblPrice?: number | null;
  dblPriceUnit?: number | null;
  dblPriceCost?: number | null;
  dblPriceUnitCost?: number | null;
  dblPriceAgent?: number | null;
  dblPriceUnitAgent?: number | null;
  intCommissionTypeID?: number | null;
  dblPriceAgentCom?: number | null;
  dblPriceAgentComUnit?: number | null;
  dblQuantity?: number | null;
  dblPriceTotal: number;
  dblPriceTotalCost: number;
  dblPriceTotalAgent?: number | null;
  dblPriceTotalAgentCom: number;
  dblPriceTotalProfit: number;
  dblPriceTotalProfitAgent: number;
  intCurrencyID: number;
  dblPricePaid: number;
  dblPriceBalance: number;
  dtmDateDeadline?: string | null;
  intOrder?: number | null;
  strRemark?: string | null;
  intFOCSelecting?: number | null;
  intLevel?: number | null;
  IsHasPriceKid: boolean;
  IsNotCombinedFOC?: boolean | null;
  IsPromotion?: boolean | null;
  IsMaster: number;
  IsEnable: boolean;
  intNoOfMainServiceConfirmed: number;
  intNoOfMainServiceNeedConfirmed: number;
  IsActive: boolean;
  strCreatedBy: string;
  strUpdatedBy: string;
  dtmCreatedDate: string;
  dtmLastUpdatedDate: string;
  dblPaymentAmount?: number | null;
  strPayableRemark?: string | null;
  strBookingStatusName: string;
  strBookingSubStatusName: string;
  intTotalRecords: number;
}

export interface IServiceDetailCard {
  IsActive: boolean;
  IsEnable: boolean;
  IsHasPriceKid: boolean;
  IsMaster: number;

  No: number;

  dblPriceBalance: number;
  dblPricePaid: number;
  dblPriceTotal: number;
  dblPriceTotalAgentCom: number;
  dblPriceTotalCost: number;
  dblPriceTotalProfit: number;
  dblPriceTotalProfitAgent: number;

  dtmCreatedDate: string;
  dtmDateFrom: string;
  dtmDateTo: string;
  dtmLastUpdatedDate: string;

  intAdult: number;
  intAdultsInService: number;
  intBookingStatusID: number;
  intCateID: number;
  intChildren: number;
  intCurrencyID: number;
  intDBL: number;
  intMealIncludedTypeID: number;
  intMemberTypeID: number;
  intNoOfChild: number;
  intNoOfMainServiceConfirmed: number;
  intNoOfMainServiceNeedConfirmed: number;
  intRemain: number;
  intTotalPax: number;
  intTotalRecords: number;

  intQuantity: string;

  strAgentHostBookingGUID: string;
  strAgentHostCompanyGUID: string;
  strAgentHostName: string;
  strAgentHostServiceItemCode: string;
  strAgentHostServiceItemGUID: string;
  strAgentName: string;

  strBookingStatusName: string;
  strBookingSubStatusName: string;

  strCreatedBy: string;

  strItemTypeDetailGUID: string;
  strItemTypeGUID: string;
  strItemTypeName: string;

  strMemberTypeName: string;

  strPriceLevelGUID: string;
  strPriceListGUID: string;

  strServiceName: string;

  strSourceBookingGUID: string;

  strSupplierGUID: string;
  strSupplierMappingGUID: string;
  strSupplierName: string;

  strUpdatedBy: string;

  strUserEmail: string;
  strUserFirstName: string;
  strUserLastName: string;

  [key: string]: any;
}

export interface IServiceDetailTable {
  dblPrice: number;
  dblPriceAgent: number;
  dblPriceAgentCom: number;
  dblPriceAgentComUnit: number;
  dblPriceCost: number;
  dblPriceTotal: number;
  dblPriceTotalAgent: number;
  dblPriceTotalAgentCom: number;
  dblPriceTotalCost: number;

  dblPriceTotalProfit: any;
  dblPriceTotalProfitAgent: any;
  dblPriceUnit: number;
  dblPriceUnitAgent: number;
  dblPriceUnitCost: number;
  dblQuantity: number;

  dtmDateFrom: string;
  dtmDateTo: string;

  intCateID: any;
  intCommissionTypeID: any;
  intCurrencyID: number;
  intNoOfDay: any;
  intQuantityTypeID: number;
  intSglDblID: number;

  strAgentHostBookingGUID: string;
  strAgentHostServiceItemDetailGUID: string;
  strAgentHostServiceItemGUID: string;
  strAgentHostServiceItemPriceDetailCode: string;

  strItemTypeName: any;
  strRemark: any;
  strServiceName: string;
  strServiceName_View: string;
  strSourceBookingGUID: string;
  strSupplierName: any;
}


export interface IListPayable {
  strBookingPaymentTermGUID: string;
  strAgentHostServiceItemGUID: string;
  strPaymentTermGUID: any;
  strPaymentTermCode: string;
  strPaymentTermName: any;
  intDayFrom: any;
  intDayTo: any;
  dblPaymentPercentage: number;
  dtmDateFrom: string;
  dtmDateTo: string;
  intCurrencyID: number;
  dblPriceCharge: number;
  intNoOfNotified: number;
  IsPreparePaid: boolean;
  IsPaid: boolean;
  IsToPayable: boolean;
  IsCancellation: boolean;
  IsEnable: boolean;
  IsActive: boolean;
  strCreatedBy: string;
  strUpdatedBy: string;
  dtmCreatedDate: string;
  dtmLastUpdatedDate: string;
}