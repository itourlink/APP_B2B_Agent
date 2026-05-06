import { slidesFlight } from '@/components/banner/banner-data';
import GuideFeeList from './components/guide-fee-list';
import BannerSlider from '@/components/banner/banner-slider';

const GuideFeeView = () => (
  <main className="min-h-screen bg-gray-50">
    <BannerSlider slides={slidesFlight}/>
    <GuideFeeList />
  </main>
);

export default GuideFeeView;