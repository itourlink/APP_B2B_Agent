import { Bell } from "lucide-react"
import { useState } from "react"
import NotificationPopup from "./notification-popup"
import { AnimatePresence, motion } from "framer-motion"

const Notification = () => {
    const [open, setOpen] = useState(false)

    return (
        <div
            className="relative cursor-pointer group"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button className="cursor-pointer p-2.5 text-gray-600 group-hover:bg-gray-100 group-hover:text-[#4a6fa5] rounded-full transition-all duration-300">
                <Bell size={20} strokeWidth={2} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 z-50"
                    >
                        <NotificationPopup />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Notification