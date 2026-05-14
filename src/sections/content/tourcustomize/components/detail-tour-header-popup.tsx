import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Edit,
  Filter,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import PanelPopup from "@/components/popup/panel-popup";
import { useGetlistCustomer } from "@/hooks/actions/useTourCustomized";
import type { ITourCustomizedCustomer } from "@/hooks/interfaces/user";

import DeleteCustomer from "./del-customer";
import DetailTourHeaderPopupAdd from "./detail-tour-header-popup-add";
import UpdateCustomer from "./upd-customer";

interface Props {
  strTourCustomizedGUID: string;
  strTourCode: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];
const DISABLED_ACTION_BUTTON_CLASS =
  "flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-[#34495e] opacity-50 cursor-not-allowed";
const EDIT_ACTION_BUTTON_CLASS =
  "flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-[#34495e] transition hover:bg-blue-50 hover:text-[#004b91] cursor-pointer";
const DELETE_ACTION_BUTTON_CLASS =
  "flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-[#34495e] transition hover:bg-red-50 hover:text-red-600 cursor-pointer";

const normalizeText = (value?: string | null) => value?.trim() || null;

const getCustomerName = (customer: ITourCustomizedCustomer) => {
  const fullName = `${customer?.strFirstName || ""} ${customer?.strLastName || ""}`.trim();
  return fullName || customer?.strFullName || "---";
};

const getRoomName = (customer: ITourCustomizedCustomer) =>
  customer?.strRoomName ||
  customer?.strRoomTypeName ||
  customer?.strRoomType ||
  customer?.strSGLDBLName ||
  "";

