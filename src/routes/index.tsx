import { lazy, Suspense, useEffect } from "react";
import { Navigate, Outlet, useRoutes, useLocation } from "react-router-dom";
import { paths } from "./paths";
import InitLayout, { LAYOUT } from "../layouts/init-layout";
import { SplashScreen } from "@/components/loading";
import AuthGuard from "./auth-guard";
import CompanyGuard from "./company-guard";
const TourPage = lazy(() => import("@/pages/tour/list"));
const TourDetailPage = lazy(() => import("@/pages/tour/detail"));
const BoatPage = lazy(() => import("@/pages/boat/list"));
const BoatDetailPage = lazy(() => import("@/pages/boat/detail"));
const FlightPage = lazy(() => import("@/pages/flight/list"));
const FlightDetailPage = lazy(() => import("@/pages/flight/detail"));
const VehiclePage = lazy(() => import("@/pages/vehicle/list"));
const VehicleDetailPage = lazy(() => import("@/pages/vehicle/detail"));
const GuidePage = lazy(() => import("@/pages/guide-fee/list"));
const GuideDetailPage = lazy(() => import("@/pages/guide-fee/detail"));
const RestaurantPage = lazy(() => import("@/pages/restaurant/list"));
const RestaurantDetailPage = lazy(() => import("@/pages/restaurant/detail"));
const NotificationPage = lazy(() => import("@/pages/notification/notification"));
const HotelPage = lazy(() => import("@/pages/hotel/list"));
const HotelDetailPage = lazy(() => import("@/pages/hotel/detail"));
const Page404Page = lazy(() => import("@/pages/error/page404"));
const AgentCompanyPage = lazy(() => import("@/pages/agent-company/list"));
const SearchPage = lazy(() => import("@/pages/search/search"));
const CartPage = lazy(() => import("@/pages/cart/list"));
const SalesChannelPage = lazy(() => import("@/pages/sales-channel/list"));
const ShopPage = lazy(() => import("@/pages/shop/list"));
const VoucherPage = lazy(() => import("@/pages/voucher/list"));
const VoucherDetailPage = lazy(() => import("@/pages/voucher/detail"));
const PaymentBookingPage = lazy(() => import("@/pages/booking/payment-booking"));
const PaymentBookingCartPage = lazy(() => import("@/pages/booking/payment-booking-cart"));
const PaymentBookingHotelPage = lazy(() => import("@/pages/booking/payment-booking-hotel"));
const AgentPage = lazy(() => import("@/pages/content/agent"));
const AgentHostPage = lazy(() => import("@/pages/overlay/agent-host"));

export function Router() {
  // const isLoading = true;
  // if (isLoading) return <SplashScreen />

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const router = useRoutes([
    {
      path: "/",
      element: (
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      ),
      children: [

        // OVERLAY LAYOUT
        {
          element: (
            <AuthGuard>
              <InitLayout type={LAYOUT.OVERLAY}>
                <Outlet />
              </InitLayout>
            </AuthGuard>
          ),
          children: [
            {
              path: paths.content.agentHost,
              element: <AgentHostPage />,
            },
          ],
        },

        // INFO LAYOUT
        {
          element: (
            <AuthGuard>
              <InitLayout type={LAYOUT.INFO}>
                <Outlet />
              </InitLayout>
            </AuthGuard>
          ),
          children: [
            {
              path: paths.content.agent,
              element: <AgentPage />,
            },
          ],
        },

        // SHOP LAYOUT
        {
          element: (
            <AuthGuard>
              <CompanyGuard>
                <InitLayout type={LAYOUT.SHOP}>
                  <Outlet />
                </InitLayout>
              </CompanyGuard>
            </AuthGuard>
          ),
          children: [
            {
              index: true,
              element: <Navigate to={paths.content.agent} replace />,
            },
            {
              path: paths.shop.voucher.list,
              element: <VoucherPage />,
            },
            {
              path: paths.shop.voucher.detail,
              element: <VoucherDetailPage />,
            },
            {
              path: paths.shop.home,
              element: <ShopPage />,
            },

            {
              path: paths.shop.tour.list,
              element: <TourPage />,
            },
            {
              path: paths.shop.tour.detail,
              element: <TourDetailPage />,
            },

            {
              path: paths.shop.boat.list,
              element: <BoatPage />,
            },
            {
              path: paths.shop.boat.detail,
              element: <BoatDetailPage />,
            },

            {
              path: paths.shop.hotel.list,
              element: <HotelPage />,
            },
            {
              path: paths.shop.hotel.detail,
              element: <HotelDetailPage />,
            },

            {
              path: paths.shop.flight.list,
              element: <FlightPage />,
            },
            {
              path: paths.shop.flight.detail,
              element: <FlightDetailPage />,
            },

            {
              path: paths.shop.vehicle.list,
              element: <VehiclePage />,
            },
            {
              path: paths.shop.vehicle.detail,
              element: <VehicleDetailPage />,
            },

            {
              path: paths.shop.guide.list,
              element: <GuidePage />,
            },
            {
              path: paths.shop.guide.detail,
              element: <GuideDetailPage />,
            },

            {
              path: paths.shop.restaurant.list,
              element: <RestaurantPage />,
            },
            {
              path: paths.shop.restaurant.detail,
              element: <RestaurantDetailPage />,
            },

            {
              path: paths.shop.notification.list,
              element: <NotificationPage />,
            },

            {
              path: paths.shop.agentCompany.list,
              element: <AgentCompanyPage />,
            },

            {
              path: paths.shop.search,
              element: <SearchPage />,
            },

            {
              path: paths.shop.cart.list,
              element: <CartPage />,
            },

            {
              path: paths.shop.salesChannel.list,
              element: <SalesChannelPage />,
            },

          ],
        },

        // OUT LAYOUT
        {
          element: (
            <AuthGuard>
              <CompanyGuard>
                <InitLayout type={LAYOUT.OUTSIDE}>
                  <Outlet />
                </InitLayout>
              </CompanyGuard>
            </AuthGuard>
          ),
          children: [
            {
              path: paths.booking.paymentBooking,
              element: <PaymentBookingPage />,
            },
            {
              path: paths.booking.paymentBookingCart,
              element: <PaymentBookingCartPage />,
            },
            {
              path: paths.booking.paymentBookingHotel,
              element: <PaymentBookingHotelPage />,
            },
          ],
        },
      ],
    },

    { path: paths.page404, element: <Page404Page /> },
    { path: "*", element: <Navigate to={paths.page404} replace /> },
  ]);
  return router;
}
