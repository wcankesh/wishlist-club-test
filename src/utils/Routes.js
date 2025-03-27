import { baseUrl } from "./Constant";
import { lazy } from "react";

const Dashboard = lazy(() => import("../Component/Dashboard/Dashboard"));
const Analytics = lazy(() => import("../Component/Analytics/Analytics"));
const BackInStock = lazy(() => import("../Component/BackInStock/BackInStock"));
const BackInStockDesign = lazy(() => import("../Component/BackInStock/BackInStockDesign/BackInStockDesign"));
const BackInStockEmail = lazy(() => import("../Component/BackInStock/BackInStockEmail/BackInStockEmail"));
const StockNotification = lazy(() => import("../Component/BackInStock/BackInStockEmail/StockNotification"));
const ThankYouNotification = lazy(() => import("../Component/BackInStock/BackInStockEmail/ThankYouNotification"));
const WishlistItems = lazy(() => import("../Component/WishlistItems/WishlistItems"));
const WishlistDesign = lazy(() => import("../Component/Settings/WishlistDesign/WishlistDesign"));
const Settings = lazy(() => import("../Component/Settings/Settings"));
const General = lazy(() => import("../Component/Settings/General/General"));
const WishlistEmail = lazy(() => import("../Component/Settings/WishlistEmail/WishlistEmail"));
const WishlistEmailCustomization = lazy(() => import("../Component/Settings/WishlistEmail/WishlistEmailCustomization"));
const Language = lazy(() => import("../Component/Settings/Language/Language"));
const Headless = lazy(() => import("../Component/Settings/Headless/Headless"));
const Plan = lazy(() => import("../Component/Plan/Plan"));
const Installation = lazy(() => import("../Component/Installation/Installation"));
const Integration = lazy(() => import("../Component/Settings/Integration/Integration"));
const IntegrationDetails = lazy(() => import("../Component/Settings/Integration/IntegrationDetails/IntegrationDetails"));
const WhatSNew = lazy(() => import("../Component/Settings/WhatSNew/WhatSNew"));
const RequestAFeature = lazy(() => import("../Component/Settings/WhatSNew/RequestAFeature/RequestAFeature"));
const EmailHistory = lazy(() => import("../Component/EmailHistory/EmailHistory"));
const OnBoardingApp = lazy(() => import("../Component/OnBoardingApp/OnBoardingApp"));

export const routes = [
    { path: `${baseUrl}/dashboard`, component: <Dashboard /> },
    { path: `${baseUrl}/analytics`, component: <Analytics /> },
    { path: `${baseUrl}/back-in-stock`, component: <BackInStock /> },
    { path: `${baseUrl}/back-in-stock/design`, component: <BackInStockDesign /> },
    { path: `${baseUrl}/back-in-stock/email`, component: <BackInStockEmail /> },
    { path: `${baseUrl}/settings/back-in-stock/email/stock-notification`, component: <StockNotification /> },
    { path: `${baseUrl}/settings/back-in-stock/email/thank-you-notification`, component: <ThankYouNotification /> },
    { path: `${baseUrl}/wishlist-items`, component: <WishlistItems /> },
    { path: `${baseUrl}/wishlist-design`, component: <WishlistDesign /> },
    { path: `${baseUrl}/settings`, component: <Settings /> },
    { path: `${baseUrl}/settings/general`, component: <General /> },
    { path: `${baseUrl}/settings/wishlist-design`, component: <WishlistDesign /> },
    { path: `${baseUrl}/settings/email`, component: <WishlistEmail /> },
    { path: `${baseUrl}/settings/email/email-customization`, component: <WishlistEmailCustomization /> },
    { path: `${baseUrl}/settings/language`, component: <Language /> },
    { path: `${baseUrl}/settings/headless`, component: <Headless /> },
    { path: `${baseUrl}/settings/plan`, component: <Plan /> },
    { path: `${baseUrl}/settings/installation`, component: <Installation /> },
    { path: `${baseUrl}/settings/integration`, component: <Integration /> },
    { path: `${baseUrl}/settings/integration/:type`, component: <IntegrationDetails /> },
    { path: `${baseUrl}/settings/feedback`, component: <WhatSNew /> },
    { path: `${baseUrl}/settings/request-feature`, component: <RequestAFeature /> },
    { path: `${baseUrl}/email-history`, component: <EmailHistory /> },
    { path: `${baseUrl}/onboarding`, component: <OnBoardingApp /> },
];