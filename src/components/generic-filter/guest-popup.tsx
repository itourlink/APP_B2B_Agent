import { useEffect, useState } from "react";

const ages = Array.from({ length: 17 }, (_, i) => i + 1);
type Props = {
    isOpen: boolean;
    value: {
        adults: number;
        children: number;
        childAges: number[];
    };
    onDone: (val: Props["value"]) => void;
};
const GuestPopup = ({ isOpen, value, onDone }: Props) => {
    const safeValue = value || {
        adults: 1,
        children: 0,
        childAges: [],
    };

    const [adults, setAdults] = useState(safeValue.adults);
    const [children, setChildren] = useState(safeValue.children);
    const [childAges, setChildAges] = useState<number[]>(safeValue.childAges);

    useEffect(() => {
        setAdults(safeValue.adults);
        setChildren(safeValue.children);
        setChildAges(safeValue.childAges);
    }, [value]);

    if (!isOpen) return null;


    const handleChildrenChange = (type: "inc" | "dec") => {
        if (type === "inc") {
            setChildren((prev) => prev + 1);
            setChildAges((prev) => [...prev, 1]);
        } else {
            setChildren((prev) => Math.max(0, prev - 1));
            setChildAges((prev) => prev.slice(0, -1));
        }
    };

    const handleAgeChange = (index: number, value: number) => {
        const newAges = [...childAges];
        newAges[index] = value;
        setChildAges(newAges);
    };

    return (
        <div className="w-[320px] bg-white rounded-2xl shadow-lg p-4">
            {/* Adults */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <div className="font-semibold">Adults</div>
                    <div className="text-sm text-gray-500">Ages 18 or above</div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setAdults((p) => Math.max(1, p - 1))}
                        className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                    >
                        -
                    </button>
                    <span>{adults}</span>
                    <button
                        onClick={() => setAdults((p) => p + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="w-full h-px bg-gray-300"></div>

            {/* Children */}
            <div className="flex justify-between items-center my-4">
                <div>
                    <div className="font-semibold">Children</div>
                    <div className="text-sm text-gray-500">Ages 1-17</div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleChildrenChange("dec")}
                        className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                    >
                        -
                    </button>
                    <span>{children}</span>
                    <button
                        onClick={() => handleChildrenChange("inc")}
                        className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Children list */}
            {children > 0 && (
                <div
                    className={`mt-2 pr-2 ${children >= 4 ? "max-h-30 overflow-y-auto " : ""
                        }`}
                >
                    {childAges.map((age, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center mb-3"
                        >
                            <span>Child {index + 1}</span>

                            <select
                                value={age}
                                onChange={(e) =>
                                    handleAgeChange(index, Number(e.target.value))
                                }
                                className="border border-gray-300 rounded-md px-2 py-1 cursor-pointer focus:outline-0 cursor-pointer"
                            >
                                {ages.map((a) => (
                                    <option className="cursor-pointer" key={a} value={a}>
                                        {a} years
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            )}

            {/* Done button */}
            <button
                onClick={() =>
                    onDone({
                        adults,
                        children,
                        childAges,
                    })
                }
                className="w-full mt-4 bg-[#4a6fa5] hover:bg-[#3b5b7e] text-white py-2 rounded-lg cursor-pointer transition"
            >
                Apply
            </button>
        </div>
    );
};

export default GuestPopup;