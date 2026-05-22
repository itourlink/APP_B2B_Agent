import VehicleList from './components/vehicle-list';
import BannerSlider from '@/components/banner/banner-slider';
import { slidesVehicle } from '@/components/banner/banner-data';

const VehicleView = () => {
  return (
    <main className="min-h-screen bg-white">
      <BannerSlider slides={slidesVehicle} />
      <VehicleList />
    </main>
  );
};

export default VehicleView;
