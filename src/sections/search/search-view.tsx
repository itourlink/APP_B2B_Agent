import { useLocation } from "react-router-dom";
import { useListTourPublish, useListTourSeries } from "@/hooks/actions/useTour";
import { TourListCard } from "./tour-list-card";
import { useListHotel, useSearchHotel } from "@/hooks/actions/useHotel";
import SearchFilter from "./search-filter";
import { useEffect, useMemo, useState } from "react";
import Pagination from "@/components/pagination/pagination";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { useUser } from "@/hooks/actions/useAuth";
import HotelListRowCard from "./hotel-list-row-card";
import TourSearch from "../tour/components/tour-search";
import HotelSearch from "../hotel/components/hotel-search";
import { HotelCard } from "../hotel/components/hotel-card";
import { useTranslate } from "@/locales";
import { useCurrency } from "@/components/currency/useCurrency";
import { useListCurrency } from "@/components/currency/useListCurrency";
import TourListSeries from "./tour-list-series";
import { useRouter } from "@/routes/hooks/use-router";

const SearchView = () => {
  const router = useRouter()
  const { t } = useTranslate("search")
  const { currencyId } = useCurrency();
  const { selectedCurrency } = useListCurrency();
  const location = useLocation();
  const state = (location.state || {}) as any;
  const searchType =
    new URLSearchParams(location.search)
      .get("type");
  const isSeries = state?.isTourSeries;
  const searchTourPayload = state?.isSearchTour || {};
  const searchSnapshot = state?.tourSearchState
    ? JSON.parse(state.tourSearchState)
    : null;
  const hotelSearchSnapshot =
    state?.hotelSearchState
      ? JSON.parse(state.hotelSearchState)
      : null;
  const [pageSeries, setPageSeries] = useState(1);
  const [pageTour, setPageTour] = useState(1);
  const [pageHotel, setPageHotel] = useState(1);
  const mode = state?.mode; // "quick" | "list"
  const isQuick = mode === "quick";
  const isSearchHotel = mode === "quick" || state?.isSearchHotel;
  // const pageSize = 5;

  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPageSeries(1);
    setPageTour(1);
    setPageHotel(1);
  };

  const getTotalPages = (listData: any, pageSize: number) => {
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    return Math.ceil(totalRecords / pageSize);
  };

  // ================= TOUR FILTER STATE =================
  const [tourFilter, setTourFilter] = useState({
    intCateID: searchTourPayload?.intCateID ?? null,

    intProductID: searchTourPayload?.intProductID ?? null,

    strNoOfDayRange: null,
    strFilterServiceName: null,
    strListEasiaCateID: null,
    strListTransportOptionID: null,

    strLocationCode: searchTourPayload?.strLocationCode ?? null,

    dtmFilterDateValidFrom: searchTourPayload?.dtmFilterDateValidFrom ?? null,

    dtmFilterDateValidTo: searchTourPayload?.dtmFilterDateValidTo ?? null,

    strPriceFromRange: null,
  });

  // ================= SERIES FILTER STATE =================
  const [seriesFilter, setSeriesFilter] = useState({
    intCateID: searchTourPayload?.intCateID ?? null,

    intProductID: searchTourPayload?.intProductID ?? null,

    strNoOfDayRange: null,
    strFilterServiceName: null,
    strListEasiaCateID: null,
    strListTransportOptionID: null,

    strPriceFromRange: null,

    intNoOfAdult: searchTourPayload?.intNoOfAdult,

    strListNoOfChild: searchTourPayload?.strListNoOfChild,

    intNoOfSGLSup: searchTourPayload?.intNoOfSGLSup,

    intNoOfTPLRec: searchTourPayload?.intNoOfTPLRec,

    strLocationCode: searchTourPayload?.strLocationCode ?? null,

    dtmFilterDateValidFrom: searchTourPayload?.dtmFilterDateValidFrom ?? null,

    dtmFilterDateValidTo: searchTourPayload?.dtmFilterDateValidTo ?? null,
  });

  const [hotelFilter, setHotelFilter] = useState({
    strFilterSupplierName: null,
    strPriceFromRange: null,
    strListEasiaCateID: null,
  });

  // ================= TEMP FILTER =================
  const [tempTourFilter, setTempTourFilter] = useState(tourFilter);
  const hotelParams =
    hotelSearchSnapshot?.draftFilters ||
    state?.isSearchHotel ||
    {};
  const [tempSeriesFilter, setTempSeriesFilter] = useState(seriesFilter);

  const [tempHotelFilter, setTempHotelFilter] = useState(hotelFilter);

  useEffect(() => {
    setTempHotelFilter(hotelFilter);
  }, [hotelFilter]);

  useEffect(() => {
    setTempSeriesFilter(seriesFilter);
  }, [seriesFilter]);

  useEffect(() => {
    setTempTourFilter(tourFilter);
  }, [tourFilter]);

  // ================= API =================

  const { tdpData, tdpLoading } = useListTourPublish(
    !isSeries && !isSearchHotel
      ? {
        ...searchTourPayload,
        page: pageTour,
        pageSize,
        ...tourFilter,
      }
      : null,
  );
  const { tsData, tsLoading } = useListTourSeries(
    isSeries
      ? {
        ...searchTourPayload,
        ...seriesFilter,
        page: pageSeries,
        pageSize,
      }
      : null,
  );

  const { coData } = useListCompanyOwner();
  const { user } = useUser();

  // QUICK HOTEL
  const quickHotel = useSearchHotel(
    isQuick
      ? {
        intCurPage: pageHotel,
        intPageSize: pageSize,

        strCompanyOwnerGUID: coData?.strCompanyGUID,
        strCompanyPartnerGUID: user?.strCompanyGUID,
        intCurrencyID: currencyId,

        ...hotelParams,

        strFilterSupplierName:
          hotelFilter?.strFilterSupplierName ||
          hotelParams?.strFilterDestinationName ||
          null,

        strListEasiaCateID:
          hotelFilter?.strListEasiaCateID,

        strPriceFromRange:
          hotelFilter?.strPriceFromRange,

        strOrder: null,
        strSupplierGUID: null,
        tblsReturn: "[0],[1],[2]",
      }
      : undefined
  );
  // LIST HOTEL
  const listHotel = useListHotel(
    !isQuick
      ? {
        strCompanyPartnerGUID: user?.strCompanyGUID,
        strCompanyOwnerGUID: coData?.strCompanyGUID,
        intCurrencyID: currencyId,

        ...hotelParams,

        strFilterSupplierName:
          hotelFilter?.strFilterSupplierName ||
          hotelParams?.strFilterDestinationName ||
          null,

        strPriceFromRange:
          hotelFilter?.strPriceFromRange,

        strListEasiaCateID:
          hotelFilter?.strListEasiaCateID,

        page: pageHotel,
        pageSize: pageSize,
        tblsReturn: "[0]",
      }
      : undefined
  );

  const tsTotalPages = getTotalPages(tsData, pageSize);
  const tourTotalPages = getTotalPages(tdpData, pageSize);
  const quickHotelTotalPages = getTotalPages(
    quickHotel.searchData,
    pageSize
  );

  const listHotelTotalPages = getTotalPages(
    listHotel.hotelData,
    pageSize
  );

  // ================= RESET PAGE =================
  useEffect(() => {
    setPageSeries(1);
    setPageTour(1);
    setPageHotel(1);
  }, [isSeries, isSearchHotel]);

  // ================= RAW DATA =================
  const rawData = useMemo(() => {
    if (isSeries) return tsData || [];

    if (isSearchHotel) {
      return isQuick
        ? quickHotel.searchData || []
        : listHotel.hotelData || [];
    }

    return tdpData || [];
  }, [
    tsData,
    tdpData,
    quickHotel.searchData,
    listHotel.hotelData,
    isSeries,
    isSearchHotel,
    isQuick,
  ]);

  // ================= PAGE FIX =================
  useEffect(() => {
    const totalPages = getTotalPages(tsData, pageSize);

    if (pageSeries > totalPages && totalPages > 0) {
      setPageSeries(1);
    }
  }, [tsData, pageSeries]);

  useEffect(() => {
    const totalPages = getTotalPages(tdpData, pageSize);

    if (pageTour > totalPages && totalPages > 0) {
      setPageTour(1);
    }
  }, [tdpData, pageTour]);

  useEffect(() => {

    const hotelSource = isQuick
      ? quickHotel.searchData
      : listHotel.hotelData;

    const totalPages = getTotalPages(
      hotelSource,
      pageSize
      // isQuick ? pageSize : 12
    );

    if (pageHotel > totalPages && totalPages > 0) {
      setPageHotel(1);
    }

  }, [
    quickHotel.searchData,
    listHotel.hotelData,
    pageHotel,
    isQuick,
    pageSize,
  ]);

  // ================= LOADING =================
  const hotelLoadingState = isQuick
    ? quickHotel.searchLoading
    : listHotel.hotelLoading;

  const loading =
    tsLoading ||
    tdpLoading ||
    hotelLoadingState;

  const resultCount = rawData?.[0]?.intTotalRecords || 0;

  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});

  useEffect(() => {
    const nextPayload =
      searchSnapshot?.draftFilters2 ||
      state?.isSearchTour ||
      {};

    setTourFilter({
      intCateID: nextPayload?.intCateID ?? null,
      intProductID: nextPayload?.intProductID ?? null,
      strNoOfDayRange: null,
      strFilterServiceName: null,
      strListEasiaCateID: null,
      strListTransportOptionID: null,
      strLocationCode: nextPayload?.strLocationCode ?? null,
      dtmFilterDateValidFrom: nextPayload?.dtmFilterDateValidFrom ?? null,
      dtmFilterDateValidTo: nextPayload?.dtmFilterDateValidTo ?? null,
      strPriceFromRange: null,
    });

    setSeriesFilter({
      intCateID: nextPayload?.intCateID ?? null,
      intProductID: nextPayload?.intProductID ?? null,
      strNoOfDayRange: null,
      strFilterServiceName: null,
      strListEasiaCateID: null,
      strListTransportOptionID: null,
      strPriceFromRange: null,
      intNoOfAdult: nextPayload?.intNoOfAdult,
      strListNoOfChild: nextPayload?.strListNoOfChild,
      intNoOfSGLSup: nextPayload?.intNoOfSGLSup,
      intNoOfTPLRec: nextPayload?.intNoOfTPLRec,
      strLocationCode: nextPayload?.strLocationCode ?? null,
      dtmFilterDateValidFrom: nextPayload?.dtmFilterDateValidFrom ?? null,
      dtmFilterDateValidTo: nextPayload?.dtmFilterDateValidTo ?? null,
    });

    // HOTEL

    setHotelFilter({
      strFilterSupplierName: null,
      strPriceFromRange: null,
      strListEasiaCateID: null,
    });

    setPageSeries(1);
    setPageTour(1);
    setPageHotel(1);

  }, [location.key]);

  const getDateRange = (from: string, to: string) => {
    const dates: string[] = [];

    const current = new Date(from);
    const end = new Date(to);

    while (current <= end) {
      dates.push(current.toISOString());
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const payloadSearch = searchSnapshot?.filters;

  return (
    <div className="">
      <div className="sticky top-30 z-[49] mt-[-50px]">
        {searchType === "tour" && (
          <TourSearch />
        )}

        {searchType === "hotel" && (
          <HotelSearch initialHotel={hotelFilter} />
        )}
      </div>

      <div className="mt-20 max-w-7xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FILTER */}
          <div className="lg:col-span-3">
            <SearchFilter
              isSeries={isSeries}
              isHotel={isSearchHotel}
              isQuick={isQuick}

              tourFilter={
                isSearchHotel
                  ? tempHotelFilter
                  : tempTourFilter
              }

              setTourFilter={
                isSearchHotel
                  ? setTempHotelFilter
                  : setTempTourFilter
              }

              seriesFilter={tempSeriesFilter}
              setSeriesFilter={setTempSeriesFilter}

              onApply={() => {
                if (isSeries) {
                  setSeriesFilter({
                    ...tempSeriesFilter,
                  });

                  setPageSeries(1);

                } else if (isSearchHotel) {

                  setHotelFilter({
                    ...tempHotelFilter,
                  });

                  setPageHotel(1);

                } else {

                  setTourFilter({
                    ...tempTourFilter,
                  });

                  setPageTour(1);
                }
              }}
            />
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-9">
            <div className="text-2xl font-semibold mb-6">
              {loading ? t("loading") : t("searchResultCount", { count: resultCount })}
            </div>

            <TourListSeries
              loading={tsLoading}
              data={rawData}
              pageSeries={pageSeries}
              setPageSeries={setPageSeries}
              tsTotalPages={tsTotalPages}
              tsData={tsData}
              handlePageSizeChange={handlePageSizeChange}
              payloadSearch={payloadSearch}
              searchTourPayload={searchTourPayload}
              seriesFilter={seriesFilter}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              selectedCurrency={selectedCurrency}
              router={router}
              t={t}
              getDateRange={getDateRange}
              isSeries={isSeries}
            />

            {/* HOTEL */}
            {isSearchHotel && (
              <>
                {hotelLoadingState ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                  </div>
                ) : (
                  <>
                    {/* QUICK MODE */}
                    {isQuick ? (
                      <>
                        {quickHotel.searchData?.length > 0 ? (
                          <div className="grid grid-cols-3 gap-6">
                            {quickHotel.searchData.map((item: any) => (
                              <HotelCard
                                key={item?.strSupplierGUID}
                                hotel={item}
                                hotelLoading={hotelLoadingState}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="w-full py-20 flex items-center justify-center text-gray-500">
                            {t("noHotelData")}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {listHotel.hotelData?.length > 0 ? (
                          <div className="flex flex-col gap-4">
                            {listHotel.hotelData.map((item: any) => (
                              <HotelListRowCard
                                key={item?.strSupplierGUID}
                                hotel={item}
                                hotelLoading={hotelLoadingState}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="w-full py-20 flex items-center justify-center text-gray-500">
                            {t("noHotelData")}
                          </div>
                        )}
                      </>
                    )}

                    {/* PAGINATION */}
                    <Pagination
                      currentPage={pageHotel}
                      onPageChange={setPageHotel}
                      totalPages={
                        isQuick
                          ? quickHotelTotalPages || 1
                          : listHotelTotalPages || 1
                      }

                      totalRecords={
                        isQuick
                          ? quickHotel.searchData?.[0]?.intTotalRecords || 0
                          : listHotel.hotelData?.[0]?.intTotalRecords || 0
                      }
                      recordsPerPage={pageSize}
                      onRecordsPerPageChange={handlePageSizeChange}
                    />
                  </>
                )}
              </>
            )}

            {/* TOUR */}
            {!loading && !isSeries && !isSearchHotel && (
              <div className="grid grid-cols-3 gap-6">
                {rawData.map((item: any) => (
                  <TourListCard key={item?.strTourGUID} tour={item} />
                ))}
              </div>
            )}
            {!isSeries && !isSearchHotel && !tdpLoading && (
              <Pagination
                currentPage={pageTour}
                onPageChange={setPageTour}
                totalPages={tourTotalPages || 1}
                totalRecords={tdpData?.[0]?.intTotalRecords || 0}
                recordsPerPage={pageSize}
                onRecordsPerPageChange={handlePageSizeChange}
              />
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default SearchView;
