import {baseUrl} from "./Constant";
import Dashboard from "../Component/Dashboard/Dashboard";
import Analytics from "../Component/Analytics/Analytics";
import WishlistItems from "../Component/WishlistItems/WishlistItems";
import Settings from "../Component/Settings/Settings";
import General from "../Component/Settings/General/General";
import WishlistDesign from "../Component/Settings/WishlistDesign/WishlistDesign";
import Email from "../Component/Settings/Email/Email";
import BisEmail from "../Component/BackInStock/BisEmail/BisEmail"
import BisDesign from "../Component/BackInStock/BisDesign/BisDesign";
import Language from "../Component/Settings/Language/Language";
import Headless from "../Component/Settings/Headless/Headless";
import StockNotification from "../Component/BackInStock/BisEmail/StockNotification/StockNotification";
import ThankYouNotification from "../Component/BackInStock/BisEmail/ThankYouNotification/ThankYouNotification";
import Installtion from "../Component/Installation/Installtion";
import WishlistItem from "../Component/Settings/Email/WishlistItem/WishlistItem";
import PriceDropAlert from "../Component/Settings/Email/PriceAlert/PriceDropAlert";
import RestockAlert from "../Component/Settings/Email/RestockAlert/RestockAlert";
import PlanPricing from "../Component/PlanPricing/PlanPricing";
import BackInStock from "../Component/BackInStock/BackInStock";


export const routes = [
    {path: `${baseUrl}/dashboard`, component: Dashboard},
    {path: `${baseUrl}/analytics`, component: Analytics},
    {path: `${baseUrl}/bistock`, component: BackInStock},
    {path: `${baseUrl}/wishlist-items`, component: WishlistItems},
    {path: `${baseUrl}/settings`, component: Settings},
    {path: `${baseUrl}/general-settings`, component: General},
    {path: `${baseUrl}/design-settings`, component: WishlistDesign},
    {path: `${baseUrl}/bistock-email`, component: BisEmail},
    {path: `${baseUrl}/bistock-email/stock-notificattion`, component: StockNotification},
    {path: `${baseUrl}/bistock-email/thnaks-notification`, component: ThankYouNotification},
    {path: `${baseUrl}/bistock-design`, component: BisDesign},
    {path: `${baseUrl}/email-settings`, component: Email},
    {path: `${baseUrl}/email-settings/wishlistemail`, component: WishlistItem},
    {path: `${baseUrl}/email-settings/pricealert`, component: PriceDropAlert},
    {path: `${baseUrl}/email-settings/restockalert`, component: RestockAlert},
    {path: `${baseUrl}/language-settings`, component: Language},
    {path: `${baseUrl}/headless-settings`, component: Headless},
    {path: `${baseUrl}/plan`, component: PlanPricing},
    {path: `${baseUrl}/installation`, component: Installtion},
]




