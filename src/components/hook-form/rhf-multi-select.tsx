import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useFormContext, Controller, useFormState } from "react-hook-form";
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
};

export function RHFMultiSelect({
  name,
  label,
  options,
  placeholder = "Select...",
}: Props) {
  const { control, clearErrors } = useFormContext();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  const { errors } = useFormState({ name });
  const error = errors[name];

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto clear error
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => clearErrors(name), 3000);

      return () => clearTimeout(t);
    }
  }, [error, name, clearErrors]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValues: string[] =
          typeof field.value === "string"
            ? field.value.split(",").filter(Boolean)
            : [];

        const filteredOptions = options.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase())
        );

        // FIX: keep value as csv string
        const toggleValue = (val: string | number) => {
          const value = String(val);

          let updatedValues: string[];

          if (selectedValues.includes(value)) {
            updatedValues = selectedValues.filter((v) => v !== value);
          } else {
            updatedValues = [...selectedValues, value];
          }

          field.onChange(updatedValues.join(","));
        };

        return (
          <div className="flex flex-col gap-1 w-full relative" ref={ref}>
            {/* LABEL */}
            {label && (
              <div className="flex gap-1 text-mdMedium mb-1">
                <span>{label.text}</span>
                <span className="text-red-400">{label.icon}</span>
              </div>
            )}

            {/* INPUT BOX */}
            <div
              onClick={() => setOpen(!open)}
              className={twMerge(
                "flex items-center flex-wrap gap-2 text px-4 py-2 min-h-[48px] rounded-[10px] cursor-pointer border",
                error ? "border-red-500" : "border-gray-300"
              )}
            >
              {/* SELECTED TAGS */}
              {selectedValues.length === 0 ? (
                <span className="text-[#b7b9c0]">{placeholder}</span>
              ) : (
                selectedValues.map((val) => {
                  // FIX: compare same type
                  const opt = options.find(
                    (o) => String(o.value) === val
                  );

                  return (
                    <div
                      key={val}
                      className="flex items-center gap-1 bg- border border-gray-300 rounded-md px-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{opt?.label}</span>

                      <X
                        size={14}
                        className="cursor-pointer"
                        onClick={() => toggleValue(val)}
                      />
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
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full z-10 mt-2 bg-white border border-gray-300 rounded-xl shadow-xl max-h-60 overflow-auto"
                >
                  {/* SEARCH BOX */}
                  <div className="sticky top-0 p-2 bg-white border-b border-gray-300">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="w-full px-3 py-2 rounded-md bg-gray-300 text-black outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* OPTIONS */}
                  {filteredOptions.map((opt) => {
                    // FIX: compare same type
                    const active = selectedValues.includes(
                      String(opt.value)
                    );

                    return (
                      <div
                        key={opt.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleValue(opt.value);
                        }}
                        className={twMerge(
                          "px-4 py-2 cursor-pointer",
                          active
                            ? "bg-[#5f7eac] text-white border"
                            : "hover:bg-gray-300 hover:text-white"
                        )}
                      >
                        {opt.label}
                      </div>
                    );
                  })}
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