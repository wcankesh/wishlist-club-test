import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Banner, BlockStack, Layout} from "@shopify/polaris";
import {apiService, baseUrl, openUrlInNewWindow} from "../../utils/Constant";
import {Shop_details} from "../../redux/action/action";
import {useNavigate} from "react-router-dom";
import ConformationModal from "../Comman/ConformationModal";

const Notifications = () => {
    const shopDetails = useSelector((state) => state.shopDetails);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [active, setActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [bannerDisplayText, setBannerDisplayText] = useState("")

    const handleUpgradeNow = (text) => {
        setActive((prevActive) => !prevActive);
        setBannerDisplayText(text);
    }

    const handleConfirmation = async () => {
        setIsLoading(true);
        const payload = {
            new_wishlist_template: 1,
            new_price_drop_template: 1,
            new_restock_template: 1,
            new_bis_template: 1,
            new_thankyou_template: 1,
        }
        const response = await apiService.templateConfirmation(payload);
        if (response.status === 200) {
            setIsLoading(false);
            setActive((active) => !active);
            await onRemoveBanner(bannerDisplayText);

        } else {
            setIsLoading(false);
            setActive((active) => !active)
        }
    }

    const onRemoveBanner = async (name) => {
        const payload = {
            banner_display_setting: {...shopDetails.bannerDisplaySetting, [name]: "true"},
            id: shopDetails.id
        }
        if (name === 'addon_email_notification') {
            dispatch(Shop_details({...shopDetails, addon_email_notification: false}));
        }
        dispatch(Shop_details({
            ...shopDetails,
            bannerDisplaySetting: {...shopDetails.bannerDisplaySetting, [name]: "true"}
        }));
        const data = await apiService.updateShopDisplayBanner(payload);
    }

    const notification = [
        {
            type: `info`,
            button_link: ``,
            is_custom_click: false,
            button_text: ``,
            notification_title: `You're currently in the development store.`,
            notification_description: `All features are accessible in Dev stores. To access all of our app's features, once you've chosen your Shopify plan, you'll also need to upgrade our app plan.`,
            is_close: true,
            show: (shopDetails.shopify_plan === "affiliate" || shopDetails.shopify_plan === "staff" || shopDetails.shopify_plan === "plus_partner_sandbox" || shopDetails.shopify_plan === "partner_test") && shopDetails && shopDetails.bannerDisplaySetting["development_store"] !== "true",
            keyName: 'development_store',
        },
        {
            type: `warning`,
            button_link: () => openUrlInNewWindow(`https://${shopDetails.shop}/admin/themes/current/editor?context=apps`),
            is_custom_click: true,
            button_text: `Activate`,
            notification_title: `Activate Wishlist Club App`,
            notification_description: `Add the wishlist feature to your website. Activate Wishlist Club App Embed.`,
            is_close: true,
            show: shopDetails.extension_status === false && shopDetails && shopDetails.bannerDisplaySetting["extension_status"] !== "true",
            keyName: 'extension_status',
        },
        {
            type: `warning`,
            button_link: () => navigate(`${baseUrl}/settings/plan`),
            is_custom_click: true,
            button_text: `Upgrade Email Plan`,
            notification_title: `Attention: 80% Notification Limit Exceeded of your current plan!`,
            notification_description: `You’re Nearing your email limit on the current plan. Ensure uninterrupted communication by purchasing AddOn Emails.`,
            is_close: true,
            show: shopDetails && shopDetails.addon_email_notification,
            keyName: 'addon_email_notification',
        },
        {
            type: `info`,
            button_link: () => handleUpgradeNow('email-editor-template'),
            is_custom_click: true,
            button_text: `Upgrade Now`,
            notification_title: `New Email Template Editor available!`,
            notification_description: `Switch to our enhanced email template editor for a more intuitive and feature-rich experience. Please note, when you upgrade, your previous template will be removed, and you’ll need to set up a new one. Check out the difference here <a href="https://webcontrive.helpscoutdocs.com/article/847-difference-between-old-and-new-email-template" target="_blank">Click here<a>`,
            is_close: true,
            show: shopDetails && shopDetails.bannerDisplaySetting["email_editor_template"] !== "true",
            keyName: 'email_editor_template',
        },
        {
            type: `info`,
            button_link: () => navigate(`${baseUrl}/settings/email?step=2`),
            is_custom_click: true,
            button_text: `Check Them Out! 🚀`,
            notification_title: `Boost Your Sales with New Email Alerts! 📩🚀`,
            notification_description: `Exciting News! 🚀 We've added brand-new email alerts to help boost your sales! Stay updated with important notifications and never miss an opportunity to engage with your customers. Start leveraging these powerful features today!`,
            is_close: false,
            show: shopDetails && shopDetails.bannerDisplaySetting["email_editor_template_settings"] !== "true",
            keyName: 'email_editor_template_settings',
        },
    ];

    return (
        <React.Fragment>
            {active ? (
                <ConformationModal
                    active={active}
                    onClose={handleUpgradeNow}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setActive={setActive}
                    isEditor={false}
                    handleConfirmation={handleConfirmation}
                />
            ) : ""}

            {
                notification.length > 0 ?
                    (notification || []).map((x, i) => {
                        return (
                            x.show ? (
                                <React.Fragment key={i}>
                                    <Layout.Section>
                                        <Banner
                                            title={x?.notification_title}
                                            tone={x?.type}
                                            onDismiss={x?.is_close ? () => onRemoveBanner(x?.keyName) : null}
                                            action={
                                                x.button_text ? {
                                                        content: x.button_text,
                                                        onAction: x.is_custom_click ? () => x.button_link() : null
                                                    }
                                                    : ""}
                                        >
                                            <BlockStack gap={"100"}>
                                                <span dangerouslySetInnerHTML={{__html: x?.notification_description}}/>
                                            </BlockStack>
                                        </Banner>
                                    </Layout.Section>
                                </React.Fragment>
                            ) : ""
                        )
                    }) : ''
            }
        </React.Fragment>
    );
};

export default Notifications;