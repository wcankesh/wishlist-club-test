import React, {useEffect, useState} from 'react';
import {Frame, FooterHelp, Link, Text, Modal} from '@shopify/polaris';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {baseUrl} from "../../utils/Constant"
import {useSelector} from 'react-redux';
import {Provider, RoutePropagator, NavigationMenu} from "@shopify/app-bridge-react";

const apiKey = '65909e95fac4682299cfdae29dcd6a1a';

const DefaultLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isUpdateLoading, setIsUpdateLoading,] = useState(false);
    const urlParams = new URLSearchParams(location.search);
    const host = urlParams.get('host');
    const shopDetails = useSelector(state => state.shopDetails);
    const config = {apiKey: apiKey, host: host, forceRedirect: process.env.NODE_ENV === 'development' ? false : true};

    useEffect(() => {
        if (shopDetails.plan_type == "0" || shopDetails.is_older_shop == 1) {
            navigate(`${baseUrl}/settings/plan`)
        }
        if (shopDetails?.upgrade == "0") {
            document.body.classList.add('hide-popup-close-icon');
        }
        if (shopDetails.onboarding == 0) {
            navigate(`${baseUrl}/onboarding`)
        }
    }, []);

    const onAuthorize = () => {
        setIsUpdateLoading(true)
        window.open(shopDetails.install_url, "_top");
    };

    const navigationLinks = [
        {label: 'Analytics', destination: `${baseUrl}/analytics`},
        {label: 'Back In Stock', destination: `${baseUrl}/back-in-stock`},
        {label: 'Wishlist Items', destination: `${baseUrl}/wishlist-items`},
        {label: 'Email History', destination: `${baseUrl}/email-history`},
        {label: 'Settings', destination: `${baseUrl}/settings`},
    ];

    return (
        <div>
            <Provider config={config}>
                <NavigationMenu navigationLinks={shopDetails.onboarding == 0 ? [] :navigationLinks}
                                matcher={(link, location) => link.destination === location.pathname}
                />
                <Frame>
                    <RoutePropagator location={location}/>
                    <Outlet/>
                    <Modal onClose={() => {}} open={shopDetails?.upgrade == "0"} title="Authorize our latest app update" primaryAction={{content: "Authorize", onAction: onAuthorize, loading: isUpdateLoading}}>
                        <Modal.Section>
                            <Text as={"span"}>Hey there,</Text>
                            <br/>
                            <Text as={"span"}>
                                Our app has been updated to align with the most recent changes in Shopify. To maintain your access to our review services, please authorize us from the <b>"Admin Account"</b> to continue using our services. Please <Link onClick={() => window.Beacon('toggle')} removeUnderline>contact us</Link> if you face any difficulty.
                            </Text>
                        </Modal.Section>
                    </Modal>
                    <FooterHelp>
                        <div className="FooterHelp__Content">
                           if you need any help, please &nbsp;
                            <Link onClick={() => window.Beacon("toggle")}>
                                Contact us
                            </Link>
                        </div>
                    </FooterHelp>
                </Frame>
            </Provider>
        </div>
    );
};


export default DefaultLayout;
