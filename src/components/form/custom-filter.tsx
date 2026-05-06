import { useTranslate } from "@/locales";
import { useEffect, useState, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "../button/primary-button";
import { FilterIcon, Search } from "lucide-react";
import PanelPopup from "../popup/panel-popup";
import { DateRangePicker } from "./date-range-picker";
import { Select } from "./select";

interface Option {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

interface SelectItem {
  key: string;
  listOptions: Option[];
  value: string | number;
  label: string;
  placeholder?: string;
}

interface CustomFilterProps {
  time?: {
    keyStartTime: string;
    keyendTime: string;
    startTime: number;
    endTime: number;
  };
  search?: {
    keySearch: string;
    value: string;
    placeHoder?: string;
  }[]; // <-- changed to array
  listSelect?: SelectItem[];
  onChangeFilters: (key: string, value: string | number) => void;
  onReset?: () => void;
  className?: string;
  title?: string;
}

const CustomFilter = ({
  time,
  listSelect,
  search,
  onChangeFilters,
  onReset,
  className,
  title,
}: CustomFilterProps) => {
  const { t } = useTranslate("dashboard");
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<
    Record<string, string | number>
  >({});

  const searchFields = Array.isArray(search) ? search : search ? [search] : [];

  useEffect(() => {
    if (!time) return;
    if (open) {
      const initialFilters: Record<string, string | number> = {
        startTime: time.startTime,
        endTime: time.endTime,
      };
      if (listSelect)
        listSelect.forEach((item) => {
          initialFilters[item.key] = item.value;
        });

      setTempFilters(initialFilters);
    }
  }, [open, time, listSelect]);

  const handleTempFilterChange = (key: string, value: string | number) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleConfirm = () => {
    Object.entries(tempFilters).forEach(([key, value]) => {
      onChangeFilters(key, value);
    });
    setOpen(false);
  };
  useEffect(() => {
    if (!open) return;

    const initialFilters: Record<string, string | number> = {};

    searchFields.forEach((s) => {
      initialFilters[s.keySearch] = s.value;
    });

    if (time) {
      initialFilters["startTime"] = time.startTime;
      initialFilters["endTime"] = time.endTime;
    }

    if (listSelect)
      listSelect.forEach((item) => {
        initialFilters[item.key] = item.value;
      });

    setTempFilters(initialFilters);
  }, [open, search, time, listSelect]);

  useEffect(() => {
    const initialFilters: Record<string, string | number> = {};

    searchFields.forEach((s) => {
      initialFilters[s.keySearch] = s.value;
    });

    if (time) {
      initialFilters["startTime"] = time.startTime;
      initialFilters["endTime"] = time.endTime;
    }

    if (listSelect)
      listSelect.forEach((item) => {
        initialFilters[item.key] = item.value;
      });

    setTempFilters(initialFilters);
  }, [search, time, listSelect]); 

  return (
    <div className={twMerge("w-fit", className)}>
      <div className="lg:flex lg:flex-row flex-col gap-2 hidden">
        {searchFields.map((s, index) => (
          <div className="relative w-auto" key={s.keySearch + index}>
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="" size={16} />
            </span>

            <input
              value={tempFilters[s.keySearch] ?? ""}
              onChange={(e) => {
                handleTempFilterChange(s.keySearch, e.target.value);
                onChangeFilters(s.keySearch, e.target.value);
              }}
              type="text"
              placeholder={s.placeHoder ?? "Search"}
              className="w-full bg-transparent border border-gray-400 rounded-lg py-2 pl-10 pr-4 
   placeholder-gray-500 focus:outline-none"
            />
          </div>
        ))}

        {time && (
          <div className="w-full md:w-100">
            <DateRangePicker
              startTime={Number(time.startTime)}
              endTime={Number(time.endTime)}
              onStartTime={(value) => onChangeFilters(time.keyStartTime, value)}
              onEndTime={(value) => {
                onChangeFilters(time.keyendTime, value);
              }}
              // day={31}
              className={`border border-gray-400 rounded-lg`}
            />
          </div>
        )}
        {listSelect &&
          listSelect.length > 0 &&
          listSelect.map((item) => (
            <div className="w-auto md:min-w-44" key={item.key}>
              <Select
                placeholder={item.placeholder}
                options={item.listOptions}
                value={item.value}
                onChange={(value: any) => onChangeFilters(item.key, value)}
                label={item.label}
                className={`bg-black-600 text-white min-w-32`}
              />
            </div>
          ))}
      </div>
      <div
        onClick={() => setOpen(true)}
        className="lg:hidden flex justify-between w-full h-10 px-[12px] py-[10px] items-center gap-[6px] self-stretch rounded-[8px] border border-[#76D5CD] bg-[rgba(64,64,64,0.40)]"
      >
        <span className="text-gray-500">Filter</span>
        <FilterIcon className="text-gray-500" size={18} />
      </div>

      <PanelPopup
        title={title ?? "Filter"}
        open={open}
        onClose={() => setOpen(false)}
        isOverflowHidden={false}
      >
        <div className={twMerge("mt-1 h-full", className)}>
          <div className="min-h-[300px] space-y-2">
            {searchFields.map((s, index) => (
              <div className="relative w-auto" key={s.keySearch + index}>
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="text-gray-200" size={16} />
                </span>

                <input
                  value={tempFilters[s.keySearch] ?? ""}
                  onChange={(e) => {
                    handleTempFilterChange(s.keySearch, e.target.value);
                    onChangeFilters(s.keySearch, e.target.value);
                  }}
                  type="text"
                  placeholder={s.placeHoder ?? "Search"}
                  className="w-full bg-transparent border border-gray-400 rounded-lg py-2 pl-10 pr-4 
  text-gray-200 placeholder-gray-500 focus:outline-none"
                />
              </div>
            ))}

            {time && (
              <DateRangePicker
                startTime={Number(tempFilters.startTime)}
                endTime={Number(tempFilters.endTime)}
                onStartTime={(value) =>
                  handleTempFilterChange("startTime", value)
                }
                onEndTime={(value) => {
                  handleTempFilterChange("endTime", value);
                }}
                // day={31}
                className={`
bg-black-600 text-white
                border border-gray-400 rounded-[8px] 
                `}
              />
            )}
            <div className="mt-2 space-y-2">
              {listSelect &&
                listSelect.length > 0 &&
                listSelect.map((item) => (
                  <div className="w-auto md:min-w-32" key={item.key}>
                    <Select
                      placeholder={item.placeholder}
                      options={item.listOptions}
                      value={tempFilters[item.key] ?? item.value}
                      onChange={(value) =>
                        handleTempFilterChange(item.key, value)
                      }
                      label={item.label}
                      className={`bg-black-600 text-white w-full`}
                    />
                  </div>
                ))}
            </div>
            <div className="mt-8 flex items-center gap-5">
              {onReset && (
                <div className="grow">
                  <PrimaryButton
                    text={t("reset")}
                    className="bg-transparent border border-primary-color text-primary-color"
                    onClick={onReset}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <PrimaryButton
              onClick={() => setOpen(false)}
              text="Cancel"
              className="bg-transparent border border-brand-500 text-brand-500"
            />
            <PrimaryButton text="Confirm" onClick={handleConfirm} />
          </div>
        </div>
      </PanelPopup>
    </div>
  );
};

export default CustomFilter;
