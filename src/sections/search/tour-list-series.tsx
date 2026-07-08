import Pagination from "@/components/pagination/pagination";
import TourSeriesCard from "./tour-series-card";

type TourListSeriesProps = {
    loading: boolean;
    data: any[];
    pageSeries: number;
    setPageSeries: (page: number) => void;
    tsTotalPages: number;
    tsData: any[];
    handlePageSizeChange: (value: number) => void;

    payloadSearch: any;
    searchTourPayload: any;
    seriesFilter: any;

    selectedDates: Record<string, string>;
    setSelectedDates: React.Dispatch<
        React.SetStateAction<Record<string, string>>
    >;

    selectedCurrency: any;

    router: any;
    t: any;

    getDateRange: (from: string, to: string) => string[];

    isSeries: boolean;
};

const TourListSeries = ({
    loading,
    data,
    pageSeries,
    setPageSeries,
    tsTotalPages,
    tsData,
    handlePageSizeChange,
    payloadSearch,
    searchTourPayload,
    seriesFilter,
    selectedDates,
    setSelectedDates,
    selectedCurrency,
    router,
    t,
    getDateRange,
    isSeries,
}: TourListSeriesProps) => {

    return (
        <div>
            {/* SERIES */}
            {loading && isSeries && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                </div>
            )}

            {!loading && isSeries && (
                <div className="grid gap-6">
                    {data?.map((item, index) => (
                        <TourSeriesCard
                            key={item?.strTourGUID ?? index}
                            item={item}
                            index={index}

                            payloadSearch={payloadSearch}
                            searchTourPayload={searchTourPayload}
                            seriesFilter={seriesFilter}

                            selectedDates={selectedDates}
                            setSelectedDates={setSelectedDates}

                            selectedCurrency={selectedCurrency}

                            router={router}
                            t={t}

                            getDateRange={getDateRange}
                        />
                    ))}
                </div>
            )}

            {isSeries && !loading && (
                <Pagination
                    currentPage={pageSeries}
                    onPageChange={setPageSeries}
                    totalPages={tsTotalPages || 1}
                    totalRecords={tsData?.[0]?.intTotalRecords || 0}
                    onRecordsPerPageChange={handlePageSizeChange}
                />
            )}
        </div>
    );
};

export default TourListSeries;