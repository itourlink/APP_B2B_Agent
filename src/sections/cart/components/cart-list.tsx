import { useState } from "react";
import { Building2, HelpCircle, LayoutGrid, Trash2 } from "lucide-react";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { useListCart } from "@/hooks/actions/useCart";
import CartPopupAccept from "./cart-popup-accept";


const CartList = () => {
  const [filters] = useState({
    page: 1,
    pageSize: 10,
  });

  const [popupAccept, setPopupAccept] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const { cartData, cartLoading, cartError } = useListCart(filters);

  const listCart = cartData?.[0] ?? []

  const handleOpenDelete = (row: any) => {
    setSelectedRow(row);
    setPopupAccept(true);
  }
  const colDefs: ColumnDef<any>[] = [
    {
      field: "checkbox",
      headerName: "",
      render: () => <input className="w-4 h-4 cursor-pointer" type="checkbox" />,
    },
    {
      field: "No",
      headerName: "STT",
      render: (value: any) => (
        <span className="text-[13px] text-gray-700">{value || "--"}</span>
      ),
    },
    {
      field: "strServiceName",
      headerName: "Tên dịch vụ",
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
      headerName: "Type",
      render: (_: any, row: any) => (
        <span
          className="text-[13px] text-gray-700"
          dangerouslySetInnerHTML={{ __html: row?.strType || "-" }}
        />
      )
    },
    {
      field: "intQuantity",
      headerName: "Số lượng",
      render: (_: any, row: any) => (
        <div
          className="text-[#1f5fa9] text-[13px] leading-5"
          dangerouslySetInnerHTML={{ __html: row?.intQuantity || "" }}
        />
      )
    },
    {
      field: "dblPriceTotal",
      headerName: "Tổng giá",
      render: (value: any) => (
        <span className="text-[13px] text-gray-800">${value ?? 0}</span>
      ),
    },
    {
      field: "dblPriceTotalAgentCom",
      headerName: "Tổng hoa hồng",
      render: (value: any) => <span className="text-[13px] text-gray-700">{value}</span>,
    },
    {
      field: "No",
      headerName: "Thao tác",
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
        Lỗi tải dữ liệu giỏ hàng
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen mt-30">
      <div className="max-w-[1320px] mx-auto px-6 py-10">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">
            Giỏ hàng
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
          </div>
        </div>
      </div>
    </div>

    
  );
};

export default CartList;