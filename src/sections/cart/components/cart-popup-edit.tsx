import { useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import PanelPopup from "@/components/popup/panel-popup";

import { fetchListPrice } from "@/hooks/actions/useBooking";
import { fetchDetailTour } from "@/hooks/actions/useTour";
import { useUserStore } from "@/zustand/useUserStore";


import {CONFIG} from "@/config-global";

interface Props {
  open: boolean;
  onClose: () => void;
  item?: any;
}

const CartPopupEdit = ({
  open,
  onClose,
  item,
}: Props) => {
  const { user } = useUserStore();

  // ================= SELECTED LEVEL =================
  const [selectedLevel, setSelectedLevel] =
    useState("");

  // ================= TOUR DETAIL =================
  const { data: tourDetail } = useQuery({
    queryKey: [
      "TOUR_DETAIL",
      item?.strTourGUID,
    ],

    queryFn: () =>
      fetchDetailTour({
        strTourGUID: item?.strTourGUID,
        strServiceNameUrl: null,
        intCurPage: 1,
        intPageSize: 10,
        strOrder: null,
        tblsReturn: "[0]",
      }),

    enabled:
      open && !!item?.strTourGUID,
  });

  // ================= DETAIL TOUR =================
  const detailTour =tourDetail?.[0]?.[0];

  console.log("TOUR DETAIL", detailTour);

  // ================= PRICE LEVEL =================
  const {
    data: priceLevels,
    isLoading: priceLoading,
  } = useQuery({
    queryKey: [
      "PRICE_LEVEL_TOUR",
      item?.strTourGUID,
    ],

    queryFn: () =>
      fetchListPrice({
        strUserGUID:
          user?.strUserGUID,

        strTourPriceItemLevelGUID:
          item?.strTourPriceItemLevelGUID,

        strTourGUID:
          item?.strTourGUID,

        strPriceLevelGUID:
          item?.strPriceLevelGUID,

        intNoOfAdult:
          item?.intAdults || 2,

        xmlNoOfChild:
          "<child></child>",

        intNoOfSGLSup: 0,
        intNoOfTPLRec: 0,

        dtmFilterDateFrom:
          item?.dtmDateFrom,

        dtmFilterDateTo: null,

        intCurrencyView:
          item?.intCurrencyID || 1,

        strCompanyOwnerGUID:
          item?.strCompanyGUID,

        IsHasPriceKid: false,

        intEasiaCateID:
          item?.intEasiaCateID || "4",

        intCateID:
          item?.intCateID,

        intJoinTypeID:
          item?.intJoinTypeID || 2,

        intTransportOptionID: null,

        intCurPage: 1,
        intPageSize: 1,

        strOrder: null,

        tblsReturn: "[0]",
      }),

    enabled: open && !!item,
  });

  console.log(
    "PRICE LEVELS TOUR",priceLevels
  );

  // ================= DEFAULT SELECT =================
  useEffect(() => {
    if (priceLevels?.[0]?.length > 0) {
      setSelectedLevel(
        priceLevels?.[0]?.[0]
          ?.strTourPriceItemLevelGUID || ""
      );
    }
  }, [priceLevels]);

  // ================= CURRENT PRICE =================
  const currentPrice = useMemo(() => {
    return priceLevels?.[0]?.find(
      (x: any) =>
        x?.strTourPriceItemLevelGUID ===
        selectedLevel
    );
  }, [priceLevels, selectedLevel]);

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title="Edit Tour"
      className="max-w-[500px]"
    >
      <div className="space-y-5">
        {/* ================= TOUR IMAGE ================= */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <img
            src={
              detailTour?.strTourImageUrl
                ? `${CONFIG.site.serverUrl}/${detailTour?.strTourImageUrl}`
                : "/no-image.png"
            }
            alt="tour"
            className="h-[220px] w-full object-cover"
          />

          <div className="space-y-2 p-4">
            <div className="text-xl font-bold text-[#004b91]">
              {detailTour?.strServiceName}
            </div>

            <div className="text-sm text-gray-500">
              {detailTour?.strCompanyName}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-gray-400">
              <span>
                Tour Code:
                {" "}
                {detailTour?.strTourCode}
              </span>

              <span>
                {detailTour?.intNoOfDay}
                {" "}
                Days
              </span>

              <span>
                {currentPrice?.strJoinTypeName}
              </span>
            </div>
          </div>
        </div>

        {/* ================= SELECT LEVEL ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Price Level
          </label>

          <select
            value={selectedLevel}
            onChange={(e) =>
              setSelectedLevel(
                e.target.value
              )
            }
            className="
              h-11 w-full rounded-lg
              border border-gray-300
              px-3 text-sm outline-none
              focus:border-[#004b91]
            "
          >
            {priceLevels?.[0]?.map(
              (level: any) => (
                <option
                  key={
                    level?.strTourPriceItemLevelGUID
                  }
                  value={
                    level?.strTourPriceItemLevelGUID
                  }
                >
                  {
                    level?.strColPriceName
                  }
                </option>
              )
            )}
          </select>
        </div>

        {/* ================= PRICE ================= */}
        <div className="rounded-xl bg-[#f5f9ff] p-4">
          <div className="text-sm text-gray-500">
            Total Price
          </div>

          <div className="mt-1 text-[32px] font-bold text-[#1f73ff]">
            $
            {Number(
              currentPrice?.dblTotalPrice ||
                0
            ).toLocaleString("en-US")}
          </div>
        </div>

        {/* ================= OVERVIEW ================= */}
        {detailTour?.strOverview && (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 text-sm font-semibold text-[#004b91]">
              Overview
            </div>

            <div
              className="text-sm leading-6 text-gray-600"
              dangerouslySetInnerHTML={{
                __html:
                  detailTour?.strOverview,
              }}
            />
          </div>
        )}

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg border border-gray-300
              px-5 py-2 text-sm font-medium
              text-gray-700
              hover:bg-gray-100
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={priceLoading}
            className="
              rounded-lg bg-[#004b91]
              px-5 py-2
              text-sm font-medium text-white
              hover:bg-[#00386d]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {priceLoading
              ? "Loading..."
              : "Save"}
          </button>
        </div>
      </div>
    </PanelPopup>
  );
};

export default CartPopupEdit;