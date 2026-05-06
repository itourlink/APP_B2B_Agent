import { useEffect, useState } from "react";
import { Flag, RotateCcw, Search, Tag } from "lucide-react";
import PrimaryButton from "@/components/button/primary-button";
import CustomFilter from "@/components/form/custom-filter";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListBookingRequest } from "@/hooks/actions/useUser";
import { fDateTime } from "@/utils/format-time";
import { useUserStore } from "@/zustand/useUserStore";
import Pagination from "@/components/pagination/pagination";

const RequestDone = () => {
  const router = useRouter()
  const [filters, setFilters] = useState({
    idRequest: ""
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const user = useUserStore((state) => state.user);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { data, isError, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER.LIST_BOOKING_REQUEST, page, appliedFilters],
    queryFn: () =>
      useListBookingRequest({
        strBookingRequestGUID: null,
        strCompanyGUID: user?.strCompanyGUID,
        strListRequestProcessID: "3,4",
        strFilterBookingRequestCode: appliedFilters?.idRequest || null,
        IsAgent: true,
        strOrder: null,
        intCurPage: page,
        intPageSize: pageSize,
        tblsReturn: "[0][1]"
      }),
    placeholderData: keepPreviousData,
  });
  const listData = data;

  const totalRecords = listData?.[0]?.[0]?.intTotalRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalPages]);

  const handleSearch = () => {
    setAppliedFilters(filters)
    setPage(1)
  };

  const handleReset = () => {
    const defaultFilters = {
      idRequest: "",
    };

    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
  };

  const onChangeFilters = (key: string, value: string | number) => {
    let newValue: string | number = value;

    setFilters((prev) => ({
      ...prev,
      [key]: String(newValue),
    }));
  };

  function getCategory(html: string): string | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const div = doc.querySelector("div");
    if (!div) return null;

    const text = div.textContent || "";
    return text.replace("Category:", "").trim();
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CustomFilter
          onChangeFilters={onChangeFilters}

          search={[
            {
              keySearch: "idRequest",
              value: filters.idRequest,
              placeHoder: "Mã yêu cầu",
            },

          ]}

        />

        <div className="flex gap-2">
          <PrimaryButton
            text="Tìm kiếm"
            onClick={handleSearch}
            className="bg-[#4e6d9a] hover:bg-[#3d567a] rounded-lg px-6 py-2 text-sm w-fit font-medium text-white shadow-sm transition-all"
            prefixIcon={<Search size={18} />}
          />

          <PrimaryButton
            text="Reset"
            onClick={handleReset}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-6 py-2 text-sm w-fit font-medium transition-all border border-gray-200"
            prefixIcon={<RotateCcw size={18} />}
          />
        </div>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse"
          >
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>

            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="px-6 py-5 flex justify-between">
                <div className="flex gap-6">
                  <div className="h-4 w-4 bg-gray-200 rounded" />
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-40 bg-gray-200 rounded" />
                  </div>
                </div>

                <div className="h-4 w-24 bg-gray-200 rounded" />

                <div className="flex gap-6">
                  <div className="h-4 w-10 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        listData?.[0]?.map((header: any, index: number) => {

          const filteredItems = listData?.[1]?.filter(
            (item: any) =>
              item.strBookingRequestCode === header.strBookingRequestCode
          ) || [];

          return (
            <div key={header.strBookingRequestGUID || index}>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#004b91] font-bold">
                    <Flag size={18} fill="currentColor" />

                    <button
                      onClick={() => router.replaceParams(paths.content.detailRequest, { strBookingRequestGUID: header?.strBookingRequestGUID })}
                      className="uppercase tracking-wide cursor-pointer hover:underline decoration-blue-200 underline-offset-4"
                    >
                      {header.strCompanyName}
                    </button>

                    <span className="text-gray-400 font-normal ml-2">
                      #{header.strBookingRequestCode}
                    </span>
                  </div>

                  <button className="text-[#0066b2] bg-blue-50 px-3 py-1 rounded-md text-xs font-semibold">
                    {header.strRequestProcessName}
                  </button>
                </div>

                {filteredItems.map((item: any, i: number) => (
                  <div key={item.strBookingRequestItemGUID || i}
                    className="px-6 py-5 flex items-center justify-between">

                    <div className="flex items-center gap-6">
                      <span className="text-gray-400">{i + 1}</span>

                      <div>
                        <h4 className="font-bold text-gray-800 text-[15px]">{item.strServiceName}</h4>
                        <p className="text-sm text-gray-500">
                          {fDateTime(item.dtmDateFrom)} - {fDateTime(item.dtmDateTo)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <span>Category:</span>
                      <Tag size={14} className="text-yellow-500 fill-yellow-500" />
                      <span>
                        {getCategory(item.strType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-12">
                      <span className="text-gray-700">
                        {typeof item?.intQuantity === "object" ? "---" : item?.intQuantity}
                      </span>

                      <div>
                        {new Intl.NumberFormat('vi-VN').format(item?.dblPriceTotal || 0)} đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )
        })
      )}

      {!isError && (
        <Pagination
          currentPage={page}
          onPageChange={(value) => setPage(value)}
          totalPages={totalPages || 1}
        />
      )}

    </div>
  );
};

export default RequestDone;