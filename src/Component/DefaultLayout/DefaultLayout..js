import React, {useState, useEffect, useCallback} from 'react';
import {AppProvider, Frame, FooterHelp, Link, Spinner, Modal, Button,Text} from '@shopify/polaris';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import enTranslation from "@shopify/polaris/locales/en.json"
import {NavigationMenu, Provider, RoutePropagator} from '@shopify/app-bridge-react';
import {baseUrl, apiService} from "../../Utills/Constant";
import {useDispatch, useSelector} from "react-redux";
import {Shop_details} from "../../redux/action/action";
import {Icons} from "../../Utills/Icons";

const DefaultLayout = () => {

    const location = useLocation()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true);

    const urlParams = new URLSearchParams(window.location.search);
    const shopDetails = useSelector((state) => state.shopDetails)
    const host = urlParams.get('host');
    const shop = urlParams.get('shop');

    const appKey = "65909e95fac4682299cfdae29dcd6a1a"
    const config = {
        apiKey: appKey,
        host,
    }

    let navigate = useNavigate();
    useEffect(() => {
        const getInstall = async () => {

            const response = await apiService.Install({shop: shop})
            if (response.status === 200) {
                dispatch(Shop_details({...response.data, notification: response.notification}))
                if(response.data.is_app_embedded === "0"){
                    document.querySelector("body").classList.add("remove-close-icon-modal")
                }
                if (response.data.plan_type == "0" && response.data.is_older_shop == "0") {
                    navigate(`${baseUrl}/plan`);
                }
                setIsLoading(false)
            } else if (response.status === 201 && response.data.is_install === false) {
                window.top.location.href = response.data.install_url
                //setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        }
        getInstall();
    }, [])

    const onAppEmbedded = async () => {
        const data = await apiService.getAppEmbedded();
        if (data.status === 200) {
            dispatch(Shop_details({...shopDetails, is_app_embedded: "1"}))
            document.querySelector("body").classList.remove("remove-close-icon-modal")
            window.open(`https://${shopDetails.shop}/admin/themes/current/editor?context=apps&appEmbed=gid://shopify/OnlineStoreThemeAppEmbed/wishlist-club`, "_top")
        } else {

        }
    }

    const [active, setActive] = useState(true);

    const handleChange = useCallback(() => setActive(!active), [active]);

    const activator = <Button onClick={handleChange}>Open</Button>;

    return (
        <AppProvider
            i18n={enTranslation}
        >
            {
                isLoading ?
                    <div className="main_spinner">
                        <Spinner accessibilityLabel="Spinner example" size="large" color="teal"/>
                    </div> : <Provider config={config}>
                        <NavigationMenu navigationLinks={[
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
                            <RoutePropagator location={location}/>
                            <Outlet/>
                            {
                                shopDetails && shopDetails.is_app_embedded === "0" &&
                                <Modal
                                    activator={activator}
                                    open={shopDetails.is_app_embedded === "0"}
                                    onClose={handleChange}
                                    title="Configure Wishlist Club widget on your theme."
                                >
                                    <Modal.Section>
                                        <Text>Please click <Link removeUnderline onClick={onAppEmbedded}>here</Link> to activate embedded block of
                                            Wishlist Club widget from your theme settings. You can deactivate it anytime.
                                        </Text>
                                    </Modal.Section>
                                </Modal>
                            }

                            <FooterHelp>
                                <div className="FooterHelp__Content">
                                    {Icons.footerAlert}if you need any help, please &nbsp;
                                    <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
                                        Contact us
                                    </Link>
                                </div>
                            </FooterHelp>
                        </Frame>
                    </Provider>
            }

        </AppProvider>
    );
}


export default DefaultLayout;