import { useComboboxByCode } from "@/hooks/actions/useComboBox";
import { useCurrency } from "@/components/currency/useCurrency";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useEffect, useMemo } from "react";
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
  const { currencyId, setCurrencyId } = useCurrency();

  const { data: currencyOptions = [] } =
    useComboboxByCode("075");

  const currencies = useMemo<Currency[]>(
    () =>
      currencyOptions
        .filter((item) => ["1", "3"].includes(item.value))
        .map((item) => ({
          value: item.value,
          label:
            item.label.match(/\(([A-Z]{3})/)?.[1] ?? item.label,
          symbol:
            item.label.match(/^([^\s]+)/)?.[1] ?? "",
        })),
    [currencyOptions]
  );

  // Khởi tạo mặc định lần đầu
  useEffect(() => {
    if (!currencyId && currencies.length) {
      setCurrencyId(Number(currencies[0].value));
    }
  }, [currencyId, currencies, setCurrencyId]);

  const selected = useMemo(
    () =>
      currencies.find(
        (item) => Number(item.value) === currencyId
      ) ?? currencies[0],
    [currencies, currencyId]
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
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
        <div className="flex items-center gap-1">

          <span className="text-base">
            {selected?.symbol}
          </span>

          <span className="text-sm font-medium">
            {selected?.label}
          </span>
        </div>

        <ChevronUp
          size={14}
          className={twMerge(
            "ml-auto transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </div>

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
              w-28
              max-h-64
              overflow-y-auto
              rounded-xl
              bg-white/20
              backdrop-blur-md
              shadow-xl
              border border-[rgba(64,64,64,0.5)]
              p-1
            "
          >
            {currencies.map((item) => (
              <div
                key={item.value}
                onClick={() =>
                  setCurrencyId(Number(item.value))
                }
                className={twMerge(
                  "flex items-center justify-between",
                  "px-3 py-2 rounded-lg",
                  "cursor-pointer transition-colors",
                  "hover:bg-[#4a6fa5] hover:text-white",
                  Number(item.value) === currencyId &&
                  "bg-[#4a6fa5] text-white"
                )}
              >
                <div className="flex items-center gap-1">
                  <span>{item.symbol}</span>
                  <span>{item.label}</span>
                </div>

                {Number(item.value) === currencyId && (
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