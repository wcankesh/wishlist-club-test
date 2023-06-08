import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import {baseUrl} from "./utils/Constant"
import {AppBridgeProvider, QueryProvider, PolarisProvider, DefaultLayout} from "./components";
import {Frame} from "@shopify/polaris"

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
                navigationLinks={[
                  {
                    label: 'Analytics',
                    destination: `${baseUrl}/analytics`

                  },
                  {
                    label: 'Back In Stock',
                    destination: `${baseUrl}/bistock`

                  },
                  {
                    label: 'Wishlist Items',

                    destination: `${baseUrl}/wishlist-items`
                  },
                  {
                    label: 'Settings',

                    destination: `${baseUrl}/settings`
                  },
                  {
                    label: 'Plan & Pricing',
                    destination: `${baseUrl}/plan`,

                  },
                  {
                    label: 'Installation',
                    destination: `${baseUrl}/installation`,

                  },
                ]}
                matcher={(link, location) => link.destination === location.pathname}
            />
            <Frame>
              <DefaultLayout pages={pages} />
            </Frame>


          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
