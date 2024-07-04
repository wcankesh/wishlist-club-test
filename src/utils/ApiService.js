import axios from "axios";
import createApp from "@shopify/app-bridge";
import {getSessionToken} from "@shopify/app-bridge-utils";
import {isMobile, isShopifyEmbedded} from '@shopify/app-bridge/utilities';
import qs from "qs";

const instance = axios.create();
const apiBaseUrl = "https://rivyo.com/wishlist/api/public";

const urlParams = new URLSearchParams(window.location.search);
const host = urlParams.get('host');

const appKey = "65909e95fac4682299cfdae29dcd6a1a"
if(isMobile()){
    const app = createApp({
        apiKey: appKey,
        host,

    });
    instance.interceptors.request.use(function (config) {
        return getSessionToken(app)
            .then((token) => {
                config.headers["Authorization"] = `Bearer ${token}`;
                return config;
            })
    });
} else {
    if(isShopifyEmbedded()){
        const app = createApp({
            apiKey: appKey,
            host,

        });
        instance.interceptors.request.use(function (config) {
            return getSessionToken(app)
                .then((token) => {
                    config.headers["Authorization"] = `Bearer ${token}`;
                    return config;
                })
        });
    } else {
        instance.interceptors.request.use(function (config) {
            let urlParams = new URLSearchParams(window.location.search);
            urlParams.toString();
            const params = Object.fromEntries(urlParams)
            config.headers["Authorization"] = JSON.stringify(params)
            return config;
        })
    }
}

export class ApiService {
    errorResponse(e) {
        let resData = '';
        if (e.response.status === 401) {
            resData = e && e.response && e.response.data;
        } else {
            resData = e && e.response && e.response.data ? {...e.response.data, status: e.response.status}: e.response.data;
        }
        return resData
    }

    successResponse(res) {
        let resData = '';
        if (res.status === 200) {
            resData = res.data;
        } else {
            resData = res.data
        }
        return resData
    }

