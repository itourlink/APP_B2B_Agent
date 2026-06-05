import { SplashScreen } from "@/components/loading";
import { paths } from "@/routes/paths";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function CompanyGuard({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const hasCompany = new URLSearchParams(location.search).has("company");

  useEffect(() => {
    if (!hasCompany) {
      navigate(paths.content.agent, { replace: true });
    }
  }, [hasCompany, navigate]);

  if (!hasCompany) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}