import { ChevronDown } from "lucide-react";
import type { FormEvent } from "react";

interface Props {
  formId?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

const inputClassName =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-[#004b91]";

const textareaClassName =
  "min-h-[120px] w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 outline-none transition focus:border-[#004b91]";

const labelClassName = "mb-2 block text-sm font-semibold text-gray-700";

const DetailTourHeaderPopupAdd = ({
  formId = "customer-add-form",
  onSubmit,
}: Props) => {
  return (
    <form id={formId} onSubmit={onSubmit} className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClassName}>Salute</label>
          <select
            defaultValue="Mr"
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-[#004b91] md:max-w-[110px]"
          >
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
            <option value="Mrs">Mrs</option>
          </select>
        </div>

        <div>
          <label className={labelClassName}>
            First name <span className="text-red-500">*</span>
          </label>
          <input className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>
            Last name <span className="text-red-500">*</span>
          </label>
          <input className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>Email</label>
          <input type="email" className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>SĐT</label>
          <input className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>Country</label>
          <div className="relative">
            <select
              defaultValue=""
              className="h-10 w-full appearance-none rounded-lg border border-gray-300 px-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-[#004b91]"
            >
              <option value="">txt_plhd_Select</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Japan">Japan</option>
              <option value="Korea">Korea</option>
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        <div>
          <label className={labelClassName}>Date of birth</label>
          <input type="text" className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>Passport</label>
          <input className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>Visa Expity Date</label>
          <input className={inputClassName} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClassName}>Contact detail</label>
          <textarea className={textareaClassName} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClassName}>More Info</label>
          <textarea className={textareaClassName} />
        </div>
      </div>
    </form>
  );
};

export default DetailTourHeaderPopupAdd;