    async getData(url, header) {
        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                ...header || {}
            }
        };
        let resData = "";
        await instance.get(url, config).then((res) => {
            resData = this.successResponse(res)
        }).catch((e) => {
            resData = this.errorResponse(e)
        });
        return resData
    }

    async postData(url, data, isFormData, header) {
        const newData = qs.stringify(data);
        const config = {
            headers: {
                'content-type': isFormData ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
                ...header || {}
            }
        };
        let resData = "";
        await instance.post(url, isFormData ? data : newData, config).then((res) => {
            resData = this.successResponse(res)

        }).catch((e) => {
            resData = this.errorResponse(e)
        });
        return resData
    }

    async putData(url, data, header) {
        const newData = qs.stringify(data);
        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                ...header || {}
            }
        };
        let resData = "";
        await instance.put(url, newData, config).then((res) => {
            resData = this.successResponse(res)
        }).catch((e) => {
            resData = this.errorResponse(e)
        })
        return resData
    }

    async deleteData(url, header) {
        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                ...header || {}
            }
        };
        let resData = "";
        await instance.delete(url, config).then((res) => {
            resData = this.successResponse(res)
        }).catch((e) => {
            resData = this.errorResponse(e)
        });
        return resData
    }

    async Install(payload) {
        return await this.postData(`${apiBaseUrl}/api/install`, payload);
    }

    async getAppEmbedded() {
        return await this.getData(`${apiBaseUrl}/api/is-app-embedded`);
    }

    async getThemes() {
        return await this.getData(`${apiBaseUrl}/api/themes`);
    }

    async checkTheme(payload) {
        return await this.postData(`${apiBaseUrl}/api/check-theme`,payload);
    }

    async codeSetup(payload) {
        return await this.postData(`${apiBaseUrl}/api/code-setup`, payload);
    }

    async Analytics(payload) {
        return await this.postData(`${apiBaseUrl}/api/analytics`, payload);
    }

    async WishlistAnalytics(payload) {
        return await this.postData(`${apiBaseUrl}/api/wishlist-analytic`, payload);
    }

    async Email(payload) {
        return await this.postData(`${apiBaseUrl}/api/emails`, payload);
    }
    async ImportWishlistHistory(payload) {
        return await this.postData(`${apiBaseUrl}/api/histories`, payload);
    }

    async getExport(payload) {
        let url = `${apiBaseUrl}/api/export?shop=${payload.shop}`
        return window.open(url, "_blank");
    }

    async Import(payload, isFormData) {
        return await this.postData(`${apiBaseUrl}/api/import`, payload, isFormData);
    }

    async getSetting() {
        return await this.getData(`${apiBaseUrl}/api/setting`);
    }

    async updateSetting(payload, id) {
        return await this.putData(`${apiBaseUrl}/api/setting/${id}`, payload);
    }

    async getLauncher() {
        return await this.getData(`${apiBaseUrl}/api/launcher`);
    }

    async updateLauncher(payload, id) {
        return await this.putData(`${apiBaseUrl}/api/launcher/${id}`, payload);
    }

    async getLabel() {
        return await this.getData(`${apiBaseUrl}/api/label`);
    }

    async updateLabel(payload, id) {
        return await this.postData(`${apiBaseUrl}/api/label/${id}`, payload);
    }

    async getEmailVerification() {
        return await this.getData(`${apiBaseUrl}/api/bis/setting`);
    }

    async updateEmailVerification(payload) {
        return await this.postData(`${apiBaseUrl}/api/bis/edit-message`, payload);
    }

    async emailSetting() {
        return await this.getData(`${apiBaseUrl}/api/email-setting`);
    }

    async updateEmailSetting(payload, id) {
        return await this.postData(`${apiBaseUrl}/api/email-setting/${id}`, payload, true);
    }

    async bisSetting() {
        return await this.getData(`${apiBaseUrl}/api/bis/setting`);
    }

    async updateBisSetting(payload) {
        return await this.postData(`${apiBaseUrl}/api/bis/setting`, payload, true);
    }

    async updateIcon(payload, isFormData) {
        return await this.postData(`${apiBaseUrl}/api/icon`, payload, isFormData);
    }

    async deleteIcon() {
        return await this.deleteData(`${apiBaseUrl}/api/icon`);
    }

    async getHeadless() {
        return await this.getData(`${apiBaseUrl}/api/headless`);
    }

    async getHeadlessToken() {
        return await this.getData(`${apiBaseUrl}/api/headless-token`);
    }

    async updateHeadless(payload) {
        return await this.postData(`${apiBaseUrl}/api/headless`, payload);
    }

    async BisAnalytics(payload) {
        return await this.postData(`${apiBaseUrl}/api/bis/analytics`, payload);
    }

    async upgradePlan(payload) {
        return await this.postData(`${apiBaseUrl}/api/upgrade`, payload)
    }

    async upgradeEmailPlan(payload) {
        return await this.postData(`${apiBaseUrl}/api/usage-charge`, payload)
    }

    async getBilling() {
        return await this.getData(`${apiBaseUrl}/api/billing`);
    }

    async updateShopDisplayBanner(payload) {
        return await this.postData(`${apiBaseUrl}/api/banner-setting`, payload)
    }
    async getBisExport(payload) {
        let url = `${apiBaseUrl}/api/bis/export?shop=${payload.shop}`
        return window.open(url, "_blank");
    }

    async bisImport(payload, isFormData) {
        return await this.postData(`${apiBaseUrl}/api/bis/import`, payload, isFormData);
    }

    async enableBackInStock(payload) {
        return await this.postData(`${apiBaseUrl}/api/enable-bis`, payload)
    }

    async onBoarding(payload) {
        return await this.postData(`${apiBaseUrl}/api/complete-onboarding`, payload)
    }

    async getIntegration(payload) {
        return await this.getData(`${apiBaseUrl}/api/integration/get?${qs.stringify(payload)}`);
    }

    async createIntegration(payload) {
        return await this.postData(`${apiBaseUrl}/api/integration/create`, payload)
    }
}