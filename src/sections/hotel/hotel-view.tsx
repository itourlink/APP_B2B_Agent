import { slidesHotel } from "@/components/banner/banner-data"
import BannerSlider from "@/components/banner/banner-slider"
import HotelList from "./components/hotel-list"
import DestinationCarousel from "./components/destination-carousel"
import HotelSearch from "./components/hotel-search"

const HotelView = () => {
    return (
        <div className="relative">
            <BannerSlider slides={slidesHotel} />
            <div className="absolute left-1/2 -translate-x-1/2 top-[550px] z-50 w-full">
                <HotelSearch />
            </div>
            <div className="mt-20">
                <HotelList />
            </div>
            <DestinationCarousel />
        </div>
    )
}

export default HotelView