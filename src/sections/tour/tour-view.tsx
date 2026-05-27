import { slidesTour } from "@/components/banner/banner-data";
import BannerSlider from "@/components/banner/banner-slider";
import TourList from "./components/tour-list";
import DestinationAccordion from "./components/destination-accordion";
import Partner from "./components/partner";
import TourSearch from "./components/tour-search";
const TourView = () => {
    return (
        <div className="relative">
            <BannerSlider slides={slidesTour} />
            <div className="sticky top-30 z-50 mt-[-50px] z-[49]">
                <TourSearch />
            </div>
            <div className="mt-20">
                <TourList />
            </div>
            <DestinationAccordion />
            <Partner />

        </div>
    );
};

export default TourView;