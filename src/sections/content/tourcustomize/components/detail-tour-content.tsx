import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pen, Plus, X } from "lucide-react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import PanelPopup from "@/components/popup/panel-popup";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import {
  useAddDayTourCustomized,
  getListServiceTourCustomized,
} from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";
import { useToastStore } from "@/zustand/useToastStore";

import AddAccommodationD from "./add-accommodation-d";
import AddImageD from "./add-image-d";
import AddManual from "./add-manually-d";
import AddShippingServicesD from "./add-shipping-services-d";
import AddToursD from "./add-tours-d";
import ChangeDayOrder from "./change-day-order";
import DetailTourInEx from "./detail-tour-in-ex";
import DetailTourPrice from "./detail-tour-price";
import ListDaySidebar from "./list-day-sidebar";
import ListTour from "./list-tour";
import MapView from "./map/map-view";
import AddServiceSingleD from "./add-service-single-d";

interface DetailTourContentProps {
  itemListData?: any;
  itemDetail?: any;
  onOpenChangeDay: () => void;
  isPopupOpen: boolean;
  setIsPopupOpen: (val: boolean) => void;
  hasChange: boolean;
  setHasChange: (val: boolean) => void;
  tourCustomizedGUID: string;
}

export const DetailTourContent = ({
  itemListData,
  itemDetail,
  isPopupOpen,
  setIsPopupOpen,
  hasChange,
  setHasChange,
  tourCustomizedGUID,
}: DetailTourContentProps) => {
  const { t } = useTranslate("tourcustomize");
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();
  const location = useLocation();
  const item = location.state?.item;
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [openManualPopup, setOpenManualPopup] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [selectedDayGUID, setSelectedDayGUID] = useState<string | null>(null);
  const [setMapDay] = useState<any>(null);
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);

  const renderServiceContent = () => {
    switch (selectedService) {
      case "accommodation":
        return (
          <AddAccommodationD
            strUserGUID={itemDetail?.strUserGUID || null}
            strCompanyGUID={itemListData?.strCompanyGUID || null}
            itemListour={currentMapDay ?? {}}
            dtmDateFrom={
              currentMapDay?.dtmDateFrom || itemListData?.dtmDateFrom || null
            }
            dtmDateTo={
              currentMapDay?.dtmDateTo || itemListData?.dtmDateTo || null
            }
            intPaxCount={itemListData?.intTotalPax || null}
          />
        );
      case "image":
        return <AddImageD />;
      case "service":
        return (
          <AddServiceSingleD
            item={itemListData ?? {}}
            itemListour={currentMapDay ?? {}}
            strTourCustomizedDayGUID={currentMapDay?.strTourCustomizedDayGUID}
            dtmDateFrom={
              currentMapDay?.dtmDateFrom || itemListData?.dtmDateFrom || null
            }
            dtmDateTo={
              currentMapDay?.dtmDateTo || itemListData?.dtmDateTo || null
            }
            intPaxCount={itemListData?.intTotalPax || null}
            intCurrencyView={itemListData?.intCurrencyID || null}
          />
        );
      case "shipping":
        return (
          <AddShippingServicesD
            item={itemListData ?? {}}
            itemListour={currentMapDay ?? {}}
            strTourCustomizedDayGUID={currentMapDay?.strTourCustomizedDayGUID}
          />
        );
      case "tours":
        return <AddToursD
          item={itemListData ?? {}}
          itemListour={currentMapDay ?? {}}
          strTourCustomizedDayGUID={
            currentMapDay?.strTourCustomizedDayGUID
          }
        />
      default:
        return null;
    }
  };

  const handleSelectService = (
    value: string,
    dayItems?: any
  ) => {
    const firstDay = dayItems?.[0];

    if (firstDay?.strTourCustomizedDayGUID) {
      setSelectedDayGUID(
        firstDay.strTourCustomizedDayGUID
      );
    }

    if (value === "manual") {
      setOpenManualPopup(true);
      setSelectedDay(firstDay);
      return;
    }

    setSelectedService(value);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSave = () => {
    setHasChange(false);
    setIsPopupOpen(false);
  };

  const { data } = useQuery({
    queryKey: [
      QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
      item?.strTourCustomizedGUID,
    ],
    queryFn: () =>
      getListServiceTourCustomized({
        strTourCustomizedGUID: item?.strTourCustomizedGUID,
        strTourCustomizedDayGUID: null,
      }),
    placeholderData: keepPreviousData,
    enabled: !!item?.strTourCustomizedGUID,
  });

  const listData = data?.[0] ?? [];

  const groupByDay = (sourceData: any[]) => {
    const map: Record<string, any[]> = {};

    sourceData.forEach((dataItem) => {
      const key = dataItem?.strTourCustomizedDayGUID;

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(dataItem);
    });

    return Object.values(map);
  };

  const { mutate: useAddDayTourCustomizedApi, isPending: isLoading } =
    useMutation({
      mutationFn: useAddDayTourCustomized,
    });

  const handleAddTourNow = () => {
    const totalDay = groupByDay(listData).length;

    const payload = {
      strTourCustomizedGUID: item?.strTourCustomizedGUID,
      intDayOrder: totalDay + 1,
      strDayTitle: t("dayWithNumber", { number: totalDay + 1 }),
    };

    useAddDayTourCustomizedApi(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
            item?.strTourCustomizedGUID,
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED],
        });

        showToast("success", t("addDaySuccess"));
      },
      onError: () => {
        showToast("error", t("addDayError"));
      },
    });
  };

  const groupedDays = groupByDay(listData);

  const handleClickSideBarDay = (dayGUID: string) => {
    setSelectedDayGUID(dayGUID);

    const selectedGroup = groupedDays.find(
      (items) => items?.[0]?.strTourCustomizedDayGUID === dayGUID,
    );

    if (selectedGroup) {
      setMapDay(selectedGroup[0]);
    }

    const container = contentRef.current;
    const target = dayRefs.current[dayGUID];

    if (!container || !target) return;

    container.scrollTo({
      top: target.offsetTop - 200,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!selectedDayGUID && groupedDays?.length) {
      setSelectedDayGUID(groupedDays?.[0]?.[0]?.strTourCustomizedDayGUID);
    }
  }, [groupedDays, selectedDayGUID]);

  const currentMapDay = groupedDays
    .flat()
    .find((item) => item.strTourCustomizedDayGUID === selectedDayGUID);

  return (
    <div className="flex h-[calc(100vh-154px)] min-h-0 overflow-hidden bg-gray-50 font-sans">
      <div
        className={
          isPopupOpen
            ? "h-full min-h-0 w-20 shrink-0 overflow-y-auto border-r border-gray-100 bg-white py-6 opacity-50 transition-opacity pointer-events-none lg:w-48"
            : "h-full min-h-0 w-20 shrink-0 overflow-y-auto border-r border-gray-100 bg-white py-6 lg:w-48"
        }
      >
        {/* <ListDaySidebar item={item ?? ""} /> */}
        <div className="flex min-h-full flex-col items-center gap-4">
          <ListDaySidebar
            groupedDays={groupedDays}
            selectedDayGUID={selectedDayGUID}
            onSelectDay={handleClickSideBarDay}
          />

          <button
            onClick={() => setIsPopupOpen(true)}
            className="group flex h-12 w-12 items-center justify-center gap-2 rounded-xl bg-blue-50 text-[#004b91] transition-all hover:bg-blue-100 lg:h-10 lg:w-40"
          >
            <Pen size={18} />

            <span className="cursor-pointer hidden text-xs font-bold uppercase tracking-tight lg:inline">
              {t("editDay")}
            </span>
          </button>

          <button
            className="group flex h-12 w-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 text-gray-400 transition-all hover:border-[#004b91] hover:text-[#004b91] lg:h-10 lg:w-40"
            onClick={handleAddTourNow}
          >
            <Plus size={18} />

            <span className="hidden text-xs font-bold uppercase tracking-tight lg:inline">
              {isLoading ? t("loading") : t("addDay")}
            </span>
          </button>
        </div>
      </div>

      <div
        ref={contentRef}
        className={
          isPopupOpen
            ? "pointer-events-none h-full min-h-0 flex-1 overflow-hidden space-y-6 bg-white px-8 py-6"
            : "h-full min-h-0 flex-1 space-y-6 overflow-y-auto bg-white px-8 py-6"
        }
      >
        {groupedDays.map((items: any[], index) => {
          const firstItem = items?.[0];
          const dayGUID = firstItem?.strTourCustomizedDayGUID;

          return (
            <div
              key={dayGUID || index}
              ref={(element) => {
                if (dayGUID) {
                  dayRefs.current[dayGUID] = element;
                }
              }}
              className="space-y-4"
            >
              <ListTour
                item={items}
                itemDetail={itemDetail ?? ""}
                itemListData={itemListData}
                onChange={(val) => handleSelectService(val, items)}
              />
            </div>
          );
        })}

        <DetailTourInEx item={item} />
        <DetailTourPrice item={item} />
      </div>

      <PanelPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        title={t("changeDayOrder")}
        className="w-[800px]"
      >
        <ChangeDayOrder
          strTourCustomizedGUID={
            item?.strTourCustomizedGUID || tourCustomizedGUID
          }
          onChanged={(val) => setHasChange(val)}
          onClose={handleClosePopup}
          onSave={handleSave}
          hasChange={hasChange}
        />
      </PanelPopup>

      <PanelPopup
        open={openManualPopup}
        onClose={() => {
          setOpenManualPopup(false);
          setSelectedDay(null);
        }}
        title={t("addManualTitle", { day: selectedDay?.intDayOrder || "" })}
        className="w-[900px]"
      >
        <AddManual
          strTourCustomizedDayGUID={currentMapDay?.strTourCustomizedDayGUID}
          selectedDay={selectedDay}
          onClose={() => {
            setOpenManualPopup(false);
            setSelectedDay(null);
          }}
        />
      </PanelPopup>

      <div className="relative hidden w-130 border-l border-gray-200 bg-gray-100 xl:block">
        {selectedService ? (
          <div className="animate-in absolute inset-0 z-10 overflow-y-auto bg-white fade-in duration-300">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {t("serviceDetail")}
                </h3>

                <p className="text-[11px] text-gray-400">{selectedService}</p>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4">{renderServiceContent()}</div>
          </div>
        ) : (
          <>
            <MapView selectedDay={currentMapDay || groupedDays?.[0]?.[0]} />
          </>
        )}
      </div>
    </div>
  );
};
