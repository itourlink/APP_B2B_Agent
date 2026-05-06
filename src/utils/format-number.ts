// ----------------------------------------------------------------------

/*
 * Locales code
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */

export type InputNumberValue = string | number | null | undefined;

type Options = Intl.NumberFormatOptions | undefined;
export function fNumber(
  value: string | number,
  minimumFractionDigits: number = 2
): string {
  if (value === null || value === undefined || value === "") return "0";

  const num = Number(value);
  if (isNaN(num)) return "0";

  const str = String(value);

  if (Math.abs(num) < 1) {
    const [intPart, decPart = ""] = str.split(".");

    // Cắt tối đa 6 số, không làm tròn
    const truncated = decPart.slice(0, 6);

    return truncated ? `${intPart}.${truncated}` : intPart;
  }

  const [integerPart, decimalPart = ""] = str.split(".");

  const truncatedDecimal =
    minimumFractionDigits > 0
      ? decimalPart
        .padEnd(minimumFractionDigits, "0")
        .slice(0, minimumFractionDigits)
      : "";

  const formattedInteger = Number(integerPart).toLocaleString("en-US");

  return truncatedDecimal
    ? `${formattedInteger}.${truncatedDecimal}`
    : formattedInteger;
}

export const fTruncateText = (text: string, maxLength: number) => {
  if (typeof text !== "string") return text; // Đảm bảo text là chuỗi
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const truncateId = (text: string, startChars = 4, endChars = 4) => {
  if (!text) return "";

  // Nếu ID ngắn hơn tổng số ký tự muốn giữ thì không cần cắt
  if (text.length <= startChars + endChars) {
    return text;
  }

  // Cắt đầu, cắt đuôi và nối bằng "..."
  const start = text.slice(0, startChars);
  const end = text.slice(-endChars); // Số âm để lấy từ cuối lên

  return `${start}...${end}`;
};

export const formatCurrency = (
  num: number | undefined,
  options?: Options
): string => {
  if (num === undefined || isNaN(num)) return "";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });
};

export const fAddress = (
  text: string,
  start: number = 6,
  end: number = 7
): string => {
  if (typeof text !== "string" || !text) return "";
  if (text.length <= start + end) return text; // nếu quá ngắn thì không cắt
  return `${text.slice(0, start)}...${text.slice(-end)}`;
};


export const truncateText = (text?: string, max = 20) => {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
};

export const truncateEmail = (email?: string, max = 5) => {
  if (!email) return "";

  const [name, domain] = email.split("@");
  if (!domain) return email;

  return name.length > max
    ? name.slice(0, max) + "...@" + domain
    : email;
};

export const formatPrice = (price: any) => {
  if (
    price === null ||
    price === undefined ||
    price === '' ||
    price === 'N/A' ||
    (typeof price === 'object' && Object.keys(price).length === 0)
  ) {
    return '---';
  }

  const num = Number(price);

  if (isNaN(num) || num <= 0) return '---';

  return `$${num}`;
};