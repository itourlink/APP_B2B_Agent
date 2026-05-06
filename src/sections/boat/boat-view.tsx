import { slidesBoat } from "@/components/banner/banner-data"
import BannerSlider from "@/components/banner/banner-slider"
import BoatList from "./components/boat-list"
import DestinationAccordion from "../tour/components/destination-accordion"

const BoatView = () => {
    return (
        <div className="relative">
            <BannerSlider slides={slidesBoat} />
            <div className="absolute left-1/2 -translate-x-1/2 top-[550px] z-50 w-full">
                {/* <TourSearch /> */}
            </div>
            <div className="mt-20">
                <BoatList />
            </div>
            <DestinationAccordion />
        </div>
    )
}

export default BoatView