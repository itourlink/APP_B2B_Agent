import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PanelPopup from "@/components/popup/panel-popup";
import { fetchListPrice, useListCurrency } from "@/hooks/actions/useBooking";
import { fetchDetailTour } from "@/hooks/actions/useTour";
import { useUserStore } from "@/zustand/useUserStore";
import { isValidValue } from "@/utils/utilts";

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
  const { currencyData } = useListCurrency();
  // ================= SELECTED LEVEL =================
  const [selectedLevel, setSelectedLevel] = useState("");
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
  const detailTour = tourDetail?.[0]?.[0];

  // ================= PRICE LEVEL =================
  const {
    data: priceLevels,
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
      title="Payment"
      className="max-w-[420px]"
    >
      <div className="space-y-4">

        {/* ================= FORM ================= */}
        <div className="grid grid-cols-2 gap-4">

          {/* TOUR LEVEL */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-gray-700">
              Hạng Tour
            </label>

            <select
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(e.target.value)
              }
              className=" cursor-pointer
                h-10 w-full rounded
                border border-gray-300
                bg-white px-3
                text-sm outline-none
                focus:border-[#004b91]
            "
            >
              <option className="cursor-pointer" value={selectedLevel}>
                {Array(
                  Number(detailTour?.strListEasiaCateID || 0)
                )
                  .fill("★")
                  .join("")}
              </option>
            </select>
          </div>

          {/* JOIN TYPE */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-gray-700">
              Join Type
            </label>

            <select
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(e.target.value)
              }
              className="
              cursor-pointer
            h-10 w-full rounded
            border border-gray-300
            bg-white px-3
            text-sm outline-none
            focus:border-[#004b91]
        "
            >
              {priceLevels?.[0]?.map((item: any) => (
                <option
                  key={item?.strTourPriceItemLevelGUID}
                  value={item?.strTourPriceItemLevelGUID}
                >
                  {item?.strJoinTypeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= PRICE INFO ================= */}
        <div className="space-y-1">
          <div className="text-[28px] font-bold text-[#1f73ff]">
            Tổng giá:
            {" "}
            {currencyData?.strCurrencySymbol} {' '}
            {Number(
              currentPrice?.dblTotalPrice || 0
            ).toLocaleString("en-US")}
          </div>

          <div className="text-sm text-gray-500">
            (Số tiền hoa hồng:
            {" "}
            <span className="font-semibold text-red-500">
              {currencyData?.strCurrencySymbol} {' '}
              {(isValidValue((currentPrice?.dblTotalPriceCom || 0)))}
            </span>
            )
          </div>

          <div className="text-sm font-medium text-orange-500">
            Còn lại {isValidValue((currentPrice?.intPaxRemain || 0))} Pax
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-start pt-2">
          <button
            type="button"
            className="
            cursor-pointer
          rounded bg-[#004b91]
          px-5 py-2
          text-sm font-medium text-white
          hover:bg-[#00386d]
        "
          >
            Save
          </button>
        </div>
      </div>
    </PanelPopup>
  );
};

export default CartPopupEdit;