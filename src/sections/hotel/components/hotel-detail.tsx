import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { useListHotel, useListItemByAgent } from "@/hooks/actions/useHotel";
import { getUrlImage } from "@/utils/format-image";
import {
    Star,
    MapPin,
    CheckCircle2,
    XCircle,
    Info,
    X,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const HotelDetail = () => {
    const location = useLocation();
    const item = location?.state?.item;

    const [filters] = useState({
        page: 1,
        pageSize: 1,
        strSupplierGUID: item?.strSupplierGUID,
        tblsReturn: "[0][1]"
    });

    const { hotelData, hotelLoading, hotelError } = useListHotel(filters);
    const { ibgData, ibgLoading, ibgError } = useListItemByAgent(filters);

    const hotel = hotelData?.[0] ?? {};
    
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    


    const colDefs: ColumnDef<any>[] = [
        {
            field: "stt",
            headerName: "STT",
            render: (_, __, rowIndex) => (
                <span className="text-gray-400 font-medium">
                    {rowIndex + 1}
                </span>
            )
        },
        {
            field: "No",
            headerName: "Image",
            render: (value) => {
                const imageUrl =
                    getUrlImage(value) ||
                    "https://dummyimage.com/600x400/e5e7eb/9ca3af&text=No+Image";

                return (
                    <img
                        src={imageUrl}
                        alt="room-image"
                        onClick={() => setPreviewImage(imageUrl)}
                        className="w-24 h-16 object-cover rounded cursor-pointer"
                    />
                );
            },
        },
        {
            field: "strItemTypeName",
            headerName: "Tên phòng",
            render: (value) => <div>{value}</div>
        },
        {
            field: "strSglDblName",
            headerName: "Loại phòng",
            render: (value) => (
                <div>
                    {value === "Double" ? "Phòng đôi" : "Phòng đơn"}
                </div>
            )
        },
        {
            field: "strSglDblName",
            headerName: "Tên phòng",
            render: (value) => (
                <div>
                    {value === "Double" ? "Phòng đôi" : "Phòng đơn"}
                </div>
            )
        },
    ];

    if (hotelLoading || ibgLoading) {
        return (
            <div className="p-10 animate-pulse">
                <div className="h-8 w-1/3 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-6" />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-[500px] bg-gray-200 rounded-2xl" />
                    </div>
                    <div className="h-[300px] bg-gray-200 rounded-2xl" />
                </div>

                <div className="mt-8 h-[300px] bg-gray-200 rounded-2xl" />
            </div>
        );
    }

    if (hotelError || ibgError) {
        return (
            <div className="p-10 text-center text-red-500">
                Có lỗi xảy ra, vui lòng thử lại.
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-6">
            <div className="max-w-7xl mx-auto space-y-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">
                        {hotel?.strSupplierName}
                    </h1>

                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                fill={i < hotel?.intEasiaCateID ? "#fbbf24" : "none"}
                                className={
                                    i < hotel?.intEasiaCateID
                                        ? "text-yellow-400"
                                        : "text-slate-300"
                                }
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                        <MapPin size={14} className="text-[#2566b0]" />
                        {hotel?.strSupplierAddr}
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                            <img
                                onClick={() => {
                                    console.log("Image clicked, opening popup...");
                                    setPreviewImage(
                                        getUrlImage(hotel?.strSupplierImage) ||
                                        "https://dummyimage.com/600x400/e5e7eb/9ca3af&text=No+Image");
                                }}
                                src={
                                    getUrlImage(hotel?.strSupplierImage) ||
                                    "https://dummyimage.com/600x400/e5e7eb/9ca3af&text=No+Image"
                                }
                                className="w-full h-[500px] object-cover cursor-pointer hover:brightness-90 transition-all duration-300 relative z-10"
                            />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 mb-3">
                                Giới thiệu
                            </h3>

                            <div className="p-4 text-sm">
                                {hotel?.strDescription
                                    ? <div dangerouslySetInnerHTML={{ __html: hotel?.strDescription }} />
                                    : <span>Chưa có nội dung</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-200 flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900">
                            Chọn phòng
                        </h2>

                        <button className="bg-[#2566b0] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                            Message
                        </button>
                    </div>

                    <TableCore
                        rowData={ibgData ?? []}
                        columnDefs={colDefs}
                        loading={ibgLoading}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="flex items-center gap-2 font-bold text-emerald-600 mb-3">
                            <CheckCircle2 size={18} />
                            Bao gồm
                        </h3>
                        <p className="text-sm text-slate-600">
                            Không có dữ liệu
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="flex items-center gap-2 font-bold text-red-600 mb-3">
                            <XCircle size={18} />
                            Không bao gồm
                        </h3>
                        <p className="text-sm text-slate-600">
                            Không có dữ liệu
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                        <Info size={18} className="text-[#2566b0]" />
                        Điều khoản
                    </h3>

                    <p className="text-sm text-slate-600">
                        Không có dữ liệu
                    </p>
                </div>
            </div>

            {previewImage  && (
                <div 
                    className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div 
                        className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Xem chi tiết hình ảnh</h2>
                            <button  
                                onClick={() => setPreviewImage(null)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-2 flex justify-center bg-slate-50">
                            <img 
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                src={getUrlImage(hotel?.strSupplierImage) || "https://dummyimage.com/600x400/e5e7eb/9ca3af&text=No+Image"} 
                                alt="hotel-image" 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelDetail;