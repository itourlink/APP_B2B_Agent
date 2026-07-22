import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Lang from "../lang/lang";
import { CONFIG } from "@/config-global";
import { LogoutPopup } from "./logout-popup";

interface Props {
  open: boolean;
  onClose?: () => void;
  onBack?: () => void;
  hideBack?: boolean;
  children: React.ReactNode;
  subChildren?: React.ReactNode;
  title?: string;
  description?: string;
  isOverflowHidden?: boolean;
  lang?: boolean;
  logout?: boolean;
  className?: string;
  footer?: React.ReactNode;
  bodyClassName?: string;
}

const PanelPopup = ({
  open,
  onClose,
  onBack,
  hideBack,
  children,
  subChildren,
  title,
  description,
  className,
  footer,
  lang,
  logout,
  bodyClassName,
}: Props) => {

  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || !onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const bodyMaxHeightClass = footer
    ? "max-h-[calc(90vh-140px)]"
    : "max-h-[calc(90vh-96px)]";

  const handleLogout = async () => {
    window.location.href = `${CONFIG.serverUrl}auth/logout`;
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="flex min-h-full items-center justify-center">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                className={twMerge(
                  "flex w-[700px] max-w-[95vw] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]",
                  className
                )}
              >
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 md:px-6">
                  <div className="flex min-w-0 items-start gap-3">
                    {onBack && !hideBack && (
                      <button
                        type="button"
                        onClick={onBack}
                        className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                      >
                        <ChevronLeft size={18} />
                      </button>
                    )}

                    <div className="min-w-0">
                      {title && (
                        <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
                          {title}
                        </h2>
                      )}

                      {description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>

                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="cursor-pointer inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                    >
                      <X size={18} />
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    {lang && (
                      <Lang />
                    )}
                    {logout && (
                      <button
                        onClick={() => setConfirmLogout(true)}
                        className="h-10 rounded-lg border border-[rgba(64,64,64,0.5)] px-3 flex items-center justify-evenly cursor-pointer"
                      >
                        <LogOut size={18} />
                      </button>
                    )}

                    <LogoutPopup
                      open={confirmLogout}
                      onClose={() => setConfirmLogout(false)}
                      onConfirm={handleLogout}
                    />
                  </div>
                </div>

                <div
                  className={twMerge(
                    "min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6",
                    bodyMaxHeightClass,
                    bodyClassName
                  )}
                >
                  {children}
                </div>

                {footer && (
                  <div className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 md:px-6">
                    {footer}
                  </div>
                )}
              </motion.div>

              {subChildren && (
                <div
                  className="hidden w-[320px] shrink-0 xl:block"
                  onClick={(event) => event.stopPropagation()}
                >
                  {subChildren}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PanelPopup;
