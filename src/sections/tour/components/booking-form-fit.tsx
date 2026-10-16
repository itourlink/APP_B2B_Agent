import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CalendarDays, ChevronDown, ChevronUp, Filter, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import PrimaryButton from "@/components/button/primary-button";
import { useCurrency } from "@/components/currency/useCurrency";
import { useListCurrency } from "@/components/currency/useListCurrency";
import { Select } from "@/components/form/select";
import DateRangePopup from "@/components/generic-filter/date-range-popup";
import GuestRoomPopup from "@/components/generic-filter/guess-room-popup";
import Pagination from "@/components/pagination/pagination";
import PanelPopup from "@/components/popup/panel-popup";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUser } from "@/hooks/actions/useAuth";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { addCartForTour } from "@/hooks/actions/useCart";
import { useListFixedTourDepartures } from "@/hooks/actions/useTour";
import { useTranslate } from "@/locales";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { fCurrency } from "@/utils/format-number";
import { useToastStore } from "@/zustand/useToastStore";

type FixedTourItem = {
  strTourGUID?: string;
  strTourName?: string;
  strServiceName?: string;
  strPriceLevelGUID?: string;
  strListStarCateID?: string;
  strListEasiaCateID?: string;
  dblPriceFrom?: number;
  intNoOfDay?: number;
  IsHasPriceKid?: boolean;
};

type FixedDeparture = {
  No?: number;
  strTourGUID?: string;
  strDepartureTourLevelGUID?: string;
  strTourPriceItemLevelGUID?: string;
  dtmRealStartDate?: string | Date;
  dtmDateFrom?: string | Date;
  strDateStart?: string;
  dtmStartDate?: string | Date;
  dtmRealEndDate?: string | Date;
  dtmDateTo?: string | Date;
  dtmDateBookingBefore?: string | Date;
  dtmCreatedDate?: string | Date;
  dtmLastUpdatedDate?: string | Date;
  intTotalPaxRemain?: number;
  intPaxRemain?: number;
  intEasiaCateID?: number;
  intStarCateID?: number;
  strEasiaCateName?: string;
  strDayStatusName?: string;
  strPaxStatusName?: string;
  dblUnitPrice?: number;
  dblTotalPrice?: number;
  dblTotalPriceCom?: number;
  dblCommissionPrice?: number;
  dblTotalExtraCommissionPrice?: number;
};

interface Props {
  item?: FixedTourItem;
}

type GuestValue = {
  rooms: number;
  adults: number;
  children: number;
  childAges: number[];
  roomTypes: {
    sgl: number;
    dbl: number;
    twn: number;
    tpl: number;
  };
};

type CalendarView = "calendar" | "list";
type CalendarPickerMode = "month" | "year" | null;

const parseApiDate = (value?: string | number | Date | null): Date | null => {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const dotNetMatch = String(value).match(
    /\/Date\((-?\d+)(?:[+-]\d{4})?\)\//
  );
  const parsed = dotNetMatch ? new Date(Number(dotNetMatch[1])) : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getDepartureDate = (departure?: FixedDeparture | null): Date | null => {
  const value =
    departure?.dtmDateFrom ??
    departure?.dtmRealStartDate ??
    departure?.strDateStart ??
    departure?.dtmStartDate;

  return parseApiDate(value);
};

const getDepartureEndDate = (
  departure?: FixedDeparture | null
): Date | null => {
  return parseApiDate(departure?.dtmDateTo ?? departure?.dtmRealEndDate);
};

const getBookingBeforeDate = (
  departure?: FixedDeparture | null
): Date | null => parseApiDate(departure?.dtmDateBookingBefore);

const getDepartureKey = (departure?: FixedDeparture | null) =>
  departure?.strDepartureTourLevelGUID ??
  departure?.strTourPriceItemLevelGUID ??
  `${departure?.strTourGUID ?? "tour"}-${getDepartureDate(departure)?.toISOString() ?? "date"}-${departure?.No ?? 0}`;

const getRemainingPax = (departure?: FixedDeparture | null) =>
  Number(departure?.intTotalPaxRemain ?? departure?.intPaxRemain ?? 0);

const toBusinessDateIso = (date: Date | null, endOfDay = false) => {
  if (!date || Number.isNaN(date.getTime())) return undefined;

  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0
  )).toISOString();
};

