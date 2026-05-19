import { Popup } from "@/components/popup/popup";
import { useTranslate } from "@/locales";
import AddTourCustomize from "../../info/components/add-tour-customize";

interface CreatedDayPopupProps {
  open: boolean;
  onClose: () => void;

  // FIX
  strTourCustomizedGUID: string;

  intDayOrder: number;

  // callback add local
  onAddLocalDay?: (day: any) => void;
}

const CreatedDayPopup = ({
  open,
  onClose,
  strTourCustomizedGUID,
  intDayOrder,
  onAddLocalDay,
}: CreatedDayPopupProps) => {
  const { t } = useTranslate("tourcustomize");

  return (
    <Popup
      open={open}
      onClose={onClose}
      title={t("createdDay")}
      className="w-[450px]"
    >
      <div className="p-1 font-sans">
        <AddTourCustomize
          onClose={onClose}
          strTourCustomizedGUID={
            strTourCustomizedGUID
          }
          intDayOrder={intDayOrder}

          // FIX
          onAddLocalDay={onAddLocalDay}
        />
      </div>
    </Popup>
  );
};

export default CreatedDayPopup;
