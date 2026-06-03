import {
  CameraOff,
  Star,
  Filter,
  RefreshCcw,
  Search,
  ChevronDown,
  Home,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  useDetailVehicle,
  useListVehicleMappingPrice,
} from "@/hooks/actions/useVehicle";
import { getUrlImage } from "@/utils/format-image";
import { useState } from "react";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { paths } from "@/routes/paths";

const safeText = (value: any, fallback = "---") => {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "object") return fallback;

  return String(value);
};
const VehicleDetail = () => {
  const location = useLocation();
  const item = location?.state?.item;

  const { vdData } = useDetailVehicle({
    page: 1,
    pageSize: 1,
    strSupplierGUID: item?.strSupplierGUID,
  });

  const vehicle = vdData?.[0]?.[0];
  const company = vdData?.[1]?.[0];

  // table

  const [filters] = useState({
    page: null,
    pageSize: null,
    strSupplierGUID: item?.strSupplierGUID,
    tblsReturn: "[0][1][2]",
  });
  const { mpData, mpLoading } = useListVehicleMappingPrice(filters);

  const colDefs: ColumnDef<any>[] = [
    {
      field: "No",
      headerName: "STT",
      render: (value: any) => (
        <span className="text-[15px] text-[#2f3a4a]">{value ?? "-"}</span>
      ),
    },
    {
      field: "strItineraryName",
      headerName: "Tên xe",
      render: (value: any) => (
        <div className="text-[15px] text-[#2f3a4a] leading-[22px] max-w-[220px]">
          {value || "-"}
        </div>
      ),
    },
    {
      field: "dtmDateStart",
      headerName: "Ngày bắt đầu",
      render: (value: any) => (
        <input
          type="text"
          value={value || "16/04/2026"}
          readOnly
          className="h-[42px] w-[118px] rounded-[4px] border border-[#cfcfcf] bg-white px-3 text-[15px] text-[#5b6575] outline-none"
        />
      ),
    },
    {
      field: "intQuantity",
      headerName: "Số lượng",
      render: (value: any) => (
        <input
          type="text"
          value={value ?? 1}
          readOnly
          className="h-[42px] w-[60px] rounded-[4px] border border-[#cfcfcf] bg-white px-3 text-[15px] text-[#5b6575] outline-none"
        />
      ),
    },
    {
      field: "strCarTypeName",
      headerName: "Chọn xe",
      render: (value: any, row: any) => (
        <select
          defaultValue={value || ""}
          className="h-[42px] w-[150px] rounded-[4px] border border-[#cfcfcf] bg-white px-3 text-[15px] text-[#5b6575] outline-none"
        >
          <option value=""> </option>

          {/* nếu sau này có list xe thì map ở đây */}
          {row?.carOptions?.map((car: any, index: number) => (
            <option key={index} value={car?.value}>
              {car?.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      field: "dblPrice",
      headerName: "Đơn giá",
      render: (value: any) => (
        <div className="text-[15px] text-[#2f3a4a] whitespace-nowrap">
          ${value ?? 0}
        </div>
      ),
    },
    {
      field: "dblTotalPrice",
      headerName: "Tổng giá",
      render: (value: any) => (
        <div className="text-[15px] text-[#2f3a4a] whitespace-nowrap">
          ${value ?? 0}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Thao tác",
      render: (_: any) => (
        <button
          type="button"
          className="min-w-[60px] h-[42px] rounded-[4px] bg-[#e9edf2] px-4 text-[15px] font-medium text-[#2f5f9f] hover:bg-[#dfe6ee]"
        >
          Chọn
        </button>
      ),
    },
  ];
  return (
    <section className="bg-slate-50 min-h-screen px-6 py-10 text-slate-700">
      <div className="max-w-7xl mx-auto mb-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <Link
            to={paths.shop.tour.list}
            className="flex items-center text-slate-400 hover:text-[#2566b0] transition-colors"
          >
            <Home size={20} />
          </Link>
          <span className="text-slate-400">&gt;</span>
          <Link
            to={paths.shop.tour.list}
            className="hover:text-[#2566b0] transition-colors"
          ></Link>
          <span className="text-slate-600 font-medium line-clamp-1">
            {vehicle?.strSupplierName ||
              "Chi tiết nhà xe" /* Nếu có tên nhà xe thì hiển thị, không có thì hiển thị "Chi tiết nhà xe" */}
          </span>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-6 pt-[50px] bg-[#f8f9fa] min-h-screen flex flex-col lg:flex-row items-start gap-8 font-sans">
        {/* =========================================
          CỘT TRÁI: THÔNG TIN NHÀ XE & CHỌN HÀNH TRÌNH 
          ========================================= */}
        <div className="flex-1 w-full space-y-10 min-w-0">
          {/* 1. Phần Thông tin nhà xe */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-64 h-48 bg-[#e5e7eb] flex items-center justify-center flex-shrink-0 overflow-hidden rounded-md">
              {vehicle?.strSupplierImage ? (
                <img
                  src={getUrlImage(vehicle?.strSupplierImage)}
                  alt={vehicle?.strSupplierName || "vehicle"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <CameraOff className="w-12 h-12 text-white" />
              )}
            </div>

            <div className="flex flex-col pt-2">
              <h1 className="text-3xl font-medium text-gray-800 uppercase tracking-wide">
                {safeText(vehicle?.strSupplierName, "Không có dữ liệu")}
              </h1>

              <div className="flex text-orange-400 mt-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Địa chỉ:</span>{" "}
                {safeText(vehicle?.strSupplierAddr, "Không có dữ liệu")}
              </p>

              <p className="text-sm text-gray-700 italic">Mô tả:</p>
              <p className="text-sm text-gray-500 italic mt-1">
                {safeText(vehicle?.strRemark, "Không có dữ liệu")}
              </p>
            </div>
          </div>

          {/* 2. Phần Chọn hành trình */}
          <div className="space-y-4">
            <h2 className="text-[22px] font-medium text-gray-800">
              Chọn hành trình
            </h2>

            <div className="rounded-[20px] border border-gray-200 bg-white p-4 md:p-5">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-2 block text-[15px] text-gray-800">
                    Lựa chọn nhà cung cấp
                  </label>

                  <select className="h-[44px] w-full rounded border border-gray-300 bg-white px-3 text-[15px] text-gray-700 outline-none focus:border-[#2566b0]">
                    <option>
                      {company?.strCompanyName || "Không có dữ liệu"}
                      {company?.dblPriceFrom !== null &&
                      company?.dblPriceFrom !== undefined
                        ? ` (Giá từ: $${company.dblPriceFrom}/Xe)`
                        : ""}
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                  <div>
                    <label className="mb-2 block text-[15px] text-gray-800">
                      Tên xe
                    </label>
                    <input
                      type="text"
                      className="h-[42px] w-full rounded border border-gray-300 px-3 text-sm outline-none focus:border-[#2566b0]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[15px] text-gray-800">
                      Thời lượng
                    </label>
                    <div className="px-2 pt-2">
                      <div className="relative h-[5px] rounded-full bg-gray-200">
                        <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-[#2f68b3]" />
                        <div className="absolute left-0 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-300 bg-white shadow-sm" />
                        <div className="absolute right-0 top-1/2 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-300 bg-white shadow-sm" />
                      </div>
                      <div className="mt-3 flex justify-between text-[14px] text-gray-800">
                        <span>0 ngày</span>
                        <span>3 ngày</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[15px] text-gray-800">
                      Giá
                    </label>
                    <div className="px-2 pt-2">
                      <div className="relative h-[5px] rounded-full bg-gray-200">
                        <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-[#2f68b3]" />
                        <div className="absolute left-0 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-300 bg-white shadow-sm" />
                        <div className="absolute right-0 top-1/2 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-300 bg-white shadow-sm" />
                      </div>
                      <div className="mt-3 flex justify-between text-[14px] text-gray-800">
                        <span>$0</span>
                        <span>$295</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button className="flex h-[34px] items-center gap-1.5 rounded bg-[#0b56a8] px-4 text-sm font-medium text-white hover:bg-blue-800">
                    <Filter className="h-4 w-4 fill-current" />
                    Lọc
                  </button>

                  <button className="flex h-[34px] w-[38px] items-center justify-center rounded border border-gray-300 bg-white text-slate-600 hover:bg-gray-50">
                    <RefreshCcw className="h-4 w-4" />
                  </button>

                  <button className="flex h-[34px] items-center gap-0.5 rounded border border-gray-300 bg-white px-3 text-[#2566b0] hover:bg-blue-50">
                    <Search className="h-4 w-4" />
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <TableCore
                rowData={mpData ?? []}
                columnDefs={colDefs}
                loading={mpLoading}
              />

              {/* <div className="mt-4 overflow-hidden rounded-tl-[16px] rounded-tr-[16px] border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#2f68b3] text-sm text-white">
                      <th className="px-4 py-4 font-medium">STT</th>
                      <th className="px-4 py-4 font-medium">Tên xe</th>
                      <th className="px-4 py-4 font-medium">Ngày bắt đầu</th>
                      <th className="px-4 py-4 font-medium">Số lượng</th>
                      <th className="px-4 py-4 font-medium">Chọn xe</th>
                      <th className="px-4 py-4 font-medium">Đơn giá</th>
                      <th className="px-4 py-4 font-medium">Tổng giá</th>
                      <th className="px-4 py-4 font-medium">Thao tác</th>
                    </tr>
                  </thead>

                  <tbody className="text-[15px] text-gray-700">
                    {journeys.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-200 bg-white"
                      >
                        <td className="px-4 py-4">{index + 1}</td>
                        <td className="px-4 py-4 text-gray-800">{item.name}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            defaultValue={item.date}
                            className="h-[34px] w-[100px] rounded border border-gray-300 px-2 text-sm outline-none"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            defaultValue={item.quantity}
                            className="h-[34px] w-[60px] rounded border border-gray-300 px-2 text-sm outline-none"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select className="h-[34px] w-[150px] rounded border border-gray-300 bg-white px-2 text-sm outline-none">
                            <option></option>
                          </select>
                        </td>
                        <td className="px-4 py-4">$0</td>
                        <td className="px-4 py-4">${item.price}</td>
                        <td className="px-4 py-2">
                          <button className="rounded bg-[#e9edf3] px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-300">
                            Chọn
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <select className="h-[34px] rounded border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none">
                    <option>10</option>
                  </select>
                  <span className="text-sm text-gray-700">[1 - 5]/5</span>
                </div>

                <div className="flex items-center gap-0">
                  <button className="flex h-[34px] w-[40px] items-center justify-center rounded-l border border-gray-300 bg-white text-[#2566b0] hover:bg-blue-50">
                    <ChevronsLeft className="h-4 w-4" />
                  </button>
                  <button className="flex h-[34px] w-[40px] items-center justify-center border-y border-r border-gray-300 bg-white text-[#2566b0] hover:bg-blue-50">
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <select className="h-[34px] border-y border-r border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none">
                    <option>1</option>
                  </select>

                  <div className="flex h-[34px] items-center border-y border-r border-gray-300 px-3 text-sm text-gray-700">
                    / 1
                  </div>

                  <button className="flex h-[34px] w-[40px] items-center justify-center border-y border-r border-gray-300 bg-white text-[#2566b0] hover:bg-blue-50">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button className="flex h-[34px] w-[40px] items-center justify-center rounded-r border-y border-r border-gray-300 bg-white text-[#2566b0] hover:bg-blue-50">
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div> */}
            </div>
          </div>
        </div>

        {/* =========================================
          CỘT PHẢI: WIDGET ĐẶT XE (STICKY)
          Đã thêm self-start, h-fit và tăng top-24 để tránh Header
          ========================================= */}
        <div className="w-full lg:w-[320px] flex-shrink-0 sticky top-[150px] self-start h-fit">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-medium text-[#2566b0] mb-5">Đặt Xe</h2>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-800 mb-1.5">
                  Ngày khởi hành <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="11/04/2026"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#2566b0] w-full"
                />
              </div>

              <div className="flex flex-col">
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#2566b0] bg-white text-gray-700 w-full mt-2">
                  <option>1 N.Lớn - 0 T.Em</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleDetail;
