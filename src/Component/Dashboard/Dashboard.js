import React, {Fragment} from 'react';
import {Banner, Layout, Page, Text} from "@shopify/polaris";
import HelpDesk from "./HelpDesk/HelpDesk"
import {useDispatch, useSelector} from "react-redux";
import Feedback from "./Feedback/Feedback";
import {Shop_details} from "../../redux/action/action";
import {apiService, baseUrl, openUrlInNewWindow} from "../../utils/Constant";
import {useNavigate} from "react-router-dom";

const Dashboard = () => {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayName = days[new Date().getDay()];
    let hours = new Date().getHours();
    const shopDetails = useSelector((state) => state.shopDetails)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onRemoveBanner = async (name) => {
        const payload = {
            banner_display_setting: {...shopDetails.bannerDisplaySetting, [name]: "true"},
            id: shopDetails.id
        }
        dispatch(Shop_details({
            ...shopDetails,
            bannerDisplaySetting: {...shopDetails.bannerDisplaySetting, [name]: "true"}
        }));
        const data = await apiService.updateShopDisplayBanner(payload)
    }

    const onCloseEmailBanner = () => {
        dispatch(Shop_details({...shopDetails, addon_email_notification: false}));
    }

    return (
        <Fragment>
            <Page
                title={`Good ${hours < 12 ? "Morning" : hours >= 12 && hours <= 17 ? "Afternoon" : hours >= 17 && hours <= 24 ? "Evening" : ""} , ${shopDetails.store_name}`}
                subtitle={`Happy ${dayName} from the WebContrive team`}>
                <Layout>
                    {
                        (shopDetails.shopify_plan === "affiliate" || shopDetails.shopify_plan === "staff" || shopDetails.shopify_plan === "plus_partner_sandbox" || shopDetails.shopify_plan === "partner_test") ?
                            shopDetails && shopDetails.bannerDisplaySetting["development_store"] !== "true" ?
                                <Layout.Section>
                                    <Banner title={"You're currently in the development store."} tone="info"
                                            onDismiss={() => onRemoveBanner("development_store")}>
                                        <p>All features are accessible in Dev stores. To access all of our app's
                                            features, once you've chosen your Shopify plan, you'll also need to upgrade
                                            our app plan.</p>
                                    </Banner>
                                </Layout.Section> : ""
                            : ""
                    }
                    {
                        shopDetails.extension_status === false ? shopDetails && shopDetails.bannerDisplaySetting["extension_status"] !== "true" ?
                            <Layout.Section>
                                <Banner
                                    action={{
                                        content: "Activate",
                                        onAction: () => openUrlInNewWindow(`https://${shopDetails.shop}/admin/themes/current/editor?context=apps`)
                                    }}
                                    title={"Activate Wishlist Club App"} tone={"warning"}
                                    onDismiss={() => onRemoveBanner("extension_status")}
                                >
                                    <Text as={"span"}>
                                        {`Add the wishlist feature to your website. Activate Wishlist Club App Embed.`}
                                    </Text>
                                </Banner>
                            </Layout.Section> : "" : ""
                    }
                    {
                        shopDetails.notification.length > 0 ?
                            shopDetails.notification.map((x, i) => {
                                return (
                                    shopDetails && shopDetails.bannerDisplaySetting[x.notification_title.replaceAll(" ", "_")] !== "true" ?
                                        <Layout.Section>
                                            <Banner
                                                title={x.notification_title}
                                                tone={x.type}
                                                onDismiss={() => onRemoveBanner(x.notification_title.replaceAll(" ", "_"))}
                                            >
                                                <span dangerouslySetInnerHTML={{__html: x.notification_description}}/>
                                            </Banner>
                                        </Layout.Section> : ""
                                )
                            })
                            : ''
                    }
                    {shopDetails.addon_email_notification &&
                    <Layout.Section variant={"fullWidth"}>
                        <Banner
                            title={`Attention: 80% Notification Limit Exceeded of your current plan!`}
                            tone={"warning"}
                            onDismiss={() => onCloseEmailBanner()}
                            action={{
                                content: 'Upgrade Email Plan',
                                onAction: () => navigate(`${baseUrl}/settings/plan`)
                            }}>
                            <Text as={"span"}>
                                {`You’re Nearing your email limit on the current plan. Ensure uninterrupted communication by purchasing AddOn Emails.`}
                            </Text>
                        </Banner>
                    </Layout.Section>}
                    <Layout.Section variant={"fullWidth"}>
                        <HelpDesk/>
                    </Layout.Section>
                    {
                        shopDetails && shopDetails.bannerDisplaySetting["share_feedback"] != "true" ? <Layout.Section>
                            <Feedback onRemoveBanner={onRemoveBanner}/>
                        </Layout.Section> : ""
                    }
                </Layout>
            </Page>
        </Fragment>
    );
};

export default Dashboard;