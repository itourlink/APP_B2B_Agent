import { useTranslate } from "@/locales";
interface Props {
    items: any,
    focData: any
}
const SurFoc = ({ items, focData }: Props) => {
    const { t } = useTranslate("hotel");
    return (
        <div>
            {/* SURCHARGE */}
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900">
                        {t("surcharge")}
                    </h3>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-4 py-3 text-center w-16">
                                {t("no")}
                            </th>

                            <th className="px-4 py-3 text-left">
                                {t("surchargeName")}
                            </th>

                            <th className="px-4 py-3 text-center w-24">
                                {t("days")}
                            </th>

                            <th className="px-4 py-3 text-center w-24">
                                {t("quantity")}
                            </th>

                            <th className="px-4 py-3 text-right w-32">
                                {t("unitPrice")}
                            </th>

                            <th className="px-4 py-3 text-right w-32">
                                {t("totalPrice")}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td
                                colSpan={6}
                                className="px-4 py-6 text-center text-slate-500"
                            >
                                {t("noData")}
                            </td>
                        </tr>

                        {/* {!displayData?.surcharges?.length ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-6 text-center text-slate-500"
                                >
                                    {t("noData")}
                                </td>
                            </tr>
                        ) : (
                            displayData.surcharges.map(
                                (item: any, index: number) => (
                                    <tr
                                        key={index}
                                        className="border-b border-slate-100 last:border-b-0"
                                    >
                                        <td className="px-4 py-3 text-center">
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-3">
                                            {item.name}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            {item.days}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            {item.qty}
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            {item.price?.toLocaleString()}
                                        </td>

                                        <td className="px-4 py-3 text-right font-medium">
                                            {item.total?.toLocaleString()}
                                        </td>
                                    </tr>
                                ),
                            )
                        )} */}
                    </tbody>
                </table>
            </div>

            {/* FOC */}
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900">
                        FOC
                    </h3>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-4 py-3 text-center w-16">
                                {t("no")}
                            </th>

                            <th className="px-4 py-3 text-left">
                                {t("description")}
                            </th>

                            <th className="px-4 py-3 text-center w-24">
                                {t("quantity")}
                            </th>

                            <th className="px-4 py-3 text-right w-32">
                                {t("unitPrice")}
                            </th>

                            <th className="px-4 py-3 text-right w-32">
                                {t("totalPrice")}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {!focData?.length ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-6 text-center text-slate-500"
                                >
                                    {t("noData")}
                                </td>
                            </tr>
                        ) : (
                            focData?.map((item: any, index: number) => (
                                <tr
                                    key={item.strFocGUID}
                                    className="border-b border-slate-100 last:border-b-0"
                                >
                                    <td className="px-4 py-3 text-center">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-3">
                                        {/* {item.strUomName} */}
                                        Đặt 5 phòng được 1 FOC(tối đa được 1 FOC)
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {/* {item.intFOCPax} */}
                                        -1
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {/* {item.dblFOCGet} */}

                                        ${items?.[0]?.price.toLocaleString()}
                                    </td>

                                    <td className="px-4 py-3 text-center font-medium">
                                        {/* {item.dblFOCMax} */}

                                         $-{items?.[0]?.price.toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SurFoc