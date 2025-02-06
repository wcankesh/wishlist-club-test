import React, {useEffect, useState} from 'react';
import {Box, FooterHelp, Frame, Link, Text} from '@shopify/polaris';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {baseUrl} from "../../utils/Constant"
import {useSelector} from 'react-redux';
import {Modal, NavMenu, TitleBar} from "@shopify/app-bridge-react";

const DefaultLayout = () => {
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
        {label: 'Analytics', destination: `${baseUrl}/analytics`},
        {label: 'Back In Stock', destination: `${baseUrl}/back-in-stock`},
        {label: 'Wishlist Items', destination: `${baseUrl}/wishlist-items`},
        {label: 'Email History', destination: `${baseUrl}/email-history`},
        {label: 'Settings', destination: `${baseUrl}/settings`},
    ];

    return (
        <React.Fragment>
            {shopDetails.onboarding == 0 ? "" : (
                <NavMenu>
                    {(navigationLinks || []).map((x, i) => (
                        <a href={x.destination} rel={i === 0 ? "dashboard" : ''} key={i}>
                            {x.label}
                        </a>
                    ))}
                </NavMenu>
            )}

            <Frame>
                <Outlet/>

                {shopDetails?.upgrade == "0" ? (
                    <Modal open={shopDetails?.upgrade == "0"}>
                        <TitleBar title={"Authorize our latest app update"}>
                            <button variant="primary" loading={isUpdateLoading && ''}
                                    onClick={() => onAuthorize()}>{'Authorize'}</button>
                        </TitleBar>
                        <Box padding={'400'}>
                            <Text as={"span"}>Hey there,</Text>
                            <br/>
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
