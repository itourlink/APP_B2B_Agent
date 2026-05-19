import { useEffect, useMemo, useState } from "react";

import Pagination from "@/components/pagination/pagination";
import PanelPopup from "@/components/popup/panel-popup";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { useTranslate } from "@/locales";
import { fDateTime } from "@/utils/format-time";

const DetailAccommodationD = ({ open, onClose }: any) => {
  const { t } = useTranslate("tourcustomize");

  const supListMapData = useMemo(
    () => [
      [
        {
          No: 1,
          strPriceSeasonGUID: "D8D9ED12-258A-4ADE-9BFA-4E7FFF02F254",
          strPriceSeasonName: t("sampleSeasonYear"),
          strSeasonName: t("sampleSeasonName"),
          strItemName: t("sampleVillaSuperior"),
          strMealIncludedTypeName: t("breakfastIncluded"),
          dblMarkup: 0,
          dblPriceView: 21.6,
          intTotalRecords: "1",
        },
      ],
      [
        {
          strPriceSeasonGUID: "D8D9ED12-258A-4ADE-9BFA-4E7FFF02F254",
          dtmDateFrom: "2025-01-01T00:00:00",
          dtmDateTo: "2029-12-31T00:00:00",
        },
      ],
      [],
    ],
    [t]
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const listData = useMemo(() => supListMapData?.[0] || [], [supListMapData]);
  const seasonData = useMemo(() => supListMapData?.[1] || [], [supListMapData]);

  const totalRecords = 10;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const isLoading = false;
  const isError = false;

  const colDefs = useMemo<ColumnDef<any>[]>(
    () => [
      {
        field: "No",
        headerName: t("serialNumber"),
        render: (value) => (
          <span className="font-medium text-gray-500">{value}</span>
        ),
      },
      {
        field: "strItemName",
        headerName: t("description"),
        render: (_, row) => {
          const season: any = seasonData?.find(
            (item: any) => item?.strPriceSeasonGUID === row?.strPriceSeasonGUID
          );

          return (
            <div className="py-2">
              <div className="mb-3 border-b pb-3">
                <div className="text-[18px] font-semibold">
                  {t("season")}: {row?.strPriceSeasonName}
                </div>

                <div className="mt-1 text-sm">
                  <span className="font-semibold">{t("dateValid")}:</span>{" "}
                  ({row?.strSeasonName}) ({t("mondayToSunday")}) [
                  {fDateTime(season?.dtmDateFrom)} - {fDateTime(season?.dtmDateTo)}
                  ]
                </div>
              </div>

              <div className="flex items-center gap-1 text-[16px]">
                <span className="font-bold uppercase">{row?.strItemName}</span>
                <span>({row?.strMealIncludedTypeName})</span>
              </div>
            </div>
          );
        },
      },
      {
        field: "dblMarkup",
        headerName: t("markUp"),
        render: (value) => (
          <div className="font-medium">
            {Number(value) > 0 ? value : t("noMarkup")}
          </div>
        ),
      },
      {
        field: "dblPriceView",
        headerName: t("price"),
        render: (value) => <div className="text-right font-medium">${value}</div>,
      },
    ],
    [seasonData, t]
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={t("sampleAccommodationPopupTitle")}
      className="w-[900px]"
    >
      <div className="pt-4">
        <TableCore rowData={listData ?? []} columnDefs={colDefs} loading={isLoading} />

        {!isError && (
          <Pagination
            currentPage={page}
            onPageChange={(value) => setPage(value)}
            totalPages={totalPages || 1}
          />
        )}
      </div>
    </PanelPopup>
  );
};

export default DetailAccommodationD;
