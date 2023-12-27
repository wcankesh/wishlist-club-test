import React, {useEffect, useState} from 'react';
import {Route, Routes, Navigate, BrowserRouter, useLocation, useNavigate} from "react-router-dom";
import '@shopify/polaris/build/esm/styles.css';
import "./style.css";
import DefaultLayout from './Component/DefaultLayout/DefaultLayout';
import {apiService, baseUrl} from './utils/Constant';
import { routes } from './utils/Routes';
import {useDispatch} from "react-redux";
import {Shop_details} from "./redux/action/action";
import {AppProvider, Spinner} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

const App = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const [isLoading, setIsLoading,] = useState(true);
    const dispatch = useDispatch();
    const shop = urlParams.get("shop")

    useEffect(() => {
        const getInstall = async () => {
            const response = await apiService.Install({shop: shop})
            if (response.status === 200) {
                dispatch(Shop_details({...response.data, notification: response.notification, bannerDisplaySetting: JSON.parse(response.banner_display_setting), extension_status: response.extension_status, on_boardig:response?.on_boardig}))
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
      <BrowserRouter>
        <Routes>
            <Route path={`${baseUrl}/`} element={ <AppProvider i18n={enTranslations}>
                {isLoading ?
                    <div className="main_spinner">
                        <Spinner accessibilityLabel="Spinner example" size="large" color="teal"/>
                    </div> :
                    <DefaultLayout isLoading={isLoading}/>}
            </AppProvider>}>
            {
              routes.map((x, i) => {
                return (
                    <Route exact={true} key={i} path={x.path} element={x.component} />
                )
              })
            }
            <Route path={`${baseUrl}/`} element={<Navigate to={`${baseUrl}/dashboard`} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
};

export default App;