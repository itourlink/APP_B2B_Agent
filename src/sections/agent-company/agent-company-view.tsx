import { useListAgentHost } from "@/hooks/actions/useCompanyOwner";
import { getUrlImage } from "@/utils/format-image";
import { isValidValue } from "@/utils/utilts";
import { FileCheck } from "lucide-react";
import { useState } from "react";
import imgDefault from "@/assets/images/default-image.jpg";
import { useTranslate } from "@/locales";
import { useListCity } from "@/hooks/actions/useCity";

const getLogoSrc = (logo: any) => {
  if (!logo || typeof logo !== "string") return "";

  if (logo.startsWith("http")) return logo;

  return getUrlImage(logo);
};

type FiltersType = {
  page: number | null;
  pageSize: number | null;
  strFilterCompanyName: string | null;
  strFilterLocationCode: string | null;
  intCateID: string | null;
};

type TempFiltersType = {
  page: number | null;
  pageSize: number | null;
  strFilterCompanyName: string;
  strFilterLocationCode: string;
  intCateID: string;
};

const AgentCompanyView = () => {
  const { t } = useTranslate("agent");

  const { ctData: cityData = [] } = useListCity({
    strTableName: "MC04",
    strFeildSelect: "MC04_CityCode AS strCityCode, MC04_CityName AS strCityName",
    strWhere: "WHERE IsActive=1 AND MC04_CityCode LIKE '%VN%' ORDER BY MC04_CityName ASC",
  });


  const BADGE_MAP: Record<number, { icon: string; label: string }> = {
    1: { icon: "💎", label: t("diamond") },
    2: { icon: "🥇", label: t("gold") },
    3: { icon: "🥈", label: t("silver") },
    4: { icon: "🥉", label: t("bronze") },
  };

  const CATEID_OPTIONS = [
    { label: t("tour"), value: "19" },
    { label: t("hotel"), value: "1" },
    { label: t("restaurant"), value: "2" },
    { label: t("cruise"), value: "3" },
    { label: t("vehicle"), value: "4" },
    { label: t("flight"), value: "6" },
    { label: t("sightseeing"), value: "7" },
    { label: t("tourGuide"), value: "8" },
    { label: t("vehicle"), value: "31" },
    { label: t("voucher"), value: "34" },
  ];

  const getCateLabels = (value: any) => {
    if (!value) return "---";

    let ids: string[] = [];

    if (Array.isArray(value)) {
      ids = value.map(String);
    } else if (typeof value === "string") {
      ids = value.split(",");
    } else if (typeof value === "number") {
      ids = [String(value)];
    } else {
      return "---";
    }

    return ids
      .map((id) => CATEID_OPTIONS.find((c) => c.value === id)?.label)
      .filter(Boolean)
      .join(", ");
  };

  const [feFilters, setFeFilters] = useState({
    intCompanyTypeID: "",
    intBadgeTypeID: "",
    isContractSigned: "",
  });

  const [filters, setFilters] = useState<FiltersType>({
    page: null,
    pageSize: null,
    strFilterCompanyName: null,
    strFilterLocationCode: null,
    intCateID: null,
  });

  const [tempFilters, setTempFilters] = useState<TempFiltersType>({
    page: null,
    pageSize: null,
    strFilterCompanyName: "",
    strFilterLocationCode: "",
    intCateID: "",
  });

  const handleReset = () => {
    const defaultFilters = {
      page: null,
      pageSize: null,
      strFilterCompanyName: "",
      strFilterLocationCode: "",
      intCateID: "",
    };

    setTempFilters(defaultFilters);
    setFilters({
      ...defaultFilters,
      strFilterCompanyName: null,
      strFilterLocationCode: null,
      intCateID: null,
    });
    setFeFilters({
      intCompanyTypeID: "",
      intBadgeTypeID: "",
      isContractSigned: "",
    });
  };

  const { ahData, ahLoading, ahError } = useListAgentHost(filters);
  const list = ahData || [];

  const filteredList = list.filter((item: any) => {
    const matchType =
      !feFilters.intCompanyTypeID ||
      String(item.intCompanyTypeID) === feFilters.intCompanyTypeID;

    const matchBadge =
      !feFilters.intBadgeTypeID ||
      String(item.intCompanyBadgeTypeID) === feFilters.intBadgeTypeID;

    const matchContract =
      feFilters.isContractSigned === ""
        ? true
        : Number(item.IsContractSigned) === Number(feFilters.isContractSigned);

    return matchType && matchBadge && matchContract;
  });

  const selectClass =
    "w-full h-10 px-3 border border-slate-200 rounded-md text-sm outline-none bg-white cursor-pointer";
  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-slate-800">
          <h1>{t("supplierList")}</h1>
        </h1>

        {/* FILTER */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-5">
              <input
                value={tempFilters.strFilterCompanyName}
                onChange={(e) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    strFilterCompanyName: e.target.value,
                  }))
                }
                type="text"
                placeholder={t("companyName")}
                className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm outline-none"
              />
            </div>

            <div className="col-span-6 md:col-span-3">
              <select
                value={tempFilters.strFilterLocationCode}
                onChange={(e) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    strFilterLocationCode: e.target.value,
                  }))
                }
                className="cursor-pointer w-full h-10 px-3 border border-slate-200 rounded-md text-sm outline-none bg-white"
              >
                <option value="">{t("location")}</option>
                {cityData?.map((city: any) => (
                  <option key={city.strCityCode} value={city.strCityCode}>
                    {city.strCityName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-6 md:col-span-2">
              <select
                value={tempFilters.intCateID}
                onChange={(e) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    intCateID: e.target.value,
                  }))
                }
                className="cursor-pointer w-full h-10 px-3 border border-slate-200 rounded-md text-sm outline-none"
              >
                <option value="">{t("all")}</option>
                {CATEID_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Button */}
            <div className="col-span-12 md:col-span-2 flex gap-2">
              <button
                onClick={handleReset}
                className="cursor-pointer w-1/2 h-10 flex items-center justify-center bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
              >
                {t("reset")}
              </button>

              <button
                onClick={() =>
                  setFilters({
                    ...tempFilters,
                    strFilterCompanyName:
                      tempFilters.strFilterCompanyName || null,
                    strFilterLocationCode:
                      tempFilters.strFilterLocationCode || null,
                    intCateID: tempFilters.intCateID || null,
                    page: 1,
                  })
                }
                className="cursor-pointer w-1/2 h-10 flex items-center justify-center bg-[#004b91] text-white rounded-md hover:bg-[#003566]"
              >
                {t("search")}
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          <div className="grid grid-cols-12 gap-4">
            {/* Loại công ty */}
            <div className="col-span-12 md:col-span-4">
              <label className="text-xs text-slate-500 mb-1 block">
                <label>{t("companyType")}</label>
              </label>
              <select
                value={feFilters.intCompanyTypeID}
                onChange={(e) =>
                  setFeFilters((prev) => ({
                    ...prev,
                    intCompanyTypeID: e.target.value,
                  }))
                }
                className={selectClass}
              >
                <option value="">{t("all")}</option>
                <option value="1">{t("agent")}</option>
                <option value="2">{t("agentHost")}</option>
              </select>
            </div>

            {/* Huy hiệu */}
            <div className="col-span-12 md:col-span-4">
              <label className="text-xs text-slate-500 mb-1 block">
                {t("badge")}
              </label>
              <select
                value={feFilters.intBadgeTypeID}
                onChange={(e) =>
                  setFeFilters((prev) => ({
                    ...prev,
                    intBadgeTypeID: e.target.value,
                  }))
                }
                className={selectClass}
              >
                <option value="">{t("all")}</option>

                {Object.entries(BADGE_MAP).map(([key, badge]) => (
                  <option key={key} value={key}>
                    {badge.icon} {badge.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Chứng nhận */}
            <div className="col-span-12 md:col-span-4">
              <label className="text-xs text-slate-500 mb-1 block">
                <label>{t("certification")}</label>
              </label>
              <select
                value={feFilters.isContractSigned}
                onChange={(e) =>
                  setFeFilters((prev) => ({
                    ...prev,
                    isContractSigned: e.target.value,
                  }))
                }
                className={selectClass}
              >
                <option value="">{t("all")}</option>
                <option value="1">{t("contractSigned")}</option>
                <option value="0">{t("contractUnsigned")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* LOADING SKELETON */}
          {ahLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-slate-100 animate-pulse flex gap-4"
              >
                <div className="w-20 h-20 bg-slate-200 rounded-lg" />

                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            ))}

          {/* ERROR */}
          {ahError && !ahLoading && (
            <div className="col-span-2 text-center text-red-500 py-10">
              {t("somethingWentWrong")}
            </div>
          )}

          {/* EMPTY */}
          {!ahLoading && !ahError && list.length === 0 && (
            <div className="col-span-2 text-center text-slate-400 py-10">
              {t("noDataFound")}
            </div>
          )}

          {/* DATA */}
          {!ahLoading &&
            !ahError &&
            filteredList.map((company: any) => {
              const badge = BADGE_MAP[company?.intCompanyBadgeTypeID];

              return (
                <div
                  key={company?.strCompanyGUID}
                  className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition flex gap-4"
                >
                  {/* Logo */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        typeof company?.strCompanyLogo === "string" &&
                          company.strCompanyLogo.trim()
                          ? getLogoSrc(company.strCompanyLogo)
                          : imgDefault
                      }
                      alt="logo"
                      onError={(e) => {
                        e.currentTarget.src = imgDefault;
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Top */}
                    <div className="flex justify-between gap-3">
                      <h2 className="font-semibold text-sm text-slate-800 leading-snug line-clamp-2">
                        {company?.strCompanyName}
                      </h2>

                      <div className="flex flex-col items-end gap-1 min-w-[100px]">
                        <div className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded">
                          {company?.intCompanyTypeID === 2
                            ? t("agentHost")
                            : t("agent")}
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                          {badge && <div>{badge.icon}</div>}

                          {company?.IsContractSigned && (
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                              <FileCheck size={16} />
                              <span>{t("contractSigned")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-xs text-slate-600 mt-2 space-y-1">
                      <p>
                        <span className="text-slate-400">{t("companyCategory")}:</span>{" "}
                        {getCateLabels(company?.strListCateID)}
                      </p>
                      <p>
                        <span className="text-slate-400">{t("location")}:</span>{" "}
                        {isValidValue(company?.strListDestinationName)}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="h-[40px] mt-2">
                      {company?.IsSendReq === 1 ? (
                        <span className="inline-block bg-slate-200 text-slate-700 px-3 py-1 rounded text-xs">
                          {t("pendingApproval")}
                        </span>
                      ) : (
                        <span className="cursor-pointer inline-block text-slate-200 bg-[#2566b0] hover:bg-slate-50 hover:border hover:border-slate-400 hover:text-[#2566b0] px-3 py-1 rounded text-xs">
                          {t("sendRequest")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AgentCompanyView;
