import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from './locales/i18n-provider.tsx';
// main.tsx hoặc index.tsx
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 1000 * 60 * 5,
      // gcTime: 0,
      // gcTime: 1000 * 60 * 60 * 2,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </QueryClientProvider>
  </StrictMode>
);