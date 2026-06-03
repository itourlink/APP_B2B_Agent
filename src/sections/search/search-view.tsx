import { useLocation } from "react-router-dom";
import { useListTourPublish, useListTourSeries } from "@/hooks/actions/useTour";
import { TourListCard } from "./tour-list-card";
import { useListHotel, useSearchHotel } from "@/hooks/actions/useHotel";
import { HotelCard } from "../hotel/components/hotel-list";
import SearchFilter from "./search-filter";
import { useEffect, useMemo, useState } from "react";
import { isValidValue } from "@/utils/utilts";
import { getUrlImage } from "@/utils/format-image";
import { Calendar, Clock, Flag, MapPin, Users } from "lucide-react";
import Pagination from "@/components/pagination/pagination";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { useUser } from "@/hooks/actions/useAuth";
import HotelListRowCard from "./hotel-list-row-card";
import TourSearch from "../tour/components/tour-search";
import HotelSearch from "../hotel/components/hotel-search";

const SearchView = () => {
  const router = useRouter();
  const location = useLocation();
  const state = (location.state || {}) as any;
  const searchType =
    new URLSearchParams(location.search)
      .get("type");
  const isSeries = state?.isTourSeries;
  const searchTourPayload = state?.isSearchTour || {};

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
  // const hotelParams = state?.hotelParams;
  const hotelParams = state?.isSearchHotel || {};
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
        intCurrencyID: user?.intCurrencyID,

        ...hotelParams,

        strFilterSupplierName:
          hotelFilter?.strFilterSupplierName ||
          hotelParams?.strFilterDestinationName,

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
        intCurrencyID: user?.intCurrencyID,

        ...hotelParams,

        strFilterSupplierName:
          hotelFilter?.strFilterSupplierName ||
          hotelParams?.strFilterDestinationName,

        strPriceFromRange:
          hotelFilter?.strPriceFromRange,

        strListEasiaCateID:
          hotelFilter?.strListEasiaCateID,

        intCurPage: pageHotel,
        intPageSize: pageSize,
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

  useEffect(() => {
    const nextPayload = state?.isSearchTour || {};

    setTourFilter({
      intCateID: nextPayload?.intCateID ?? null,

      intProductID: nextPayload?.intProductID ?? null,

      strNoOfDayRange: null,
      strFilterServiceName: null,
      strListEasiaCateID: null,
      strListTransportOptionID: null,

      strLocationCode:
        nextPayload?.strLocationCode ?? null,

      dtmFilterDateValidFrom:
        nextPayload?.dtmFilterDateValidFrom ?? null,

      dtmFilterDateValidTo:
        nextPayload?.dtmFilterDateValidTo ?? null,

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

      intNoOfAdult:
        nextPayload?.intNoOfAdult,

      strListNoOfChild:
        nextPayload?.strListNoOfChild,

      intNoOfSGLSup:
        nextPayload?.intNoOfSGLSup,

      intNoOfTPLRec:
        nextPayload?.intNoOfTPLRec,

      strLocationCode:
        nextPayload?.strLocationCode ?? null,

      dtmFilterDateValidFrom:
        nextPayload?.dtmFilterDateValidFrom ?? null,

      dtmFilterDateValidTo:
        nextPayload?.dtmFilterDateValidTo ?? null,
    });

    setPageSeries(1);
    setPageTour(1);
    setPageHotel(1);

  }, [location.key]);


  return (
    <div className="">
      <div className="sticky top-30 z-[49] mt-[-50px]">
        {searchType === "tour" && (
          <TourSearch />
        )}

        {searchType === "hotel" && (
          <HotelSearch />
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
              {loading ? "Loading..." : `Tìm thấy ${resultCount} kết quả`}
            </div>

            {resultCount === 0 && !loading && (
              <div className="text-center py-10 text-gray-500">
                Tìm thấy 0 kết quả
              </div>
            )}

            {/* SERIES */}
            {tsLoading && isSeries && (
              <div className="flex items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
              </div>
            )}

            {!tsLoading && !!isSeries && (
              <div className="grid gap-6">
                {rawData?.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="max-w-4xl mx-auto border border-gray-200 rounded-2xl p-6 flex gap-6 bg-white shadow-sm font-sans"
                    >
                      {/* IMAGE */}
                      <div className="w-1/3">
                        <img
                          src={getUrlImage(isValidValue(item?.strTourImageUrl))}
                          alt={isValidValue(item?.strTourName)}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800 uppercase mb-4">
                            {isValidValue(item?.strTourName)}
                          </h2>

                          <div className="flex gap-4 mb-4">
                            <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-48">
                              <option>
                                {isValidValue(item?.strEasiaCateName)}
                              </option>
                            </select>

                            <div className="border border-gray-300 rounded px-3 py-1 text-sm flex items-center gap-2 bg-white w-48">
                              <Calendar size={14} />

                              <span>{isValidValue(item?.dtmDateStarted)}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Flag size={16} />

                              <span>
                                Bởi:
                                <span className="font-medium ml-1">
                                  {isValidValue(item?.strOwnerCompanyName)}
                                </span>
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Users size={16} />

                              <span>Tổng: {isValidValue(item?.intPaxMax)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock size={16} />

                              <span>
                                Thời lượng: {isValidValue(item?.intNoOfDay)}{" "}
                                Days
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-bold">
                                Đã bán: {isValidValue(item?.intTotalPaxUsed)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin size={16} />

                              <span>
                                Các điểm đến:{" "}
                                {isValidValue(item?.strListTourDestinationName)}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="text-blue-600 font-bold">
                                + Trống: {isValidValue(item?.intTotalPaxRemain)}
                              </div>

                              <div className="text-blue-600 font-bold">
                                + Giữ chỗ: {isValidValue(item?.intTotalPaxHold)}
                              </div>
                            </div>
                          </div>

                          <span className="inline-block mt-4 px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-xs font-medium">
                            {isValidValue(item?.strTourTypeName) ||
                              "Tour hằng ngày"}
                          </span>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="w-1/4 flex flex-col items-center justify-center border-l border-gray-100 pl-6">
                        <div className="text-gray-700 font-bold text-lg mb-1">
                          Giá :
                        </div>

                        <div className="text-blue-600 text-3xl font-extrabold mb-4">
                          ${isValidValue(item?.dblTotalPrice)}
                        </div>

                        <button
                          onClick={() => router.push(paths.content.agent)}
                          className="cursor-pointer w-full py-2 border border-gray-300 rounded-full text-blue-500 font-semibold hover:bg-blue-50 transition-colors"
                        >
                          Đặt Ngay
                        </button>

                        <button className="mt-2 text-xs font-bold text-black uppercase bg-gray-100 px-2 py-1 rounded shadow-inner">
                          Tăng giá/Giảm giá
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {isSeries && !tsLoading && (
              <Pagination
                currentPage={pageSeries}
                onPageChange={setPageSeries}
                totalPages={tsTotalPages || 1}
                totalRecords={tsData?.[0]?.intTotalRecords || 0 } 
                onRecordsPerPageChange={handlePageSizeChange}
              />
            )}

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
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="w-full py-20 flex items-center justify-center text-gray-500">
                            Không có dữ liệu Khách sạn
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
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="w-full py-20 flex items-center justify-center text-gray-500">
                            Không có dữ liệu Khách sạn
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
                totalRecords = {tdpData?.[0]?.intTotalRecords || 0 }
                recordsPerPage={pageSize}
                onRecordsPerPageChange={handlePageSizeChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchView;
