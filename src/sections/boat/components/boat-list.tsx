import { useListBoat } from '@/hooks/actions/useBoat';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { getUrlImage } from '@/utils/format-image';
import { formatPrice } from '@/utils/format-number';
import { Star, MapPin, Anchor, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

const BoatCardSkeleton = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-44 bg-gray-200" />
            <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-4" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
        </div>
    );
};

const BoatCard = ({ boat }: any) => {
    const router = useRouter()
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
            <div className="relative h-44 overflow-hidden">
                <img
                    src={getUrlImage(boat?.strSupplierImage)}
                    alt={boat?.strSupplierName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-gray-800 font-bold text-[15px] leading-tight uppercase mb-4 h-12 line-clamp-2">
                    {boat?.strSupplierName}
                </h3>

                <div className="space-y-2.5 mb-4 text-[13px] text-gray-600">
                    <div className="flex items-center gap-2">
                        <Anchor size={14} className="text-gray-400 shrink-0" />
                        <span>Du thuyền</span>
                        <div className="flex items-center ml-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={i < boat?.intEasiaCateID ? "fill-orange-400 text-orange-400" : "text-gray-300"}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2 leading-relaxed">{boat?.strSupplierAddr || "---"}</span>
                    </div>
                </div>

                <div className="mb-4 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-[11px] font-bold text-gray-900 italic tracking-wider">
                            Tăng giá/Giảm giá
                        </span>
                    </div>
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <p className="text-[11px] text-gray-500 mb-0.5">Giá từ</p>
                        <p className="text-[#2563eb] font-bold text-xl leading-none">
                            {formatPrice(boat?.dblPriceFrom)}
                        </p>
                    </div>
                    <button onClick={() => router.replaceParams(paths.shop.boat.detail, { item: boat })} className="cursor-pointer text-[#2566b0] border border-blue-200 hover:border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

const BoatList = () => {
    const [filters] = useState({
        page: 1,
        pageSize: 15,
        tblsReturn: "[0]"
    });

    const { boatData, boatLoading, boatError } = useListBoat(filters);
    const boatDT = boatData?.[0] ?? []
    return (
        <section className="max-w-7xl mx-auto p-8 bg-white">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Du Thuyền Nổi Bật</h2>
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                    <button className="p-1.5 bg-blue-600 text-white rounded-md shadow-sm">
                        <LayoutGrid size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400">
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* ERROR */}
            {boatError && (
                <div className="text-center py-10 text-red-500">
                    Không tải được danh sách tàu
                </div>
            )}

            {/* LOADING */}
            {boatLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <BoatCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* DATA */}
            {!boatLoading && !boatError && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {boatDT.length > 0 ? (
                        boatDT.map((boat: any) => (
                            <BoatCard key={boat.strSupplierGUID} boat={boat} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            Không có dữ liệu
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default BoatList;