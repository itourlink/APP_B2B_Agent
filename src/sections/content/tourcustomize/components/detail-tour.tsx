import { useState } from "react";
import { useLocation } from "react-router-dom";
import UpdateTour from "./update-tour";
import { DetailTourHeader } from "./detail-tour-header";
import { DetailTourContent } from "./detail-tour-content";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListTourCustomized } from "@/hooks/actions/useUser";

export const DetailTour = () => {

  const location = useLocation();
  const item = location.state?.item;

  console.log("item", item)
  const [isUpdate, setIsUpdate] = useState(false);

  // 1. Quản lý trạng thái Popup & Thay đổi tập trung tại cha
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasChange, setHasChange] = useState(false);

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.USER.LIST_USER_IN_COMPANY_OWNER, item?.strTourCode],
    queryFn: () =>
      useListTourCustomized({
        strTourCustomizedGUID: null,
        strFilter: null,
        intTourStepID: null,
        strCodeChkVer: item?.strTourCode || null,
        intMemberTypeID: 1,
        strOrder: "intVersionID DESC",
        intCurPage: null,
        intPageSize: null,
        tblsReturn: "[0]"
      }),
    placeholderData: keepPreviousData,
  });
  const listData = data?.[0]?.[0] ?? [];

  return (
    <div className={isPopupOpen ? "overflow-hidden h-screen" : ""}>
      <DetailTourHeader
        onUpdate={() => setIsUpdate(true)}
        isLocked={isPopupOpen}
      />

      {isUpdate ? (
        <UpdateTour onBack={() => setIsUpdate(false)} />
      ) : (
        <DetailTourContent
          onOpenChangeDay={() => setIsPopupOpen(true)}
          // onUpdateDays={setDays}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          hasChange={hasChange}
          setHasChange={setHasChange}
          tourCustomizedGUID={listData?.tourCustomizedGUID ?? ""}
        />
      )}
    </div>
  );
};



