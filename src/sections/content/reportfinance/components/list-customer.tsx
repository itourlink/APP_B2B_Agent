import { useTranslate } from "@/locales";

interface PassengerItem {
  intSaluteID: number | object;
  strSaluteName: string;
  intAgeID: number;
  strAgeName: string;
  strPassengerName: string;
  strPassengerFirstName: string | object;
  strPassengerLastName: string | object;
  intPassengerAges: number | object;
  strCountryGUID: string | object;
  strCountryName: string;
  strPassport: string;
  dtmPasspostExpirationDate: string;
  dtmPassengerBirthday: string;
  strPassengerEmail: string | object;
  strPassengerPhone: string | object;
  strRemark: string;
  IsEnableInput: boolean;
  IsLeader: boolean;
  strPassengerGUID: string;
}

interface ListCustomerProps {
  customers?: PassengerItem[];
  loading?: boolean;
}

const toStr = (value: string | object | undefined | null): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return "";
  return String(value);
};

const Field = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div className="min-h-[38px]">
      <p className="text-[12px] leading-[18px] text-[#222] font-medium">
        {label}
      </p>
      <p className="mt-1 text-[12px] leading-[18px] text-[#444] min-h-[18px]">
        {value || ""}
      </p>
    </div>
  );
};

const ListCustomer = ({ customers = [], loading = false }: ListCustomerProps) => {
  const { t } = useTranslate("reportfinance");

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-[18px] font-semibold text-[#222]">
          {t("listCustomer")}
        </h2>
        <div className="rounded-[10px] bg-white px-5 py-8 shadow-sm border border-[#f0f0f0] text-center text-gray-400">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-[18px] font-semibold text-[#222]">
          {t("listCustomer")}
        </h2>
        <div className="rounded-[10px] bg-white px-5 py-8 shadow-sm border border-[#f0f0f0] text-center text-gray-400">
          {t("noCustomerData")}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="mb-4 text-[18px] font-semibold text-[#222]">
        {t("listCustomer")}
      </h2>

      <div className="rounded-[10px] bg-white px-5 py-4 shadow-sm border border-[#f0f0f0]">
        {customers.map((customer, index) => {
          const isLeader = customer.IsLeader;
          const label = isLeader
            ? t("leader")
            : `${t("customer")} ${index + 1}`;

          return (
            <div key={customer.strPassengerGUID || index} className={index !== 0 ? "mt-10" : ""}>
              <h3 className="mb-4 text-[16px] font-semibold text-[#222]">
                {label}
                {isLeader && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </h3>

              {isLeader ? (
                <div className="grid grid-cols-4 gap-x-10 gap-y-3">
                  <Field label={t("salute")} value={toStr(customer.strSaluteName)} />
                  <Field label={t("firstName")} value={toStr(customer.strPassengerFirstName)} />
                  <Field label={t("lastName")} value={toStr(customer.strPassengerLastName)} />
                  <Field label={t("age")} value={toStr(customer.strAgeName)} />

                  <Field label={t("dateOfBirth")} value={toStr(customer.dtmPassengerBirthday)} />
                  <Field label={t("country")} value={toStr(customer.strCountryName)} />
                  <Field label={t("email")} value={toStr(customer.strPassengerEmail)} />
                  <Field label={t("phone")} value={toStr(customer.strPassengerPhone)} />

                  <div className="col-span-4">
                    <Field label={t("remark")} value={toStr(customer.strRemark)} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-x-16 gap-y-3 max-w-[760px]">
                  <Field label={t("salute")} value={toStr(customer.strSaluteName)} />
                  <Field label={t("firstName")} value={toStr(customer.strPassengerFirstName)} />
                  <Field label={t("lastName")} value={toStr(customer.strPassengerLastName)} />

                  <Field label={t("age")} value={toStr(customer.strAgeName)} />
                  <Field label={t("dateOfBirth")} value={toStr(customer.dtmPassengerBirthday)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListCustomer;