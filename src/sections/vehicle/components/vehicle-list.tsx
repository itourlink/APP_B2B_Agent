import { useListVehicle } from '@/hooks/actions/useVehicle';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { getUrlImage } from '@/utils/format-image';
import { Star, MapPin, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

// interface VehicleItem {
//   id: number;
//   name: string;
//   image: string;
//   rating: number;
//   address: string;
//   price: number;
//   tag?: string;
// }

const VehicleCard = ({ vehicle }: any) => {
  const router = useRouter();

  const handleNavigate = () => router.push(paths.shop.vehicle.detail);

  return (
    <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full min-h-[195px] group">
      <div
        className="relative w-1/2 overflow-hidden bg-gray-100 cursor-pointer shrink-0"
        onClick={handleNavigate}
      >
        <img
          src={getUrlImage(vehicle?.strSupplierImage)}
          alt={vehicle?.strSupplierName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="w-1/2 p-4 flex flex-col">
        <h3
          onClick={handleNavigate}
          className="text-[#1a4a8d] font-bold text-[15px] leading-tight uppercase mb-3 line-clamp-2 cursor-pointer hover:text-[#2566b0] transition-colors"
        >
          {vehicle.strSupplierName}
        </h3>

        <div className="flex items-center gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < vehicle.intEasiaCateID ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}
            />
          ))}
        </div>

        <div className="flex items-start gap-1.5 mb-3">
          <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2">
            {vehicle.strSupplierAddr || 'Dang cap nhat...'}
          </p>
        </div>

        <div className="mb-3">
          <span className="inline-block bg-[#e6f0ff] text-[#3b82f6] text-[11px] font-medium px-3 py-1 rounded-full">
            {vehicle.tag || 'Phuong tien'}
          </span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Gia tu</p>
            <p className="text-[#2563eb] font-bold text-lg leading-none">
              {vehicle.dblPriceFrom === '$0' || vehicle.dblPriceFrom === 'N/A' ? (
                <span className="text-gray-400 text-base">N/A</span>
              ) : (
                vehicle.dblPriceFrom
              )}
            </p>
          </div>

          <button
            onClick={() =>
              router.replaceParams(paths.shop.vehicle.detail, {
                item: vehicle,
              })
            }
            className="cursor-pointer text-[#2566b0] border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
          >
            Xem chi tiet
          </button>
        </div>
      </div>
    </div>
  );
};

const VehicleList = () => {
  const [filters] = useState({
    page: 1,
    pageSize: 15,
  });

  const { vehicleData } = useListVehicle(filters);

  return (
    <section className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Khám phá nhà xe</h2>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm text-gray-500 ml-2">Hien thi dang:</span>
          <button className="p-1.5 bg-blue-600 text-white rounded-md shadow-sm">
            <LayoutGrid size={18} />
          </button>
          <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors">
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vehicleData.map((vehicle: any) => (
          <VehicleCard key={vehicle.strVehicleGUID ?? vehicle.strSupplierGUID} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
};

export default VehicleList;
