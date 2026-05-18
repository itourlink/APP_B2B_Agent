import { Field, Form } from "@/components/hook-form";
import { useListCity } from "@/hooks/actions/useCity";
// import { useGetlistSupplierMappingPrice } from "@/hooks/actions/useTourCustomized";
import { STARS2_OPTIONS } from "@/utils/oprion-data";
import { Info, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import DetailAccommodationD from "./detail-accommodation-d";
import AddSupAccommodationD from "./add-sup-accommodation-d";

const AddAccommodationD = () => {
    const [open, setOpen] = useState({
        detail: false,
        add: false
    })

    // const { supListMapData } = useGetlistSupplierMappingPrice({
    //     page: 1,
    //     pageSize: 9999
    //     strSupplierMappingPriceGUID = null;
    //     strSupplierGUID = null;
    //     tblsReturn = "[0]";
    // })

    // console.log("supListMapData", supListMapData)
    const methods = useForm({
        defaultValues: {
            type: "Hotel",
            country: "",
            displayName: "",
        },
    });

    const fakeAccommodationData = [
        {
            No: 1,
            strSupplierMappingPriceGUID: "1",
            strSupplierName: "KHÁCH SẠN BÃI CHÁY HẠ LONG",
            strItemTypeName: "VILLA SUPERIOR",
            dblPriceView: 604800,
            strMealIncludedTypeName: "Breakfast Included",
        },

        {
            No: 2,
            strSupplierMappingPriceGUID: "2",
            strSupplierName: "KHÁCH SẠN BÃI CHÁY HẠ LONG",
            strItemTypeName: "VILLA FAMILY",
            dblPriceView: 846720,
            strMealIncludedTypeName: "Breakfast Included",
        },

        {
            No: 3,
            strSupplierMappingPriceGUID: "3",
            strSupplierName: "KHÁCH SẠN BÃI CHÁY HẠ LONG",
            strItemTypeName: "SUPERIOR",
            dblPriceView: 725760,
            strMealIncludedTypeName: "Breakfast Included",
        },
    ];

    // COUNTRY
    const { ctData } = useListCity({
        strTableName: "MC02",

        strFeildSelect:
            "MC02_CountryCode AS code, MC02_CountryName AS strName",

        strWhere:
            "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
    });

    const COUNTRY_OPTIONS_LIST =
        ctData?.map((item: any) => ({
            label: item.strName,
            value: item.code,
        })) || [];

    const onSubmit = methods.handleSubmit((values) => {
        console.log("values", values);
    });

    return (
        <div className="">
            <Form methods={methods} onSubmit={onSubmit}>
                <div className="px-4 space-y-5">
                    {/* TITLE */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Thêm Lưu Trú cho Ngày 1
                        </h2>

                        <p className="text-sm text-gray-400 mt-1">
                            Chọn loại lưu trú và tìm kiếm dịch vụ
                        </p>
                    </div>

                    {/* FILTER */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* TYPE */}
                        <div>
                            <Field.Select
                                name="type"
                                options={[
                                    {
                                        label: "Hotel",
                                        value: "1"
                                    },
                                    {
                                        label: "Boat",
                                        value: "2"
                                    }
                                ]}
                            />

                        </div>

                        {/* NAME */}
                        <div >
                            <Field.Text
                                name="displayName"
                                placeholder="Search..."
                            />
                        </div>

                        {/* COUNTRY */}
                        <div>
                            <Field.MultiSelect
                                name="country"
                                placeholder="Select country"
                                options={COUNTRY_OPTIONS_LIST}
                            />
                        </div>

                        <div>
                            <Field.Select
                                name="type"
                                options={STARS2_OPTIONS}
                            />
                        </div>

                        <div >
                            <Field.Text
                                name="from"
                                placeholder="From..."
                            />

                        </div>

                        <div className="">
                            <Field.Text
                                name="to"
                                placeholder="To..."

                            />
                        </div>
                        {/* SEARCH */}
                        <button
                            type="submit"
                            className="w-11 h-11 rounded-lg border border-blue-200 bg-white flex items-center justify-center text-[#004b91] hover:bg-blue-50 transition cursor-pointer"
                        >
                            <Search size={18} />
                        </button>
                    </div>

                    {/* TABLE */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                        STT
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Tên dịch vụ
                                    </th>

                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                        Meal
                                    </th>

                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                        Price
                                    </th>

                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {fakeAccommodationData.map((item) => (
                                    <tr
                                        key={
                                            item.strSupplierMappingPriceGUID
                                        }
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-center">
                                            {item.No}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-gray-800">
                                                {item.strItemTypeName}
                                            </div>

                                            <div className="text-xs text-gray-400">
                                                {item.strSupplierName}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            {
                                                item.strMealIncludedTypeName
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center font-semibold text-[#004b91]">
                                            {item.dblPriceView?.toLocaleString()} đ
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpen((prev) => ({
                                                            ...prev,
                                                            detail: true,
                                                        }))
                                                    }
                                                    className="px-3 py-1 rounded-lg bg-[#004b91] text-white text-sm hover:opacity-90 cursor-pointer"
                                                >
                                                    <Info size={18} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpen((prev) => ({
                                                            ...prev,
                                                            add: true,
                                                        }))
                                                    }
                                                    className="px-3 py-1 rounded-lg bg-[#004b91] text-white text-sm hover:opacity-90 cursor-pointer"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* {!isError && (
                    <Pagination
                        currentPage={page}
                        onPageChange={(value) => setPage(value)}
                        totalPages={totalPages || 1}
                    />
                )} */}
                </div>


            </Form>


            <DetailAccommodationD
                open={open.detail}
                onClose={() =>
                    setOpen((prev) => ({
                        ...prev,
                        detail: false,
                    }))
                }
            />
            <AddSupAccommodationD open={open.add}
                onClose={() =>
                    setOpen((prev) => ({
                        ...prev,
                        add: false,
                    }))
                } />

        </div>

    );
};

export default AddAccommodationD;