import { useListGuideFee } from '@/hooks/actions/useGuideFee';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { Star, MapPin, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { getUrlImage } from '@/utils/format-image';

// interface GuideItem {
//   id: number;
//   name: string;
//   image: string;
//   rating: number;
//   address: string;
//   price: string;
//   tag?: string;
// }

export const GuideCard = ({ guide }: {guide: any}) => {
  const router = useRouter();

  const handleNavigate = () => {
    const supplierGuidQuery = guide?.strSupplierGUID
      ? `?supplierGuid=${encodeURIComponent(guide.strSupplierGUID)}`
      : "";

    router.replaceParams(`${paths.shop.guide.detail}${supplierGuidQuery}`, {
      item: guide,
    });
  };

  return (
    <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full min-h-[195px] group">
      <div
        className="relative w-1/2 overflow-hidden bg-gray-100 cursor-pointer shrink-0"
        onClick={handleNavigate}
      >
        <img
          src={getUrlImage(guide?.strSupplierImage)}
          alt={guide?.strSupplierName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="w-1/2 p-4 flex flex-col">
        <h3
          onClick={handleNavigate}
          className="text-[#1a4a8d] font-bold text-[15px] leading-tight uppercase mb-3 line-clamp-2 cursor-pointer hover:text-[#2566b0] transition-colors"
        >
          {guide.strSupplierName}
        </h3>

        <div className="flex items-center gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < guide.intEasiaCateID ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}
            />
          ))}
        </div>

        <div className="flex items-start gap-1.5 mb-3">
          <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2">
            {guide.strSupplierAddr || 'Dang cap nhat...'}
          </p>
        </div>

        <div className="mb-3">
          <span className="inline-block bg-[#e6f0ff] text-[#3b82f6] text-[11px] font-medium px-3 py-1 rounded-full">
            {guide.tag || 'Phi huong dan'}
          </span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Gia tu</p>
            <p className="text-[#2563eb] font-bold text-lg leading-none">
              {guide.dblMaxPriceFrom === '$0' || guide.dblMaxPriceFrom === 'N/A' ? (
                <span className="text-gray-400 text-base">N/A</span>
              ) : (
                guide.dblMaxPriceFrom
              )}
            </p>
          </div>

          <button
            onClick={handleNavigate}
            className="cursor-pointer text-[#2566b0] border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
          >
            Xem chi tiet
          </button>
        </div>
      </div>
    </div>
  );
};

const GuideFeeList = () => {
  const [filters] = useState({
    page: 1,
    pageSize: 15,
  });

  const { guideFeeData: guideData } = useListGuideFee(filters);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  return (
    <section className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Phi huong dan</h2>

       <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <span className="text-[12px] text-gray-500 ml-2">Hiển thị dạng:</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-[#2566b0] text-white shadow-sm" : "text-gray-400 hover:bg-gray-200"}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-[#2566b0] text-white shadow-sm" : "text-gray-400 hover:bg-gray-200"}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {guideData.map((guide: any) => (
          <GuideCard key={guide.strSupplierGUID} guide={guide} />
        ))}
      </div>
    </section>
  );
};

export default GuideFeeList;
