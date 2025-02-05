import {baseUrl} from "./Constant";
import Dashboard from "../Component/Dashboard/Dashboard";
import Analytics from "../Component/Analytics/Analytics";
import BackInStock from "../Component/BackInStock/BackInStock";
import BackInStockEmail from "../Component/BackInStock/BackInStockEmail/BackInStockEmail";
import StockNotification from "../Component/BackInStock/BackInStockEmail/StockNotification";
import ThankYouNotification from "../Component/BackInStock/BackInStockEmail/ThankYouNotification";
import WishlistItems from "../Component/WishlistItems/WishlistItems";
import Settings from "../Component/Settings/Settings";
import General from "../Component/Settings/General/General";
import WishlistDesign from "../Component/Settings/WishlistDesign/WishlistDesign";
import WishlistEmail from "../Component/Settings/WishlistEmail/WishlistEmail";
import WishlistItemsEmail from "../Component/Settings/WishlistEmail/WishlistItemsEmail";
import PriceDropAlertEmail from "../Component/Settings/WishlistEmail/PriceDropAlertEmail";
import RestockAlertEmail from "../Component/Settings/WishlistEmail/RestockAlertEmail";
import Language from "../Component/Settings/Language/Language";
import Headless from "../Component/Settings/Headless/Headless";
import Plan from "../Component/Plan/Plan";
import Installation from "../Component/Installation/Installation";
import BackInStockDesign from "../Component/BackInStock/BackInStockDesign/BackInStockDesign";
import EmailHistory from "../Component/EmailHistory/EmailHistory";
import OnBoardingApp from "../Component/OnBoardingApp/OnBoardingApp";
import Integration from "../Component/Settings/Integration/Integration";
import IntegrationDetails from "../Component/Settings/Integration/IntegrationDetails/IntegrationDetails";
import WhatSNew from "../Component/Settings/WhatSNew/WhatSNew";
import RequestAFeature from "../Component/Settings/WhatSNew/RequestAFeature/RequestAFeature";
import WishlistEmailCustomization from "../Component/Settings/WishlistEmail/WishlistEmailCustomization";

export const routes = [
    {path: `${baseUrl}/dashboard`, component: <Dashboard/>},
    {path: `${baseUrl}/analytics`, component: <Analytics/>},
    {path: `${baseUrl}/back-in-stock`, component: <BackInStock/>},
    {path: `${baseUrl}/back-in-stock/design`, component: <BackInStockDesign/>},
    {path: `${baseUrl}/back-in-stock/email`, component: <BackInStockEmail/>},
    {path: `${baseUrl}/back-in-stock/email/stock-notification`, component: <StockNotification/>},
    {path: `${baseUrl}/back-in-stock/email/thank-you-notification`, component: <ThankYouNotification/>},
    {path: `${baseUrl}/wishlist-items`, component: <WishlistItems/>},
    {path: `${baseUrl}/settings`, component: <Settings/>},
    {path: `${baseUrl}/settings/general`, component: <General/>},
    {path: `${baseUrl}/settings/wishlist-design`, component: <WishlistDesign/>},
    {path: `${baseUrl}/settings/email`, component: <WishlistEmail/>},
    {path: `${baseUrl}/settings/email/email-customization`, component: <WishlistEmailCustomization/>},
    // {path: `${baseUrl}/settings/email/wishlist-items`, component: <WishlistItemsEmail/>},
    // {path: `${baseUrl}/settings/email/price-drop-alert`, component: <PriceDropAlertEmail/>},
    // {path: `${baseUrl}/settings/email/restock-alert`, component: <RestockAlertEmail/>},
    {path: `${baseUrl}/settings/language`, component: <Language/>},
    {path: `${baseUrl}/settings/headless`, component: <Headless/>},
    {path: `${baseUrl}/settings/plan`, component: <Plan/>},
    {path: `${baseUrl}/settings/installation`, component: <Installation/>},
    {path: `${baseUrl}/settings/integration`, component: <Integration/>},
    {path: `${baseUrl}/settings/integration/:type`, component: <IntegrationDetails/>},
    {path: `${baseUrl}/settings/feedback`, component: <WhatSNew/>},
    {path: `${baseUrl}/settings/request-feature`, component: <RequestAFeature/>},
    {path: `${baseUrl}/email-history`, component: <EmailHistory/>},
    {path: `${baseUrl}/onboarding`, component: <OnBoardingApp/>},
]