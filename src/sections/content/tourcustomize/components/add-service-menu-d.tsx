import { useEffect, useState } from "react";
import { Funnel, MapPin, X } from "lucide-react";
import { Form, Field, } from "@/components/hook-form";
import { useForm } from "react-hook-form"
import { useListCity } from "@/hooks/actions/useCity";
// import { useFetchAddServiceMenuMappingPrice } from "@/hooks/actions/useAddServiceMenu";


const AddServiceMenuD = () => {
  const methods = useForm({
    defaultValues: {
      serviceType: "1",
      displayName: "",
      category: "",
      from: "",
      to: "",
      country: "",
      cities: "",
    },
  });

  const { watch, setValue } = methods;
  const selectedCountryCode = watch("country");

  const {
    ctData: countryData = [],
  } = useListCity({
    strTableName: "MC02",
    strWhere: "WHERE IsActive=1 ORDER BY MC02_CountryName",
    strFeildSelect:
      "MC02_CountryCode AS code, MC02_CountryName AS strName",
  });

  const [isEditLoc, setIsEditLoc] = useState(false);

  const selectedCountry = countryData.find(
    (item: any) => item.code === selectedCountryCode
  );

  const countryOptions = countryData.map((item: any) => ({
    label: item.strName,
    value: item.code,
  }));

  // const { vehicleData, vehicleLoading } = useFetchAddServiceMenuMappingPrice({ page: 1, pageSize: 10 });

  const {
    ctData: cityData = [],
  } = useListCity({
    strTableName: "MC04",
    strWhere: selectedCountryCode
      ? `WHERE IsActive=1 AND MC04_CityCode LIKE '%${selectedCountryCode}%' ORDER BY MC04_CityName`
      : "WHERE 1=0",
    strFeildSelect:
      "MC04_CityCode AS code, MC04_CityName AS strName",
  });

  const cityOptions = cityData.map((item: any) => ({
    label: item.strName,
    value: item.code,
  }));

  useEffect(() => {
    setValue("cities", "");
  }, [selectedCountryCode, setValue]);

  const selectedCitiesCodes = (watch("cities") ?? "")
    .split(",")
    .filter(Boolean);

  const selectedCitiesNames = cityData
    ?.filter((c: any) => selectedCitiesCodes.includes(c.code))
    .map((c: any) => c.strName) || [];
  return (
    <Form methods={methods}>
      <div className="bg-white px-2 pb-4 pt-1 text-[13px] text-gray-700">
        <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-[20px] font-normal text-gray-800">
            Add Single Service for Day 1
          </h2>

          <button
            type="button"
            className="text-[#0d4d92] transition hover:opacity-80"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Field.Select name="serviceType"
              options={[
                { label: "Boat (Day cruise)", value: "1" },
                { label: "Restaurant", value: "2" },
                { label: "Transport", value: "3" }]}
            />
          </div>

          <div >
            <Field.Text name="displayName" placeholder="Name" />
          </div>

          {/* <input
          type="text"
          placeholder="Name"
          className="h-7 flex-1 rounded border border-gray-300 px-2 text-[12px] text-gray-700 outline-none placeholder:text-gray-400"
        /> */}

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded bg-[#0d4d92] text-white  cursor-pointer"
          >
            <Funnel size={18} />
          </button>

          {/* <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded border border-[#0d4d92] text-[#0d4d92]"
        >
          <Link2 size={18} />
        </button> */}
        </div>

        {isEditLoc ? (
          <div className="mb-2 flex items-center gap-2">
            <div className="w-[180px]">
              <Field.SearchSelect name="country" options={countryOptions} />
            </div>
            <div className="flex-1">
              <Field.MultiSelect name="cities" options={cityOptions} />
            </div>
            <button type="button" onClick={() => setIsEditLoc(false)} className="text-gray-400 hover:text-gray-600 transition">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            className="mb-2 flex items-center gap-1 text-[12px] text-[#0d4d92] cursor-pointer hover:opacity-80 transition"
            onClick={() => setIsEditLoc(true)}
          >
            <MapPin size={13} className="fill-[#0d4d92]" />
            <span>
              {selectedCountry ? selectedCountry.strName : "Vietnam"}: {selectedCitiesNames.length > 0 ? selectedCitiesNames.join(", ") : "Ha Noi"}
            </span>
          </div>
        )}

        <div className="mb-3 grid grid-cols-[190px_1fr_1fr] gap-2">
          <Field.Select name="category"
            placeholder="Select Category"
            options={[
              { label: "*", value: "1" },
              { label: "**", value: "2" },
              { label: "***", value: "3" },
              { label: "****", value: "4" },
              { label: "*****", value: "5" },
              { label: "******", value: "6" },
              { label: "*******", value: "7" }]} />

          <div>
            {/* <CalendarDays size={13} className="mr-2 text-gray-500" /> */}
            <Field.Text name="from" placeholder="From" />
          </div>

          <div>
            {/* <CalendarDays size={13} className="mr-2 text-gray-500" /> */}
            <Field.Text name="to" placeholder="To" />
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-gray-200 text-[#3b6ea8]">
                <th className="py-2 text-left font-normal">STT</th>
                <th className="py-2 text-left font-normal">Tên dịch vụ</th>
                <th className="py-2 text-left font-normal">Price</th>
              </tr>
            </thead>

            {/* <tbody>
              {vehicleLoading ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    Đang tải dữ liệu dịch vụ...
                  </td>
                </tr>
              ) : vehicleData && vehicleData.length > 0 ? (
                vehicleData.map((item: any, index: number) => (
                  <tr key={item.strSupplierMappingPriceGUID || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 text-gray-700 px-2">{index + 1}</td>
                    <td className="py-2 px-2 font-medium">{item.strSupplierName || item.strItemName || "N/A"}</td>
                    <td className="py-2 px-2 text-[#0d4d92] font-semibold">
                      {item.dblPriceCost ? item.dblPriceCost.toLocaleString() : "Liên hệ"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 text-gray-700 text-center" colSpan={3}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody> */}

            <tbody>
               
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 text-gray-700 px-2">1</td>
                    <td className="py-2 px-2 font-medium">Test</td>
                    <td className="py-2 px-2 text-[#0d4d92] font-semibold">
                      10000
                    </td>
                  </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Form>
  );
};

export default AddServiceMenuD;
