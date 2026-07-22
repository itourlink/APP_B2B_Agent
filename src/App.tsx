import { useEffect } from "react";
import { Router } from "./routes";
import ToastComponent from "./components/notification/useToast";
import { BrowserRouter } from "react-router-dom";
import GlobalLoading from "./components/loading/global-loading";
import { useUser } from "./hooks/actions/useAuth";
import { useCurrency } from "./components/currency/useCurrency";

function App() {

  useEffect(() => {
    const url = new URL(window.location.href);
    const companyInUrl = url.searchParams.get("company");

    if (!companyInUrl) {
      const saved = localStorage.getItem("company");

      if (saved) {
        url.searchParams.set("company", saved);
        localStorage.removeItem("company");
        window.location.replace(url.toString());
      }
    }
  }, []);

  const { user } = useUser()

  const { currencyId, setCurrencyId } = useCurrency();

  useEffect(() => {
    if (currencyId === null && user?.intCurrencyID) {
      setCurrencyId(user.intCurrencyID);
    }
  }, [currencyId, user, setCurrencyId]);

  return (
    <BrowserRouter>
      <Router />
      <ToastComponent />
      <GlobalLoading />
    </BrowserRouter>
  );
}

export default App;