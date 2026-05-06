/* eslint-disable @typescript-eslint/no-explicit-any */

import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DownloadCSVProps<T> {
  data: T[];
  headerMap: Record<string, string>;
  fileName?: string;
}

// referrer.email  children[0].email
function getValueByPath(obj: any, path: string) {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function formatCSVValue(value: any) {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/"/g, '""');
}

export function DownloadCSV<T>({
  data,
  headerMap,
  fileName = "export.csv",
}: DownloadCSVProps<T>) {
  const { t } = useTranslation("common");
  const handleDownload = () => {
    const keys = Object.keys(headerMap);

    const headers = keys.map((k) => headerMap[k]).join(",");

    const rows = data
      .map((row) =>
        keys
          .map((key) => {
            const raw = getValueByPath(row, key);
            return `"${formatCSVValue(raw)}"`;
          })
          .join(",")
      )
      .join("\n");

    const csv = headers + "\n" + rows;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-brand-500 text-white rounded-lg flex items-center w-max gap-3"
    >
      <Download size={20} /> {t("download")} .CSV
    </button>
  );
}
