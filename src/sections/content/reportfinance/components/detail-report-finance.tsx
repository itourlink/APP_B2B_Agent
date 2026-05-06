import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { paths } from "@/routes/paths";
import { ArrowLeft, Calendar, ClipboardCheck, Clock } from "lucide-react";
import { fDateTime } from "@/utils/format-time";
import { useLocation } from "react-router-dom";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListBooking } from "@/hooks/actions/useUser";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter } from "@/routes/hooks/use-router";
import { useState } from "react";
import Pagination from "@/components/pagination/pagination";
import { VideoHelperPopup } from "./video-helper-popup";
import ReportPriceTab from "./report-price-tab";
import { TabsPills } from "@/components/tab/tabspills";
import BookingServiceActions from "./booking-service-actions";
import ListCustomer from "./list-customer";

const REPORT_TABS = [
  {
    id: "agency",
    label: "Giá đại lý",
    icon: Clock,
    component: ReportPriceTab,
  },
  {
    id: "selling",
    label: "Giá bán",
    icon: ClipboardCheck,
    component: ReportPriceTab,
  },
];
const DetailReportFinance = () => {
  const [open, setOpen] = useState({
    video: false,
  });
  const location = useLocation();
  const item = location.state?.item;
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.USER.LIST_AGENT_FOR_GROUP],
    queryFn: () =>
      useListBooking({
        strBookingGUID: item?.strBookingGUID,
        strBookingCode: null,
        strFilterDateFrom: null,
        strFilterDateTo: null,
        intOrderStatusID: null,
        intPaymentStatusID: null,
        intBookingStatusID: null,
        intCurPage: page,
        intPageSize: pageSize,
        isPartner: true,
        tblsReturn: "[0][3][4][5][6][9]",
      }),
    placeholderData: keepPreviousData,
  });

  const listData = data?.[0] ?? [];
  const totalRecords = listData?.[0]?.intTotalRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const colDefs: ColumnDef<any>[] = [
    {
      field: "strGroupName",
      headerName: "Booking Code",
      render: (value) => (
        <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
          {value || "---"}
        </span>
      ),
    },
    {
      field: "dblPriceSubTotal",
      headerName: "Sub Total Price",
      render: (value) => (
        <div className="">
          {new Intl.NumberFormat("vi-VN").format(
            Number.isFinite(Number(value)) ? Number(value) : 0,
          )}{" "}
          <span className="text-[10px] align-top">đ</span>
        </div>
      ),
    },
    {
      field: "dblPriceDiscount",
      headerName: "Total Discount",
      render: (value) => (
        <div className="">
          {new Intl.NumberFormat("vi-VN").format(
            Number.isFinite(Number(value)) ? Number(value) : 0,
          )}{" "}
          <span className="text-[10px] align-top">đ</span>
        </div>
      ),
    },
    {
      field: "dblPriceTotal",
      headerName: "Tổng Giá",
      render: (value) => (
        <div className="">
          {new Intl.NumberFormat("vi-VN").format(
            Number.isFinite(Number(value)) ? Number(value) : 0,
          )}{" "}
          <span className="text-[10px] align-top">đ</span>
        </div>
      ),
    },
    {
      field: "dblPricePaid",
      headerName: "Total Paid",
      render: (value) => (
        <div className="">
          {new Intl.NumberFormat("vi-VN").format(
            Number.isFinite(Number(value)) ? Number(value) : 0,
          )}{" "}
          <span className="text-[10px] align-top">đ</span>
        </div>
      ),
    },
    {
      field: "dblPriceBalance",
      headerName: "Total Balance",
      render: (value) => (
        <div className="">
          {new Intl.NumberFormat("vi-VN").format(
            Number.isFinite(Number(value)) ? Number(value) : 0,
          )}{" "}
          <span className="text-[10px] align-top">đ</span>
        </div>
      ),
    },
    {
      field: "strOrderStatusName",
      headerName: "Booking Status",
      render: (value) => {
        return (
          <span
            className={`min-w-[100px] text-center px-3 py-1 rounded-2xl text-[11px] font-medium ${
              value
                ? "bg-green-50 text-green-600 border border-green-100"
                : "bg-orange-50 text-orange-600 border border-orange-100"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      field: "dtmBookingDate",
      headerName: "Booked On",
      render: (value) => (
        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          <Calendar size={13} className="text-gray-400" />
          {fDateTime(value)}
        </div>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState("agency");

  return (
    <div className="max-w-7xl mx-auto bg-[#f8fafc] min-h-screen">
      <button
        onClick={() => router.push(paths.content.quote)}
        className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-[#004b91] transition-colors group py-2"
      >
        <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
          <ArrowLeft size={20} />
        </div>
        <span className="text-sm font-medium">Quay lại</span>
      </button>

      <div className="space-y-5 mt-2">
        <div className="flex justify-between">
          <div className="flex flex-col font-sans">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold text-gray-800">
                Booking Detail
              </h2>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setOpen((prev) => ({ ...prev, video: true }))}
              className="cursor-pointer w-full px-10 py-1.5 bg-[#004b91] hover:bg-[#003d75] rounded-lg text-white transition-colors disabled:opacity-50"
            >
              Video Helper
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <TableCore
            rowData={listData ?? []}
            columnDefs={colDefs}
            loading={isLoading}
          />
          {!isError && (
            <Pagination
              currentPage={page}
              onPageChange={(value) => setPage(value)}
              totalPages={totalPages || 1}
            />
          )}
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-6">
          Thông tin chung
        </h2>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-3 gap-y-6">
            <div className="space-y-1">
              <div className="text-xs text-gray-400 font-medium uppercase">
                Group size
              </div>
              <div className="text-[15px] text-gray-700 font-semibold">
                {item?.intTotalPax}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-400 font-medium uppercase">
                Payable
              </div>
              <div className="text-[15px] text-gray-700 font-semibold">
                {" "}
                {new Intl.NumberFormat("vi-VN").format(
                  Number.isFinite(Number(item?.dblPriceTotal))
                    ? Number(item?.dblPriceTotal)
                    : 0,
                )}
                <span className="text-[10px] align-top">đ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {/* Hàng 1: title + action */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[28px] font-semibold text-[#1f2937]">
              List Booking Services
            </h2>

            <button className="bg-[#0057a8] hover:bg-[#00498d] text-white px-6 py-2.5 rounded-[16px] text-sm font-medium transition-colors">
              Send Booking
            </button>
          </div>

          {/* Hàng 2: tabs */}
          <div className="mb-0 ">
            <TabsPills
              tabs={REPORT_TABS}
              activeTab={activeTab}
              onChange={setActiveTab}
              className="bg-transparent p-0 rounded-none shadow-none border-0"
            />
          </div>

          {/* Hàng 3: content */}
          <div className="bg-white rounded-tr-[18px] rounded-b-[18px] min-h-[160px] px-8 py-6">
            <ReportPriceTab
              variant={activeTab === "selling" ? "selling" : "agency"}
            />
          </div>
        </div>

        <BookingServiceActions />
        <ListCustomer customers={data?.[3] ?? []} loading={isLoading} />
        <div className="mt-6 flex justify-end">
          <button
            className="
                px-4 py-1.5
                text-[12px]
                border border-gray-300
                rounded
                bg-white
                text-gray-700
                hover:bg-gray-100
                transition
                "
            // onClick={handleCancel}
          >
            Cancellation Booking
          </button>
        </div>
      </div>

      {open.video && (
        <VideoHelperPopup
          open={open.video}
          onClose={() => setOpen((prev) => ({ ...prev, video: false }))}
        />
      )}
    </div>
  );
};

export default DetailReportFinance;
