import { getUrlImage } from "@/utils/format-image";
import { isValidValue } from "@/utils/utilts";
import { Calendar, Flag, Clock, MapPin, Users } from "lucide-react";

const TourSeriesCard = ({ tour }: any) => {
    return (
        <div className="max-w-4xl mx-auto border border-gray-200 rounded-2xl p-6 flex gap-6 bg-white shadow-sm font-sans">
            {/* Left Side: Image */}
            <div className="w-1/3">
                <img
                    src={getUrlImage(isValidValue(tour?.strTourImageUrl))}
                    alt={isValidValue(tour?.strTourName)}
                    className="w-full h-full object-cover rounded-xl"
                />
            </div>

            {/* Right Side */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 uppercase mb-4">
                        {isValidValue(tour?.strTourName)}
                    </h2>

                    <div className="flex gap-4 mb-4">
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-48">
                            <option>
                                {isValidValue(tour?.strEasiaCateName)}
                            </option>
                        </select>

                        <div className="border border-gray-300 rounded px-3 py-1 text-sm flex items-center gap-2 bg-white w-48">
                            <Calendar size={14} />
                            <span>
                                {isValidValue(tour?.dtmDateStarted)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Flag size={16} />
                            <span>
                                Bởi:{" "}
                                <span className="font-medium">
                                    {isValidValue(tour?.strOwnerCompanyName)}
                                </span>
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Users size={16} />
                            <span>
                                Tổng: {isValidValue(tour?.intPaxMax)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>
                                Thời lượng:{" "}
                                {isValidValue(tour?.intNoOfDay)} Days
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-bold">
                                Đã bán:{" "}
                                {isValidValue(tour?.intTotalPaxUsed)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>
                                Các điểm đến:{" "}
                                {isValidValue(
                                    tour?.strListTourDestinationName
                                )}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="text-blue-600 font-bold">
                                + Trống:{" "}
                                {isValidValue(tour?.intTotalPaxRemain)}
                            </div>

                            <div className="text-blue-600 font-bold">
                                + Giữ chỗ:{" "}
                                {isValidValue(tour?.intTotalPaxHold)}
                            </div>
                        </div>
                    </div>

                    <span className="inline-block mt-4 px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-xs font-medium">
                        {isValidValue(tour?.strTourTypeName) || "Tour hằng ngày"}
                    </span>
                </div>
            </div>

            {/* Pricing */}
            <div className="w-1/4 flex flex-col items-center justify-center border-l border-gray-100 pl-6">
                <div className="text-gray-700 font-bold text-lg mb-1">
                    Giá :
                </div>

                <div className="text-blue-600 text-3xl font-extrabold mb-4">
                    ${isValidValue(tour?.dblTotalPrice)}
                </div>

                <button className="w-full py-2 border border-gray-300 rounded-full text-blue-500 font-semibold hover:bg-blue-50 transition-colors">
                    Đặt Ngay
                </button>

                <button className="mt-2 text-xs font-bold text-black uppercase bg-gray-100 px-2 py-1 rounded shadow-inner">
                    Tăng giá/Giảm giá
                </button>
            </div>
        </div>
    );
};

export default TourSeriesCard;