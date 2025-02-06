import axios from 'axios';
import qs from 'qs';
import {useAppBridge} from "@shopify/app-bridge-react";

const apiBaseUrl = "https://stagingapp.webcontrive.com/wishlist/api/public";

const instance = axios.create();

const ApiService = () => {
    const shopify = useAppBridge();

    if (shopify.environment.mobile || shopify.environment.embedded) {
        instance.interceptors.request.use(async function (config) {
            return await shopify.idToken()
                .then((token) => {
                    config.headers["Authorization"] = `Bearer ${token}`;
                    return config;
                });
        });
    } else {
        instance.interceptors.request.use(function (config) {
            const localData = window.location.search;
            let urlParams = new URLSearchParams(localData);
            urlParams.toString();
            const params = Object.fromEntries(urlParams);
            config.headers["Authorization"] = JSON.stringify(params);
            return config;
        })
    }
    const fetchData = async (method, url, data, isFormData, header) => {
        const config = {
            headers: {
                ...(header || {}),
                "content-type": isFormData ? "multipart/form-data" : "application/json",
            }
        };

        let result = '';

        try {
            const res = await instance[method](url, data, config);
            if (res.status === 200) {
                result = {...res.data, apiStatus: res.status};
            } else {
                result = {...res.data, apiStatus: res.status};
            }
        } catch (e) {
            result = {...e.response.data, apiStatus: e.status};
        }

        return result;
    };

    //----------------------------API-Methods-----------------------------//

    const getData = async (url, header) => {
        return await fetchData('get', url, null, false, header);
    };

    const postData = async (url, data, isFormData, header) => {
        return await fetchData('post', url, data, isFormData, header);
    };

    const putData = async (url, data, isFormData, header) => {
        return await fetchData('put', url, data, isFormData, header);
    };

    const deleteData = async (url, header) => {
        return await fetchData('delete', url, null, false, header);
    };

    //---------------------------------------------------------------------//


    //--------------------------------API----------------------------------//


    return {

        Install: async (payload) => await postData(`${apiBaseUrl}/api/install`, payload),

        getAppEmbedded: async () => await getData(`${apiBaseUrl}/api/is-app-embedded`),

        getThemes: async () => await getData(`${apiBaseUrl}/api/themes`),

        checkTheme: async (payload) => await postData(`${apiBaseUrl}/api/check-theme`, payload),

        codeSetup: async (payload) => await postData(`${apiBaseUrl}/api/code-setup`, payload),

        Analytics: async (payload) => await postData(`${apiBaseUrl}/api/analytics`, payload),

        WishlistAnalytics: async (payload) => await postData(`${apiBaseUrl}/api/wishlist-analytic`, payload),

        Email: async (payload) => await postData(`${apiBaseUrl}/api/emails`, payload),

        ImportWishlistHistory: async (payload) => await postData(`${apiBaseUrl}/api/histories`, payload),

        getExport: async (payload) => window.open(`${apiBaseUrl}/api/export?shop=${payload.shop}`, "_blank"),

        Import: async (payload, isFormData) => await postData(`${apiBaseUrl}/api/import`, payload, isFormData),

        getSetting: async () => await getData(`${apiBaseUrl}/api/setting`),

        updateSetting: async (payload, id) => await putData(`${apiBaseUrl}/api/setting/${id}`, payload),

        getLauncher: async () => await getData(`${apiBaseUrl}/api/launcher`),

        updateLauncher: async (payload, id) => await putData(`${apiBaseUrl}/api/launcher/${id}`, payload),

        getLabel: async () => await getData(`${apiBaseUrl}/api/label`),

        updateLabel: async (payload, id) => await postData(`${apiBaseUrl}/api/label/${id}`, payload),

        getEmailVerification: async () => await getData(`${apiBaseUrl}/api/bis/setting`),

        updateEmailVerification: async (payload) => await postData(`${apiBaseUrl}/api/bis/edit-message`, payload),

        emailSetting: async () => await getData(`${apiBaseUrl}/api/email-setting`),

        updateEmailSetting: async (payload, id) => await postData(`${apiBaseUrl}/api/email-setting/${id}`, payload, true),

        bisSetting: async () => await getData(`${apiBaseUrl}/api/bis/setting`),

        updateBisSetting: async (payload) => await postData(`${apiBaseUrl}/api/bis/setting`, payload, true),

        updateIcon: async (payload, isFormData) => await postData(`${apiBaseUrl}/api/icon`, payload, isFormData),

        deleteIcon: async () => await deleteData(`${apiBaseUrl}/api/icon`),

        getHeadless: async () => await getData(`${apiBaseUrl}/api/headless`),

        getHeadlessToken: async () => await getData(`${apiBaseUrl}/api/headless-token`),

        updateHeadless: async (payload) => await postData(`${apiBaseUrl}/api/headless`, payload),

        BisAnalytics: async (payload) => await postData(`${apiBaseUrl}/api/bis/analytics`, payload),

        upgradePlan: async (payload) => await postData(`${apiBaseUrl}/api/upgrade`, payload),

        upgradeEmailPlan: async (payload) => await postData(`${apiBaseUrl}/api/usage-charge`, payload),

        getBilling: async () => await getData(`${apiBaseUrl}/api/billing`),

        updateShopDisplayBanner: async (payload) => await postData(`${apiBaseUrl}/api/banner-setting`, payload),

        getBisExport: async (payload) => window.open(`${apiBaseUrl}/api/bis/export?shop=${payload.shop}`, "_blank"),

        bisImport: async (payload, isFormData) => await postData(`${apiBaseUrl}/api/bis/import`, payload, isFormData),

        onBisMailResend: async (payload, id) => await postData(`${apiBaseUrl}/api/bis/bis-mail/${id}`, payload),

        enableBackInStock: async (payload) => await postData(`${apiBaseUrl}/api/enable-bis`, payload),

        onBoarding: async (payload) => await postData(`${apiBaseUrl}/api/complete-onboarding`, payload),

        getIntegration: async (payload) => await getData(`${apiBaseUrl}/api/integration/get?${qs.stringify(payload)}`),

        createIntegration: async (payload) => await postData(`${apiBaseUrl}/api/integration/create`, payload),

        templateConfirmation: async (payload) => await postData(`${apiBaseUrl}/api/template-notice`, payload)

    };
}

export default ApiService;