const BookingFormFit = ({ item }: Props) => {
  const { t } = useTranslate("tour");
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useUser();
  const { coData } = useListCompanyOwner();
  const { currencyId } = useCurrency();
  const { selectedCurrency } = useListCurrency();
  const { showToast } = useToastStore();
  const company = new URLSearchParams(location.search).get("company") || "";

  const [guestOpen, setGuestOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<CalendarView>("calendar");
  const [listPage, setListPage] = useState(1);
  const listPageSize = 10;
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(new Date()));
  const [calendarPickerMode, setCalendarPickerMode] = useState<CalendarPickerMode>(null);
  const [calendarYearPageStart, setCalendarYearPageStart] = useState(() =>
    Math.floor(new Date().getFullYear() / 10) * 10
  );
  const [guestValue, setGuestValue] = useState<GuestValue>({
    rooms: 1,
    adults: 2,
    children: 0,
    childAges: [],
    roomTypes: { sgl: 0, dbl: 1, twn: 0, tpl: 0 },
  });

  const starList = useMemo(() => {
    const raw = item?.strListStarCateID || item?.strListEasiaCateID;
    if (!raw) return [];
    return String(raw)
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value) && value > 0);
  }, [item]);

  const [selectedStar, setSelectedStar] = useState<number | string>("");
  const [filterStar, setFilterStar] = useState<number | string>("");
  const [filterStart, setFilterStart] = useState(0);
  const [filterEnd, setFilterEnd] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [appliedFilters, setAppliedFilters] = useState({
    star: "" as number | string,
    start: 0,
    end: 0,
  });
  const [selectedDeparture, setSelectedDeparture] = useState<FixedDeparture | null>(null);
  const [draftDeparture, setDraftDeparture] = useState<FixedDeparture | null>(null);
  const effectiveStar = selectedStar || starList[0] || "";

  const defaultDepartureRange = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = addMonths(start, 12);
    end.setHours(23, 59, 59, 999);
    return { start: start.getTime(), end: end.getTime() };
  }, []);

  const queryDateRange = useMemo(() => {
    if (appliedFilters.start && appliedFilters.end) {
      return {
        start: appliedFilters.start,
        end: appliedFilters.end,
      };
    }

    if (!calendarOpen) return defaultDepartureRange;

    const start = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
    end.setHours(23, 59, 59, 999);
    return { start: start.getTime(), end: end.getTime() };
  }, [appliedFilters.end, appliedFilters.start, calendarOpen, defaultDepartureRange, visibleMonth]);

  const childAges = guestValue.childAges.join(",");
  const {
    departureData,
    totalRecords,
    totalPages,
    departureLoading,
    departureError,
    refetchDepartures,
  } =
    useListFixedTourDepartures({
      strTourGUID: item?.strTourGUID,
      intEasiaCateID: appliedFilters.star || effectiveStar || null,
      dtmDateValidFrom: queryDateRange.start,
      dtmDateValidTo: queryDateRange.end,
      intNoOfAdult: guestValue.adults,
      strListNoOfChild: childAges,
      intNoOfSGLSup: guestValue.roomTypes.sgl,
      intNoOfTPLRec: guestValue.roomTypes.tpl,
      IsHasPriceKid: Boolean(item?.IsHasPriceKid),
      viewMode: calendarView,
      page: listPage,
      pageSize: listPageSize,
      enabled: Boolean(item?.strTourGUID),
    });

  const departures = useMemo(
    () =>
      (Array.isArray(departureData) ? (departureData as FixedDeparture[]) : [])
        .filter((departure) => getDepartureDate(departure))
        .sort(
          (a, b) =>
            getDepartureDate(a)!.getTime() - getDepartureDate(b)!.getTime()
        ),
    [departureData]
  );

  const effectiveDeparture = useMemo(() => {
    const refreshedSelectedDeparture = selectedDeparture
      ? departures.find(
          (departure) =>
            getDepartureKey(departure) === getDepartureKey(selectedDeparture)
        )
      : null;

    return (
      refreshedSelectedDeparture ??
      (calendarOpen ? selectedDeparture : null) ??
      departures.find((departure) => getRemainingPax(departure) > 0) ??
      departures[0] ??
      null
    );
  }, [calendarOpen, departures, selectedDeparture]);

  const starOptions = useMemo(
    () =>
      starList.map((star) => ({
        value: star,
        label: "★".repeat(star),
      })),
    [starList]
  );

  const departuresByDay = useMemo(() => {
    return departures.reduce<Record<string, FixedDeparture[]>>((result, departure) => {
      const date = getDepartureDate(departure);
      if (!date) return result;
      const key = format(date, "yyyy-MM-dd");
      result[key] = [...(result[key] ?? []), departure];
      return result;
    }, {});
  }, [departures]);

  const calendarDays = useMemo(() => {
    const firstDay = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
    const lastDay = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: firstDay, end: lastDay });
  }, [visibleMonth]);

  const selectedDate = getDepartureDate(effectiveDeparture);
  const totalPrice =
    effectiveDeparture?.dblTotalPrice ??
    (effectiveDeparture?.dblUnitPrice != null
      ? Number(effectiveDeparture.dblUnitPrice) * guestValue.adults
      : item?.dblPriceFrom);
  const unitPrice = effectiveDeparture?.dblUnitPrice ?? item?.dblPriceFrom;
  const commissionPrice =
    effectiveDeparture?.dblTotalPriceCom ??
    effectiveDeparture?.dblCommissionPrice ??
    effectiveDeparture?.dblTotalExtraCommissionPrice ??
    0;
  const remainingPax = getRemainingPax(effectiveDeparture);

  const { mutate: addCart, isPending: addingToCart } = useMutation({
    mutationFn: addCartForTour,
  });

  const buildPayload = () => {
    const startDate = getDepartureDate(effectiveDeparture);
    const apiEndDate =
      effectiveDeparture?.dtmRealEndDate ?? effectiveDeparture?.dtmDateTo;
    const endDate = apiEndDate
      ? getDepartureDate({ dtmRealStartDate: apiEndDate })
      : startDate
        ? addDays(startDate, Math.max(Number(item?.intNoOfDay || 1) - 1, 0))
        : null;

    return {
      strCompanyPartnerGUID: user?.strCompanyGUID,
      strCompanyOwnerGUID: coData?.strCompanyGUID,
      strTourGUID: item?.strTourGUID,
      strTourPriceItemLevelGUID:
        effectiveDeparture?.strTourPriceItemLevelGUID,
      strDepartureTourLevelGUID:
        effectiveDeparture?.strDepartureTourLevelGUID,
      intAdult: guestValue.adults,
      strListChildAge: childAges,
      intSGL: guestValue.roomTypes.sgl,
      intDBL: guestValue.roomTypes.dbl,
      intTWN: guestValue.roomTypes.twn,
      intTPL: guestValue.roomTypes.tpl,
      dtmDateFrom: toBusinessDateIso(startDate),
      dtmDateTo: toBusinessDateIso(endDate, true),
      intCurrencyID: currencyId,
    };
  };

  const bookingDisabled =
    !effectiveDeparture ||
    !selectedDate ||
    !effectiveDeparture?.strTourPriceItemLevelGUID ||
    !effectiveDeparture?.strDepartureTourLevelGUID ||
    remainingPax <= 0 ||
    guestValue.adults + guestValue.children > remainingPax;

  const handleBooking = () => {
    if (bookingDisabled) return;
    router.replaceParams(paths.booking.paymentBooking, {
      item,
      price: effectiveDeparture,
      payload: buildPayload(),
      childPrices: [],
    });
  };

  const handleAddToCart = () => {
    if (bookingDisabled) return;
    addCart(buildPayload(), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART.LIST_CART] });
        showToast("success", t("addToCartSuccess"));
        router.pushQuery(paths.shop.cart.list, { company });
      },
      onError: () => showToast("error", t("addToCartFailed")),
    });
  };

  const openCalendar = () => {
    const today = new Date();
    const nextStar = filterStar || effectiveStar;

    setFilterStar(nextStar);
    setAppliedFilters((previous) => ({ ...previous, star: nextStar }));
    setCalendarView("calendar");
    setListPage(1);
    setDraftDeparture(effectiveDeparture);
    const date = getDepartureDate(effectiveDeparture);
    setVisibleMonth(startOfMonth(date || today));
    setCalendarOpen(true);
  };

  const applySelectedDeparture = () => {
    if (!draftDeparture) return;
    setSelectedDeparture(draftDeparture);
    const departureStar =
      draftDeparture?.intEasiaCateID ?? draftDeparture?.intStarCateID;
    if (departureStar) setSelectedStar(Number(departureStar));
    setCalendarOpen(false);
  };

  const applyFilters = () => {
    const nextStar = filterStar || effectiveStar;
    setShowDatePicker(false);
    setListPage(1);
    setSelectedStar(nextStar);
    setAppliedFilters({
      star: nextStar,
      start: filterStart,
      end: filterEnd,
    });
  };

  const departureColumns = useMemo<ColumnDef<FixedDeparture>[]>(
    () => [
      {
        field: "strDepartureTourLevelGUID",
        headerName: "",
        width: 44,
        algin: "center",
        render: (_, departure) => {
          const date = getDepartureDate(departure);
          const available = getRemainingPax(departure) > 0;
          const checked =
            getDepartureKey(draftDeparture) === getDepartureKey(departure);

          return (
            <input
              type="radio"
              name="fixed-departure"
              checked={checked}
              disabled={!available}
              onChange={() => setDraftDeparture(departure)}
              aria-label={`${t("selectDeparture")} ${
                date ? format(date, "dd/MM/yyyy") : ""
              }`}
              className="h-4 w-4 accent-[#257EF8]"
            />
          );
        },
      },
      {
        field: "No",
        headerName: t("no"),
        width: 60,
        algin: "start",
        render: (value, _departure, index) =>
          value === "--"
            ? (listPage - 1) * listPageSize + index + 1
            : value,
      },
      {
        field: "strDayStatusName",
        headerName: t("dayStatus"),
        width: 110,
        algin: "start",
      },
      {
        field: "strPaxStatusName",
        headerName: t("paxStatus"),
        width: 110,
        algin: "start",
      },
      {
        field: "dtmDateFrom",
        headerName: t("dateTravel"),
        width: 280,
        algin: "start",
        render: (_, departure) => {
          const startDate = getDepartureDate(departure);
          const endDate = getDepartureEndDate(departure);
          if (!startDate) return "--";

          return (
            <span className="whitespace-nowrap">
              {format(startDate, "EEE, dd MMM, yyyy")}
              {endDate ? ` - ${format(endDate, "EEE, dd MMM, yyyy")}` : ""}
            </span>
          );
        },
      },
      {
        field: "dtmDateBookingBefore",
        headerName: t("bookingBeforeDate"),
        width: 190,
        algin: "start",
        render: (_, departure) => {
          const bookingBeforeDate = getBookingBeforeDate(departure);
          return bookingBeforeDate ? (
            <span className="whitespace-nowrap">
              {format(bookingBeforeDate, "EEE, dd MMM, yyyy")}
            </span>
          ) : "--";
        },
      },
      {
        field: "dblUnitPrice",
        headerName: t("unitPrice"),
        width: 120,
        algin: "start",
        render: (_, departure) => (
          <span className="font-medium text-[#257EF8]">
            {fCurrency(departure.dblUnitPrice, selectedCurrency?.label)}
          </span>
        ),
      },
      {
        field: "intTotalPaxRemain",
        headerName: t("remain"),
        width: 90,
        algin: "start",
        render: (_, departure) => {
          const available = getRemainingPax(departure) > 0;
          return (
            <span className={available ? "text-slate-700" : "text-red-500"}>
              {available ? getRemainingPax(departure) : t("soldOut")}
            </span>
          );
        },
      },
    ],
    [draftDeparture, listPage, selectedCurrency?.label, t]
  );

  return (
    <div className="w-[280px] sticky top-24">
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{t("addTour")}</h3>
          <p className="text-[11px] text-slate-500">{t("enterCompleteInfo")}</p>
        </div>

        {departureLoading && !selectedDeparture ? (
          <div className="text-xs italic text-slate-500">{t("loadingDepartures")}</div>
        ) : departureError ? (
          <button
            type="button"
            onClick={() => refetchDepartures()}
            className="w-full rounded-lg border border-red-200 bg-red-50 p-2 text-left text-xs font-medium text-red-600"
          >
            {t("loadDeparturesFailed")}
          </button>
        ) : effectiveDeparture ? (
          <div className="space-y-1">
            <div className="text-xl font-semibold text-[#0c63e6]">
              {t("totalPrice")}: {fCurrency(totalPrice, selectedCurrency?.label)}
            </div>
            <div className="text-xs text-slate-600">
              ({t("pricePerPax")}: {fCurrency(unitPrice, selectedCurrency?.label)})
            </div>
            <div className="text-xs text-slate-600">
              ({t("commissionPrice")}: <span className="text-red-500">{fCurrency(commissionPrice, selectedCurrency?.label)}</span>)
            </div>
          </div>
        ) : appliedFilters.start ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
            {t("noDepartures")}
          </div>
        ) : (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-[#2566b0]">
            {t("selectDeparture")}
          </div>
        )}

        <div>
          <div className="mb-1 text-xs font-semibold text-slate-700">{t("startDate")}</div>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-slate-700">
                {selectedDate ? format(selectedDate, "EEE, dd MMM, yyyy") : t("selectDate")}
              </div>
              {effectiveDeparture && (
                <div className="text-xs text-slate-600">
                  ({t("remaining")}: {remainingPax} {t("pax")})
                </div>
              )}
            </div>
            <button
              type="button"
              title={t("changeDate")}
              aria-label={t("changeDate")}
              onClick={openCalendar}
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#2566b0] text-white transition hover:bg-[#1d4f8a]"
            >
              <CalendarDays size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="mb-1 text-xs font-semibold text-slate-700">{t("numberOfPeople")}</div>
          <button
            type="button"
            onClick={() => setGuestOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2 text-left">
              <Users size={14} />
              {guestValue.adults} {t("adultShort")} - {guestValue.children} {t("childShort")} - {guestValue.rooms} {t("room")}
            </span>
            {guestOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {guestOpen && (
            <div className="absolute right-full top-0 z-40 mr-3">
              <GuestRoomPopup
                isOpen
                isRoomDetail
                value={guestValue}
                onDone={(value) => {
                  setGuestValue(value);
                  setGuestOpen(false);
                }}
              />
            </div>
          )}
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold text-slate-700">{t("tourCategory")}</div>
          <Select
            options={starOptions}
            value={effectiveStar}
            onChange={(value) => {
              setSelectedStar(value);
              setFilterStar(value);
              setAppliedFilters((previous) => ({ ...previous, star: value }));
            }}
            placeholder={t("selectCategory")}
            className="py-2"
          />
        </div>

        <PrimaryButton
          type="button"
          text={t("bookNow")}
          onClick={handleBooking}
          disabled={bookingDisabled}
          className="h-10 rounded-lg bg-[#4a6fa5] py-2 hover:bg-[#3b5984]"
        />
        <PrimaryButton
          type="button"
          text={t("addToCart")}
          onClick={handleAddToCart}
          isLoading={addingToCart}
          disabled={bookingDisabled || addingToCart}
          className="h-10 rounded-lg bg-[#4a6fa5] py-2 hover:bg-[#3b5984]"
        />
      </div>

      <PanelPopup
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        title={t("changeDate")}
        className="w-[1080px]"
        bodyClassName="p-0 md:p-0"
        footer={
          <div className="flex justify-end">
            <PrimaryButton
              type="button"
              text={t("save")}
              onClick={applySelectedDeparture}
              disabled={!draftDeparture || getRemainingPax(draftDeparture) <= 0}
              className="h-9 w-fit rounded-lg bg-[#4a6fa5] px-5 py-2 hover:bg-[#3b5984]"
            />
          </div>
        }
      >
        <div className="space-y-5 p-4 md:p-6">
          <div className="text-base font-bold uppercase text-slate-800 md:text-lg">
            {item?.strTourName || item?.strServiceName}
            <span className="ml-1 normal-case text-[#257EF8]">
              ({item?.intNoOfDay || 0} {t("days")} / {Math.max(Number(item?.intNoOfDay || 1) - 1, 0)} {t("nights")})
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-[230px_300px_auto] md:items-end">
            <div>
              <div className="mb-1 text-xs font-semibold text-slate-700">{t("tourCategory")}</div>
              <Select
                options={starOptions}
                value={filterStar || effectiveStar}
                onChange={setFilterStar}
                placeholder={t("selectCategory")}
                className="py-2"
              />
            </div>
            <div>
              <div className="mb-1 text-xs font-semibold text-slate-700">{t("validFromTo")}</div>
              <div className="relative w-full md:w-[300px]" ref={datePickerRef}>
                <button
                  type="button"
                  onClick={() => setShowDatePicker((prev) => !prev)}
                  className="grid h-9 w-full cursor-pointer grid-cols-[16px_1fr_auto_1fr_16px] items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-sm text-slate-800 shadow-sm transition hover:border-gray-400"
                  aria-label={t("validFromTo")}
                >
                  <span aria-hidden="true" />
                  <span className="truncate text-right">
                    {filterStart ? format(new Date(filterStart), "dd-MM-yyyy") : ""}
                  </span>
                  <span className="text-slate-400">-</span>
                  <span className="truncate text-left">
                    {filterEnd ? format(new Date(filterEnd), "dd-MM-yyyy") : ""}
                  </span>
                  <CalendarDays size={16} className="text-slate-400" />
                </button>

                {showDatePicker && (
                  <div
                    className="absolute top-11 left-0 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DateRangePopup
                      isOpen={showDatePicker}
                      value={{
                        startDate: filterStart ? new Date(filterStart) : null,
                        endDate: filterEnd ? new Date(filterEnd) : null,
                      }}
                      minDate={null}
                      allowSameDay={true}
                      autoApply
                      onApply={(range) => {
                        if (range.startDate && range.endDate) {
                          setFilterStart(range.startDate.getTime());
                          const end = new Date(range.endDate);
                          end.setHours(23, 59, 59, 999);
                          setFilterEnd(end.getTime());
                        } else {
                          setFilterStart(0);
                          setFilterEnd(0);
                        }
                        setShowDatePicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <PrimaryButton
              type="button"
              text={t("filter")}
              prefixIcon={<Filter size={15} />}
              onClick={applyFilters}
              className="h-9 w-fit rounded-lg bg-[#4a6fa5] px-4 py-2 hover:bg-[#3b5984]"
            />
          </div>

          <div className="border-b border-gray-200 bg-slate-50 px-2">
            <button
              type="button"
              onClick={() => setCalendarView("calendar")}
              className={`px-4 py-3 text-sm font-medium ${calendarView === "calendar" ? "border-b-2 border-[#257EF8] text-[#257EF8]" : "text-slate-600"}`}
            >
              {t("calendarView")}
            </button>
            <button
              type="button"
              onClick={() => {
                setListPage(1);
                setCalendarView("list");
              }}
              className={`px-4 py-3 text-sm font-medium ${calendarView === "list" ? "border-b-2 border-[#257EF8] text-[#257EF8]" : "text-slate-600"}`}
            >
              {t("listView")}
            </button>
          </div>

          {departureLoading ? (
            <div className="flex min-h-64 items-center justify-center text-sm italic text-slate-500">
              {t("loadingDepartures")}
            </div>
          ) : departureError ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-sm text-red-600">
              <span>{t("loadDeparturesFailed")}</span>
              <button type="button" onClick={() => refetchDepartures()} className="rounded-lg border border-red-200 px-3 py-2">
                {t("tryAgain")}
              </button>
            </div>
          ) : departures.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
              {t("noDepartures")}
            </div>
          ) : calendarView === "calendar" ? (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarPickerMode(null);
                    setVisibleMonth((month) => subMonths(month, 1));
                  }}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  « {t("previousMonth")}
                </button>

                <div className="relative flex items-center font-semibold text-slate-700">
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarPickerMode((current) => current === "month" ? null : "month")
                    }
                    className="rounded-md px-2 py-1 hover:bg-slate-100"
                  >
                    {t("month")}: {format(visibleMonth, "M")}
                  </button>
                  <span>-</span>
                  <button
                    type="button"
                    onClick={() => {
                      const visibleYear = visibleMonth.getFullYear();
                      setCalendarYearPageStart(Math.floor(visibleYear / 10) * 10);
                      setCalendarPickerMode((current) => current === "year" ? null : "year");
                    }}
                    className="rounded-md px-2 py-1 hover:bg-slate-100"
                  >
                    {t("year")}: {format(visibleMonth, "yyyy")}
                  </button>

                  {calendarPickerMode === "month" && (
                    <div className="absolute left-1/2 top-9 z-40 grid w-[300px] -translate-x-1/2 grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal shadow-xl">
                      {Array.from({ length: 12 }, (_, month) => (
                        <button
                          type="button"
                          key={month}
                          onClick={() => {
                            setVisibleMonth(startOfMonth(new Date(
                              visibleMonth.getFullYear(),
                              month,
                              1
                            )));
                            setCalendarPickerMode(null);
                          }}
                          className={`rounded-md px-2 py-2 ${
                            visibleMonth.getMonth() === month
                              ? "bg-[#2566b0] text-white"
                              : "text-slate-700 hover:bg-blue-50"
                          }`}
                        >
                          {t("month")} {month + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  {calendarPickerMode === "year" && (
                    <div className="absolute left-1/2 top-9 z-40 w-[260px] -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal shadow-xl">
                      <div className="mb-2 text-center font-semibold text-slate-700">
                        {calendarYearPageStart} - {calendarYearPageStart + 9}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {Array.from({ length: 10 }, (_, index) => {
                          const year = calendarYearPageStart + index;
                          return (
                            <button
                              type="button"
                              key={year}
                              onClick={() => {
                                setVisibleMonth(startOfMonth(new Date(
                                  year,
                                  visibleMonth.getMonth(),
                                  1
                                )));
                                setCalendarPickerMode(null);
                              }}
                              className={`rounded-md px-2 py-2 ${
                                visibleMonth.getFullYear() === year
                                  ? "bg-[#2566b0] text-white"
                                  : "text-slate-700 hover:bg-blue-50"
                              }`}
                            >
                              {year}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2 flex justify-between border-t border-slate-100 pt-2">
                        <button
                          type="button"
                          onClick={() => setCalendarYearPageStart((year) => year - 10)}
                          className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100"
                        >
                          ‹ 10
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalendarYearPageStart((year) => year + 10)}
                          className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100"
                        >
                          10 ›
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCalendarPickerMode(null);
                    setVisibleMonth((month) => addMonths(month, 1));
                  }}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  {t("nextMonth")} »
                </button>
              </div>

              <div className="grid grid-cols-7 border-b border-gray-200 text-center text-xs font-semibold text-[#257EF8] md:text-sm">
                {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                  <div key={day} className="py-2">{t(day)}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((day) => {
                  const dayDepartures = departuresByDay[format(day, "yyyy-MM-dd")] ?? [];
                  const availableDeparture = dayDepartures.find((departure) => getRemainingPax(departure) > 0);
                  const displayedDeparture = availableDeparture ?? dayDepartures[0];
                  const isSelected = draftDeparture && getDepartureKey(draftDeparture) === getDepartureKey(displayedDeparture);
                  const selectable = !!availableDeparture;

                  return (
                    <button
                      type="button"
                      key={day.toISOString()}
                      disabled={!selectable}
                      onClick={() => selectable && setDraftDeparture(availableDeparture)}
                      className={`min-h-20 border-b border-r border-gray-200 p-1.5 text-left align-top transition md:min-h-28 md:p-2 ${!isSameMonth(day, visibleMonth) ? "bg-slate-50 text-slate-400" : "bg-white"} ${selectable ? "cursor-pointer hover:bg-blue-50" : "cursor-default"} ${isSelected ? "ring-2 ring-inset ring-[#257EF8]" : ""}`}
                    >
                      <span className="text-sm font-semibold">{format(day, "d")}</span>
                      {displayedDeparture && (
                        <span className="mt-2 block text-[10px] leading-4 text-slate-600 md:text-xs">
                          <span className="mb-1 flex gap-1">
                            {dayDepartures.slice(0, 5).map((departure) => (
                              <span key={getDepartureKey(departure)} className={`h-2 w-2 rounded-full ${getRemainingPax(departure) > 0 ? "border border-slate-300 bg-white" : "bg-red-300"}`} />
                            ))}
                          </span>
                          <span className="block font-medium">{fCurrency(displayedDeparture?.dblUnitPrice, selectedCurrency?.label)}</span>
                          <span className={getRemainingPax(displayedDeparture) > 0 ? "text-[#257EF8]" : "text-red-500"}>
                            {t("remaining")}: {getRemainingPax(displayedDeparture)}
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <TableCore
                rowData={departures}
                columnDefs={departureColumns}
                loading={departureLoading}
              />
              <Pagination
                currentPage={listPage}
                totalPages={totalPages}
                totalRecords={totalRecords}
                pageSize={listPageSize}
                onPageChange={setListPage}
              />
            </div>
          )}
        </div>
      </PanelPopup>
    </div>
  );
};

export default BookingFormFit;
