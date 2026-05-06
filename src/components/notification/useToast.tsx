import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";
import { useToastStore } from "@/zustand/useToastStore";

const icons = {
  success: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
      <path
        d="M12.5 2.083C6.747 2.083 2.083 6.747 2.083 12.5S6.747 22.917 12.5 22.917 22.917 18.253 22.917 12.5 18.253 2.083 12.5 2.083Zm0 18.75c-4.595 0-8.333-3.738-8.333-8.333S7.905 4.167 12.5 4.167 20.833 7.905 20.833 12.5 17.095 20.833 12.5 20.833Zm3.923-12.055 1.473 1.473-6.438 6.464-3.862-3.861 1.473-1.473 2.389 2.389 4.965-4.992Z"
        fill="#2DC24E"
      />
    </svg>
  ),
  error: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
      <path
        d="M12.5 7.945v5.73M12.5 17.055v-.52M10.117 3.792C10.723 3.276 11.026 3.018 11.343 2.867c.361-.173.757-.262 1.157-.262.4 0 .796.089 1.157.262.318.151.621.409 1.226.926.624.531 1.258.8 2.091.865.793.063 1.19.095 1.521.212.765.27 1.367.872 1.637 1.637.117.33.149.727.213 1.521.065.834.333 1.466.864 2.09.517.605.776.908.927 1.225.35.733.35 1.584 0 2.315-.151.318-.41.621-.925 1.226-.518.58-.823 1.317-.867 2.091-.063.793-.096 1.19-.213 1.521-.134.378-.35.721-.634 1.004-.283.284-.626.5-1.004.633-.33.117-.727.15-1.52.213-.834.066-1.466.334-2.091.865-.605.517-.908.776-1.226.927-.361.172-.757.262-1.157.262-.4 0-.796-.09-1.157-.262-.317-.151-.62-.41-1.226-.926-.579-.517-1.316-.822-2.09-.867-.793-.063-1.19-.096-1.52-.213-.378-.134-.721-.35-1.004-.633-.284-.283-.5-.626-.634-1.004-.117-.33-.15-.728-.213-1.522-.044-.774-.349-1.51-.865-2.09-.517-.605-.775-.908-.927-1.225-.172-.362-.262-.758-.262-1.158 0-.4.09-.795.262-1.157.151-.318.41-.621.926-1.226.541-.636.8-1.274.865-2.09.063-.793.095-1.19.212-1.521.134-.378.35-.721.633-1.004.284-.283.627-.5 1.005-.633.33-.117.727-.15 1.52-.213.774-.044 1.51-.35 2.09-.865Z"
        stroke="#C22D2D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: <Info color="#3772ff" size={24} />,
};

const textColors = {
  success: "text-[#2DC24E]",
  error: "text-[#C22D2D]",
  info: "text-[#3772ff]",
};

const ToastComponent = () => {
  const { toastData, clearToast } = useToastStore();

  if (!toastData) return null;

  const { type, message } = toastData;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-8 left-[12px] right-4 sm:left-auto sm:right-10 w-[calc(100%-2rem)] sm:w-full sm:max-w-[353px] h-auto py-2 text-white flex items-center justify-start rounded-[10px] shadow-md px-4 gap-3 mx-auto sm:mx-0 bg-white`}
        style={{ zIndex: 99999 }}
      >
        {icons[type]}
        <div
          className={`text-[16px] flex-1 ${textColors[type]}  font-[400] leading-[24px] tracking-[0.24px]`}
        >
          {message}
        </div>
        <button
          onClick={clearToast}
          className="text-md font-bold text-white hover:text-gray-300 px-[6px] py-[1px] cursor-pointer"
        >
          <X color="gray" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ToastComponent;