const formatCustomerDate = (value?: string | number | null) => {
  if (!value) return "---";

  if (typeof value === "string") {
    const match = value.match(/\/Date\((\d+)\)\//);
    if (match) {
      const dotNetDate = new Date(Number(match[1]));
      return Number.isNaN(dotNetDate.getTime())
        ? "---"
        : dotNetDate.toLocaleDateString("vi-VN");
    }
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "---" : date.toLocaleDateString("vi-VN");
};

const DetailTourHeaderPopup = ({ strTourCustomizedGUID, strTourCode }: Props) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState<string | null>(null);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [editingCustomer, setEditingCustomer] = useState<ITourCustomizedCustomer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ITourCustomizedCustomer | null>(null);
  const addCustomerFormId = "detail-tour-add-customer-form";
  const updateCustomerFormId = "detail-tour-update-customer-form";

  const {
    tourCustomer,
    totalRecords,
    totalPages,
    isLoading,
    isFetching,
    refetch,
  } = useGetlistCustomer({
    strTourCode,
    page,
    pageSize,
    searchText: appliedSearch,
  });

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleApplyFilter = () => {
    const nextSearch = normalizeText(searchInput);
    const shouldManualRefetch =
      nextSearch === appliedSearch && page === DEFAULT_PAGE;

    setAppliedSearch(nextSearch);
    setPage(DEFAULT_PAGE);

    if (shouldManualRefetch) {
      refetch();
    }
  };

  const handleRefresh = () => {
    const shouldManualRefetch =
      searchInput === "" &&
      appliedSearch === null &&
      page === DEFAULT_PAGE &&
      pageSize === DEFAULT_PAGE_SIZE;

    setSearchInput("");
    setAppliedSearch(null);
    setPage(DEFAULT_PAGE);
    setPageSize(DEFAULT_PAGE_SIZE);

    if (shouldManualRefetch) {
      refetch();
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(DEFAULT_PAGE);
  };

  const handleAddCustomerSuccess = () => {
    setOpenPopup(false);
    refetch();
  };

  const handleUpdateCustomerSuccess = () => {
    setEditingCustomer(null);
    refetch();
  };

  const handleDeleteCustomerSuccess = () => {
    const isDeletingLastVisibleCustomer =
      tourCustomer.length === 1 && page > DEFAULT_PAGE;

    if (isDeletingLastVisibleCustomer) {
      setPage((prev) => Math.max(prev - 1, DEFAULT_PAGE));
      return;
    }

    refetch();
  };

  

  const pageCount = Math.max(totalPages, 1);
  const isEmpty = !isLoading && tourCustomer.length === 0;
  const displayFrom = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const displayTo =
    totalRecords === 0
      ? 0
      : Math.min((page - 1) * pageSize + tourCustomer.length, totalRecords);


 
  return (
    <div className="w-full">
      <div className="px-5 py-5">
        <div className="mb-5">
          <label className="mb-2 block text-lg font-semibold text-gray-700">
            Customer name
          </label>

          <div className="flex items-center gap-2">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleApplyFilter();
                }
              }}
              placeholder="Search customer name"
              className="h-11 w-[245px] rounded border border-gray-300 px-3 outline-none focus:border-blue-600"
            />

            <button
              type="button"
              onClick={handleApplyFilter}
              className="flex h-11 items-center gap-2 rounded bg-[#004b91] px-4 font-semibold text-white hover:bg-[#003f7a]"
            >
              <Filter size={22} fill="white" />
              Filter
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              className="flex h-11 w-12 items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-t-2xl">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="bg-[#2f69b1] text-white">
                <th className="px-3 py-3 text-left text-base font-semibold">
                  STT
                </th>
                <th className="px-3 py-3 text-left text-base font-semibold">
                  Customer <br /> name
                </th>
                <th className="px-3 py-3 text-left text-base font-semibold">
                  Room <br /> name
                </th>
                <th className="px-3 py-3 text-left text-base font-semibold">
                  Date Of <br /> Birth
                </th>
                <th className="px-3 py-3 text-left text-base font-semibold">
                  Passport
                </th>
                <th className="px-3 py-3 text-left text-base font-semibold">
                  Visa expiry date
                </th>
                <th className="px-3 py-3 text-left text-base font-semibold">
                  Contact <br /> detail
                </th>
                <th className="px-3 py-3 text-left text-base font-semibold">
                  Email
                </th>
                <th className="px-3 py-3 text-center text-base font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-10 text-center text-base text-gray-500"
                  >
                    Loading customer data...
                  </td>
                </tr>
              ) : isEmpty ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-10 text-center text-base text-gray-500"
                  >
                    No customer data
                  </td>
                </tr>
              ) : (
                tourCustomer.map((customer, index) => (
                  <tr
                    key={customer?.strCustomerGUID || `${customer?.No || page}-${index}`}
                    className="border-b border-gray-100 text-gray-700"
                  >
                    <td className="px-3 py-5 align-top text-base">
                      {customer?.No || (page - 1) * pageSize + index + 1}
                    </td>

                    <td className="px-3 py-5 align-top text-base">
                      {getCustomerName(customer)}
                    </td>

                    <td className="px-3 py-5 align-top text-base">
                      {getRoomName(customer) || "---"}
                    </td>

                    <td className="px-3 py-5 align-top text-base">
                      {formatCustomerDate(customer?.dtmDateOfBirth)}
                    </td>

                    <td className="px-3 py-5 align-top text-base">
                      {customer?.strPassNum || "---"}
                    </td>

                    <td className="px-3 py-5 align-top text-base">
                      {formatCustomerDate(customer?.dtmPassportExpireDate)}
                    </td>

                    <td className="px-3 py-5 align-top text-base">
                      {customer?.strContactDetail || "---"}
                    </td>

                    <td className="px-3 py-5 align-top text-base">
                      {customer?.strEmail || "---"}
                    </td>

                    <td className="px-3 py-5 text-center align-top">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          disabled={!customer?.strCustomerGUID}
                          className={
                            customer?.strCustomerGUID
                              ? EDIT_ACTION_BUTTON_CLASS
                              : DISABLED_ACTION_BUTTON_CLASS
                          }
                          onClick={() => setEditingCustomer(customer)}
                        >
                          <Edit size={18} />
                        </button>

                        {/* <button
                          type="button"
                          disabled
                          className={DISABLED_ACTION_BUTTON_CLASS}
                        >
                          <Copy size={18} />
                        </button> */}

                        <button
                          type="button"
                          disabled={!customer?.strCustomerGUID}
                          className={
                            customer?.strCustomerGUID
                              ? DELETE_ACTION_BUTTON_CLASS
                              : DISABLED_ACTION_BUTTON_CLASS
                          }
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <select
              value={pageSize}
              onChange={(event) => handlePageSizeChange(Number(event.target.value))}
              className="h-11 w-[78px] rounded border border-gray-300 px-3 text-lg text-gray-600 outline-none"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <span className="text-lg text-gray-700">
              [{displayFrom} - {displayTo}]/{totalRecords}
            </span>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(1)}
              className="flex h-11 w-12 items-center justify-center rounded-l border border-gray-300 text-[#2f75b8] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronsLeft size={20} />
            </button>

            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="flex h-11 w-12 items-center justify-center border-y border-r border-gray-300 text-[#2f75b8] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>

            <select
              value={page}
              onChange={(event) => setPage(Number(event.target.value))}
              className="h-11 w-[66px] border-y border-r border-gray-300 px-3 text-center text-gray-600 outline-none"
            >
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <option key={pageNumber} value={pageNumber}>
                    {pageNumber}
                  </option>
                )
              )}
            </select>

            <span className="flex h-11 items-center border-y border-r border-gray-300 px-2 text-lg text-gray-700">
              / {pageCount}
            </span>

            <button
              type="button"
              disabled={page >= pageCount || isLoading || totalPages === 0}
              onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
              className="flex h-11 w-12 items-center justify-center border-y border-r border-gray-300 text-[#2f75b8] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>

            <button
              type="button"
              disabled={page >= pageCount || isLoading || totalPages === 0}
              onClick={() => setPage(pageCount)}
              className="flex h-11 w-12 items-center justify-center rounded-r border-y border-r border-gray-300 text-[#2f75b8] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>

        {isFetching && !isLoading && (
          <p className="mt-3 text-sm text-gray-500">Refreshing customer data...</p>
        )}

        <button
          type="button"
          onClick={() => setOpenPopup(true)}
          className="mt-10 flex h-11 items-center gap-2 rounded bg-[#2869bd] px-4 text-lg font-semibold text-white hover:bg-[#1f5ca8]"
        >
          <Plus size={26} />
          Add new
        </button>
      </div>

      <PanelPopup
        title="Add new customer"
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        className="w-[700px] max-w-[95vw]"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpenPopup(false)}
              className="h-10 rounded-lg border border-gray-300 px-6 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              form={addCustomerFormId}
              className="h-10 rounded-lg bg-[#004b91] px-7 font-semibold text-white transition hover:bg-[#003f7a]"
            >
              Save
            </button>
          </div>
        }
      >
        <DetailTourHeaderPopupAdd
          formId={addCustomerFormId}
          onClose={() => setOpenPopup(false)}
          onSuccess={handleAddCustomerSuccess}
          strTourCustomizedGUID={strTourCustomizedGUID}
          strTourCode={strTourCode}
        />
      </PanelPopup>

      <PanelPopup
        title="Update customer"
        open={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        className="w-[700px] max-w-[95vw]"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingCustomer(null)}
              className="h-10 rounded-lg border border-gray-300 px-6 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              form={updateCustomerFormId}
              className="h-10 rounded-lg bg-[#004b91] px-7 font-semibold text-white transition hover:bg-[#003f7a]"
            >
              Save
            </button>
          </div>
        }
      >
        <UpdateCustomer
          formId={updateCustomerFormId}
          onClose={() => setEditingCustomer(null)}
          onSuccess={handleUpdateCustomerSuccess}
          customer={editingCustomer}
          strTourCode={strTourCode}
        />
      </PanelPopup>

      <DeleteCustomer
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        strCustomerGUID={selectedCustomer?.strCustomerGUID || ""}
        strTourCode={strTourCode}
        customerName={selectedCustomer ? getCustomerName(selectedCustomer) : ""}
        onDeleted={handleDeleteCustomerSuccess}
      />
    </div>
  );
};

export default DetailTourHeaderPopup;
