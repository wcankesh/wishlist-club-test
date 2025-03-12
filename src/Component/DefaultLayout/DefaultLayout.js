import React, { useCallback, useEffect, useState } from 'react';
import { Box, FooterHelp, Frame, Link, Text } from '@shopify/polaris';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { apiService, baseUrl } from "../../utils/Constant"
import { useSelector } from 'react-redux';
import { Modal, NavMenu, TitleBar } from "@shopify/app-bridge-react";

const DefaultLayout = ({ isLoading, setIsLoading }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isUpdateLoading, setIsUpdateLoading,] = useState(false);
    const shopDetails = useSelector(state => state.shopDetails);

    const excludedRoutes = [
        `${baseUrl}/settings/email/email-customization`,
    ];

    const isExcluded = excludedRoutes.includes(location.pathname);

    useEffect(() => {
        if (shopDetails?.upgrade == "0") {
            document.body.classList.add('hide-popup-close-icon');
        }
        if (shopDetails.plan_type == "0" || shopDetails.is_older_shop == 1) {
            navigate(`${baseUrl}/settings/plan`)
        } else if (shopDetails.onboarding == 0) {
            navigate(`${baseUrl}/onboarding`)
        }

    }, [])

    const onAuthorize = () => {
        setIsUpdateLoading(true)
        window.open(shopDetails.install_url, "_top");
    };

    const navigationLinks = [
        { label: 'Wishlist', destination: `${baseUrl}/wishlist-items` },
        { label: 'Back In Stock', destination: `${baseUrl}/back-in-stock` },
        { label: 'Design', destination: `${baseUrl}/wishlist-design` },
        { label: 'Analytics', destination: `${baseUrl}/analytics` },
        { label: 'Plan & Price', destination: `${baseUrl}/settings/plan` },
        { label: 'Settings', destination: `${baseUrl}/settings` },
    ];

    useEffect(() => {
        const onCheckLCP = async (payload) => {
            try {
                const response = await apiService.onCheckLCP(payload);
                console.log("response", response)
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
            {shopDetails.onboarding == 0 ? "" : (
                <NavMenu>
                    {(navigationLinks || []).map((x, i) => (
                        <a href={x.destination} rel={i === 0 ? "dashboard" : ''} key={i}
                            onClick={() => {
                                setIsLoading(!isLoading)
                            }}
                        >
                            {x.label}
                        </a>
                    ))}
                </NavMenu>
            )}

            <Frame>
                <Outlet />

                {shopDetails?.upgrade == "0" ? (
                    <Modal open={shopDetails?.upgrade == "0"}>
                        <TitleBar title={"Authorize our latest app update"}>
                            <button variant="primary" loading={isUpdateLoading && ''}
                                onClick={() => onAuthorize()}>{'Authorize'}</button>
                        </TitleBar>
                        <Box padding={'400'}>
                            <Text as={"span"}>Hey there,</Text>
                            <br />
                            <Text as={"span"}>
                                Our app has been updated to align with the most recent changes in Shopify. To maintain
                                your access to our review services, please authorize us from the <b>"Admin
                                    Account"</b> to continue using our services. Please <Link
                                        onClick={() => window.Beacon('toggle')} removeUnderline>contact us</Link> if you face
                                any difficulty.
                            </Text>
                        </Box>
                    </Modal>
                ) : ''}

                {!isExcluded ? (
                    <FooterHelp>
                        <div className="FooterHelp__Content">
                            if you need any help, please &nbsp;
                            <Link onClick={() => window.Beacon("toggle")}>
                                Contact us
                            </Link>
                        </div>
                    </FooterHelp>
                ) : ""}
            </Frame>
        </React.Fragment>
    );
};


export default DefaultLayout;
