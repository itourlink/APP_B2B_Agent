import {
    MapPin,
    Clock3,
    MessageSquare,
    Facebook,
    Twitter,
    Mail,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { TourCard } from "./tour-list";
import BookingForm from "./booking-form";
import { useDetailTour, useListTourDay, useListTourPublish } from "@/hooks/actions/useTour";
import { useLocation } from "react-router-dom";
import { getUrlImage } from "@/utils/format-image";

/* --- Skeleton + Error --- */
const SkeletonBlock = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
);

const ErrorBlock = () => (
    <div className="text-red-500 text-sm">Có lỗi xảy ra</div>
);

const TourDetail = () => {
    const location = useLocation();
    const item = location.state;

    const [filters] = useState({
        page: 1,
        pageSize: 1,
        strServiceNameUrl: item?.item?.strServiceNameUrl
    });

    const [filters2] = useState({
        page: 1,
        pageSize: 4,
        intCateID: item?.item?.intCateID,
        intProductID: item?.item?.intProductID,
        strLocationCode: null
    });

    const [filters3] = useState({
        strTourGUID: item?.item?.strTourGUID
    });

    const { tdData, tdLoading, tdError } = useDetailTour(filters);
    const { tdpData, tdpLoading, tdpError } = useListTourPublish(filters2);
    const { tddData, tddLoading, tddError } = useListTourDay(filters3);

    const [openDay, setOpenDay] = useState<number | null>(1);
    const toggleDay = (day: number) => {
        setOpenDay(openDay === day ? null : day);
    };

    const ListData = tdData?.[0]?.[0] || {};

    const includedList = ListData?.strIncluded
        ?.replace(/<\/p>/g, "")
        ?.split("<p>")
        ?.filter(Boolean)
        ?.map((item: any) => item.replace(/^\s*-\s*/, "")) || [];

    const exclusionsList = ListData?.strExcluded
        ?.replace(/<\/p>/g, "")
        ?.split("<p>")
        ?.filter(Boolean)
        ?.map((item: any) => item.replace(/^\s*-\s*/, "")) || [];

    return (
        <section className="bg-slate-50 min-h-screen px-6 py-10 text-slate-700">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* LEFT */}
                <div className="flex-1 space-y-10 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">

                    {/* TITLE */}
                    <div className="space-y-3">
                        {tdLoading ? <SkeletonBlock /> : tdError ? <ErrorBlock /> : (
                            <>
                                <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">
                                    {ListData?.strServiceName}
                                </h1>

                                <div className="text-sm text-slate-600 space-y-1">
                                    <p className="font-semibold">{ListData?.strCompanyName}</p>
                                    <div className="flex items-center gap-3">
                                        <p>{ListData?.strCompanyEmail}</p> - <p>{ListData?.strCompanyPhone}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                                    <div className="flex items-center gap-5 text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} className="text-[#2566b0]" />
                                            {ListData?.strListTourDestinationName}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Clock3 size={16} />
                                            Quy mô: {ListData?.intPaxMin} - {ListData?.intPaxMax} khách
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Clock3 size={16} />
                                            {ListData?.intNoOfDay} Ngày /  {(ListData?.intNoOfDay) - 1} Đêm
                                        </div>

                                        <button className="bg-[#2566b0] text-white px-4 py-2 rounded-lg text-xs font-semibold">
                                            <MessageSquare size={14} className="inline mr-1" />
                                            Nhắn tin
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-500">
                                        <span className="text-sm font-semibold">Share:</span>
                                        {[
                                            {
                                                Icon: Facebook,
                                                link: `https://www.facebook.com`
                                            },
                                            {
                                                Icon: Twitter,
                                                link: `https://twitter.com`
                                            },
                                            {
                                                Icon: Mail,
                                                link: `https://gmail.com`
                                            }
                                        ].map(({ Icon, link }, i) => (
                                            <a
                                                key={i}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-500"
                                            >
                                                <Icon size={14} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* IMAGE */}
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200">
                        {tdLoading ? <SkeletonBlock /> : tdError ? <ErrorBlock /> : (
                            <img
                                src={getUrlImage(ListData?.strTourImageUrl)}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">Mô tả</h2>
                        {tdLoading ? <SkeletonBlock /> : tdError ? <ErrorBlock /> : (
                            ListData?.strRemark
                                ? <div dangerouslySetInnerHTML={{ __html: ListData?.strRemark }} />
                                : <span className="text-slate-500 text-sm">Không có dữ liệu</span>
                        )}
                    </div>

                    {/* ITINERARY */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">Lịch trình</h2>

                        {tddLoading && <SkeletonBlock />}
                        {tddError && <ErrorBlock />}

                        {!tddLoading && !tddError && tddData?.map((tdd: any) => {
                            const hasContent = tdd?.strDayContent && typeof tdd?.strDayContent === "string" && tdd?.strDayContent.trim() !== "";

                            return (
                                <div key={tdd?.strTourDayGUID} className="border border-slate-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleDay(tdd?.No)}
                                        className="w-full flex justify-between p-4 bg-slate-50"
                                    >
                                        Ngày {tdd?.No}
                                        {openDay === tdd?.No ? <ChevronUp /> : <ChevronDown />}
                                    </button>

                                    {openDay === tdd?.No && (
                                        <div className="p-4 text-sm">
                                            {hasContent
                                                ? <div dangerouslySetInnerHTML={{ __html: tdd?.strDayContent }} />
                                                : <span>Chưa có nội dung</span>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold mb-3">Bao gồm</h3>
                            {includedList.map((item: any, i: any) => (
                                <div key={i} className="flex gap-2 text-sm">
                                    <CheckCircle2 className="text-green-500" />
                                    <span dangerouslySetInnerHTML={{ __html: item }} />
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="font-bold mb-3">Không bao gồm</h3>
                            {exclusionsList.map((item: any, i: any) => (
                                <div key={i} className="flex gap-2 text-sm">
                                    <XCircle className="text-red-500" />
                                    <span dangerouslySetInnerHTML={{ __html: item }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TERMS */}
                    <div>
                        <h2 className="text-xl font-bold">Các điều khoản</h2>
                        {tdLoading ? <SkeletonBlock /> : tdError ? <ErrorBlock /> : (
                            ListData?.strTermAndCondition
                                ? <div className="text-sm" dangerouslySetInnerHTML={{ __html: ListData?.strTermAndCondition }} />
                                : <span className="text-sm">Không có dữ liệu</span>
                        )}
                    </div>

                </div>

                {/* RIGHT */}
                <div className="relative">
                    <div className="sticky top-32">
                        <BookingForm item={ListData} />
                    </div>
                </div>
            </div>

            {/* RELATED */}
            <div className="max-w-7xl m-auto mt-20">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Bạn có thể quan tâm
                </h2>

                {tdpLoading && <SkeletonBlock />}
                {tdpError && <ErrorBlock />}

                {!tdpLoading && !tdpError && (
                    <div className="grid grid-cols-4 gap-4">
                        {tdpData?.map((t: any) => (
                            <TourCard key={t.id} tour={t} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TourDetail;