import { paths } from "@/routes/paths";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function CompanyGuard({ children }: Props) {
  const location = useLocation();

  const hasCompany = new URLSearchParams(
    location.search
  ).has("company");

  if (!hasCompany) {
    return (
      <Navigate
        to={paths.content.agent}
        replace
      />
    );
  }

  return <>{children}</>;
}