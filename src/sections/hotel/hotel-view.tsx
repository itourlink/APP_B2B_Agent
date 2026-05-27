import { slidesHotel } from "@/components/banner/banner-data"
import BannerSlider from "@/components/banner/banner-slider"
import HotelList from "./components/hotel-list"
import DestinationCarousel from "./components/destination-carousel"
import HotelSearch from "./components/hotel-search"

const HotelView = () => {
    return (
        <div className="relative">
            <BannerSlider slides={slidesHotel} />
            <div className="sticky top-30 mt-[-50px] z-[49]">
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