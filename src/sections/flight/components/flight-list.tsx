import { useListFlight } from '@/hooks/actions/useFilght';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { Star, LayoutGrid, List, MapPin } from 'lucide-react';
import { getUrlImage } from '@/utils/format-image';


// ─── FlightCard ───────────────────────────────────────────────────────────────

const FlightCard = ({ flight }:  any ) => {
  const router = useRouter();

 
  return (
    <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full min-h-[195px] group">
      {/* Image — left */}
      <div
        className="relative w-1/2 overflow-hidden bg-gray-100 cursor-pointer shrink-0"
        // onClick={handleNavigate}
      >
        <img
          src={getUrlImage(flight?.strSupplierImage)}
          alt={flight?.strSupplierName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content — right */}
      <div className="w-1/2 p-4 flex flex-col">
        {/* Airline name */}
        <h3
          // onClick={handleNavigate}
          className="text-[#1a4a8d] font-bold text-[15px] leading-tight uppercase mb-3 line-clamp-2 cursor-pointer hover:text-[#2566b0] transition-colors"
        >
          {flight.strSupplierName}
        </h3>

        {/* Star rating */}
        <div className="flex items-center gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < flight.intEasiaCateID ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}
            />
          ))}
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 mb-3">
          <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2">
            {flight.strSupplierAddr || 'Đang cập nhật...'}
          </p>
        </div>

        {/* Badge */}
        <div className="mb-3">
          <span className="inline-block bg-[#e6f0ff] text-[#3b82f6] text-[11px] font-medium px-3 py-1 rounded-full">
            {flight.tag || 'Chuyến bay nổi bật'}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Giá từ</p>
            <p className="text-[#2563eb] font-bold text-lg leading-none">
              {flight.dblPriceFrom === '$0' || flight.dblPriceFrom === 'N/A' ? (
                <span className="text-gray-400 text-base">N/A</span>
              ) : (
                flight.dblPriceFrom
              )}
            </p>
          </div>

          <button
            // onClick={() => handleNavigate()}
            onClick={() => {
              router.replaceParams(paths.flight.detail, {
                item: flight
              })
            }}
            className="cursor-pointer text-[#2566b0] border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── FlightList ───────────────────────────────────────────────────────────────

const FlightList = () => {
  const filters = {
    page:1,
    pageSize: 15,
  };

  const { flightData } = useListFlight(filters);

  return (
    <section className="max-w-7xl mx-auto px-6  mb-10">
    
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Chuyến bay nổi bật
      </h2>

      <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
        <span className="text-sm text-gray-500 ml-2">Hiển thị dạng:</span>
        <button className="p-1.5 bg-[#2566b0] text-white rounded-md shadow-sm">
          <LayoutGrid size={18} />
        </button>
        <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors">
          <List size={18} />
        </button>
      </div>
    </div>

    {/* List */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {flightData.map((flight: any) => (
        <FlightCard key={flight.strSupplierGUID} flight={flight} />
      ))}
    </div>

  </section>
  )
}

export default FlightList;
