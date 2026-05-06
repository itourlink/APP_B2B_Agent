import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslate } from "@/locales";

type Option = {
  label: string;
  value: string | number;
  icon?: ReactNode;
};

type Props = {
  label?: string;
  helperText?: string;
  options: Option[];
  value: string | number;
  onChange?: (value: string | number) => void;
  InputProps?: {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
  };
  InputLabelProps?: {
    shrink?: boolean;
  };
  placeholder?: string;
  disable?: boolean;
  className?: string;
};

export function Select({
  label,
  options,
  value,
  onChange,
  InputProps,
  placeholder,
  disable = false,
  className = "",
}: Props) {
  // const { isDarkStore } = useDarkModeStore();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslate("dashboard");
  const selectedOption = options.find((opt) => opt.value === value);

  const finalPlaceholder = placeholder || t("select_placeholder");
  // Đóng khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuSelect = open && (
    <div className="absolute top-12 left-0 w-full z-10 rounded-xl shadow-lg max-h-32 md:max-h-56 overflow-auto ">
      {options.map((opt) => (
        <div
          key={opt.value}
          className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-colors text-black hover:text-white bg-white hover:bg-[#4a6fa5]"
          onClick={() => {
            // setOpen(false);
            if (onChange) onChange(opt.value);
          }}
        >
          {opt.icon && opt.icon}
          <span className=""> {opt.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={` flex w-full flex-col gap-1 `} ref={ref}>
      <div
        className={` ${className}  w-full relative sm:px-4 px-3 py-[10px] cursor-pointer border border-gray-400 rounded-[8px]`}
        onClick={() => {
          if (!disable) setOpen((prev) => !prev);
        }}
      >
        {label ? (
          <div className=" w-full flex items-center justify-between">
            <div className="flex w-full items-center justify-between sm:gap-2">
              <div className="flex items-center gap-2">
                {InputProps?.startAdornment && (
                  <div className="flex items-center">
                    {InputProps.startAdornment}
                  </div>
                )}
                <span className="text-sm text-black">
                  {selectedOption?.label || (
                    <span className="">{finalPlaceholder}</span>
                  )}
                </span>
              </div>

              <div className="">
                {InputProps?.endAdornment ? (
                  InputProps.endAdornment
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>

            {menuSelect}
          </div>
        ) : (
          <div className=" flex justify-between">
            <div className="flex items-center gap-2">
              {InputProps?.startAdornment && (
                <div className="flex items-center">
                  {InputProps.startAdornment}
                </div>
              )}
              <span className="text-sm">
                {selectedOption?.label || (
                  <span className="text-gray-400">{finalPlaceholder}</span>
                )}
              </span>
            </div>
            <div className="ml-2">
              {InputProps?.endAdornment ? (
                InputProps.endAdornment
              ) : (
                <ChevronDown size={16} />
              )}
            </div>

            {menuSelect}
          </div>
        )}
      </div>
    </div>
  );
}
