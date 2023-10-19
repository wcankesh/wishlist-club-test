import React, {useEffect} from 'react';
import {Frame,FooterHelp, Link} from '@shopify/polaris';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {baseUrl} from "../../utils/Constant"
import {useSelector} from 'react-redux';
import {Provider, RoutePropagator, NavigationMenu} from "@shopify/app-bridge-react";

const apiKey = '65909e95fac4682299cfdae29dcd6a1a';

const DefaultLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(location.search);
    const host = urlParams.get('host');
    const shopDetails = useSelector(state => state.shopDetails);
    const config = {
        apiKey: apiKey,
        host: host,
        forceRedirect: process.env.NODE_ENV === 'development' ? false : true
    };
    useEffect(() => {
        if(shopDetails.plan_type == "0" || shopDetails.is_older_shop == 1){
            navigate(`${baseUrl}/settings/plan`)
        }
    }, [])

    return (
        <div>
            <Provider config={config}>
                <NavigationMenu
                    navigationLinks={[
                        {
                            label: 'Dashboard',
                            destination: `${baseUrl}/dashboard`,
                        },
                        {
                            label: 'Analytics',
                            destination: `${baseUrl}/analytics`

                        },
                        {
                            label: 'Back In Stock',
                            destination: `${baseUrl}/back-in-stock`

                        },
                        {
                            label: 'Wishlist Items',

                            destination: `${baseUrl}/wishlist-items`
                        },
                        {
                            label: 'Email History',
                            destination: `${baseUrl}/email-history`
                        },
                        {
                            label: 'Settings',

                            destination: `${baseUrl}/settings`
                        }

                    ]}
                    matcher={(link, location) => link.destination === location.pathname}
                />
                <Frame>
                    <RoutePropagator location={location}/>
                    <Outlet/>
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
