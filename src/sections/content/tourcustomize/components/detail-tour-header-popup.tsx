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
import { useState, type FormEvent } from "react";

import PanelPopup from "@/components/popup/panel-popup";

import DetailTourHeaderPopupAdd from "./detail-tour-header-popup-add";

const DetailTourHeaderPopup = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const addCustomerFormId = "detail-tour-add-customer-form";

  const handleAddCustomerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpenPopup(false);
  };

  return (
    <div className="w-full">
      <div className="px-5 py-5">
        <div className="mb-5">
          <label className="mb-2 block text-lg font-semibold text-gray-700">
            Customer name
          </label>

          <div className="flex items-center gap-2">
            <input className="h-11 w-[245px] rounded border border-gray-300 px-3 outline-none focus:border-blue-600" />

            <button
              type="button"
              className="flex h-11 items-center gap-2 rounded bg-[#004b91] px-4 font-semibold text-white hover:bg-[#003f7a]"
            >
              <Filter size={22} fill="white" />
              Lọc
            </button>

            <button
              type="button"
              className="flex h-11 w-12 items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-t-2xl">
          <table className="w-full min-w-[1000px] border-collapse">
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
                  Visa expity date
                </th>
                <th className="px-3 py-3 text-left text-base font-semibold">
                  Contact <br /> detail
                </th>
                <th className="px-3 py-3 text-left text-base font-semibold">
                  Email
                </th>
                <th className="px-3 py-3 text-center text-base font-semibold">
                  Thao <br /> tac
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-100 text-gray-700">
                <td className="px-3 py-3 align-top text-lg"></td>

                <td className="px-3 py-3 align-top">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="flex h-10 w-12 items-center justify-center rounded bg-gray-100 text-[#34495e] hover:bg-gray-200"
                    >
                      <Edit size={20} />
                    </button>

                    <button
                      type="button"
                      className="flex h-10 w-12 items-center justify-center rounded bg-gray-100 text-[#34495e] hover:bg-gray-200"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </td>

                <td className="px-3 py-5 align-top text-lg">
                  Dương <br /> Ngọc
                </td>

                <td className="px-3 py-5 align-top text-lg"></td>

                <td className="px-3 py-5 align-top text-lg">123123123</td>

                <td className="px-3 py-5 align-top text-lg">
                  /Date(1778605200000)/
                </td>

                <td className="px-3 py-5 align-top text-lg">123123123</td>

                <td className="px-3 py-5 align-top text-lg">abc@gmail.com</td>

                <td className="px-3 py-5 text-center align-top">
                  <button
                    type="button"
                    className="inline-flex h-11 w-12 items-center justify-center rounded bg-gray-100 text-[#34495e] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <select className="h-11 w-[78px] rounded border border-gray-300 px-3 text-lg text-gray-600 outline-none">
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>40</option>
              <option>50</option>
            </select>

            <span className="text-lg text-gray-700">[1 - 1]/1</span>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              className="flex h-11 w-12 items-center justify-center rounded-l border border-gray-300 text-[#2f75b8] hover:bg-gray-50"
            >
              <ChevronsLeft size={20} />
            </button>

            <button
              type="button"
              className="flex h-11 w-12 items-center justify-center border-y border-r border-gray-300 text-[#2f75b8] hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>

            <select className="h-11 w-[66px] border-y border-r border-gray-300 px-3 text-center text-gray-600 outline-none">
              <option>1</option>
            </select>

            <span className="flex h-11 items-center border-y border-r border-gray-300 px-2 text-lg text-gray-700">
              / 1
            </span>

            <button
              type="button"
              className="flex h-11 w-12 items-center justify-center border-y border-r border-gray-300 text-[#2f75b8] hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>

            <button
              type="button"
              className="flex h-11 w-12 items-center justify-center rounded-r border-y border-r border-gray-300 text-[#2f75b8] hover:bg-gray-50"
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpenPopup(true)}
          className="mt-10 flex h-11 items-center gap-2 rounded bg-[#2869bd] px-4 text-lg font-semibold text-white hover:bg-[#1f5ca8]"
        >
          <Plus size={26} />
          Thêm mới
        </button>
      </div>

      <PanelPopup
        title="Thêm mới khách hàng"
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
              Hủy
            </button>

            <button
              type="submit"
              form={addCustomerFormId}
              className="h-10 rounded-lg bg-[#004b91] px-7 font-semibold text-white transition hover:bg-[#003f7a]"
            >
              Lưu
            </button>
          </div>
        }
      >
        <DetailTourHeaderPopupAdd
          formId={addCustomerFormId}
          onSubmit={handleAddCustomerSubmit}
        />
      </PanelPopup>
    </div>
  );
};

export default DetailTourHeaderPopup;
