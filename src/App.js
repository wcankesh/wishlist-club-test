
import React, { useState, Suspense, useEffect } from 'react';
import {Route, Navigate, Outlet, useLocation, useNavigate, Link, Routes} from "react-router-dom";
import "./style.css";
import { apiService, baseUrl } from './utils/Constant';
import { routes } from './utils/Routes';
import { useDispatch, useSelector } from "react-redux";
import { Shop_details } from "./redux/action/action";
import {InlineStack, Spinner, Frame, Box, Text, FooterHelp} from '@shopify/polaris';
import { Modal, NavMenu, TitleBar } from "@shopify/app-bridge-react";


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
    const location = useLocation();
    const navigate = useNavigate();
    const shopDetails = useSelector(state => state.shopDetails);
    const [isUpdateLoading, setIsUpdateLoading,] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const excludedRoutes = [
        `${baseUrl}/settings/email/email-customization`,
    ];
    const isExcluded = excludedRoutes.includes(location.pathname);

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

            if (response.data.shop?.upgrade == "0") {
                document.body.classList.add('hide-popup-close-icon');
            }
            if (response.data.shop.plan_type == "0" || response.data.shop?.is_older_shop == 1) {
                navigate(`${baseUrl}/settings/plan`)
            } else if (response.data.shop.onboarding == 0) {
                navigate(`${baseUrl}/onboarding`)
            }
        } catch (error) {
            console.error("Installation Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onAuthorize = () => {
        setIsUpdateLoading(true)
        window.open(shopDetails.install_url, "_top");
    };

    const navigationLinks = [
        { label: 'Wishlist Design', destination: `${baseUrl}/wishlist-design` },
        { label: 'Back In Stock', destination: `${baseUrl}/back-in-stock/design` },
        { label: 'Wishlist & Email History', destination: `${baseUrl}/wishlist-items` },
        { label: 'Analytics', destination: `${baseUrl}/analytics` },
        { label: 'Plan & Price', destination: `${baseUrl}/settings/plan` },
        { label: 'Settings', destination: `${baseUrl}/settings` },
    ];


    useEffect(() => {
        fetchShopDetails();
    }, []);

    useEffect(() => {
        const onCheckLCP = async (payload) => {
            try {
                const response = await apiService.onCheckLCP(payload);
            } catch (error) {
                console.error(error);
            }
        };
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.entryType === "largest-contentful-paint") {
                    const lcpMetric = entry;
                    if (lcpMetric) {
                        const pathname = window.location.pathname;
                        const searchParams = new URLSearchParams(window.location.search);
                        const excludeParams = new Set(["hmac", "id_token", "session", "timestamp", "locale", "shop", "embedded", "host"]);
                        const filteredParams = new URLSearchParams();
                        searchParams.forEach((value, key) => {
                            if (!excludeParams.has(key)) {
                                filteredParams.append(key, value);
                            }
                        });
                        const filteredQueryString = filteredParams.toString();
                        const fullPagePath = filteredQueryString ? `${pathname}?${filteredQueryString}` : pathname;
                        const payload = {
                            page: fullPagePath,
                            lcp_count: lcpMetric.startTime,
                        };
                        onCheckLCP(payload);
                    }
                }
            });
        });
        observer.observe({ type: "largest-contentful-paint", buffered: true });
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <React.Fragment>
            {shopDetails.onboarding != 0 && (
                <NavMenu>
                    {(navigationLinks || []).map((x, i) => {
                        return (
                            <Link to={x.destination} rel={i === 0 ? "dashboard" : ''} key={i} >
                                {x.label}
                            </Link>
                        )
                    })}
                </NavMenu>
            )}
            <Frame>
                <Suspense fallback={isLoading ? <Loader/> : ""}>
                    <Routes>
                        <Route path={`/`} element={isLoading ? <Loader/> : <Outlet/>}>
                            {
                                routes.map((x, i) => {
                                    return (
                                        <Route exact={true} key={i} path={x.path} element={x.component}/>
                                    )
                                })
                            }
                        </Route>
                        <Route path={`${baseUrl}/`} element={<Navigate to={`${baseUrl}/dashboard`} replace/>}/>
                    </Routes>

                </Suspense>
                {shopDetails?.upgrade == "0" && (
                    <Modal open={shopDetails?.upgrade == "0"}>
                        <TitleBar title={"Authorize our latest app update"}>
                            <button variant="primary" loading={isUpdateLoading && ''}
                                    onClick={() => onAuthorize()}>{'Authorize'}</button>
                        </TitleBar>
                        <Box padding={'400'}> <Text as={"span"}>Hey there,</Text><br /><Text as={"span"}> Our app has been updated to align with the most recent changes in Shopify. To maintain your access to our review services, please authorize us from the <b>"Admin Account"</b> to continue using our services. Please <Link onClick={() => window.Beacon('toggle')} removeUnderline>contact us</Link> if you face any difficulty.</Text></Box>
                    </Modal>
                )}
                {!isExcluded && (
                    <FooterHelp>
                        <div className="FooterHelp__Content">
                            if you need any help, please &nbsp;
                            <Link onClick={() => window.Beacon("toggle")}>
                                Contact us
                            </Link>
                        </div>
                    </FooterHelp>
                )}
            </Frame>

        </React.Fragment>

    );
};

export default App;
