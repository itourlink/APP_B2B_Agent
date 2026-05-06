type LogValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | unknown[];

const styles = {
  info: "background:#0ea5e9;color:white;padding:2px 8px;border-radius:4px;",
  success: "background:#10b981;color:white;padding:2px 8px;border-radius:4px;",
  warn: "background:#f59e0b;color:black;padding:2px 8px;border-radius:4px;",
  error: "background:#ef4444;color:white;padding:2px 8px;border-radius:4px;",
  label: "color:#94a3b8;font-weight:600;",
  arrow: "color:#38bdf8;",
};

function print(prefix: string, color: string, label: string, value: LogValue) {
  console.log(
    `%c${prefix} %c${label}%c`,
    color,
    styles.label,
    styles.arrow,
    value
  );
}

export const logger = {
  info(label: string, value: LogValue) {
    print("INFO", styles.info, label, value);
  },
  success(label: string, value: LogValue) {
    print("OK", styles.success, label, value);
  },
  warn(label: string, value: LogValue) {
    print("WARN", styles.warn, label, value);
  },
  error(label: string, value: LogValue) {
    print("ERR", styles.error, label, value);
  },
};
