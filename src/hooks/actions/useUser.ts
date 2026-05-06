import apiClient from "@/axios";

export const useListUserInCompanyOwner = async (body: any) => {
    const res = await apiClient.post(
        "user/GetListUserInCompanyOwner",
        body
    );
    return res.data;
};

export const addUserInCompany = async (body: any) => {
    const res = await apiClient.post(
        "user/AddUserInCompany",
        body
    );
    return res.data;
};



export const useCheckAgentRegisterByEmail = async (body: any) => {
    const res = await apiClient.post(
        "public/GetCheckAgentRegisterByEmail",
        body
    );
    return res.data;
};

export const updMemberInfoProfile = async (body: any) => {
    const res = await apiClient.post(
        "user/UpdMemberInfoProfile",
        body
    );
    return res.data;
};


export const useListBookingRequest = async (body: any) => {
    const res = await apiClient.post(
        "request/GetListBookingRequest",
        body
    );
    return res.data;
};
export const useListAgentRequest = async (body: any) => {
    const res = await apiClient.post(
        "request/GetListAgentRequest",
        body
    );
    return res.data;
};
export const useReportPayableBookingItemByAgent = async (body: any) => {
    const res = await apiClient.post(
        "payrcvbooking/GetReportPayableBookingItemByAgent",
        body
    );
    return res.data;
};
export const useReportCommissionByAgent = async (body: any) => {
    const res = await apiClient.post(
        "booking/GetReportCommissionByAgent",
        body
    );
    return res.data;
};
export const useListPaidBookingItem = async (body: any) => {
    const res = await apiClient.post(
        "payrcvbooking/GetListPaidBookingItem",
        body
    );
    return res.data;
};
export const useListCompanyOwner = async (body: any) => {
    const res = await apiClient.post(
        "user/GetListCompanyOwner",
        body
    );
    return res.data;
};
export const useListTourCustomized = async (body: any) => {
    const res = await apiClient.post(
        "tourcustomized/GetListTourCustomized",
        body
    );
    return res.data;
};
export const useListServiceTourCustomized = async (body: any) => {
    const res = await apiClient.post(
        "tourcustomized/GetListServicesTourCustomized",
        body
    );
    return res.data;
};
export const useFilterCompanyBankAccount = async (body: any) => {
    const res = await apiClient.post(
        "user/GetFilterCompanyBankAccount",
        body
    );
    return res.data;
};
export const useListSaleRequest = async (body: any) => {
    const res = await apiClient.post(
        "request/GetListSaleRequest",
        body
    );
    return res.data;
};
export const useListAgentForGroup = async (body: any) => {
    const res = await apiClient.post(
        "booking/GetListAgentForGroup",
        body
    );
    return res.data;
};
export const useReportReceivableByAgent = async (body: any) => {
    const res = await apiClient.post(
        "booking/GetReportReceivableByAgent",
        body
    );
    return res.data;
};
export const useReportCommissionByAgentHost = async (body: any) => {
    const res = await apiClient.post(
        "booking/GetReportCommissionByAgentHost",
        body
    );
    return res.data;
};
export const useListAgentHostServiceItem = async (body: any) => {
    const res = await apiClient.post(
        "booking/GetListAgentHostServiceItem",
        body
    );
    return res.data;
};
export const useListPayableBooking = async (body: any) => {
    const res = await apiClient.post(
        "payrcvbooking/GetListPayableBooking",
        body
    );
    return res.data;
};
export const useListPaidBooking = async (body: any) => {
    const res = await apiClient.post(
        "payrcvbooking/GetListPaidBooking",
        body
    );
    return res.data;
};
export const useUpdMemberPassword = async (body: any) => {
    const res = await apiClient.post(
        "user/UpdMemberPassword",
        body
    );
    return res.data;
};
export const useCheckMemberPassword = async (body: any) => {
    const res = await apiClient.post(
        "user/CheckMemberPassword",
        body
    );
    return res.data;
};
export const useUpdCompanyInfo = async (body: any) => {
    const res = await apiClient.post(
        "user/UpdCompanyInfo",
        body
    );
    return res.data;
};
export const useAddCompanyBankAccount = async (body: any) => {
    const res = await apiClient.post(
        "user/AddCompanyBankAccount",
        body
    );
    return res.data;
};
export const useGetFilterCompanyBankAccount = async (body: any) => {
    const res = await apiClient.post(
        "user/GetFilterCompanyBankAccount",
        body
    );
    return res.data;
};
export const useUpdCompanyBankAccount = async (body: any) => {
    const res = await apiClient.post(
        "user/UpdCompanyBankAccount",
        body
    );
    return res.data;
};
export const useDelCompanyBankAccount = async (body: any) => {
    const res = await apiClient.post(
        "user/DelCompanyBankAccount",
        body
    );
    return res.data;
};
export const useAddSaleRequest = async (body: any) => {
    const res = await apiClient.post(
        "request/AddSaleRequest",
        body
    );
    return res.data;
};
export const useDelTourCustomized = async (body: any) => {
    const res = await apiClient.post(
        "tourcustomized/DelTourCustomized",
        body
    );
    return res.data;
};
export const useDetailBookingRequest = async (body: any) => {
    const res = await apiClient.post(
        "request/GetDetailBookingRequest",
        body
    );
    return res.data;
};
export const useListRequestMessage = async (body: any) => {
    const res = await apiClient.post(
        "request/GetListRequestMessage",
        body
    );
    return res.data;
};
export const useListServiceItemBySaleReq = async (body: any) => {
    const res = await apiClient.post(
        "request/GetListServiceItemBySaleReq",
        body
    );
    return res.data;
};
export const useListBooking = async (body: any) => {
    const res = await apiClient.post(
        "public/GetListBooking",
        body
    );
    return res.data;
};
export const useHelperFileByShow = async (body: any) => {
    const res = await apiClient.post(
        "travelhelper/GetDetailTravelB2BHelperFileByShow",
        body
    );
    return res.data;
};
export const useListAgentNotify = async (body: any) => {
    const res = await apiClient.post(
        "notify/GetListAgentNotify",
        body
    );
    return res.data;
};
export const useUpdNotifyIsRead = async (body: any) => {
    const res = await apiClient.post(
        "notify/UpdAgentNotifyToForIsRead",
        body
    );
    return res.data;
};
export const useAddDayTourCustomized = async (body: any) => {
    const res = await apiClient.post(
        "tourcustomized/AddDayTourCustomized",
        body
    );
    return res.data;
};

export const useGetListCart = async (body: any) => {
    const res = await apiClient.post(
        "booking/GetListCartServiceItem",
        body
    );
    return Array.isArray(res) ? res : (res?.data ?? res);
};
export const useListTourCustomizedInExService = async (body: any) => {
    const res = await apiClient.post(
        "tourcustomized/GetTourCustomizedInExService",
        body
    );
    return res.data;
};
export const useListTotalPriceForTourCustom = async (body: any) => {
    const res = await apiClient.post(
        "tourcustomized/GetListTotalPriceForTourCustom",
        body
    );
    return res.data;
};
