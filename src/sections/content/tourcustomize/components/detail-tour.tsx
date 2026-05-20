import { useState } from "react";
import { useLocation } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListTourCustomized } from "@/hooks/actions/useUser";

import { DetailTourContent } from "./detail-tour-content";
import { DetailTourHeader } from "./detail-tour-header";
import UpdateTour from "./update-tour";

export const DetailTour = () => {
  const location = useLocation();
  const item = location.state?.item;

  const [isUpdate, setIsUpdate] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasChange, setHasChange] = useState(false);

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED, item?.strTourCode],
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
        tblsReturn: "[0]",
      }),
    placeholderData: keepPreviousData,
  });

  const listData = data?.[0]?.[0] ?? [];

  return (
    <div className={isPopupOpen ? "h-screen overflow-hidden" : "mt-30"}>
      <DetailTourHeader
        item={listData}
        onUpdate={() => setIsUpdate(true)}
        isLocked={isPopupOpen}
      />

      {isUpdate ? (
        <UpdateTour onBack={() => setIsUpdate(false)} />
      ) : (
        <DetailTourContent
          itemListData={listData ?? ""}
          itemDetail={item ?? ""}
          onOpenChangeDay={() => setIsPopupOpen(true)}
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
