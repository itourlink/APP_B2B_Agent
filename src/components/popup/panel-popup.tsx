import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Popup } from "./popup";
import { twMerge } from "tailwind-merge";
import { ChevronLeft } from "lucide-react";
import Breadcrumb from "../breadcrums";

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
  className?: string;
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
  isOverflowHidden = true,
  className,
}: Props) => {
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
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
  return (
    <div>
      {isMobile ? (
        <div className="">
          {/* Overlay + Panel */}
          <AnimatePresence>
            {open && (
              <>
                {/* Overlay mờ nền */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 overscroll-contain"
                  onClick={onClose}
                />

                <motion.div
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 100) {
                      if (!onClose) return;
                      onClose();
                    }
                  }}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed bottom-0 left-0 right-0 rounded-t-3xl z-20 min-h-[60vh] max-h-[95vh] overflow-hidden"
                >
                  <div className="p-5 flex flex-col w-full justify-center items-center">
                    <div className="w-[64px] h-[4px] mb-2 rounded-[100px] bg-white" />

                    <div className=" w-full flex gap-2 text-left pb-2">
                      {onBack && !hideBack && (
                        <ChevronLeft
                          className="cursor-pointer"
                          onClick={onBack}
                        />
                      )}

                      <Breadcrumb
                        title={title ?? ""}
                        description={description ?? ""}
                      />
                    </div>
                    <div
                      className={twMerge(
                        "max-h-[510px] w-full pt-1",
                        isOverflowHidden
                          ? "overflow-y-scroll scrollbar-hiden"
                          : ""
                      )}
                    >
                      {children}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Popup
          title={title}
          open={open}
          onClose={onClose}
          subChildren={subChildren}
          className={className}
          onBack={onBack}
          hideBack={hideBack}
        >
          <div className="overflow-auto scrollbar-hide">{children}</div>
        </Popup>
      )}
    </div>
  );
};

export default PanelPopup;
