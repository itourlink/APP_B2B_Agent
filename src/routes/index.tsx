import { lazy, Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { paths } from "./paths";
import InitLayout, { LAYOUT } from "../layouts/init-layout";
import { SplashScreen } from "@/components/loading";
// import { AuthRoute } from "./auth-route";
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
// const AgentTestPage = lazy(() => import("@/pages/agent-test/list"));
const AgentCompanyPage = lazy(() => import("@/pages/agent-company/list"));
const SearchPage = lazy(() => import("@/pages/search/search"));
const CartPage = lazy(() => import("@/pages/cart/list"));
const SalesChannelPage = lazy(() => import("@/pages/sales-channel/list"));
const ShopPage = lazy(() => import("@/pages/shop/list"));
// const CartDetailPage = lazy(() => import("@/pages/cart/detail"));

// import InitLayout, { LAYOUT } from "@/layouts/init-layout";
// import RootRedirect from "./root-redirect";


////////////////////////////

const InfoPage = lazy(() => import("@/pages/content/info"));
const RequestBookingPage = lazy(() => import("@/pages/content/request-booking"));
const DetailRequestPage = lazy(() => import("@/pages/content/detail-request"));
const RequestCustomizePage = lazy(() => import("@/pages/content/request-customize"));
const DetailRequestCustomizePage = lazy(() => import("@/pages/content/detail-request-customize"));
const QuotePage = lazy(() => import("@/pages/content/quote"));
const DetailQuotePage = lazy(() => import("@/pages/content/detail-quote"));
const ServicePage = lazy(() => import("@/pages/content/service"));
const DetailServicePage = lazy(() => import("@/pages/content/detail-service"));
const FeedbackPage = lazy(() => import("@/pages/content/feedback"));
const PricingPage = lazy(() => import("@/pages/content/pricing"));
const ReportsFinancePage = lazy(() => import("@/pages/content/report-finance"));
const DetailReportsFinancePage = lazy(() => import("@/pages/content/detail-report-finance"));
const ReportApprovedPage = lazy(() => import("@/pages/content/report-approved"));
const AgentPage = lazy(() => import("@/pages/content/agent"));
const TourBookingsPage = lazy(() => import("@/pages/content/tour-bookings"));
const TourCancelledPage = lazy(() => import("@/pages/content/tour-cancelled"));
const TourProposalsPage = lazy(() => import("@/pages/content/tour-proposals"));
const DetailTourPage = lazy(() => import("@/pages/content/detail-tour"));
const AgentHostPage = lazy(() => import("@/pages/overlay/agent-host"));
export function Router() {
  // const isLoading = true;
  // if (isLoading) return <SplashScreen />


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
            // <AuthRoute>
            <InitLayout type={LAYOUT.OVERLAY}>
              <Outlet />
            </InitLayout>
            // </AuthRoute >
          ),
          children: [
            {
              path: paths.overlay.notification,
              element: <NotificationPage />,
            },
            {
              path: paths.overlay.cart,
              element: <CartPage />,
            },

            //path temp of content
            {
              path: paths.content.detailTour,
              element: <DetailTourPage />,
            },

            {
              path: paths.content.agentHost,
              element: <AgentHostPage />,
            },
          ],
        },

        // INFO LAYOUT
        {
          element: (
            <InitLayout type={LAYOUT.INFO}>
              <Outlet />
            </InitLayout>
          ),
          children: [

            {
              path: paths.content.info,
              element: <InfoPage />,
            },
            {
              path: paths.content.requestBooking,
              element: <RequestBookingPage />,
            },
            {
              path: paths.content.detailRequest,
              element: <DetailRequestPage />,
            },
            {
              path: paths.content.requestCustomize,
              element: <RequestCustomizePage />,
            },
            {
              path: paths.content.detailRequestCustomize,
              element: <DetailRequestCustomizePage />,
            },
            {
              path: paths.content.quote,
              element: <QuotePage />,
            },
            {
              path: paths.content.detaiQuote,
              element: <DetailQuotePage />,
            },
            {
              path: paths.content.service,
              element: <ServicePage />,
            },
            {
              path: paths.content.detailService,
              element: <DetailServicePage />,
            },
            {
              path: paths.content.feedback,
              element: <FeedbackPage />,
            },
            {
              path: paths.content.pricing,
              element: <PricingPage />,
            },
            {
              path: paths.content.reportFinance,
              element: <ReportsFinancePage />,
            },
            {
              path: paths.content.detailReportFinance,
              element: <DetailReportsFinancePage />,
            },
            {
              path: paths.content.reportApproved,
              element: <ReportApprovedPage />,
            },
            {
              path: paths.content.agent,
              element: <AgentPage />,
            },
            {
              path: paths.content.tourBookings,
              element: <TourBookingsPage />,
            },
            {
              path: paths.content.tourCancelled,
              element: <TourCancelledPage />,
            },
            {
              path: paths.content.tourProposals,
              element: <TourProposalsPage />,
            },
          ],
        },

        // SHOP LAYOUT
        {
          element: (
            <InitLayout type={LAYOUT.SHOP}>
              <Outlet />
            </InitLayout>
          ),
          children: [
            {
              index: true,
              element: <Navigate to={paths.content.info} replace />,
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
      ],
    },

    // OUTSIDE LAYOUT
    { path: paths.page404, element: <Page404Page /> },
    { path: "*", element: <Navigate to={paths.page404} replace /> },
  ]);
  return router;
}
