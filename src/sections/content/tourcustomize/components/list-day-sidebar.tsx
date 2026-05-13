import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListServiceTourCustomized } from "@/hooks/actions/useUser";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import clsx from "clsx";

interface Props {
    item?: any;
}

const ListDaySidebar = ({ item }: Props) => {
    // GROUP DAY
    const groupByDay = (data: any[]) => {
        const map: Record<string, any[]> = {};

        data.forEach((item) => {
            const key = item?.strTourCustomizedDayGUID;

            if (!map[key]) {
                map[key] = [];
            }

            map[key].push(item);
        });

        return Object.values(map);
    };

    const { data } = useQuery({
        queryKey: [
            QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
            item?.strTourCustomizedGUID,
        ],
        queryFn: () =>
            useListServiceTourCustomized({
                strTourCustomizedGUID:
                    item?.strTourCustomizedGUID || "",
                strTourCustomizedDayGUID: null,
            }),
        placeholderData: keepPreviousData,
        enabled: !!item?.strTourCustomizedGUID,
    });

    const listData = data?.[0] ?? [];

    const groupedDays = groupByDay(listData);

    return (
        <div className="flex flex-col gap-5">
            {groupedDays.map((dayItems: any[]) => {
                const firstItem = dayItems?.[0];

                const date = new Date(firstItem?.strDateDay);

                const weekDay = date.toLocaleDateString("vi-VN", {
                    weekday: "short",
                });

                const day = date.getDate();

                const month = date.getMonth() + 1;

                const year = date.getFullYear();

                // const isActive = index === 1;

                return (
                    <div
                        key={firstItem?.strTourCustomizedDayGUID}
                        className={clsx(
                            " rounded-2xl px-3 py-5 text-center transition-all border border-slate-200",
                            // isActive
                            //     ? "bg-[#2f65b3] text-white"
                            //     : "bg-[#dfe8ed] text-[#3d3d3d]"
                        )}
                    >
                        <div className="font-bold text-[14px]">
                            Day {firstItem?.intDayOrder}
                        </div>

                        <div className="mt-2 font-medium leading-7 text-[14px]">
                            <div>
                                {weekDay}, {day} Thg {month}, {year}
                            </div>


                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ListDaySidebar;