import { useEffect } from "react";
import { Router } from "./routes";
import ToastComponent from "./components/notification/useToast";
import { BrowserRouter } from "react-router-dom";

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

  return (
    <BrowserRouter>
      <Router />
      <ToastComponent />
    </BrowserRouter>
  );
}

export default App;