import apiClient from "@/axios";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";

import { QUERY_KEYS } from "./query-keys";
import { useUserStore } from "@/zustand/useUserStore";

const fetchGetContentTourCustomizedForSendMail = async (body: any) => {
  const res = await apiClient.post(
    "tourcustomized/GetContentTourCustomizedForSendMail",
    body
  );

  return res.data;
};

export const useGetContentTourCustomizedForSendMail = (
  strTourCustomizedGUID?: string
) => {
  const { user } = useUserStore();

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.MEDIA.SEND_MAIL,
      user?.strUserGUID,
      strTourCustomizedGUID,
    ],

    queryFn: () =>
      fetchGetContentTourCustomizedForSendMail({
        strUserGUID: user?.strUserGUID,
        strTourCustomizedGUID,
      }),

    enabled: !!user?.strUserGUID && !!strTourCustomizedGUID,
    placeholderData: keepPreviousData,
  });

  return {
    mediaData: query.data ?? [],
    mediaLoading: query.isLoading,
    mediaError: query.isError,
    refetchMedia: query.refetch,
  };
};


// send   mail

type SendMailPayload = {
  strEmailsSendTo: string;
  strEmailsCC?: string | null;
  strEmailsBCC?: string | null;
  strAttachments?: string | null;
  strSubject: string;
  IsBodyHtml: boolean;
  strBody: string;
  intEmailConfigID: number;
};

const fetchGetSendMail = async (
  body: SendMailPayload & { strUserGUID?: string }
) => {
  const res = await apiClient.post("public/GetSendEmail", body);
  return res.data;
};

export const useGetSendMail = () => {
  const { user } = useUserStore();

  return useMutation({
    mutationFn: (payload: SendMailPayload) =>
      fetchGetSendMail({
        strUserGUID: user?.strUserGUID,
        strEmailsSendTo: payload.strEmailsSendTo,
        strEmailsCC: payload.strEmailsCC ?? null,
        strEmailsBCC: payload.strEmailsBCC ?? null,
        strAttachments: payload.strAttachments ?? null,
        strSubject: payload.strSubject,
        IsBodyHtml: payload.IsBodyHtml,
        strBody: payload.strBody,
        intEmailConfigID: payload.intEmailConfigID,
      }),
  });
};

//tourcustomized/UpdTourCustomizedForSent

type  UpdTourCustomizedForSentPayload = {
  strUserGUID : string;
  strTourCustomizedGUID : string;
}


const fetchUpdTourCustomizedForSent = async  (
  body: UpdTourCustomizedForSentPayload
) => {
  const res = await apiClient.post("tourcustomized/UpdTourCustomizedForSent", body);
  return res.data;
}

export const useUpdTourCustomizedForSent = () => {
  const { user } = useUserStore();
  return useMutation({
    mutationFn: (payload:  {strTourCustomizedGUID : string}) =>
      fetchUpdTourCustomizedForSent({
        strUserGUID: user?.strUserGUID ?? "",
        strTourCustomizedGUID: payload.strTourCustomizedGUID,
      }),
  })
}


// GetHTMLTourCustomizedProgForExport 

type GetHTMLTourCustomizedProgForExportPayload = {
  strUserGUID : string;
  strTourCustomizedGUID : string;
}

const fetchGetHTMLTourCustomizedProgForExport = async  ( 
  body: GetHTMLTourCustomizedProgForExportPayload
) => {
  const res = await apiClient.post("tourcustomized/GetHTMLTourCustomizedProgForExport", body);
  return res.data;

}

export const useGetHTMLTourCustomizedProgForExport = (strTourCustomizedGUID?: string) => {
  const { user } = useUserStore();
  const query = useQuery({
    queryKey: [QUERY_KEYS.MEDIA.HTML_TOUR_CUSTOMIZED_EXPORT, user?.strUserGUID, strTourCustomizedGUID],
    queryFn: () => fetchGetHTMLTourCustomizedProgForExport({
      strUserGUID: user?.strUserGUID ?? "",
      strTourCustomizedGUID: strTourCustomizedGUID ?? "",
    }),
    enabled: !!user?.strUserGUID && !!strTourCustomizedGUID,
    placeholderData: keepPreviousData,
  })

  return {
    exportHtmlData: query.data,
    exportHtmlLoading: query.isLoading,
    exportHtmlError: query.isError,
    refetchExportHtml: query.refetch,
  };
}