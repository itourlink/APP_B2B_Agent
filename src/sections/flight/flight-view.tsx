// Import component FlightList từ file bạn vừa tạo
// Giả sử file flight-list.tsx nằm cùng thư mục hoặc bạn điều chỉnh đường dẫn cho đúng
import { slidesFlight } from "@/components/banner/banner-data";
import FlightList from "./components/flight-list";
import BannerSlider from "@/components/banner/banner-slider";
const FlightView = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSlider slides={slidesFlight} />
      <div className="py-8">
        <FlightList />
      </div>
    </div>
  );
};

export default FlightView;