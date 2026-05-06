import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const listCurrency = [
  { label: "VND", value: "vnd", symbol: "₫" },
  { label: "USD", value: "usd", symbol: "$" },
];
interface Props {
  open: boolean;
  handleEnter: () => void;
  handleLeave: () => void;
}

export const SelectCurrency = ({
  open,
  handleEnter,
  handleLeave,
}: Props) => {
  const [selected, setSelected] = useState(listCurrency[0]);

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="flex w-10 h-10 relative justify-center items-center rounded-lg border border-[rgba(64,64,64,0.5)] cursor-pointer"
    >
      <span>{selected.symbol}</span>

      <AnimatePresence>
        {open && (
          <motion.div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute w-28 bg-white/20 backdrop-blur-md rounded-2xl right-0 top-[110%] p-2 space-y-1 shadow-xl border border-[rgba(64,64,64,0.5)]"
          >
            {listCurrency.map((item) => (
              <div
                key={item.value}
                onClick={() => setSelected(item)}
                className={twMerge(
                  "flex justify-between p-2 rounded-lg cursor-pointer",
                  "hover:bg-[#4a6fa5] hover:text-white text-black",
                  selected.value === item.value && "bg-[#4a6fa5] text-white"
                )}
              >
                <span>{item.label}</span>
                <span>{item.symbol}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};