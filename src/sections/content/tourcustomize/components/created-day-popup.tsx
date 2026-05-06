import { Popup } from "@/components/popup/popup";
import AddTourCustomize from "../../info/components/add-tour-customize";

interface CreatedDayPopupProps {
  open: boolean;
  onClose: () => void;
  strTourCustomizedGUID: string;
  intDayOrder: number;
}

const CreatedDayPopup = ({ open, onClose, strTourCustomizedGUID, intDayOrder }: CreatedDayPopupProps) => {
  // console.log("--- CreatedDayPopup nhận dữ liệu từ ChangeDayOrder ---");
  // console.log("GUID:", strTourCustomizedGUID);
  // console.log("Thứ tự ngày:", intDayOrder);
  
  return (
    <Popup
      open={open}
      onClose={onClose}
      title="Created Day"
      className="w-[450px]"
    >
      <div className="p-1 font-sans">
        <AddTourCustomize
          onClose={onClose}
          strTourCustomizedGUID={strTourCustomizedGUID}
          intDayOrder={intDayOrder}
        />
      </div>
    </Popup>
  );
};

export default CreatedDayPopup;
