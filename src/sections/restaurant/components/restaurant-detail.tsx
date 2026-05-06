import { useState } from "react";
import { CameraOff, Star, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  useDetailRestaurant,

} from "@/hooks/actions/useRestaurant";
import { useListMappingPrice } from "@/hooks/actions/useBoat";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { getUrlImage } from "@/utils/format-image";

const RestaurantDetail = () => {
  const location = useLocation();
  const item = location?.state?.item;

  // infor
  const [filters] = useState({
    page: 1,
    pageSize: 1,
    strSupplierGUID: item?.strSupplierGUID,
  });
  const { rdlData } = useDetailRestaurant(filters);
  const restaurant = rdlData?.[0]?.[0];
  const company = rdlData?.[1];

  const [showSearch, setShowSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // table
  const [filters3] = useState({
    page: null,
    pageSize: null,
    strSupplierGUID: item?.strSupplierGUID,
    tblsReturn: "[0]",
  });

  const { mpData, mpLoading } = useListMappingPrice(filters3);
  console.log("mpData", mpData);

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
      headerName: "Menu",
    },
    {
      field: "No",
      headerName: "Số lượng",
    },
    {
      field: "No",
      headerName: "Bữa ăn",
    },
    {
      field: "No",
      headerName: "Đơn giá",
    },
    {
      field: "No",
      headerName: "Tổng giá",
    },
  ];



  return (
    <div className="max-w-[1400px] mx-auto px-6 pb-6 pt-[50px] bg-[#f8f9fa] min-h-screen flex flex-col lg:flex-row gap-8">
      {/* LEFT */}
      <div className="flex-1">
        <div className="bg-white rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* IMAGE */}
            {/* <div className="w-full md:w-[360px] space-y-3">
              <div className="w-full h-[240px] bg-[#e5e7eb] overflow-hidden rounded-md">
                {restaurant?.strSupplierImage ? (
                  <img
                    src={restaurant.strSupplierImage}
                    alt="restaurant"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {restaurant?.strSupplierImage ? (
                  <img
                    src={restaurant.strSupplierImage}
                    alt="thumb"
                    className="w-20 h-14 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-14 flex items-center text-sm text-gray-400">
                    Không có ảnh
                  </div>
                )}
              </div>
            </div> */}

            <div className="w-full md:w-[360px] space-y-3">
              <div className="w-full h-[240px] bg-[#e5e7eb] overflow-hidden rounded-md">
                {restaurant?.strSupplierImage ? (
                  <img
                    src={getUrlImage(restaurant.strSupplierImage)}
                    alt="restaurant"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {restaurant?.strSupplierImage ? (
                  <img
                    src={getUrlImage(restaurant.strSupplierImage)}
                    alt="thumb"
                    className="w-20 h-14 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-14 flex items-center text-sm text-gray-400">
                    Không có ảnh
                  </div>
                )}
              </div>
            </div>

            {/* INFO */}
            <div className="flex-1">
              <h1 className="text-3xl font-medium uppercase">
                {restaurant?.strSupplierName || "Nhà hàng"}
              </h1>

              <div className="flex text-orange-400 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= (restaurant?.intEasiaCateID ?? 0)
                        ? "fill-current"
                        : ""
                      }`}
                  />
                ))}
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  {/* <MapPin className="w-4 h-4 text-[#1b4998] mt-0.5" /> */}
                  <span>
                    Địa chỉ: {restaurant?.strSupplierAddr || "Chưa có địa chỉ"}
                  </span>
                </div>

                <div className="">
                  <p className="bold text-500">Mô tả:</p>
                  <span className="italic text-gray-500">
                    {" "}
                    {restaurant?.strDescription || "Chưa có mô tả"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 mt-6">
          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Lựa chọn nhà cung cấp
                </label>
                <select className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none">
                  {company?.map((item: any, index: any) => (
                    <option key={item.strCompanyOwnerGUID || index}>
                      {item.strCompanyName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowSearch((prev) => !prev)}
                className="flex items-center gap-1 text-sm font-semibold text-[#2566b0]"
              >
                {showSearch ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
                {showSearch ? "Ẩn tìm kiếm" : "Hiển thị tìm kiếm"}
              </button>

              {showSearch && (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(event) => setSearchKeyword(event.target.value)}
                      placeholder="Tìm kiếm menu..."
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#2566b0] text-white">
                <tr>
                  <th className="w-12 p-3 text-center">
                    <input type="checkbox" className="rounded accent-white" />
                  </th>
                  <th className="p-3">STT</th>
                  <th className="p-3">Menu</th>
                  <th className="p-3">Số lượng</th>
                  <th className="p-3">Bữa ăn</th>
                  <th className="p-3">Đơn giá</th>
                  <th className="p-3">Tổng giá</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {!filteredMenus || filteredMenus.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-slate-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  filteredMenus.map((item, index) => (
                    <tr
                      key={item.id ?? index}
                      className="border-t border-slate-200"
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          className="rounded accent-[#2566b0]"
                        />
                      </td>
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-semibold text-slate-900">
                        {item.name}
                      </td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">{item.mealType}</td>
                      <td className="p-3">{item.unitPrice}</td>
                      <td className="p-3 font-semibold text-[#2566b0]">
                        {item.totalPrice}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div> */}

          <TableCore
            rowData={mpData ?? []}
            columnDefs={colDefs}
            loading={mpLoading}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-[320px]">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-blue-600 font-medium mb-4">Đặt thực đơn</h2>

          <input
            defaultValue="11/04/2026"
            className="border px-3 py-2 w-full mb-3 rounded-md"
          />

          <select className="border px-3 py-2 w-full mb-3 rounded-md">
            <option>1 N.Lớn - 0 T.Em</option>
          </select>

          <button className="w-full bg-blue-600 text-white py-2 rounded-md">
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    //   <div className="max-w-[1400px] mx-auto px-6 pb-6 pt-[50px] bg-[#f8f9fa] min-h-screen flex flex-col lg:flex-row gap-8">
    //     {/* LEFT */}
    //     <div className="flex-1">
    //       <div className="bg-white rounded-xl border p-6">
    //         <div className="flex flex-col md:flex-row gap-6">
    //           {/* IMAGE */}
    //           <div className="w-full md:w-[360px] space-y-3">
    //             <div className="w-full h-[240px] bg-[#e5e7eb] overflow-hidden rounded-md border">
    //               {displayImage ? (
    //                 <img
    //                   src={displayImage}
    //                   alt={restaurant?.name || "restaurant"}
    //                   className="w-full h-full object-cover"
    //                 />
    //               ) : (
    //                 <div className="flex items-center justify-center h-full">
    //                   <CameraOff className="w-12 h-12 text-gray-400" />
    //                 </div>
    //               )}
    //             </div>

    //             <div className="flex gap-2 flex-wrap">
    //               {restaurant?.thumbnails?.length ? (
    //                 restaurant.thumbnails.map((img: string, index: number) => (
    //                   <button
    //                     key={`${img}-${index}`}
    //                     type="button"
    //                     onClick={() => setActiveImage(img)}
    //                     className={`w-20 h-14 border rounded overflow-hidden ${
    //                       displayImage === img
    //                         ? "border-[#1b4998]"
    //                         : "border-gray-300"
    //                     }`}
    //                   >
    //                     <img
    //                       src={img}
    //                       alt={`thumbnail-${index + 1}`}
    //                       className="w-full h-full object-cover"
    //                     />
    //                   </button>
    //                 ))
    //               ) : (
    //                 <div className="w-full h-14 flex items-center text-sm text-gray-400">
    //                   Không có ảnh
    //                 </div>
    //               )}
    //             </div>
    //           </div>

    //           {/* INFO */}
    //           <div className="flex-1">
    //             <h1 className="text-3xl font-medium uppercase">
    //               {restaurant?.name || "Nhà hàng"}
    //             </h1>

    //             <div className="flex text-orange-400 mt-2">
    //               {[1, 2, 3, 4, 5].map((star) => (
    //                 <Star
    //                   key={star}
    //                   className={`w-4 h-4 ${
    //                     star <= (restaurant?.rating ?? 0) ? "fill-current" : ""
    //                   }`}
    //                 />
    //               ))}
    //             </div>

    //             <div className="mt-4 space-y-3 text-sm">
    //               <div className="flex items-start gap-2">
    //                 <MapPin className="w-4 h-4 text-[#1b4998] mt-0.5" />
    //                 <span>{restaurant?.address || "Chưa có địa chỉ"}</span>
    //               </div>

    //               <p className="italic text-gray-500">
    //                 {restaurant?.description || "Chưa có mô tả"}
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* RIGHT */}
    //     <div className="w-full lg:w-[320px]">
    //       <div className="bg-white p-6 rounded-xl border shadow-sm">
    //         <h2 className="text-blue-600 font-medium mb-4">Đặt thực đơn</h2>

    //         <input
    //           defaultValue="11/04/2026"
    //           className="border px-3 py-2 w-full mb-3 rounded-md"
    //         />

    //         <select className="border px-3 py-2 w-full mb-3 rounded-md">
    //           <option>1 N.Lớn - 0 T.Em</option>
    //         </select>

    //         <button className="w-full bg-blue-600 text-white py-2 rounded-md">
    //           Xác nhận
    //         </button>
    //       </div>
    //     </div>
    //   </div>
  );
};
// {/* <div className=""></div> */}

export default RestaurantDetail;
