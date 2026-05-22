// export const paths = {
//   // root: "/",
//   comingSoon: "/coming-soon",
//   auth: {
//     signIn: "/sign-in",
//     signUp: "/sign-up",
//     forgotPass: "/forgot-pass",
//     newPassword: "/new-password",
//   },
//   tour: {
//     list: "/tour",
//     detail: "/tour-detail"
//   },
//   boat: {
//     list: "/boat",
//     detail: "/boat-detail"
//   },
//   hotel: {
//     list: "/hotel",
//     detail: "/detail"
//   },
//   flight: {
//     list: "/flight",
//     detail: "/flight-detail"
//   },
//   vehicle: {
//     list: "/vehicle",
//     detail: "/vehicle-detail"
//   },
//   guide: {
//     list: "/guide",
//     detail: "/guide-detail"
//   },
//   restaurant: {
//     list: "/restaurant",
//     detail: "/restaurant-detail"
//   },
//   voucher: {
//     list: "/voucher"
//   },
//   notification: {
//     list: "/notification"
//   },
//   agentCompany: {
//     list: "/agent-company"
//   },
//   search: "/search",
//   cart: {
//     list: "/cart",
//     detail: "/cart-detail"
//   },
//   salesChannel: {
//     list: "/sales-channel"
//   },
//   shop: {
//     list: "/shop"
//   },
//   content: {
//     info: "/info",
//     requestBooking: "/request-booking",
//     detailRequest: "/detail-request",
//     requestCustomize: "/request-customize",
//     detailRequestCustomize: "/detail-request-customize",
//     quote: "/quote",
//     detaiQuote: "/detail-quote",
//     service: "/service",
//     detailService: "/detail-service",
//     feedback: "/feedback",
//     pricing: "/pricing",
//     reportFinance: "/report-finance",
//     detailReportFinance: "/detail-report-finance",
//     reportApproved: "/report-approved",
//     agent: "/agent",
//     tourBookings: "/tour-bookings",
//     tourCancelled: "/tour-cancelled",
//     tourProposals: "/tour-proposals",
//     detailTour: "/detail-tour",
//     agentHost: "/agent-host",
//   },
//   overlay: {
//     notification: "/notification",
//     cart: "/cart"
//   },
//   backdoor: "/backdoor",
//   page403: "/error/403",
//   page404: "/error/404",
//   page500: "/error/500",
// };



export const paths = {
  comingSoon: "/coming-soon",

  auth: {
    signIn: "/sign-in",
  },

  // SHOP
  shop: {
    home: "/shop",

    tour: {
      list: "/shop/tour",
      detail: "/shop/tour-detail",
    },

    boat: {
      list: "/shop/boat",
      detail: "/shop/boat-detail",
    },

    hotel: {
      list: "/shop/hotel",
      detail: "/shop/hotel-detail",
    },

    flight: {
      list: "/shop/flight",
      detail: "/shop/flight-detail",
    },

    vehicle: {
      list: "/shop/vehicle",
      detail: "/shop/vehicle-detail",
    },

    guide: {
      list: "/shop/guide",
      detail: "/shop/guide-detail",
    },

    restaurant: {
      list: "/shop/restaurant",
      detail: "/shop/restaurant-detail",
    },

    voucher: {
      list: "/shop/voucher",
      detail: "/shop/voucher-detail",
    },

    notification: {
      list: "/shop/notification",
    },

    agentCompany: {
      list: "/shop/agent-company",
    },

    search: "/shop/search",

    cart: {
      list: "/shop/cart",
      detail: "/shop/cart-detail",
    },

    salesChannel: {
      list: "/shop/sales-channel",
    },
  },

  booking: {
    paymentBooking: "/booking/payment-booking",
  },

  content: {
    info: "/info",
    requestBooking: "/request-booking",
    detailRequest: "/detail-request",
    requestCustomize: "/request-customize",
    detailRequestCustomize: "/detail-request-customize",
    quote: "/quote",
    detaiQuote: "/detail-quote",
    service: "/service",
    detailService: "/detail-service",
    feedback: "/feedback",
    pricing: "/pricing",
    reportFinance: "/report-finance",
    detailReportFinance: "/detail-report-finance",
    reportApproved: "/report-approved",
    agent: "/agent",
    tourBookings: "/tour-bookings",
    tourCancelled: "/tour-cancelled",
    tourProposals: "/tour-proposals",
    detailTour: "/detail-tour",
    agentHost: "/agent-host",
  },

  overlay: {
    notification: "/notification",
    cart: "/cart",
  },
  cart: {
    list: "/cart",
    detail: "/cart-detail"
  },

  backdoor: "/backdoor",

  page403: "/error/403",
  page404: "/error/404",
  page500: "/error/500",
};