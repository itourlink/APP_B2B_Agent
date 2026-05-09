import { buildQuery } from "@/utils/utilts";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);

  const router = useMemo(
    () => ({
      back: () => navigate(-1),
      forward: () => navigate(1),
      refresh: () => navigate(0),

      push: (href: string) => navigate(href),

      replace: (href: string) =>
        navigate(
          {
            pathname: href,
            search: location.search, // 👈 giữ luôn
          },
          { replace: true }
        ),

      replaceParams: (href: string, state?: any) =>
        navigate(
          {
            pathname: href,
            search: location.search,
          },
          { replace: false, state }
        ),

      replaceQuery: (
        href: string,
        params?: Record<string, any>,
        options?: { target?: "_blank" | "_self" }
      ) => {
        const query = params ? `?${buildQuery(params)}` : "";
        const url = `${href}${query}`;

        if (options?.target === "_blank") {
          window.open(url, "_blank");
          return;
        }

        navigate(url);
      },
    }),
    [navigate, location.search]
  );

  return router;
}