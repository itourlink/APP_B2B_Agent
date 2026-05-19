import { useEffect, useRef, useState } from "react";
import { MapPin, Menu, Pen, Plus, Trash2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import {
  delTourCustomizedDayItemLink,
  updTourCustomizedDay,
  updTourCustomizedDayItemCate,
} from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";
import { formatMoney } from "@/utils/format-number";
import { getUrlImage } from "@/utils/format-image";
import { isValidValue } from "@/utils/utilts";
import { useToastStore } from "@/zustand/useToastStore";

import AddDestination from "./add-destination";
import DeleteDestination from "./del-destination";
import DeleteServicePopup from "./delete-service-popup";
import { getMenuItems } from "./menu-data-add";
import ServiceMenu from "./service-menu";
import UpdateNoOfDay from "./update-no-of-day";

interface Props {
  item: any[];
  itemDetail: any;
  itemListData: any;
  onChange: (value: string) => void;
}

const ListTour = ({ item, itemDetail, onChange, itemListData }: Props) => {
  const { t } = useTranslate("tourcustomize");
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedPriceItemGUID, setSelectedPriceItemGUID] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [open, setOpen] = useState({
    del: false,
    destination: false,
    deleteDestination: false,
    updateNoOfDay: false,
  });
  const [locItem, setLocItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [isEditTitle, setIsEditTitle] = useState(false);

  const parseLocations = (value: string) => {
    if (!value) return [];

    return value
      .split("#")
      .filter(Boolean)
      .map((entry) => {
        const parts = entry.split("!");

        return {
          id: parts[0] || "",
          name: parts[1] || parts[0] || "",
        };
      })
      .filter((location) => location.name);
  };

  const firstItem = item?.[0];
  const [dayTitle, setDayTitle] = useState(firstItem?.strDayTitle || "");
  const locations = parseLocations(String(firstItem?.strListLocation));
  const menuItems = getMenuItems(t);

  const { mutate: updTourCustomizedDayApi, isPending: isLoading } = useMutation({
    mutationFn: updTourCustomizedDay,
  });

  const handleUpdateNameDay = () => {
    const payload = {
      strTourCustomizedDayGUID: firstItem?.strTourCustomizedDayGUID,
      strDayTitle: dayTitle,
      strDayContent: null,
      strDayImageUrl: null,
      strDayImageSubTwo: null,
      strDayImagesSubThree: null,
      strDayImagesSubFour: null,
    };

    updTourCustomizedDayApi(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED],
        });

        setIsEditTitle(false);
        showToast("success", t("updateTourSuccess"));
      },
      onError: () => {
        showToast("error", t("updateTourError"));
      },
    });
  };

  const {
    mutateAsync: upTourCateAPI,
    isPending: isupdLoading,
  } = useMutation({
    mutationFn: updTourCustomizedDayItemCate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED],
      });
    },
  });

  const { mutateAsync: delTourAPI, isPending: isDeleteLoading } = useMutation({
    mutationFn: delTourCustomizedDayItemLink,
  });

  const handleDelete = async () => {
    if (!deleteItem) return;

    const payload = {
      strTourCustomizedPriceItemGUID: deleteItem?.strTourCustomizedPriceItemGUID,
      intDayOrder: deleteItem?.intDayOrder,
    };

    try {
      await delTourAPI(payload);

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED],
      });

      setOpen((prev) => ({
        ...prev,
        del: false,
      }));

      setDeleteItem(null);
      showToast("success", t("deleteServiceSuccess"));
    } catch (error) {
      showToast("error", t("deleteServiceError"));
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

  const renderRow = (row: any, index: number) => {
    const safe = (val: any) => (typeof val === "object" ? "" : val ?? "");

    const starOptions = String(itemListData?.strListEasiaCateID || "")
      .split(",")
      .filter(Boolean);

    return (
      <tr
        key={row?.id ?? index}
        className="group border-b border-gray-50 transition-colors hover:bg-gray-50"
      >
        <td className="px-4 py-4 text-[13px] text-gray-600">{index + 1}</td>

        <td className="px-4 py-4">
          <div className="h-[60px] w-[100px] overflow-hidden rounded-lg border border-gray-100 shadow-sm">
            <img
              src={getUrlImage(String(row?.strImage ?? ""))}
              alt={safe(row?.strSupplierName)}
              className="h-full w-full object-cover"
            />
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold uppercase tracking-tight text-[#333]">
                {safe(row?.strSupplierName)}
              </span>
            </div>

            <div className="text-[12px] text-gray-500">({safe(row?.strCateName)})</div>

            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
              value={String(row?.strListEasiaCateID || "")}
              onChange={(event) => {
                upTourCateAPI({
                  strTourCustomizedGUID: itemDetail?.strAgentHostServiceItemGUID,
                  strTourCustomizedPriceItemGUID:
                    row?.strTourCustomizedPriceItemGUID,
                  strListEasiaCateID: event.target.value,
                });
              }}
              disabled={isupdLoading}
            >
              <option value="">{t("selectStar")}</option>

              {starOptions.map((star) => (
                <option key={star} value={star}>
                  {"*".repeat(Number(star))}
                </option>
              ))}
            </select>
          </div>
        </td>

        <td className="px-4 py-4 text-[13px] font-medium text-gray-700">
          {safe(row?.strServiceNameMain)}
        </td>

        <td className="px-4 py-4 text-[13px] text-gray-700">
          <div className="flex items-center gap-2">
            <div>{safe(row?.intNoOfDay)}</div>
            <button
              onClick={() => {
                setSelectedPriceItemGUID(row?.strTourCustomizedPriceItemGUID);
                setOpen((prev) => ({
                  ...prev,
                  updateNoOfDay: true,
                }));
              }}
              className="cursor-pointer"
            >
              <Pen size={16} />
            </button>
          </div>
        </td>

        <td className="px-4 py-4 text-right text-[14px] font-bold text-gray-800">
          {formatMoney(row?.strQuantity)}
        </td>

        <td className="px-4 py-4 text-right text-[14px] font-bold text-gray-800">
          {formatMoney(row?.dblPriceCost)}
        </td>

        <td className="px-4 py-4 text-right text-[14px] font-bold text-gray-800">
          {formatMoney(row?.dblPriceCostUnit)}
        </td>

        <td className="px-4 py-4">
          <div className="flex justify-center">
            {hasDeleteId(row?.strTourCustomizedPriceItemGUID) && (
              <button
                onClick={() => {
                  setDeleteItem(row);
                  setOpen((prev) => ({
                    ...prev,
                    del: true,
                  }));
                }}
                className="cursor-pointer rounded-md bg-[#f2f4f7] p-2 text-gray-500 transition-all hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const items = item ?? [];
  const dayItems = items.filter((entry) => entry?.strDayShiftName !== "Night");
  const nightItems = items.filter((entry) => entry?.strDayShiftName === "Night");
  const hasData = items.length > 0;

  return (
    <div className="w-full bg-white font-sans">
      <div className="flex items-center gap-5">
        <h3 className="text-lg font-bold text-gray-800">
          {t("day")} {isValidValue(firstItem?.intDayOrder)}
        </h3>

        <div className="flex items-center gap-2">
          {isEditTitle ? (
            <>
              <input
                value={dayTitle}
                onChange={(event) => setDayTitle(event.target.value)}
                className="rounded border px-2 py-1 text-lg font-bold outline-none"
              />

              <button
                disabled={isLoading}
                onClick={handleUpdateNameDay}
                className="w-10 cursor-pointer rounded-2xl border text-green-600 hover:text-green-700"
              >
                ✓
              </button>

              <button
                onClick={() => {
                  setDayTitle(firstItem?.strDayTitle || "");
                  setIsEditTitle(false);
                }}
                className="w-10 cursor-pointer rounded-2xl border text-red-500 hover:text-red-600"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-gray-800">
                {isValidValue(firstItem?.strDayTitle)}
              </h3>

              <button
                onClick={() => setIsEditTitle(true)}
                className="cursor-pointer text-gray-500 hover:text-[#2566b0]"
              >
                <Pen size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
        <div className="flex items-center gap-4 text-gray-700">
          <MapPin size={20} className="fill-current" />

          <div className="flex flex-wrap items-center gap-2">
            {locations.map((location: any, index) => (
              <span
                key={index}
                className="flex items-center gap-2 rounded-sm border border-[#4a6fa5] p-1 text-[#4a6fa5]"
              >
                <div>{location.name}</div>
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => {
                    setLocItem(location.id);
                    setOpen((prev) => ({
                      ...prev,
                      deleteDestination: true,
                    }));
                  }}
                >
                  <X size={18} />
                </button>
              </span>
            ))}

            <div
              onClick={() =>
                setOpen((prev) => ({
                  ...prev,
                  destination: true,
                }))
              }
              className="cursor-pointer rounded-md bg-[#e9f2ff] p-1 text-[#4a83d4] hover:bg-[#d0e4ff]"
            >
              <Plus size={18} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            >
              <Menu size={20} />
            </button>

            {showMenu && (
              <div className="absolute left-[-200px] top-full z-50 mt-2">
                <ServiceMenu
                  items={menuItems}
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
            <tr className="border-b border-gray-100 text-[12px] font-medium uppercase tracking-tight text-gray-500">
              <th className="w-12 px-4 py-3 text-left font-normal">
                {t("serialNumber")}
              </th>
              <th className="w-24 px-4 py-3 text-left font-normal">
                {t("image")}
              </th>
              <th className="px-4 py-3 text-left font-normal uppercase">
                {t("service")}
              </th>
              <th className="px-4 py-3 text-left font-normal uppercase">
                {t("description")}
              </th>
              <th className="px-4 py-3 text-left font-normal uppercase">
                {t("noOfDays")}
              </th>
              <th className="px-4 py-3 text-left font-normal uppercase">
                {t("quantity")}
              </th>
              <th className="px-4 py-3 text-right font-normal uppercase">
                {t("price")}
              </th>
              <th className="px-4 py-3 text-right font-normal uppercase">
                {t("pricePerPax")}
              </th>
              <th className="w-20 px-4 py-3 text-center font-normal uppercase">
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {!hasData ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-2 text-[13px] font-bold text-gray-600"
                >
                  {t("noData")}
                </td>
              </tr>
            ) : (
              <>
                {dayItems.map((row, index) => renderRow(row, index))}
                {nightItems.length > 0 && (
                  <>
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-2 text-[13px] font-bold text-gray-600"
                      >
                        {t("night")}
                      </td>
                    </tr>

                    {nightItems.map((row, index) => renderRow(row, index))}
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

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
        strUserGUID={itemDetail?.strUserGUID}
        strTourCustomizedDayGUID={firstItem?.strTourCustomizedDayGUID}
      />

      <DeleteDestination
        open={open.deleteDestination}
        onClose={() => {
          setOpen((prev) => ({
            ...prev,
            deleteDestination: false,
          }));
        }}
        strTourCustomizedDayGUID={firstItem?.strTourCustomizedDayGUID}
        strCityGUID={locItem}
      />

      <UpdateNoOfDay
        open={open.updateNoOfDay}
        onClose={() => {
          setOpen((prev) => ({
            ...prev,
            updateNoOfDay: false,
          }));
        }}
        strTourCustomizedPriceItemGUID={selectedPriceItemGUID}
        item={itemListData}
      />
    </div>
  );
};

export default ListTour;
