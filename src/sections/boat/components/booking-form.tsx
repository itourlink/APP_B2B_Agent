import { useTranslate } from "@/locales";

const BookingForm = () => {
  const { t } = useTranslate("boat");
  return (
    <div>
      <div className="w-full lg:w-[350px]">
        <div className="sticky top-32 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
          <h2 className="text-[#2566b0] text-2xl font-bold mb-6">
            {" "}
            {t("bookBoat")}
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("departureDate")} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2566b0] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none">
                <option>{t("adultChildOption1")}</option>
                <option>{t("adultChildOption2")}</option>
              </select>
            </div>

            <button className="w-full bg-[#2566b0] hover:bg-[#1e5492] text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]">
               {t("checkPrice")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
