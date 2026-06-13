import { TableCore, type ColumnDef } from "@/components/table/table-core";
import {
  useListHotel,
  useListHotelGetPriceUID,
  useListItemByAgent,
  useListPriceListForCompany,
  useListSupplierPriceByAgent,
} from "@/hooks/actions/useHotel";
import { getUrlImage } from "@/utils/format-image";
import {
  Star,
  MapPin,
  CheckCircle2,
  XCircle,
  Info,
  X,
  Utensils,
  BedDouble,
  Baby,
  ShoppingCart,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import RoomDropdown from "./room-dropdown";
import BookingHotelPopup from "./booking-hotel-popup";
// import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import BookingHotelCartPopup from "./booking-hotel-cart-popup";
// import { useToastStore } from "@/zustand/useToastStore";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useListFOC, useListSupplierPaymentTerm } from "@/hooks/actions/useBooking";
// import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUser } from "@/hooks/actions/useAuth";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { useTranslate } from "@/locales";

const HotelDetail = () => {
  const { t } = useTranslate("hotel");
  const location = useLocation();
  const item = location?.state?.item;
  // const router = useRouter();
  const { user } = useUser();
  const { coData } = useListCompanyOwner();
  // const { showToast } = useToastStore();
  // const queryClient = useQueryClient();
  const company = new URLSearchParams(location.search).get("company") || "";

  // const { mutate: addCartForHotelApi } = useMutation({
  //   mutationFn: addCartForHotel,
  // });

  const [filters] = useState({
    page: 1,
    pageSize: 1,
    strSupplierGUID: item?.strSupplierGUID,
    tblsReturn: "[0][1]",
  });

  const [filters2] = useState({
    strSupplierGUID: item?.strSupplierGUID,
    tblsReturn: "[0][1]",
  });

  const [openId, setOpenId] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState<Record<string, any[]>>({});
  const [bookingData, setBookingData] = useState<any | null>(null);
  const [bookingCartData, setBookingCartData] = useState<any | null>(null);

  const { hotelData, hotelLoading, hotelError } = useListHotel(filters);
  const { ibgData, ibgLoading, ibgError } = useListItemByAgent(filters);
  const { pplfcData } = useListPriceListForCompany(filters2);
  const { hotelData: hotelGetPriceData } = useListHotelGetPriceUID(filters);

  const hotel = hotelData?.[0] ?? {};

  const strPriceListGUID = pplfcData?.strPriceListGUID;
  const strPriceLevelGUID = hotelGetPriceData?.[1]?.[0]?.strPriceLevelGUID;

  const isSupplierPriceReady =
    !!item?.strSupplierGUID && !!strPriceListGUID && !!strPriceLevelGUID;

  const { spbData } = useListSupplierPriceByAgent(
    isSupplierPriceReady
      ? {
        strSupplierGUID: item?.strSupplierGUID,
        strPriceListGUID,
        strPriceLevelGUID,
      }
      : undefined,
  );

  const { focData, focLoading, focError } = useListFOC({
    strSupplierGUID: item?.strSupplierGUID,
    strPriceListGUID,
  })

  console.log("focData", focData)
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const ibgDataMain = ibgData?.[0] ?? [];
  const ibgDataDetail = ibgData?.[1] ?? [];
  const ibgDataDetailChild = ibgData?.[3] ?? [];

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const getPrice = (row: any, option: any) => {
    const flatSpbData = spbData?.flat?.() || [];

    const priceRow = flatSpbData.find(
      (x: any) => x.strItemTypeGUID === row.strItemTypeGUID,
    );

    if (!priceRow) return 0;

    const getNum = (v: any) => (typeof v === "number" ? v : 0);

    // CHILD / EXTRA
    if (option.raw?.intAgeFrom != null && option.raw?.intAgeTo != null) {
      const from = option.raw.intAgeFrom;
      const to = option.raw.intAgeTo;

      if (
        option.raw.IsExb ||
        option.raw.strAgeName?.toLowerCase().includes("extra")
      ) {
        return getNum(priceRow.dblPriceChild2);
      }

      if (from === 6 && to === 11) {
        return getNum(priceRow.dblPriceChild1);
      }

      return getNum(priceRow.dblPriceChild1) || getNum(priceRow.dblPrice);
    }

    // ROOM
    switch (option.raw?.intSglDblID) {
      case 1:
        return getNum(priceRow.dblPriceSGL) || getNum(priceRow.dblPrice);
      case 2:
        return getNum(priceRow.dblPriceTPL) || getNum(priceRow.dblPrice);
      default:
        return getNum(priceRow.dblPrice);
    }
  };

  useEffect(() => {
    if (!ibgDataDetail?.length && !ibgDataDetailChild?.length) return;

    const newSelected: any = {};

    ibgDataMain.forEach((row: any) => {
      const roomTypes = ibgDataDetail.filter(
        (x: any) => x.strItemTypeGUID === row.strItemTypeGUID,
      );

      const childOptions = ibgDataDetailChild.filter(
        (x: any) => x.strItemTypeGUID === row.strItemTypeGUID,
      );

      const roomOptions = [
        ...roomTypes.map((item: any) => ({
          label: item.strSglDblName,
          qty: 1,
          raw: item,
        })),
        ...childOptions.map((item: any) => ({
          label: item.strAgeName,
          qty: 1,
          raw: item,
        })),
      ];

      if (roomOptions.length > 0) {
        newSelected[row.strItemTypeGUID] = [roomOptions[0]];
      }
    });

    setSelectedRooms(newSelected);
  }, [ibgDataMain, ibgDataDetail, ibgDataDetailChild]);

  const getAdultByRoomName = (label: string) => {
    const name = label.toLowerCase();

    if (name.includes("double")) return 2;
    if (name.includes("twin")) return 2;
    if (name.includes("triple")) return 3;
    if (name.includes("3 pax")) return 3;
    if (name.includes("single")) return 1;
    if (name.includes("extra bed")) return 1;

    return 0;
  };

  // const handleAddtoCart = (data: any) => {
  //   const payload = data;

  //   addCartForHotelApi(payload, {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({
  //         queryKey: [QUERY_KEYS.CART.LIST_CART],
  //       });

  //       router.push(`${paths.shop.cart.list}?company=${company}`);
  //       showToast("success", t("addToCartSuccess"));
  //     },
  //     onError: () => {
  //       showToast("error", t("addToCartFailed"));
  //     },
  //   });
  // };

  const colDefs: ColumnDef<any>[] = [
    {
      field: "stt",
      headerName: t("no"),
      render: (_, __, rowIndex) => (
        <span className="text-gray-400 font-medium">{rowIndex + 1}</span>
      ),
    },
    {
      field: "No",
      headerName: t("image"),
      render: (_) => {
        const imageUrl = getUrlImage(hotel?.strSupplierImage);

        return (
          <img
            src={imageUrl}
            alt="room-image"
            onClick={() => setPreviewImage(imageUrl)}
            className="w-24 h-16 object-cover rounded cursor-pointer"
          />
        );
      },
    },
    {
      field: "strItemTypeName",
      headerName: t("roomName"),
      algin: "start",
      render: (value, row) => {
        const price = spbData?.[0]?.find(
          (p: any) => p.strItemTypeGUID === row.strItemTypeGUID,
        );

        return (
          <div>
            <div>{value}</div>

            {price?.strMealIncludedTypeName && (
              <div className="text-xs text-gray-500 flex items-center justify-start gap-1 mt-1   text-left">
                <Utensils size={14} className="text-emerald-500" />
                {price.strMealIncludedTypeName}
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "strSglDblName",
      headerName: t("roomType"),
      render: (_, row) => {
        const isOpen = openId === row.strItemTypeGUID;

        // ===== ROOM TYPES =====
        const roomTypes = ibgDataDetail.filter(
          (x: any) => x.strItemTypeGUID === row.strItemTypeGUID,
        );

        const roomTypeOptions = [
          ...new Map(
            roomTypes.map((item: any) => [
              item.strSglDblName,
              {
                label: item.strSglDblName,
                qty: 1,
                intSglDblID: item.intSglDblID,
                raw: item,
                isChild: false,
                icon: <BedDouble size={14} className="text-emerald-500" />,
              },
            ]),
          ).values(),
        ];

        // ===== CHILD / EXTRA OPTIONS =====
        const childOptions = ibgDataDetailChild.filter(
          (x: any) => x.strItemTypeGUID === row.strItemTypeGUID,
        );

        const childTypeOptions = childOptions.map((item: any) => ({
          label: item.strAgeName,
          qty: 1,
          intSglDblID: item.intSupplierChildAgeKeyID,
          ageFrom: item.intAgeFrom,
          raw: item,
          isChild: true,
          icon: <Baby size={14} className="text-pink-500" />,
        }));

        // ===== FINAL OPTIONS =====
        const roomOptions = [...roomTypeOptions, ...childTypeOptions];

        const selected = selectedRooms[row.strItemTypeGUID] || [];

        const firstOption = roomOptions?.[0];

        return (
          <div className="flex flex-col gap-3 w-full">
            {/* DROPDOWN */}
            <RoomDropdown
              isOpen={isOpen}
              onToggle={() => setOpenId(isOpen ? null : row.strItemTypeGUID)}
              onClose={() => setOpenId(null)}
              options={roomOptions}
              selected={selected}
              onChange={(item) => {
                setSelectedRooms((prev) => {
                  const current = prev[row.strItemTypeGUID] || [];

                  const exists = current.find((x) => x.label === item.label);

                  return {
                    ...prev,
                    [row.strItemTypeGUID]: exists
                      ? current.filter((x) => x.label !== item.label)
                      : [...current, item],
                  };
                });
              }}
            />

            {/* SELECTED LIST */}
            <div className="flex flex-col">
              {selected.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {selected.map((room) => {
                    const price = getPrice(row, room);
                    const total = room.qty * price;

                    return (
                      <div key={room.label} className="flex items-center gap-6">
                        {/* LEFT */}
                        <div className="flex items-center gap-2 w-[100px] shrink-0">
                          {room.icon}

                          <span className="text-[#1d3557] font-medium text-sm">
                            {room.label}
                          </span>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-3 ">
                          {/* QTY */}
                          <div className="flex items-center border-2 border-blue-500 rounded-full overflow-hidden h-7">
                            <button
                              className="cursor-pointer w-7 flex items-center justify-center text-blue-600"
                              onClick={() => {
                                setSelectedRooms((prev) => {
                                  const current =
                                    prev[row.strItemTypeGUID] || [];

                                  return {
                                    ...prev,
                                    [row.strItemTypeGUID]: current.map((x) =>
                                      x.label === room.label
                                        ? {
                                          ...x,
                                          qty: Math.max(1, x.qty - 1),
                                        }
                                        : x,
                                    ),
                                  };
                                });
                              }}
                            >
                              -
                            </button>

                            <span className="px-2 text-sm font-medium text-blue-600">
                              {room.qty}
                            </span>

                            <button
                              className="cursor-pointer w-7 flex items-center justify-center text-blue-600"
                              onClick={() => {
                                setSelectedRooms((prev) => {
                                  const current =
                                    prev[row.strItemTypeGUID] || [];

                                  return {
                                    ...prev,
                                    [row.strItemTypeGUID]: current.map((x) =>
                                      x.label === room.label
                                        ? {
                                          ...x,
                                          qty: x.qty + 1,
                                        }
                                        : x,
                                    ),
                                  };
                                });
                              }}
                            >
                              +
                            </button>
                          </div>

                          {/* PRICE */}
                          <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                            <span>x</span>

                            <span className="text-[#2563eb] font-medium">
                              ₫{price.toLocaleString()}
                            </span>

                            <span>=</span>

                            <span className="text-[#1d3557] font-semibold">
                              ₫{total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <BedDouble size={14} className="text-emerald-500" />

                  <span>{firstOption?.label || row.strSglDblName}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      field: "total",
      headerName: t("totalPrice"),
      render: (_, row) => {
        const selected = selectedRooms[row.strItemTypeGUID] || [];

        const total = selected.reduce((sum, item) => {
          const price = getPrice(row, item);
          return sum + item.qty * price;
        }, 0);

        return (
          <span className="font-semibold text-[#2563eb]">
            ₫{total.toLocaleString()}
          </span>
        );
      },
    },
    {
      field: "action",
      headerName: t("actions"),
      render: (_, row) => {
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const includedBreak = spbData?.[0]?.find(
                  (p: any) => p.strItemTypeGUID === row.strItemTypeGUID,
                );

                const selected = selectedRooms[row.strItemTypeGUID] || [];

                const adultCount = selected.reduce((sum, item) => {
                  if (item.isChild) return sum;

                  const adultPerRoom = getAdultByRoomName(item.label);

                  return sum + adultPerRoom * item.qty;
                }, 0);

                const childCount = selected.reduce((sum, item) => {
                  if (!item.isChild) return sum;

                  return sum + item.qty;
                }, 0);

                const roomGuidList = selected
                  .filter((x) => !x.isChild)
                  .flatMap((x) => Array(x.qty).fill(x.raw?.strItemTypeGUID));

                const childAgeList = selected
                  .filter((x) => x.isChild)
                  .flatMap((x) => Array(x.qty).fill(x.ageFrom));

                const childGuidList = selected
                  .filter((x) => x.isChild)
                  .flatMap((x) =>
                    Array(x.qty).fill(x.raw?.strSupplierChildAgeGUID),
                  );

                const items = selected.map((room) => {
                  const price = getPrice(row, room);

                  return {
                    label: room.label,
                    qty: room.qty,
                    price,
                    total: room.qty * price,
                  };
                });

                const totalAmount = items.reduce((sum, i) => sum + i.total, 0);

                const bookingPayload = {
                  hotel,
                  room: row,
                  includedBreak: includedBreak?.strMealIncludedTypeName,

                  // HOTEL
                  strSupplierGUID: hotel?.strSupplierGUID,

                  strPriceLevelGUID,
                  strPriceListGUID,

                  // DATE
                  dtmDateFrom: today,
                  dtmDateTo: tomorrow,

                  // ROOM INFO
                  intAdult: adultCount,

                  strListChildAge: childAgeList.join(",") + ",",

                  strListItemTypeGUID: roomGuidList.join(","),

                  strListSupplierChildAgeGUID: childGuidList.join(","),

                  // UI
                  adultCount,
                  childCount,

                  strItemTypeName: row.strItemTypeName,

                  items,
                  totalAmount,
                };

                setBookingData(bookingPayload);
              }}
              className="cursor-pointer px-3 h-8 rounded bg-[#4a6fa5] hover:bg-[#3b5b7e] text-white text-xs font-medium transition"
            >
              {t("bookNow")}
            </button>

            <button
              type="button"
              onClick={() => {
                // const { =
                const includedBreak = spbData?.[0]?.find(
                  (p: any) => p.strItemTypeGUID === row.strItemTypeGUID,
                );

                const selected = selectedRooms[row.strItemTypeGUID] || [];

                const strListItemTypeGUID = selected
                  .filter((room) => !room.isChild)
                  .map((room) => {
                    const raw = room.raw;

                    return `${raw?.strItemTypeGUID}!${raw?.intSglDblID}!${room.qty}!${includedBreak?.intMealIncludedTypeID}!${raw?.strItemTypeDetailGUID}!0#`;
                  })
                  .join("");

                const adultCount = selected.reduce((sum, item) => {
                  if (item.isChild) return sum;

                  const adultPerRoom = getAdultByRoomName(item.label);

                  return sum + adultPerRoom * item.qty;
                }, 0);

                const childCount = selected.reduce((sum, item) => {
                  if (!item.isChild) return sum;

                  return sum + item.qty;
                }, 0);


                const childAgeList = selected
                  .filter((x) => x.isChild)
                  .flatMap((x) => Array(x.qty).fill(x.ageFrom));

                const childGuidList = selected
                  .filter((x) => x.isChild)
                  .flatMap((x) =>
                    Array(x.qty).fill(x.raw?.strSupplierChildAgeGUID),
                  );

                const items = selected.map((room) => {
                  const price = getPrice(row, room);

                  return {
                    label: room.label,
                    qty: room.qty,
                    price,
                    total: room.qty * price,
                  };
                });

                const totalAmount = items.reduce((sum, i) => sum + i.total, 0);

                const bookingCartPayload = {
                  hotel,
                  room: row,
                  includedBreak: includedBreak?.strMealIncludedTypeName,

                  dtmDateFrom: today,
                  dtmDateTo: tomorrow,

                  adultCount,
                  childCount,

                  strItemTypeName: row.strItemTypeName,

                  items,
                  totalAmount,
                };

                const bookingCartPayloadSubmit = {
                  strSupplierGUID: hotel?.strSupplierGUID,
                  strCompanyPartnerGUID: user?.strCompanyGUID,
                  strCompanyOwnerGUID: coData?.strCompanyGUID,

                  strPriceLevelGUID,
                  strPriceListGUID,

                  intAdult: adultCount,

                  strListChildAge:
                    childAgeList.length > 0
                      ? childAgeList.join(",") + ","
                      : "",

                  strListItemTypeGUID: strListItemTypeGUID,

                  strListSupplierChildAgeGUID: childGuidList.join(","),

                  strListSurchargeDateGUID: "",

                  dtmDateFrom: today,
                  dtmDateTo: tomorrow,

                  intCurrencyID: user?.intCurrencyID,
                };

                setBookingCartData({
                  displayData: bookingCartPayload,
                  submitPayload: bookingCartPayloadSubmit,
                });
              }}
              className="cursor-pointer w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition"
            >
              <ShoppingCart size={16} className="text-slate-700" />
            </button>
          </div>
        );
      },
    },
  ];

  if (hotelLoading || ibgLoading) {
    return (
      <div className="p-10 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-4" />

        <div className="h-4 w-1/4 bg-gray-200 rounded mb-6" />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[500px] bg-gray-200 rounded-2xl" />
          </div>

          <div className="h-[300px] bg-gray-200 rounded-2xl" />
        </div>

        <div className="mt-8 h-[300px] bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (hotelError || ibgError) {
    return (
      <div className="p-10 text-center text-red-500">
        {t("loadHotelDetailFailed")}
      </div>
    );
  }

  if (Object.keys(hotel).length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-2">
            {t("hotelNotFound")}
          </h2>

          <p className="text-slate-500">{t("hotelNotFoundDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-6">
      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto mb-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <Link
            to={paths.shop.hotel.list + `?company=${company}`}
            className="flex items-center text-slate-400 hover:text-[#2566b0] transition-colors"
          >
            <Home size={20} />
          </Link>

          <span className="text-slate-400">&gt;</span>

          <Link
            to={paths.shop.hotel.list + `?company=${company}`}
            className="hover:text-[#2566b0] transition-colors"
          ></Link>

          <span className="text-slate-600 font-medium line-clamp-1">
            {hotel?.strSupplierName || t("hotelDetail")}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">
            {hotel?.strSupplierName}
          </h1>

          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < hotel?.intEasiaCateID ? "#fbbf24" : "none"}
                className={
                  i < hotel?.intEasiaCateID
                    ? "text-yellow-400"
                    : "text-slate-300"
                }
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
            <MapPin size={14} className="text-[#2566b0]" />
            {hotel?.strSupplierAddr}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                onClick={() => {
                  setPreviewImage(
                    getUrlImage(hotel?.strSupplierImage) ||
                    "https://dummyimage.com/600x400/e5e7eb/9ca3af&text=No+Image",
                  );
                }}
                src={
                  getUrlImage(hotel?.strSupplierImage) ||
                  "https://dummyimage.com/600x400/e5e7eb/9ca3af&text=No+Image"
                }
                className="w-full h-[500px] object-cover cursor-pointer hover:brightness-90 transition-all duration-300 relative z-10"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {t("introduction")}
              </h3>

              <div className="p-4 text-sm">
                {hotel?.strDescription ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: hotel?.strDescription }}
                  />
                ) : (
                  <span>{t("noContent")}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">
              {t("chooseRoom")}
            </h2>

            <button className="bg-[#2566b0] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
              {t("message")}
            </button>
          </div>

          <TableCore
            rowData={ibgDataMain}
            columnDefs={colDefs}
            loading={ibgLoading}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold text-emerald-600 mb-3">
              <CheckCircle2 size={18} />
              {t("included")}
            </h3>

            <p className="text-sm text-slate-600">{t("noData")}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold text-red-600 mb-3">
              <XCircle size={18} />
              {t("notIncluded")}
            </h3>

            <p className="text-sm text-slate-600">{t("noData")}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
            <Info size={18} className="text-[#2566b0]" />
            {t("terms")}
          </h3>

          <p className="text-sm text-slate-600">{t("noData")}</p>
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {t("viewImageDetail")}
              </h2>

              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-2 flex justify-center bg-slate-50">
              <img
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                src={
                  getUrlImage(hotel?.strSupplierImage) ||
                  "https://dummyimage.com/600x400/e5e7eb/9ca3af&text=No+Image"
                }
                alt="hotel-image"
              />
            </div>
          </div>
        </div>
      )}

      {bookingData && (
        <BookingHotelPopup
          open={true}
          data={bookingData}
          onClose={() => setBookingData(null)}
          focData={focData}
        />
      )}

      {bookingCartData && (
        <BookingHotelCartPopup
          open={true}
          data={bookingCartData}
          onClose={() => setBookingCartData(null)}
          focData={focData}
        />
      )}
    </div>
  );
};

export default HotelDetail;
