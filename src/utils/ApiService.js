import axios from 'axios';
import qs from 'qs';
import {useAppBridge} from "@shopify/app-bridge-react";

const apiBaseUrl = "https://stagingapp.webcontrive.com/wishlist/api/public/api";

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

        Install: async (payload) => await postData(`${apiBaseUrl}/install`, payload),

        getAppEmbedded: async () => await getData(`${apiBaseUrl}/is-app-embedded`),

        getThemes: async () => await getData(`${apiBaseUrl}/themes`),

        checkTheme: async (payload) => await postData(`${apiBaseUrl}/check-theme`, payload),

        codeSetup: async (payload) => await postData(`${apiBaseUrl}/code-setup`, payload),

        Analytics: async (payload) => await postData(`${apiBaseUrl}/analytics`, payload),

        WishlistAnalytics: async (payload) => await postData(`${apiBaseUrl}/wishlist-analytic`, payload),

        Email: async (payload) => await postData(`${apiBaseUrl}/emails`, payload),

        ImportWishlistHistory: async (payload) => await postData(`${apiBaseUrl}/histories`, payload),

        getExport: async (payload) => window.open(`${apiBaseUrl}/export?shop=${payload.shop}`, "_blank"),

        Import: async (payload, isFormData) => await postData(`${apiBaseUrl}/import`, payload, isFormData),

        getSetting: async () => await getData(`${apiBaseUrl}/setting`),

        updateSetting: async (payload, id) => await putData(`${apiBaseUrl}/setting/${id}`, payload),

        getLauncher: async () => await getData(`${apiBaseUrl}/launcher`),

        updateLauncher: async (payload, id) => await putData(`${apiBaseUrl}/launcher/${id}`, payload),

        getLabel: async () => await getData(`${apiBaseUrl}/label`),

        updateLabel: async (payload, id) => await postData(`${apiBaseUrl}/label/${id}`, payload),

        getEmailVerification: async () => await getData(`${apiBaseUrl}/bis/setting`),

        updateEmailVerification: async (payload) => await postData(`${apiBaseUrl}/bis/edit-message`, payload),

        emailSetting: async () => await getData(`${apiBaseUrl}/email-setting`),

        updateEmailSetting: async (payload, id) => await postData(`${apiBaseUrl}/email-setting/${id}`, payload, true),

        onUpdateV2EmailSetting: async (payload, id) => await postData(`${apiBaseUrl}/v2/email-setting/${id}`, payload),

        bisSetting: async () => await getData(`${apiBaseUrl}/bis/setting`),

        updateBisSetting: async (payload) => await postData(`${apiBaseUrl}/bis/setting`, payload, true),

        updateIcon: async (payload, isFormData) => await postData(`${apiBaseUrl}/icon`, payload, isFormData),

        deleteIcon: async () => await deleteData(`${apiBaseUrl}/icon`),

        getHeadless: async () => await getData(`${apiBaseUrl}/headless`),

        getHeadlessToken: async () => await getData(`${apiBaseUrl}/headless-token`),

        updateHeadless: async (payload) => await postData(`${apiBaseUrl}/headless`, payload),

        BisAnalytics: async (payload) => await postData(`${apiBaseUrl}/bis/analytics`, payload),

        upgradePlan: async (payload) => await postData(`${apiBaseUrl}/upgrade`, payload),

        upgradeEmailPlan: async (payload) => await postData(`${apiBaseUrl}/usage-charge`, payload),

        getBilling: async () => await getData(`${apiBaseUrl}/billing`),

        updateShopDisplayBanner: async (payload) => await postData(`${apiBaseUrl}/banner-setting`, payload),

        getBisExport: async (payload) => window.open(`${apiBaseUrl}/bis/export?shop=${payload.shop}`, "_blank"),

        bisImport: async (payload, isFormData) => await postData(`${apiBaseUrl}/bis/import`, payload, isFormData),

        onBisMailResend: async (payload, id) => await postData(`${apiBaseUrl}/bis/bis-mail/${id}`, payload),

        enableBackInStock: async (payload) => await postData(`${apiBaseUrl}/enable-bis`, payload),

        onBoarding: async (payload) => await postData(`${apiBaseUrl}/complete-onboarding`, payload),

        getIntegration: async (payload) => await getData(`${apiBaseUrl}/integration/get?${qs.stringify(payload)}`),

        createIntegration: async (payload) => await postData(`${apiBaseUrl}/integration/create`, payload),

        templateConfirmation: async (payload) => await postData(`${apiBaseUrl}/template-notice`, payload)

    };
}

export default ApiService;