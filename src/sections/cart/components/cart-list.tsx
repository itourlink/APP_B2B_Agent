import { useState } from "react";
import { Building2, HelpCircle, LayoutGrid, Pencil, Trash2 } from "lucide-react";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { useListCart } from "@/hooks/actions/useCart";
import CartPopupAccept from "./cart-popup-accept";
import CartPopupEdit from "./cart-popup-edit";
import CartBottomAcction from "./cart-bottom-acction";
import CartPopupTotalPrice from "./cart-popup-total-price";
import PanelPopup from "@/components/popup/panel-popup";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { useListCurrency } from "@/components/currency/useListCurrency";
import { useTranslate } from "@/locales";


const CartList = () => {
  const { t } = useTranslate("cart")
  const [filters] = useState({
    page: 1,
    pageSize: 10,
  });
  const { selectedCurrency } = useListCurrency()
  const router = useRouter();
  const [popupAccept, setPopupAccept] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [popupEdit, setPopupEdit] = useState(false);
  const [selectedEditRow, setSelectedEditRow] = useState<any>(null);

  const [open, setOpen] = useState(true);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const [openPriceDetail, setOpenPriceDetail] = useState(false);
  const [selectedCartPriceDetail, setSelectedCartPriceDetail] = useState("");
  const { cartData, cartLoading, cartError } = useListCart(filters);

  const listCart = cartData?.[0] ?? []
  // xóa item khỏi giỏ hàng
  const handleOpenDelete = (row: any) => {
    setSelectedRow(row);
    setPopupAccept(true);
  }
  // chỉnh sửa item trong giỏ hàng
  const handleOpenEdit = (row: any) => {

    setSelectedEditRow(row);
    setPopupEdit(true);
  };

  const handleCheckRow = (row: any) => {
    const isChecked = selectedRows.some(
      (x: any) => x?.No === row?.No
    );

    if (isChecked) {
      setSelectedRows((prev) =>
        prev.filter((x: any) => x?.No !== row?.No)
      );
    } else {
      setSelectedRows((prev) => [...prev, row]);
    }
  }
  const handleCheckAll = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      setSelectedRows(listCart || []);
    } else {
      setSelectedRows([]);
    }
  };

  const totalPrice = selectedRows.reduce(
    (sum, item) =>
      sum + Number(item?.dblPriceTotal || 0),
    0
  );
  const totalCommission =
    selectedRows.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.dblPriceTotalAgentCom || 0
        ),
      0
    );

  // poup total price detail

  const extractNumberFromHTML = (html?: string) => {
    if (!html) return 0;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const text = doc.body.textContent || "";

    const match = text.match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  const colDefs: ColumnDef<any>[] = [
    {
      field: "checkbox",
      headerName: (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer"
            checked={
              listCart.length > 0 &&
              selectedRows.length ===
              listCart.length
            }
            onChange={handleCheckAll}
          />
        </div>
      ) as any,
      width: 50,
      render: (_: any, row: any) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer"
            checked={selectedRows.some(
              (x: any) => x?.No === row?.No
            )}
            onChange={() =>
              handleCheckRow(row)
            }
          />
        </div>
      ),
    },
    {
      field: "No",
      headerName: t("no"),
      render: (value: any) => (
        <span className="text-[13px] text-gray-700">{value || "--"}</span>
      ),
    },
    {
      field: "strServiceName",
      headerName: t("serviceName"),
      render: (value: any, row: any) => (
        <div className="py-0.5 leading-5 flex flex-col items-start justify-start gap-1 w-full">
          <div className="text-[#1f5fa9] text-[13px] font-medium">
            {value || "--"}
          </div>

          <div className="flex items-center gap-1 text-[12px] text-gray-700">
            <Building2 size={13} />
            <span>{row?.strCompanyName || "-"}</span>
          </div>

          <div className="text-[12px] text-gray-600">
            {row?.dtmDateFrom && row?.dtmDateTo
              ? `${new Date(row.dtmDateFrom).toLocaleDateString("vi-VN")} - ${new Date(row.dtmDateTo).toLocaleDateString("vi-VN")}`
              : "-"}
          </div>
        </div>
      ),
    },
    {
      field: "strType",
      headerName: t("type"),

      render: (_: any, row: any) => {

        // ================= REMOVE HTML =================
        const plainText = row?.strType
          ?.replace(/<[^>]*>/g, "")
          ?.replace(/&nbsp;/g, "")
          ?.trim();

        // ================= CHECK VALID DATA =================
        const hasType =
          plainText &&
          plainText !== "--" &&
          plainText !== "-";

        return (
          <div className="flex items-center gap-2">
            <span
              className="text-[13px] text-gray-700"
              dangerouslySetInnerHTML={{
                __html: row?.strType || "--",
              }}
            />

            {/* ================= ONLY SHOW ICON WHEN HAS DATA ================= */}
            {hasType && (
              <button
                type="button"
                onClick={() => handleOpenEdit(row)}
                className="
                cursor-pointer
                  flex h-7 w-7 items-center justify-center
                  rounded bg-blue-50
                  text-[#1f5fa9]
                  hover:bg-blue-100
                "
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
        );
      },
    },
    {
      field: "intQuantity",
      headerName: t("quantity"),
      render: (_: any, row: any) => (
        <div className="text-[#1f5fa9] text-[13px] leading-5">
          {extractNumberFromHTML(row?.intQuantity)}
        </div>
      )
    },
    {
      field: "dblPriceTotal",
      headerName: t("totalPrice"),

      render: (
        value: any,
        row: any
      ) => (
        <button
          type="button"
          onClick={() => {

            setSelectedCartPriceDetail(
              row?.strCartServiceItemGUID
            );

            setOpenPriceDetail(true);
          }}
          className="
        text-[13px]
        text-[#1677ff]
        hover:underline
      "
        >
          {selectedCurrency?.symbol}
          {(value || 0)}
        </button>
      ),
    },
    {
      field: "dblPriceTotalAgentCom",
      headerName: t("totalCommission"),
      render: (value: any) => <span className="text-[13px] text-gray-700">{value}</span>,
    },
    {
      field: "No",
      headerName: t("action"),
      render: (_: any, row: any) => (
        <button
          onClick={() => handleOpenDelete(row)}
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300">
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  if (cartError) {
    return (
      <div className="px-6 py-10 text-red-500">
        {t("cartDataLoadError")}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6 py-10">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">
            {t("cart")}

          </h1>

          <div className="flex items-center gap-1 border border-gray-300 rounded-md bg-white px-1 py-1 ">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
            >
              <HelpCircle size={20} className="text-[#2d3748]" />
            </button>

            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
            >
              <LayoutGrid size={18} className="text-[#2d3748]" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-t-[18px] rounded-b-[10px] border border-[#dfe3e8] bg-white shadow-sm">
          <div

            className="
                cart-table
                [&_thead]:bg-[#2f69b1]
                [&_thead_th]:bg-[#2f69b1]
                [&_thead_th]:text-white
                [&_thead_th]:font-semibold
                [&_thead_th]:text-[13px]
                [&_thead_th]:py-3
                [&_thead_th]:border-none
                [&_thead_th]:leading-5
                [&_tbody_td]:py-2
                [&_tbody_td]:text-[14px]
                [&_tbody_td]:align-middle
                [&_tbody_tr]:border-b
                [&_tbody_tr]:border-[#e5e7eb]
              "
          >
            <TableCore
              rowData={listCart ?? []}
              columnDefs={colDefs}
              loading={cartLoading}
            />
            <CartPopupAccept
              open={popupAccept}
              onClose={() => setPopupAccept(false)}
              item={selectedRow}
            />
            <CartPopupEdit
              open={popupEdit}
              onClose={() => setPopupEdit(false)}
              item={selectedEditRow}
            />
            <CartBottomAcction
              selectedCount={selectedRows.length}
              totalPrice={totalPrice}
              totalCommission={totalCommission}
              open={open}
              onToggle={() => setOpen(!open)}
              onQuote={() => console.log("QUOTE")}
              onBooking={() => {

                const strListCartServiceItemGUID =
                  selectedRows
                    ?.map(
                      (item: any) =>
                        item?.strCartServiceItemGUID
                    )
                    ?.filter(Boolean)
                    ?.join(",");

                router.replaceParams(
                  paths.booking.paymentBookingCart,
                  {
                    items: selectedRows,
                    strListCartServiceItemGUID,
                    totalPrice,
                    totalCommission,
                  }
                );
              }}
            />

            <PanelPopup
              open={openPriceDetail}
              onClose={() =>
                setOpenPriceDetail(false)
              }
              title="Price Detail"
              className="w-[1100px]"
            >
              <CartPopupTotalPrice
                open={openPriceDetail}
                strCartServiceItemGUID={
                  selectedCartPriceDetail
                }
              />
            </PanelPopup>
          </div>
        </div>
      </div>
    </div>


  );
};

export default CartList;