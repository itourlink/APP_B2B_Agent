import type { Option } from "./type-select";
import TypeSelect from "./type-select";

interface TourTypeValues {
    mainType: string | number;
    subType: string | number;
}

interface Props {
    value: TourTypeValues;
    onChange: (val: TourTypeValues) => void;
    mainOptions: Option[];
    getSubOptions: (mainValue: string | number) => Option[];
}

const TourTypeSelect = ({ value, onChange, mainOptions, getSubOptions }: Props) => {

    const handleMainChange = (val: string | number) => {
        onChange({
            mainType: val,
            subType: "all",
        });
    };

    const handleSubChange = (val: string | number) => {
        onChange({
            ...value,
            subType: val,
        });
    };

    // Kiểm tra xem có cần hiện Select thứ 2 không (ví dụ: khác "Tất cả")
    const showSubSelect = value.mainType !== "all" && value.mainType !== "";
    const subOptions = getSubOptions(value.mainType);

    return (
        <div className="flex items-center gap-3 animate-in fade-in duration-300">
            {/* Select Chính */}
            <TypeSelect
                value={value.mainType as string}
                options={mainOptions}
                onChange={handleMainChange}
            />

            {/* Select Phụ - Chỉ hiện khi chọn loại tour cụ thể */}
            {showSubSelect && subOptions.length > 0 && (
                <div className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-300">
                    <TypeSelect
                        value={value.subType as string}
                        options={subOptions}
                        onChange={handleSubChange}
                    />
                </div>
            )}
        </div>
    );
};

export default TourTypeSelect;