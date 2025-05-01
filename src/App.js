
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import '@shopify/polaris/build/esm/styles.css';
import "./style.css";
import { apiService, baseUrl } from './utils/Constant';
import { routes } from './utils/Routes';
import { useDispatch, useSelector } from "react-redux";
import { Shop_details } from "./redux/action/action";
import { AppProvider, InlineStack, Spinner } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

const DefaultLayout = lazy(() => import('./Component/DefaultLayout/DefaultLayout'));

export const Loader = () => (
    <div style={{ height: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <InlineStack align="center" blockAlign="center" height="100vh" width="100%">
            <Spinner accessibilityLabel="Loading" size="large" />
        </InlineStack>
    </div>
);

const App = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dispatch = useDispatch();
    const shop = urlParams.get("shop");
    const shopDetails = useSelector(state => state.shopDetails);
    const [isLoading, setIsLoading] = useState(true);
    const fetchShopDetails = async () => {
        try {
            const response = await apiService.Install({ shop });
            if (!response.status) {
                setIsLoading(false);
                return;
            }
            if (response.data.is_install === false) {
                window.top.location.href = response.data.installUrl;
                return;
            }
            dispatch(Shop_details({
                ...response.data.shop,
                bannerDisplaySetting: JSON.parse(response.data.shop.banner_display_setting || "{}"),
                on_boarding: response.data.shop.onboarding,
                install_url: response.installUrl,
                addon_email_notification: response.data.shop.addon_email_notification,
            }));
        } catch (error) {
            console.error("Installation Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchShopDetails();
    }, []);

    return (
        <BrowserRouter>
            <AppProvider i18n={enTranslations}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route path={`${baseUrl}/`} element={<DefaultLayout />}>
                                {routes.map((x, i) => (
                                    <Route key={i} path={x.path} element={x.component} />
                                ))}
                                <Route path={`${baseUrl}/`} element={<Navigate to={`${baseUrl}/dashboard`} replace />} />
                            </Route>
                        </Routes>
                    </Suspense>
                )}
            </AppProvider>
        </BrowserRouter>
    );
};

export default App;
