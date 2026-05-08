import { useState } from "react";
import { CameraOff, Star } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Filter, Search, RefreshCcw , ChevronDown} from "lucide-react";

import {
  useDetailFlight,
  useListMappingPrice,
} from "@/hooks/actions/useFilght";
import BookingForm from "@/sections/flight/components/booking-form";
import { formatPrice } from "@/utils/format-number";
import { TableCore, type ColumnDef } from "@/components/table/table-core";


const FlightDetail = () => {
  const location = useLocation();
  const item = location?.state?.item;

  const { fdData } = useDetailFlight({
    page: 1,
    pageSize: 1,
    strSupplierGUID: item?.strSupplierGUID,
  });

  const flight = fdData?.[0]?.[0];
  const company = fdData?.[1]?.[0];

  const [filters] = useState({
    page: 1,
    pageSize: 10,
    strSupplierGUID: item?.strSupplierGUID,
    tblsReturn: "[0][1][2]",
  });
  const { mpData, mpLoading } =useListMappingPrice(filters);

  const [searchKeyword, setSearchKeyword] = useState("");
const [selectedCompany, setSelectedCompany] = useState("");



  const colDefs: ColumnDef<any>[] =[
  {
      field: "No",
      headerName: "STT",
      render: (value: any) => (
        <span className="text-gray-400 font-medium">{value}</span>
      ),
    },
  {
      field: "No",
      headerName: "Tên nhà cung cấp",
    },
    {
      field: "No",
      headerName: "Action",
    },
  ]
  // if (!supplierGuid && !supplierFromState) {
  //   return (
  //     <section className="min-h-screen bg-[#f3f4f6] px-6 py-10 text-slate-700 md:px-6">
  //       <div className="mx-auto max-w-[1180px] rounded-2xl bg-white p-6 shadow-sm">
  //         Không tìm thấy thông tin chuyến bay.
  //       </div>
  //     </section>
  //   );
  // }

  // if (fdLoading && !detail) {
  //   return (
  //     <section className="min-h-screen bg-[#f3f4f6] px-6 py-10 text-slate-700 md:px-6">
  //       <div className="mx-auto max-w-[1180px] rounded-2xl bg-white p-6 shadow-sm">
  //         Đang tải thông tin chuyến bay...
  //       </div>
  //     </section>
  //   );
  // }

  // if (fdError && !detail) {
  //   return (
  //     <section className="min-h-screen bg-[#f3f4f6] px-6 py-10 text-slate-700 md:px-6">
  //       <div className="mx-auto max-w-[1180px] rounded-2xl bg-white p-6 shadow-sm">
  //         Không tải được thông tin chuyến bay.
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section className="min-h-screen bg-[#f3f4f6] px-6 py-10 text-slate-700 md:px-6">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex h-[178px] w-full shrink-0 items-center justify-center bg-[#d9d9d9] md:w-[260px]">
              <CameraOff className="h-12 w-12 text-white/90" />
            </div>

            <div className="flex-1 pt-1">
              <h1 className="text-[28px] font-medium uppercase leading-none text-[#1f2937] md:text-[44px]">
                {flight?.strSupplierName || "Không có dữ liệu"}
              </h1>

              <div className="mt-3 flex items-center gap-0.5 text-[#facc15]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-current stroke-[1.5]"
                  />
                ))}
              </div>

              <div className="mt-2 space-y-3 text-[15px] text-[#111827]">
                <p>
                  <span className="font-medium">Địa chỉ: </span>
                  {flight?.strSupplierAddr || "Không có dữ liệu"}
                </p>

                <div>
                  <p className="font-medium">Mô tả:</p>
                  <p className="mt-3 italic text-slate-600">
                    {flight?.description ||
                      flight?.strRemark ||
                      "Không có dữ liệu"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[24px] font-medium text-[#1f2937]">
              Chọn hành trình
            </h2>

            <div className="bg-white px-4 py-3">
              <label className="mb-2 block text-[15px] font-medium text-[#1f2937]">
                Lựa chọn nhà cung cấp
              </label>

                  


              <select
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-[15px]"
                value={selectedCompany || company?.strCompanyName || ""}
                onChange={(event) => setSelectedCompany(event.target.value)}
              >
                <option value={company?.strCompanyName || ""}>
                  {company?.strCompanyName || "Không có dữ liệu"}
                  {` (Giá từ: $${formatPrice(company?.dblPriceFrom)}/Xe)`}
                </option>
              </select>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-[15px] font-medium text-[#1f2937]">
                    Tên chuyến bay
                  </label>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[15px] font-medium text-[#1f2937]">
                    Thời lượng
                  </label>
                  <div className="pt-2">
                    <div className="relative h-[3px] rounded-full bg-gray-300">
                      <div className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-gray-300 bg-white shadow-sm" />
                    </div>
                    <div className="mt-2 flex justify-between text-[14px] text-[#1f2937]">
                      <span>0 ngày</span>
                      <span>0 ngày</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[15px] font-medium text-[#1f2937]">
                    Giá
                  </label>
                  <div className="pt-2">
                    <div className="relative h-[3px] rounded-full bg-gray-300">
                      <div className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-gray-300 bg-white shadow-sm" />
                    </div>
                    <div className="mt-2 flex justify-between text-[14px] text-[#1f2937]">
                      <span>$0</span>
                      <span>$0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded bg-[#0b56a8] px-4 py-2 text-[15px] font-medium text-white hover:bg-blue-800">
                  <Filter className="h-4 w-4 fill-current" />
                  Lọc
                </button>

                <button className="rounded border border-gray-300 bg-white p-2 text-slate-600 hover:bg-gray-50">
                  <RefreshCcw className="h-4 w-4" />
                </button>

                <button className="flex items-center gap-0.5 px-1 py-2 text-[#0b56a8]">
                  <Search className="h-4 w-4" />
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>


               <TableCore
                           rowData={mpData ?? []}
                           columnDefs={colDefs}
                           loading={mpLoading}
                         />       
              {/* <div className="mt-4 overflow-hidden rounded-2xl bg-white">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#1f5fad] text-white">
                      <th className="px-4 py-3 font-medium">STT</th>
                      <th className="px-4 py-3 font-medium">
                        Tên nhà cung cấp
                      </th>
                      <th className="px-4 py-3 text-center font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-t border-slate-200">
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3">
                        {strCompanyName ||
                          flight?.strSupplierName ||
                          "Không có dữ liệu"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="rounded bg-gray-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-gray-200">
                          Chọn
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
            </div>
          </div>
        </div>

        <BookingForm />
      </div>
    </section>
  );
};

export default FlightDetail;
