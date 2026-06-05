import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import {
  useFormContext,
  Controller,
  useFormState,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  name: string;
  label?: {
    text?: string;
    icon?: React.ReactNode;
  };
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
};

export function RHFMultiSelect({
  name,
  label,
  options,
  placeholder,
  disabled = false,
}: Props) {
  const { t } = useTranslation("hook-form");

  const { control, clearErrors } = useFormContext();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  const { errors } = useFormState({ name });

  const error = errors[name];

  // =========================
  // CLICK OUTSIDE
  // =========================

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // =========================
  // AUTO CLEAR ERROR
  // =========================

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        clearErrors(name);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error, name, clearErrors]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValues: (string | number)[] =
          field.value || [];

        const filteredOptions = options.filter((opt) =>
          opt.label
            .toLowerCase()
            .includes(search.toLowerCase())
        );

        const toggleValue = (
          val: string | number
        ) => {
          if (disabled) return;

          if (selectedValues.includes(val)) {
            field.onChange(
              selectedValues.filter((v) => v !== val)
            );
          } else {
            field.onChange([
              ...selectedValues,
              val,
            ]);
          }
        };

        return (
          <div
            className="flex flex-col gap-1 w-full relative"
            ref={ref}
          >
            {/* LABEL */}

            {label && (
              <div className="flex gap-1 mb-1">
                <span>{label.text}</span>

                <span className="text-red-400">
                  {label.icon}
                </span>
              </div>
            )}

            {/* INPUT BOX */}

            <div
              onClick={() => {
                if (!disabled) {
                  setOpen((prev) => !prev);
                }
              }}
              className={twMerge(
                "flex items-center flex-wrap gap-2 px-4 py-2 min-h-[48px] rounded-[10px] border transition-all",
                disabled
                  ? "bg-gray-100 opacity-60 cursor-not-allowed"
                  : "bg-white cursor-pointer",
                error
                  ? "border-red-500"
                  : "border-gray-300"
              )}
            >
              {/* PLACEHOLDER */}

              {selectedValues.length === 0 ? (
                <span className="text-[#b7b9c0]">
                  {placeholder ||
                    t("selectPlaceholder")}
                </span>
              ) : (
                selectedValues.map((val) => {
                  const opt = options.find(
                    (o) => o.value === val
                  );

                  return (
                    <div
                      key={val}
                      className="flex items-center gap-1 text-black border border-gray-300 rounded-md px-2 py-1 bg-blue-50/80"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >
                      <span>{opt?.label}</span>

                      {!disabled && (
                        <X
                          size={14}
                          className="cursor-pointer"
                          onClick={() =>
                            toggleValue(val)
                          }
                        />
                      )}
                    </div>
                  );
                })
              )}

              <ChevronDown
                className={twMerge(
                  "ml-auto transition",
                  open && "rotate-180"
                )}
              />
            </div>

            {/* DROPDOWN */}

            <AnimatePresence>
              {open && !disabled && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 6,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="absolute z-10 top-full mt-2 w-full border border-gray-300 bg-white rounded-xl shadow-xl max-h-60 overflow-auto"
                >
                  {/* SEARCH */}

                  <div className="sticky top-0 p-2 border-b border-gray-300 bg-white">
                    <input
                      value={search}
                      disabled={disabled}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder={t(
                        "searchPlaceholder"
                      )}
                      className="w-full px-3 py-2 rounded-md outline-none"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    />
                  </div>

                  {/* OPTIONS */}

                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => {
                      const active =
                        selectedValues.includes(
                          opt.value
                        );

                      return (
                        <div
                          key={opt.value}
                          onClick={(e) => {
                            e.stopPropagation();

                            toggleValue(opt.value);
                          }}
                          className={twMerge(
                            "px-4 py-2 cursor-pointer transition-all",
                            active
                              ? "bg-[#4a6fa5] text-white"
                              : "hover:bg-[#4a6fa5] hover:text-white"
                          )}
                        >
                          {opt.label}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      {t("noData")}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ERROR */}

            {error && (
              <div className="text-red-500 text-xs mt-1">
                {error.message}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}