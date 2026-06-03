import { useEffect, useState } from "react";
import { getUrlImage } from "@/utils/format-image";
import { Filter, Home, MapPin, RotateCcw, Search, Star } from "lucide-react";
import BookingForm from "./booking-form";
import {
  useListBoat,
  useListImage,
  useListMappingPrice,
} from "@/hooks/actions/useBoat";
import { Link, useLocation } from "react-router-dom";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { paths } from "@/routes/paths";

const BoatDetail = () => {
  const location = useLocation();
  const item = location?.state?.item;
  const [filters] = useState({
    strSupplierGUID: item?.strSupplierGUID,
  });
  const [filters2] = useState({
    page: 1,
    pageSize: 1,
    strSupplierGUID: item?.strSupplierGUID,
    tblsReturn: "[0][1]",
  });
  const [filters3] = useState({
    page: null,
    pageSize: null,
    strSupplierGUID: item?.strSupplierGUID,
    tblsReturn: "[0][1]",
  });
  const { imgData, imgLoading, imgError } = useListImage(filters);
  const { boatData, boatLoading, boatError } = useListBoat(filters2);
  const { mpData, mpLoading } = useListMappingPrice(filters3);

  const [activeImg, setActiveImg] = useState<string | undefined>();

  const boat = boatData?.[0]?.[0] ?? [];
  const company = boatData?.[1] ?? [];

  useEffect(() => {
    if (imgData && imgData.length > 0) {
      // Khởi tạo ảnh đầu tiên nếu chưa có
      if (!activeImg) {
        setActiveImg(getUrlImage(imgData[0].strSupplierImageFileLink));
      }

      const interval = setInterval(() => {
        setActiveImg((current) => {
          const currentIndex = imgData.findIndex(
            (img: any) => getUrlImage(img.strSupplierImageFileLink) === current,
          );
          const nextIndex = (currentIndex + 1) % imgData.length;
          return getUrlImage(imgData[nextIndex].strSupplierImageFileLink);
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [imgData, activeImg]);

  if (imgLoading || boatLoading || mpLoading) {
    return <BoatDetailSkeleton />;
  }

  if (imgError || boatError) {
    return <BoatDetailError />;
  }

  const colDefs: ColumnDef<any>[] = [
    {
      field: "No",
      headerName: "STT",
      render: (value) => (
        <span className="text-gray-400 font-medium">{value}</span>
      ),
    },
    {
      field: "strBoatName",
      headerName: "Tên tàu",
      render: (value) => <span className="">{value}</span>,
    },
    {
      field: "strItineraryName",
      headerName: "Tên thuyền",
      render: (value) => <span className="">{value}</span>,
    },
    {
      field: "strBoatPriceTypeName",
      headerName: "Loại Thuyền",
      render: (value) => <span className="">{value}</span>,
    },
    {
      field: "intQuantity",
      headerName: "Số lượng",
      render: () => {
        return (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center border border-slate-300 rounded overflow-hidden h-8">
              <button className="cursor-pointer px-2 bg-slate-100 hover:bg-slate-200 text-slate-600 h-full border-r border-slate-300">
                -
              </button>
              <input
                type="text"
                className="w-10 text-center text-sm font-medium outline-none h-full"
                readOnly
              />
              <button className="cursor-pointer px-2 bg-slate-100 hover:bg-slate-200 text-slate-600 h-full border-l border-slate-300">
                +
              </button>
            </div>
            <span className="text-[10px] text-slate-500 italic">
              (Có sẵn: 0)
            </span>
          </div>
        );
      },
    },
    {
      field: "dblPrice",
      headerName: "Đơn giá",
      render: (value) => <span className="font-normal">${value}</span>,
    },
    {
      field: "dblPrice",
      headerName: "Đơn giá",
      render: (value) => (
        <span className="text-slate-700 font-normal">
          ${value?.toLocaleString()}
        </span>
      ),
    },
    {
      field: "dblTotalPrice",
      headerName: "Tổng giá",
      render: (_, row) => {
        return (
          <span className="text-slate-700 font-normal">{row?.dblPrice}</span>
        );
      },
    },
    {
      field: "No",
      headerName: "Action",
      render: (_) => (
        <div className="flex justify-center min-w-[100px]">
          <button className="cursor-pointer rounded-lg border border-[rgba(64,64,64,0.5)] text-[12px] px-3 py-2 font-medium text-gray-700 hover:text-[#2566b0] hover:bg-blue-50 transition-all duration-200 active:scale-95">
            Gửi yêu cầu
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-slate-50 min-h-screen px-6 py-10 text-slate-700">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto mb-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <Link
              to={paths.shop.boat.list}
              className="flex items-center text-slate-400 hover:text-[#2566b0] transition-colors"
            >
              <Home size={20} />
            </Link>
            <span className="text-slate-400">&gt;</span>
            <Link
              to={paths.shop.boat.list}
              className="hover:text-[#2566b0] transition-colors"
            ></Link>
            <span className="text-slate-600 font-medium line-clamp-1">
              {boat?.strSupplierName || "Chi tiết boat"}
            </span>
          </nav>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Gallery & Content */}
          <div className="flex-1 space-y-6">
            {/* Main Image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <img
                src={activeImg}
                alt="Main Boat"
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {imgData.map((img: any, index: number) => {
                const imgUrl = getUrlImage(img?.strSupplierImageFileLink);

                return (
                  <button
                    key={index}
                    onClick={() => setActiveImg(imgUrl)}
                    className={`cursor-pointer aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                      activeImg === imgUrl
                        ? "border-[#2566b0]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 space-y-2">
              <h1 className="text-3xl font-bold text-slate-800 uppercase">
                {boat?.strSupplierName}
              </h1>
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < boat?.intEasiaCateID
                        ? "fill-orange-400 text-orange-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin size={16} className="text-slate-400" />
                <span>{boat?.strSupplierAddr}</span>
              </div>
            </div>

            {/* 2. DESCRIPTION */}
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="font-bold text-lg mb-2 text-slate-800">Mô tả:</h3>
              <p className="text-slate-400 italic text-sm">Không có dữ liệu</p>
            </div>

            {/* 3. SELECT ITINERARY (CHỌN HÀNH TRÌNH) */}
            <div className="mt-10 space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Chọn hành trình
              </h2>

              {/* Filter Row 2: Search & Buttons */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Lựa chọn nhà cung cấp
                </label>

                <select className="w-full border border-slate-200 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-[#2566b0]">
                  {company.map((c: any, index: number) => (
                    <option key={index} value={c.strCompanyGUID}>
                      {c.strCompanyName} (Giá từ: ${c.dblPriceFrom})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Row 2: Search & Buttons */}
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[200px] space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Tên thuyền
                  </label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-md p-2 text-sm outline-none shadow-sm"
                  />
                </div>
                <button className="bg-[#0056b3] text-white px-4 py-2 rounded flex items-center gap-2 text-sm hover:bg-blue-700 transition-all font-medium">
                  <Filter size={16} /> Lọc
                </button>
                <button className="border border-slate-200 p-2 rounded hover:bg-slate-50 text-slate-600 transition-all">
                  <RotateCcw size={18} />
                </button>
                <button className="text-[#2566b0] p-2 hover:underline flex items-center gap-1 text-sm">
                  <Search size={18} /> <span className="text-xs">▼</span>
                </button>
              </div>

              {/* 4. TABLE LISTING */}
              <TableCore
                rowData={mpData ?? []}
                columnDefs={colDefs}
                loading={mpLoading}
              />
            </div>
          </div>

          {/* RIGHT: Quick Booking Form */}
          <div className="relative">
            <div className="sticky top-32">
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoatDetail;

const BoatDetailSkeleton = () => {
  return (
    <section className="bg-slate-50 min-h-screen px-6 py-10 animate-pulse">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* LEFT */}
        <div className="flex-1 space-y-6">
          <div className="aspect-[16/9] bg-slate-200 rounded-2xl" />

          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-slate-200 rounded-lg" />
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-6 w-1/2 bg-slate-200 rounded" />
            <div className="h-4 w-1/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/3 bg-slate-200 rounded" />
          </div>

          <div className="h-24 bg-slate-200 rounded" />

          <div className="h-40 bg-slate-200 rounded" />
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[350px] h-[400px] bg-slate-200 rounded-2xl" />
      </div>
    </section>
  );
};

const BoatDetailError = () => {
  return (
    <div className="text-center py-20 text-red-500">
      Không tải được danh sách dữ liệu
    </div>
  );
};
