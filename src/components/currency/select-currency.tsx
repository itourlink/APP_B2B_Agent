import { useComboboxByCode } from "@/hooks/actions/useComboBox";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  open: boolean;
  handleEnter: () => void;
  handleLeave: () => void;
}

interface Currency {
  value: string;
  label: string;
  symbol: string;
}

export const SelectCurrency = ({
  open,
  handleEnter,
  handleLeave,
}: Props) => {
  const { data: currencyOptions = [] } =
    useComboboxByCode("075");

  const currencies = useMemo<Currency[]>(
    () =>
      currencyOptions.map((item) => {
        const symbol =
          item.label.match(/^([^\s]+)/)?.[1] ?? "";

        const label =
          item.label.match(/\(([A-Z]{3})/)?.[1] ??
          item.label;

        return {
          value: item.value,
          label,
          symbol,
        };
      }),
    [currencyOptions]
  );

  const [selected, setSelected] =
    useState<Currency | null>(null);

  useEffect(() => {
    if (!selected && currencies.length) {
      setSelected(currencies[0]);
    }
  }, [currencies, selected]);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Trigger */}
      <div
        className="
          flex items-center gap-2
          h-10 px-3
          rounded-lg
          border border-[rgba(64,64,64,0.5)]
          bg-white/10 backdrop-blur-sm
          cursor-pointer
          min-w-[110px]
        "
      >
        <span className="text-base">
          {selected?.symbol}
        </span>

        <span className="text-sm font-medium">
          {selected?.label}
        </span>

        <ChevronUp
          size={14}
          className={twMerge(
            "ml-auto transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="
              absolute
              top-[calc(100%+8px)]
              right-0
              z-50
              w-40
              max-h-64
              overflow-y-auto
              rounded-xl
           bg-white/20 backdrop-blur-md
              shadow-xl
              border
              p-1
            "
          >
            {currencies.map((item) => (
              <div
                key={item.value}
                onClick={() => setSelected(item)}
                className={twMerge(
                  "flex items-center justify-between",
                  "px-3 py-2 rounded-lg",
                  "cursor-pointer transition-colors",
                  "hover:bg-[#4a6fa5] hover:text-white",
                  selected?.value === item.value &&
                  "bg-[#4a6fa5] text-white"
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{item.symbol}</span>
                  <span>{item.label}</span>
                </div>

                {selected?.value === item.value && (
                  <span>✓</span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};