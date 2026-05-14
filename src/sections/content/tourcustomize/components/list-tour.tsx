import { useState } from "react";
import {
  MapPin,
  ChevronsUpDown,
  Menu,
  Trash2,
  RefreshCw,
  Plus,
  Pen,
} from "lucide-react";

import ServiceMenu, {
} from "./service-menu";

import { getUrlImage } from "@/utils/format-image";
import { isValidValue } from "@/utils/utilts";

import {
  updTourCustomizedDayItemCate,
  delTourCustomizedDayItemLink,
  updTourCustomizedDay,
} from "@/hooks/actions/useUser";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useToastStore } from "@/zustand/useToastStore";
import { MENU_ITEMS } from "./menu-data-add";
import DeleteServicePopup from "./delete-service-popup";
import AddDestination from "./add-destination";

interface Props {
  item: any[];
  itemDetail: any;
  onChange: (value: string) => void;
}

const ListTour = ({
  item,
  itemDetail,
  onChange,
}: Props) => {
  const queryClient = useQueryClient();

  const { showToast } = useToastStore();

  const [showMenu, setShowMenu] =
    useState(false);

  const [open, setOpen] = useState({
    del: false,
    destination: false,
  });

  const [deleteItem, setDeleteItem] =
    useState<any>(null);

  const parseLocations = (str: string) => {
    if (!str) return [];

    return str
      .split("#")
      .filter(Boolean)
      .map((item) => {
        const parts = item.split("!");

        return {
          name: parts[1],
        };
      });
  };

  const firstItem = item?.[0];


  const locations = parseLocations(
    String(firstItem?.strListLocation)
  );


  const { mutate: updTourCustomizedDayApi, isPending: isLoading } = useMutation({
    mutationFn: updTourCustomizedDay,
  });

  const handleUpdateNameDay = () => {

    const payload = {
      strTourCustomizedDayGUID:
        firstItem?.strTourCustomizedDayGUID,

      strDayTitle: dayTitle,

      strDayContent: null,
      strDayImageUrl: null,
      strDayImageSubTwo: null,
      strDayImagesSubThree: null,
      strDayImagesSubFour: null,
    };

    updTourCustomizedDayApi(
      payload,
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            {
              queryKey: [
                QUERY_KEYS.USER
                  .LIST_SERVICE_TOUR_CUSTOMIZED,
              ],
            }
          );

          queryClient.invalidateQueries(
            {
              queryKey: [
                QUERY_KEYS.USER
                  .LIST_TOUR_CUSTOMIZED,
              ],
            }
          );

          setIsEditTitle(false);

          showToast(
            "success",
            "Update tour thành công"
          );
        },

        onError: () => {
          showToast(
            "error",
            "Update tour thất bại"
          );
        },
      }
    );
  }

  // UPDATE CATEGORY
  const {
    mutateAsync: upTourCateAPI,
    isPending: isupdLoading,
  } = useMutation({
    mutationFn: updTourCustomizedDayItemCate,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.USER
            .LIST_SERVICE_TOUR_CUSTOMIZED,
        ],
      });
    },
  });

  // DELETE SERVICE
  const {
    mutateAsync: delTourAPI,
    isPending: isDeleteLoading,
  } = useMutation({
    mutationFn:
      delTourCustomizedDayItemLink,
  });

  // HANDLE DELETE
  const handleDelete = async () => {
    if (!deleteItem) return;

    const payload = {
      strTourCustomizedPriceItemGUID:
        deleteItem?.strTourCustomizedPriceItemGUID,

      intDayOrder:
        deleteItem?.intDayOrder,
    };

    try {
      await delTourAPI(payload);

      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.USER
            .LIST_SERVICE_TOUR_CUSTOMIZED,
        ],
      });

      setOpen((prev) => ({
        ...prev,
        del: false,
      }));

      setDeleteItem(null);

      showToast(
        "success",
        "Delete service successfully"
      );
    } catch (error) {
      showToast(
        "error",
        "Delete service failed"
      );
    }
  };

  const hasDeleteId = (value: any) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      typeof value === "object"
    ) {
      return false;
    }

    return true;
  };

  const renderRow = (
    item: any,
    index: number
  ) => {
    const safe = (val: any) =>
      typeof val === "object"
        ? ""
        : val ?? "";

    const starOptions = String(
      item?.strListEasiaCateID || ""
    )
      .split(",")
      .filter(Boolean);

    return (
      <tr
        key={item?.id ?? index}
        className="border-b border-gray-50 hover:bg-gray-50 transition-colors group"
      >
        <td className="px-4 py-4 text-[13px] text-gray-600">
          {index + 1}
        </td>

        <td className="px-4 py-4">
          <div className="w-[100px] h-[60px] rounded-lg overflow-hidden border border-gray-100 shadow-sm">
            <img
              src={getUrlImage(
                String(item?.strImage ?? "")
              )}
              alt={safe(
                item?.strSupplierName
              )}
              className="w-full h-full object-cover"
            />

          </div>
        </td>

        <td className="px-4 py-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-[#333] uppercase tracking-tight">
                {safe(
                  item?.strSupplierName
                )}
              </span>

              <RefreshCw
                size={14}
                className="text-[#0057a8] rotate-90"
              />
            </div>

            <div className="text-[12px] text-gray-500">
              ({safe(item?.strCateName)})
            </div>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
              value={String(
                item?.strListEasiaCateID || ""
              )}
              onChange={(e) => {
                const value =
                  e.target.value;

                upTourCateAPI({
                  strTourCustomizedGUID:
                    itemDetail?.strAgentHostServiceItemGUID,

                  strTourCustomizedPriceItemGUID:
                    item?.strTourCustomizedPriceItemGUID,

                  strListEasiaCateID:
                    value,
                });
              }}
              disabled={isupdLoading}
            >
              <option value="">
                Select star
              </option>

              {starOptions.map((star) => (
                <option
                  key={star}
                  value={star}
                >
                  {"⭐".repeat(
                    Number(star)
                  )}
                </option>
              ))}
            </select>
          </div>
        </td>

        <td className="px-4 py-4 text-[13px] text-gray-700 font-medium">
          {safe(item?.strServiceNameMain)}
        </td>

        <td className="px-4 py-4 text-[13px] text-gray-700">
          {safe(item?.intNoOfDay)}
        </td>

        <td className="px-4 py-4 text-[14px] text-gray-800 font-bold text-right">
          {safe(item?.strQuantity)}
        </td>

        <td className="px-4 py-4 text-[14px] text-gray-800 font-bold text-right">
          ₫
          {isValidValue(
            item?.dblPriceCost
          )}
        </td>

        <td className="px-4 py-4 text-[14px] text-gray-800 font-bold text-right">
          ₫
          {isValidValue(
            item?.dblPriceCostUnit
          )}
        </td>

        <td className="px-4 py-4">
          <div className="flex justify-center">
            {hasDeleteId(
              item?.strTourCustomizedPriceItemGUID
            ) && (
                <button
                  onClick={() => {

                    setDeleteItem(item);

                    setOpen((prev) => ({
                      ...prev,
                      del: true,
                    }));
                  }}
                  className="cursor-pointer bg-[#f2f4f7] p-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-all text-gray-500"
                >
                  <Trash2 size={18} />
                </button>
              )}
          </div>
        </td>
      </tr>
    );
  };

  const [isEditTitle, setIsEditTitle] =
    useState(false);

  const [dayTitle, setDayTitle] =
    useState(
      firstItem?.strDayTitle || ""
    );
  return (
    <div className="w-full bg-white font-sans">
      <div className="flex items-center gap-5">
        <h3 className="text-lg font-bold text-gray-800">
          Ngày{" "}
          {isValidValue(
            firstItem?.intDayOrder
          )}
        </h3>

        <div className="flex items-center gap-2">
          {isEditTitle ? (
            <>
              <input
                value={dayTitle}
                onChange={(e) =>
                  setDayTitle(e.target.value)
                }
                className="border rounded px-2 py-1 text-lg font-bold outline-none"
              />

              {/* Đồng ý */}
              <button
                disabled={isLoading}
                onClick={() => handleUpdateNameDay()}
                className="text-green-600 hover:text-green-700 border w-10 rounded-2xl cursor-pointer"
              >
                ✓
              </button>

              {/* Huỷ */}
              <button
                onClick={() => {
                  setDayTitle(
                    firstItem?.strDayTitle ||
                    ""
                  );

                  setIsEditTitle(false);
                }}
                className="text-red-500 hover:text-red-600 border w-10 rounded-2xl cursor-pointer"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-gray-800">
                {isValidValue(
                  firstItem?.strDayTitle
                )}
              </h3>

              <button
                onClick={() =>
                  setIsEditTitle(true)
                }
                className="text-gray-500 hover:text-[#2566b0] cursor-pointer"
              >
                <Pen size={16} />
              </button>
            </>
          )}
        </div>

      </div>

      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-4 text-gray-700">
          <MapPin
            size={20}
            className="fill-current"
          />

          <div className="flex flex-wrap gap-2 items-center">
            {locations.map((loc, idx) => (
              <span
                key={idx}
                className="border border-[#4a6fa5] p-1 rounded-sm text-[#4a6fa5]"
              >
                {loc.name}
              </span>
            ))}

            <div
              onClick={() =>
                setOpen((prev) => ({
                  ...prev,
                  destination: true,
                }))
              }
              className="cursor-pointer bg-[#e9f2ff] text-[#4a83d4] p-1 rounded-md hover:bg-[#d0e4ff]"
            >
              <Plus size={18} />
            </div>

          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#e9f2ff] text-[#4a83d4] p-1.5 rounded-md cursor-pointer hover:bg-[#d0e4ff] transition-colors">
            <ChevronsUpDown size={18} />
          </div>

          <div className="relative">
            <button
              onClick={() =>
                setShowMenu(!showMenu)
              }
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            >
              <Menu size={20} />
            </button>

            {showMenu && (
              <div className="absolute left-[-200px] top-full mt-2 z-50">
                <ServiceMenu
                  items={MENU_ITEMS}
                  onChange={(value) => {
                    onChange(value);

                    setShowMenu(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[12px] text-gray-500 font-medium border-b border-gray-100 uppercase tracking-tight">
              <th className="px-4 py-3 text-left w-12 font-normal">
                STT
              </th>

              <th className="px-4 py-3 text-left w-24 font-normal">
                Image
              </th>

              <th className="px-4 py-3 text-left font-normal uppercase">
                Service
              </th>

              <th className="px-4 py-3 text-left font-normal uppercase">
                Description
              </th>

              <th className="px-4 py-3 text-left font-normal uppercase">
                No Of Days
              </th>

              <th className="px-4 py-3 text-left font-normal uppercase">
                Quantity
              </th>

              <th className="px-4 py-3 text-right font-normal uppercase">
                Price
              </th>

              <th className="px-4 py-3 text-right font-normal uppercase">
                Price per pax
              </th>

              <th className="px-4 py-3 text-center w-20 font-normal uppercase">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {(item ?? [])
              .filter(
                (i) =>
                  i?.strDayShiftName !==
                  "Night"
              )
              .map((item, index) =>
                renderRow(item, index)
              )}

            {item.some(
              (i) =>
                i?.strDayShiftName ===
                "Night"
            ) && (
                <>
                  <tr className="bg-blue-50">
                    <td
                      colSpan={9}
                      className="px-4 py-2 text-[13px] font-bold text-gray-600"
                    >
                      Night
                    </td>
                  </tr>

                  {item
                    .filter(
                      (i) =>
                        i?.strDayShiftName ===
                        "Night"
                    )
                    .map((item, index) =>
                      renderRow(
                        item,
                        index
                      )
                    )}
                </>
              )}
          </tbody>
        </table>
      </div>

      {/* DELETE POPUP */}
      <DeleteServicePopup
        open={open.del}
        loading={isDeleteLoading}
        onConfirm={handleDelete}
        onClose={() => {
          setOpen((prev) => ({
            ...prev,
            del: false,
          }));

          setDeleteItem(null);
        }}
      />

      <AddDestination
        open={open.destination}
        onClose={() => {
          setOpen((prev) => ({
            ...prev,
            destination: false,
          }));
        }}
        strUserGUID={
          itemDetail?.strUserGUID
        }
        strTourCustomizedDayGUID={
          firstItem?.strTourCustomizedDayGUID
        }
      />
    </div>
  );
};

export default ListTour;