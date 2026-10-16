import { useRef, useState } from "react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { DateRange } from "react-date-range";
import type { Range } from "react-date-range";
import { useTranslate } from "@/locales";
import i18next from "i18next";

type Props = {
  isOpen?: boolean;

  value: {
    startDate: Date | null;
    endDate: Date | null;
  };

  onApply: (range: Props["value"]) => void;

  minDate?: Date | null;

  allowSameDay?: boolean;

  autoApply?: boolean;
};

const DateRangePopup = ({
  isOpen,
  value,
  onApply,
  minDate,
  allowSameDay = true,
  autoApply = false,
}: Props) => {
  const { t } = useTranslate("genericFilter");

  const locale =
    i18next.language === "vi"
      ? vi
      : enUS;

  const [temp, setTemp] = useState<Range[]>([
    {
      startDate: value.startDate || new Date(),
      endDate: value.endDate || new Date(),
      key: "selection",
    },
  ]);

  const [isCleared, setIsCleared] = useState(
    !value.startDate && !value.endDate
  );
  const selectionClickCount = useRef(0);

  const isSameDay =
    temp[0].startDate &&
    temp[0].endDate &&
    temp[0].startDate.toDateString() ===
    temp[0].endDate.toDateString();


  const isInvalidRange =
    !allowSameDay && isSameDay;

  if (!isOpen) return null;

  const handleClear = () => {
    selectionClickCount.current = 0;
    setTemp([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);

    onApply({
      startDate: null,
      endDate: null,
    });
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl w-90">
      <DateRange
        locale={locale}
        ranges={temp}
        onChange={(item) => {
          const selection = item.selection;
          setIsCleared(false);
          setTemp([selection]);

          if (!autoApply) return;

          if (selectionClickCount.current === 0) {
            selectionClickCount.current = 1;
            return;
          }

          const selectedSameDay =
            selection.startDate &&
            selection.endDate &&
            selection.startDate.toDateString() === selection.endDate.toDateString();

          if (!allowSameDay && selectedSameDay) return;

          selectionClickCount.current = 0;
          onApply({
            startDate: selection.startDate ?? null,
            endDate: selection.endDate ?? null,
          });
        }}
        moveRangeOnFirstSelection={false}
        showDateDisplay={false}
        rangeColors={["#2566b0"]}
        minDate={minDate === null ? undefined : (minDate || new Date())}
      />

      <div className="flex justify-between mt-4 text-sm bg-gray-100 p-3 rounded-lg">
        <div>
          <div className="text-gray-500">
            {t("startDate")}
          </div>

          <div className="font-medium">
            {isCleared
              ? t("selectDate")
              : format(
                temp[0].startDate!,
                "dd MMM yyyy",
                { locale }
              )}
          </div>
        </div>

        <div className="flex items-center">
          →
        </div>

        <div>
          <div className="text-gray-500">
            {t("endDate")}
          </div>

          <div className="font-medium">
            {isCleared
              ? t("selectDate")
              : format(
                temp[0].endDate!,
                "dd MMM yyyy",
                { locale }
              )}
          </div>
        </div>
      </div>

      {!autoApply && <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-lg cursor-pointer"
        >
          {t("clear")}
        </button>

        <button
          type="button"
          disabled={isInvalidRange}
          onClick={(e) => {
            e.preventDefault();

            if (isInvalidRange) return;

            onApply({
              startDate: temp[0].startDate ?? null,
              endDate: temp[0].endDate ?? null,
            });
          }}
          className={`
    px-4 py-2 rounded-lg transition text-white
    ${isInvalidRange
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#4a6fa5] hover:bg-[#3b5b7e] cursor-pointer"
            }
  `}
        >
          {t("apply")}
        </button>
      </div>}
    </div>
  );
};

export default DateRangePopup;
