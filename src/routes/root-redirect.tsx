// import { Navigate } from "react-router-dom";
// import { useIsLoggedToken, useUserStore } from "@/zustand/useUserStore";
// import { paths } from "./paths";
// import { SplashScreen } from "@/components/loading";

// export default function RootRedirect() {
//   const logged = useIsLoggedToken();
//   const { user, loading } = useUserStore();

//   if (loading) {
//     return (
//       <div>
//         <SplashScreen />
//         <SplashScreen />
//       </div>
//     );
//   }

//   if (!logged)
//     return (
//       <div>
//         <SplashScreen />
//         <Navigate to={paths.home} replace />
//       </div>
//     );

//   if (user?.role === "USER")
//     return (
//       <div>
//         <SplashScreen />
//         <Navigate to={paths.overview.dashboardUser} replace />;
//       </div>
//     );

//   if (user?.role === "TRADER")
//     return (
//       <div>
//         <SplashScreen />
//         <Navigate to={paths.trader.dashboard} replace />
//       </div>
//     );

//   return <Navigate to={paths.home} replace />;
// }
