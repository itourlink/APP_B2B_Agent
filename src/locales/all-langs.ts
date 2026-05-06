// core (MUI)
import { viVN as viVNCore } from "@mui/material/locale";
import {
  enUS as enUSDate,
  viVN as viVNDate,
} from "@mui/x-date-pickers/locales";
// data grid (MUI)
import {
  enUS as enUSDataGrid,
  // frFR as frFRDataGrid,
  viVN as viVNDataGrid,

  // zhCN as zhCNDataGrid,
  // arSD as arSDDataGrid,
} from "@mui/x-data-grid/locales";

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: "en",
    label: "English",
    countryCode: "GB",
    adapterLocale: "en",
    numberFormat: { code: "en-US", currency: "USD" },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  {
    value: "vi",
    label: "Tiếng Việt",
    countryCode: "VN",
    adapterLocale: "vi",
    numberFormat: { code: "vi-VN", currency: "VND" },
    systemValue: {
      components: {
        ...viVNCore.components,
        ...viVNDate.components,
        ...viVNDataGrid.components,
      },
    },
  },
  // {
  //   value: "th",
  //   label: "ไทย", // hoặc "Thai" nếu bạn muốn tiếng Anh
  //   countryCode: "TH", // sửa lại đúng mã quốc gia Thái Lan
  //   adapterLocale: "th", // để đồng bộ với dayjs/ date-fns nếu dùng
  //   numberFormat: { code: "th-TH", currency: "THB" },
  //   systemValue: {
  //     components: {
  //       // nếu chưa có localization từ MUI, có thể để rỗng hoặc thêm custom nếu cần
  //     },
  //   },
  // },

  // {
  //   value: 'fr',
  //   label: 'French',
  //   countryCode: 'FR',
  //   adapterLocale: 'fr',
  //   numberFormat: { code: 'fr-Fr', currency: 'EUR' },
  //   systemValue: {
  //     components: { ...frFRCore.components, ...frFRDate.components, ...frFRDataGrid.components },
  //   },
  // },
  // {
  //   value: "ms",
  //   label: "Bahasa Melayu",
  //   countryCode: "MY",
  //   adapterLocale: "ms-MY",
  //   numberFormat: { code: "ms-MY", currency: "MYR" },
  //   // systemValue: {
  //   //   components: { ...msMYCore.components, ...msMYDate.components, ...msMYDataGrid.components },
  //   // },
  // },

  // {
  //   value: 'ar',
  //   label: 'Arabic',
  //   countryCode: 'SA',
  //   adapterLocale: 'ar-sa',
  //   numberFormat: { code: 'ar', currency: 'AED' },
  //   systemValue: {
  //     components: { ...arSACore.components, ...arSDDataGrid.components },
  //   },
  // },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
