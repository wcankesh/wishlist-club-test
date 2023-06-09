import React, {useState, useEffect} from 'react';
import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import {AppBridgeProvider, QueryProvider, PolarisProvider, DefaultLayout} from "./components";
import {Frame, Spinner} from "@shopify/polaris"

import {baseUrl, apiService, } from "./utils/Constant";
import {useDispatch} from "react-redux";
import {Shop_details} from "./redux/action/action";

export default function App() {
    const dispatch = useDispatch()
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get('shop');
    const [isLoading, setIsLoading] = useState(true);

    const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
    useEffect(() => {
        const getInstall = async () => {
            const response = await apiService.Install({shop: shop})
            if (response.status === 200) {
                dispatch(Shop_details({...response.data, notification: response.notification}))
                setIsLoading(false)
            } else if (response.status === 201 && response.data.is_install === false) {
                window.top.location.href = response.data.install_url;
            } else {
                setIsLoading(false);
            }
        };
        getInstall();
    }, [])



    return (
        isLoading ? <div className="main_spinner"><Spinner/></div> : <PolarisProvider>
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
                            <DefaultLayout pages={pages}/>
                        </Frame>


                    </QueryProvider>
                </AppBridgeProvider>
            </BrowserRouter>
        </PolarisProvider>
    );
}
