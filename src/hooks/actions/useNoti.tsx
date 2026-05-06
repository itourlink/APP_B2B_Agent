import apiClient from "@/axios";

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