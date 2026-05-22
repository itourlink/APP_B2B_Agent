import { useUser } from "@/hooks/actions/useAuth";
import { useGetListCart } from "@/hooks/actions/useUser";
import { useQuery } from "@tanstack/react-query";

interface CartItem {
  strServiceName?: string;
    strSupplierName?: string;
    strItemTypeName?: string;
  dtmDateFrom?: string;
  dtmDateTo?: string;

  intQuantity?: number;

  intUnitPrice?: number;
  dblPriceTotal?: number;

  strOrderBookingItemGUID?: string;
}

interface Props {
  open?: boolean;

  strCartServiceItemGUID?: string;
}

// const parseServiceName = (html: string = "") => {
//   const parser = new DOMParser();

//   const doc = parser.parseFromString(
//     html,
//     "text/html"
//   );

//   const serviceName =
//     doc.body.childNodes[0]?.textContent || "";

//   const divs = doc.querySelectorAll("div");

//   const category =
//     divs[0]?.textContent
//       ?.replace("Category:", "")
//       ?.trim() || "";

//   const joinType =
//     divs[1]?.textContent
//       ?.replace("Join Type:", "")
//       ?.trim() || "";

//   return {
//     serviceName,
//     category,
//     joinType,
//   };
// };

const CartPopupTotalPrice = ({
  open,
  strCartServiceItemGUID,
}: Props) => {
  const { user } = useUser();

  const {
    data: listCart = [],
    isLoading,
    isError,
  } = useQuery<CartItem[]>({
    queryKey: [
      "GET_LIST_CART_SERVICE_ITEM_PRICE_DETAIL",
      user?.strUserGUID,
      user?.strCompanyGUID,
      strCartServiceItemGUID,
    ],

    queryFn: async () => {
      const res = await useGetListCart({
        strUserGUID: user?.strUserGUID,

        strCompanyAgentGUID:
          user?.strCompanyGUID,

        strCartServiceItemGUID,

        strListCartServiceItemGUID: null,

        strOnlineCartGUID: null,

        strBuyFromAgentHostGUID: null,

        intCurrencyID: 1,

        intCurPage: null,

        intPageSize: null,

        strOrder: null,

        tblsReturn: "[2]",
      });

      const priceDetails =
        res?.[2] ??
        res?.[1] ??
        res?.[0] ??
        res?.data?.[2] ??
        res?.data?.[1] ??
        res?.data?.[0] ??
        res;

      return Array.isArray(priceDetails)
        ? priceDetails
        : [];
    },

    enabled:
      !!open &&
      !!user?.strUserGUID &&
      !!user?.strCompanyGUID &&
      !!strCartServiceItemGUID,
    refetchOnWindowFocus: false,
  });

  const totalPrice = listCart.reduce(
    (
      sum: number,
      item: CartItem
    ) =>
      sum +
      Number(item?.dblPriceTotal || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="flex h-[150px] items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[120px] items-center justify-center text-sm text-red-500">
        Error loading price detail
      </div>
    );
  }

  if (!listCart.length) {
    return (
      <div className="flex h-[120px] items-center justify-center text-sm text-gray-500">
        No price detail
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white">
      {/* HEADER */}
      <div className="border-b bg-gray-50 px-4 py-3">
        <h2 className="text-[15px] font-semibold text-gray-800">
          Price Detail
        </h2>
      </div>

      {/* TABLE */}
      <div className="max-h-[500px] overflow-auto">
        <table className="min-w-full border-collapse text-[13px]">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b text-left text-[#1d4ed8]">
              <th className="px-3 py-3 font-semibold">
                STT
              </th>

              <th className="px-3 py-3 font-semibold">
                Tên dịch vụ
              </th>

              <th className="px-3 py-3 font-semibold">
                Ngày bắt đầu - Ngày kết thúc
              </th>

              <th className="px-3 py-3 text-center font-semibold">
                Số lượng
              </th>

              <th className="px-3 py-3 text-right font-semibold">
                Đơn giá
              </th>

              <th className="px-3 py-3 text-right font-semibold">
                Tổng giá
              </th>
            </tr>
          </thead>

          <tbody>
            {listCart.map(
              (
                item: CartItem,
                index: number
              ) => {
                const serviceName =
                    item?.strServiceName || "";

                    const category =
                    item?.strSupplierName || "";

                    const joinType =
                    item?.strItemTypeName || "";

                return (
                  <tr
                    key={
                      item?.strOrderBookingItemGUID ||
                      index
                    }
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    {/* STT */}
                    <td className="px-3 py-4 align-top text-gray-700">
                      {index + 1}
                    </td>

                    {/* SERVICE */}
                    <td className="min-w-[260px] px-3 py-4 align-top">
                      <div className="space-y-1">
                        <div className="font-medium text-[#004b91]">
                          {serviceName}
                        </div>

                        <div className="text-[12px] text-gray-600">
                          <span className="font-semibold">
                            Category:
                          </span>{" "}
                          <span className="text-[#004b91]">
                            {category}
                          </span>
                        </div>

                        <div className="text-[12px] text-gray-600">
                          <span className="font-semibold">
                            Join Type:
                          </span>{" "}
                          <span className="text-[#004b91]">
                            {joinType}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="min-w-[250px] px-3 py-4 align-top text-gray-700">
                      {item?.dtmDateFrom} -{" "}
                      {item?.dtmDateTo}
                    </td>

                    {/* QTY */}
                    <td className="px-3 py-4 text-center align-top text-gray-700">
                      {item?.intQuantity || 0}
                    </td>

                    {/* UNIT PRICE */}
                    <td className="px-3 py-4 text-right align-top font-medium text-gray-800">
                      $
                      {Number(
                        item?.intUnitPrice || 0
                      ).toLocaleString("en-US")}
                    </td>

                    {/* TOTAL */}
                    <td className="px-3 py-4 text-right align-top font-semibold text-gray-900">
                      $
                      {Number(
                        item?.dblPriceTotal || 0
                      ).toLocaleString("en-US")}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>

          {/* FOOTER */}
          <tfoot>
            <tr className="bg-gray-50">
              <td
                colSpan={5}
                className="px-3 py-4 text-right text-sm font-semibold text-gray-700"
              >
                Total
              </td>

              <td className="px-3 py-4 text-right text-sm font-bold text-[#004b91]">
                $
                {totalPrice.toLocaleString(
                  "en-US"
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CartPopupTotalPrice;
