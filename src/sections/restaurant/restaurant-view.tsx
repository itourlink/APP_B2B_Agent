import BannerSlider from '@/components/banner/banner-slider';
import { slidesRestaurant } from '@/components/banner/banner-data';
import { RestaurantList } from './components/restaurant-list';

const RestaurantView = () => (
  <main className="min-h-screen bg-gray-50">
    <BannerSlider slides={slidesRestaurant} />
    <RestaurantList />

  </main>
);

export default RestaurantView;