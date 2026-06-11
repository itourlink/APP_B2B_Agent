import { useEffect } from "react";
import { Router } from "./routes";
import ToastComponent from "./components/notification/useToast";
import { BrowserRouter } from "react-router-dom";
import GlobalLoading from "./components/loading/global-loading";
import { useUser } from "./hooks/actions/useAuth";
import { useCurrency } from "./zustand/useCurrency";

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

  const { user } = useUser();
  const { setCurrencyId } = useCurrency();

  useEffect(() => {
    if (user?.intCurrencyID) {
      setCurrencyId(user.intCurrencyID);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <GlobalLoading />
      <Router />
      <ToastComponent />
    </BrowserRouter>
  );
}

export default App;