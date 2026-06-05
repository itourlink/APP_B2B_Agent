import {
  CameraOff,
  Star,
  Filter,
  RefreshCcw,
  Home,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDetailGuideFee } from "@/hooks/actions/useGuideFee";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { useListMappingPrice } from "@/hooks/actions/useBoat";
import { paths } from "@/routes/paths";

const GuideFeeDetail = () => {
  const location = useLocation();
  const item = location?.state?.item;
  const companyUrl =
    new URLSearchParams(location.search).get("company") || "";
  const [filters] = useState({
    page: 1,
    pageSize: 1,
    strSupplierGUID: item?.strSupplierGUID,
  });

  const { gfData } = useDetailGuideFee(filters);

  const guideFee = gfData?.[0]?.[0];
  const company = gfData?.[1];

  const [filters3] = useState({
    page: null,
    pageSize: null,
    strSupplierGUID: item?.strSupplierGUID,
    tblsReturn: "[0]",
  });
  const { mpData, mpLoading, } = useListMappingPrice(filters3)

  const colDefs: ColumnDef<any>[] = [
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
      headerName: "Tên hướng dẫn",
    },
    {
      field: "No",
      headerName: "Action",
    }
  ]


  // const [showVehicleFilter, setShowVehicleFilter] = useState(false);




  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <Link
            to={paths.shop.guide.list + `?company=${companyUrl}`}
            className="flex items-center text-slate-400 hover:text-[#2566b0] transition-colors"
          >
            <Home size={20} />
          </Link>
          <span className="text-slate-400">&gt;</span>
          <Link
            to={paths.shop.guide.list + `?company=${companyUrl}`}
            className="hover:text-[#2566b0] transition-colors"
          ></Link>
          <span className="text-slate-600 font-medium line-clamp-1">
            {guideFee?.strSupplierName ||
              "Chi tiết nhà xe" /* Nếu có tên nhà xe thì hiển thị, không có thì hiển thị "Chi tiết nhà xe" */}
          </span>
        </nav>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-10 flex flex-col lg:flex-row gap-8">

        {/* LEFT */}
        <div className="flex-1 space-y-8">
          {/* ===== INFO ===== */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-[260px] h-[200px] bg-gray-200 flex items-center justify-center rounded-md">
              {guideFee?.strSupplierImage ? (
                <img
                  src={guideFee.strSupplierImage}
                  alt={guideFee?.strSupplierName || "guide-fee"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <CameraOff className="w-12 h-12 text-white/80" />
              )}
            </div>

            <div className="flex flex-col justify-start">
              <h1 className="text-[28px] font-semibold text-gray-800 uppercase leading-tight">
                {guideFee?.strSupplierName}
              </h1>

              <div className="flex text-yellow-400 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Địa chỉ:</span>{" "}
                  {guideFee?.strSupplierAddr}
                </p>
                <p>
                  <span className="font-medium">Mô tả:</span>{" "}
                  {guideFee?.strRemark}
                </p>
                <p className="italic text-gray-500">Không có dữ liệu</p>
              </div>
            </div>
          </div>

          {/* ===== CHỌN HÀNH TRÌNH ===== */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Chọn hành trình
            </h2>

            {/* ===== FILTER CARD ===== */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-5">
              {/* SELECT */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Lựa chọn nhà cung cấp
                </label>
                <select className="w-full h-[42px] border border-gray-300 rounded-md px-3 text-sm focus:border-[#2566b0]">
                  {company?.map((item: any, index: number) => (
                    <option key={item.strCompanyOwnerGUID || index}>
                      {item.strCompanyName} (Giá từ: $
                      {item.dblPriceFrom?.value || 0}/Xe)
                    </option>
                  ))}
                </select>
              </div>

              {/* FILTER GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* INPUT */}
                <div>
                  <label className="text-sm mb-1 block text-gray-700">
                    Tên thuyền
                  </label>
                  <input className="w-full h-[38px] border border-gray-300 rounded px-3 text-sm focus:border-[#2566b0]" />
                </div>

                {/* SLIDER 1 */}
                <div>
                  <label className="text-sm mb-2 block text-gray-700">
                    Thời lượng
                  </label>
                  <div className="h-1.5 bg-gray-200 rounded-full relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border rounded-full"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span>0 ngày</span>
                    <span>0 ngày</span>
                  </div>
                </div>

                {/* SLIDER 2 */}
                <div>
                  <label className="text-sm mb-2 block text-gray-700">
                    Giá
                  </label>
                  <div className="h-1.5 bg-gray-200 rounded-full relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border rounded-full"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span>$0</span>
                    <span>$0</span>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div className="flex items-center gap-2">
                <button className="bg-[#1b4998] text-white px-4 py-1.5 rounded flex items-center gap-1 text-sm">
                  <Filter className="w-4 h-4" />
                  Lọc
                </button>

                <button className="border p-1.5 rounded bg-white hover:bg-gray-50">
                  <RefreshCcw className="w-4 h-4" />
                </button>

                {/* <button
                  onClick={() => setShowVehicleFilter(!showVehicleFilter)}
                  className="border px-3 py-1.5 rounded bg-white flex items-center gap-1 text-sm text-[#2566b0]"
                >
                  <Search className="w-4 h-4" />
                  {showVehicleFilter ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button> */}
              </div>

              {/* EXPAND FILTER */}
              <div>
                <p className="text-sm font-medium mb-2">Tên xe</p>
                <div className="flex flex-wrap gap-4">
                  {[
                    "Xe 4 chỗ",
                    "Xe 8 chỗ",
                    "Xe 16 chỗ",
                    "Xe 29 chỗ",
                    "Xe 35 chỗ",
                    "Xe 45 chỗ",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input type="checkbox" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== TABLE ===== */}

            <TableCore
              rowData={mpData ?? []}
              columnDefs={colDefs}
              loading={mpLoading}
            />
            {/* <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#1b4998] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">STT</th>
                    <th className="px-4 py-3 text-left">Tên nhà cung cấp</th>
                    <th className="px-4 py-3 text-left">Tên hướng dẫn</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> */}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[320px] sticky top-[120px] h-fit">
          <div className="bg-white rounded-xl shadow-lg p-6 border">
            <h2 className="text-lg font-semibold text-[#2566b0] mb-4">
              Đặt Xe
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Ngày khởi hành <span className="text-red-500">*</span>
                </label>
                <input className="mt-1 w-full border rounded px-3 py-2 text-sm" />
              </div>

              <select className="w-full border rounded px-3 py-2 text-sm">
                <option>1 N.Lớn - 0 T.Em</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideFeeDetail;
