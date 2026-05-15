import PanelPopup from "@/components/popup/panel-popup"
import TourCustomizedPopup from "./components/tour-customized-popup"
import { useState } from "react"

const TourCustomized = () => {
    const [openPopup, setOpenPopup] = useState(false)
    return (
        <>
            <button onClick={() => setOpenPopup(true)} className="cursor-pointer rounded-lg border border-[rgba(64,64,64,0.5)] px-3 py-2 text-[14px] font-medium text-gray-700 hover:text-[#2566b0] hover:bg-blue-50 transition-all duration-200 active:scale-95">
                Thêm tour customize
            </button>

            <PanelPopup
                title="Thêm tour customized"
                open={openPopup}
                onClose={() => setOpenPopup(false)}
                className="w-[900px]"
            >
                <div className="max-h-[80vh] flex flex-col">
                    <div className="flex-1">
                        <TourCustomizedPopup onClose={() => setOpenPopup(false)} />
                    </div>
                </div>
            </PanelPopup>
        </>
    )
}

export default TourCustomized
