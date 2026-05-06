export type ConfigValue = {
  appName: string;
  serverUrl: string;
  clientUrl: string;
  binanceServerUrlV1: string;
  binanceServerUrlV3: string;
  socketBinanceUrl: string;
  fsSocketBinanceUrl: string;
  socketServerUrl: string;
  warnIP: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: "Agent",
  serverUrl: import.meta.env.VITE_SERVER_URL ?? "",
  clientUrl: import.meta.env.VITE_CLIENT_URL ?? "",
  binanceServerUrlV1: import.meta.env.VITE_BINANCE_SERVER_URL_V1 ?? "",
  binanceServerUrlV3: import.meta.env.VITE_BINANCE_SERVER_URL_V3 ?? "",
  socketBinanceUrl: import.meta.env.VITE_SOCKET_BINANCE_URL ?? "",
  fsSocketBinanceUrl: import.meta.env.VITE_fS_SOCKET_BINANCE_URL ?? "",
  socketServerUrl: import.meta.env.VITE_SOCKET_SERVER_URL ?? "",
  warnIP: import.meta.env.VITE_WARN_IP ?? "",
};
