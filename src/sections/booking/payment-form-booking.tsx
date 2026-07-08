import { twMerge } from "tailwind-merge";

interface TravellerFormProps {
    t: any;
    travellerForm: any;
    setTravellerForm: any;
    travellerErrors: any;
    setTravellerErrors: any;

    isOpenCountry: boolean;
    setIsOpenCountry: any;

    countrySearch: string;
    setCountrySearch: any;

    filteredCountries: any[];
    selectedCountry: any;

    getFlagClass: (flag: string) => string;

    TITLES_OPTIONS: any[];
}

const PaymentFormBooking = ({
    t,
    travellerForm,
    setTravellerForm,
    travellerErrors,
    setTravellerErrors,

    isOpenCountry,
    setIsOpenCountry,

    countrySearch,
    setCountrySearch,

    filteredCountries,
    selectedCountry,

    getFlagClass,

    TITLES_OPTIONS,
}: TravellerFormProps) => {

    const clearError = (field: string) => {
        if (travellerErrors[field]) {
            setTravellerErrors((prev: any) => ({
                ...prev,
                [field]: "",
            }));
        }
    };


    const renderError = (message?: string) => {
        if (!message) return null;

        return (
            <div className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1">
                <svg
                    className="w-3.5 h-3.5 shrink-0 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>

                <span>{message}</span>
            </div>
        );
    };


    const handleChange = (field: string, value: any) => {
        setTravellerForm((prev: any) => ({
            ...prev,
            [field]: value,
        }));

        clearError(field);
    };


    return (
        <div className="mt-4 p-4 border-t border-gray-200">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">


                {/* Title */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        {t("title")} <span className="text-red-500">*</span>
                    </label>

                    <select
                        value={travellerForm.intSaluteID}
                        onChange={(e) => handleChange(
                            "intSaluteID",
                            e.target.value
                        )}
                        className={twMerge(
                            "w-full border rounded px-3 py-2 outline-none bg-white",
                            travellerErrors.intSaluteID
                                ? "border-red-500"
                                : "border-gray-300"
                        )}
                    >
                        {TITLES_OPTIONS.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>

                    {renderError(travellerErrors.intSaluteID)}
                </div>



                {/* First name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        {t("firstName")}
                        <span className="text-red-500">*</span>
                    </label>

                    <input
                        value={travellerForm.strPassengerFirstName}
                        onChange={(e) =>
                            handleChange(
                                "strPassengerFirstName",
                                e.target.value
                            )
                        }
                        placeholder={t("enterFirstName")}
                        className={twMerge(
                            "w-full border rounded px-3 py-2 outline-none",
                            travellerErrors.strPassengerFirstName
                                ? "border-red-500"
                                : "border-gray-300"
                        )}
                    />

                    {renderError(
                        travellerErrors.strPassengerFirstName
                    )}
                </div>



                {/* Last name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        {t("lastName")}
                        <span className="text-red-500">*</span>
                    </label>

                    <input
                        value={travellerForm.strPassengerLastName}
                        onChange={(e) =>
                            handleChange(
                                "strPassengerLastName",
                                e.target.value
                            )
                        }
                        placeholder={t("enterLastName")}
                        className={twMerge(
                            "w-full border rounded px-3 py-2 outline-none",
                            travellerErrors.strPassengerLastName
                                ? "border-red-500"
                                : "border-gray-300"
                        )}
                    />

                    {renderError(
                        travellerErrors.strPassengerLastName
                    )}
                </div>



                {/* Nationality */}
                <div className="relative">

                    <label className="block text-gray-700 font-medium mb-1">
                        {t("nationality")}
                        <span className="text-red-500">*</span>
                    </label>


                    <div
                        onClick={() => setIsOpenCountry(!isOpenCountry)}
                        className={twMerge(
                            "w-full border rounded px-3 py-2 bg-white cursor-pointer flex justify-between items-center",
                            travellerErrors.strCountryGUID
                                ? "border-red-500"
                                : "border-gray-300"
                        )}
                    >

                        <div className="flex items-center gap-2">

                            {
                                selectedCountry?.flag &&
                                <span
                                    className={twMerge(
                                        getFlagClass(selectedCountry.flag),
                                        "rounded-sm"
                                    )}
                                />
                            }


                            <span>
                                {
                                    selectedCountry?.label
                                    || t("selectCountry")
                                }
                            </span>

                        </div>


                        <span>⌄</span>

                    </div>



                    {
                        isOpenCountry &&
                        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow">

                            <div className="p-2 border-b">
                                <input
                                    autoFocus
                                    value={countrySearch}
                                    onChange={(e) =>
                                        setCountrySearch(e.target.value)
                                    }
                                    placeholder={t("search")}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </div>


                            <div className="max-h-60 overflow-y-auto">

                                {
                                    filteredCountries.length
                                        ?
                                        filteredCountries.map((item) => (
                                            <div
                                                key={item.value}
                                                onClick={() => {
                                                    handleChange(
                                                        "strCountryGUID",
                                                        item.value
                                                    );

                                                    setIsOpenCountry(false);
                                                }}
                                                className="px-3 py-2 flex gap-2 cursor-pointer hover:bg-gray-100"
                                            >

                                                {
                                                    item.flag &&
                                                    <span
                                                        className={twMerge(
                                                            getFlagClass(item.flag),
                                                            "rounded-sm"
                                                        )}
                                                    />
                                                }

                                                {item.label}

                                            </div>
                                        ))
                                        :
                                        <div className="px-3 py-2 text-gray-400">
                                            {t("countryNotFound")}
                                        </div>
                                }

                            </div>

                        </div>
                    }


                    {renderError(
                        travellerErrors.strCountryGUID
                    )}

                </div>



                {/* Các field còn lại */}
                {
                    [
                        {
                            key: "dtmPassengerBirthday",
                            label: "dateOfBirth",
                            type: "date"
                        },
                        {
                            key: "strPassengerEmail",
                            label: "email",
                            type: "email"
                        },
                        {
                            key: "strPassengerPhone",
                            label: "phoneNumber",
                            type: "text"
                        }
                    ].map((item) => (
                        <div key={item.key}>

                            <label className="block text-gray-700 font-medium mb-1">
                                {t(item.label)}
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                type={item.type}
                                value={travellerForm[item.key]}
                                onChange={(e) =>
                                    handleChange(
                                        item.key,
                                        e.target.value
                                    )
                                }
                                className={twMerge(
                                    "w-full border rounded px-3 py-2",
                                    travellerErrors[item.key]
                                        ? "border-red-500"
                                        : "border-gray-300"
                                )}
                            />

                            {renderError(
                                travellerErrors[item.key]
                            )}

                        </div>
                    ))
                }


            </div>



            {/* Remark */}
            <div className="mt-4 text-xs">

                <textarea
                    value={travellerForm.strPassengerRemark}
                    onChange={(e) =>
                        setTravellerForm((prev: any) => ({
                            ...prev,
                            strPassengerRemark: e.target.value
                        }))
                    }
                    placeholder={t("note")}
                    rows={3}
                    className="w-full border border-gray-300 rounded p-3 resize-none"
                />

            </div>

        </div>
    );
};


export default PaymentFormBooking;