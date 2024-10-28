import React, {Fragment} from 'react';
import {Page, Layout} from "@shopify/polaris";
import {
    LanguageMinor, DomainNewMajor, ThemesMajor, SettingsMajor, EmailMajor,
    BillingStatementDollarMajor, InstallMinor, DnsSettingsMajor, CircleInformationMajor
} from "@shopify/polaris-icons";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/Constant";
import WishlistCardMenu from "../Comman/WishlistCardMenu";

const Settings = () => {
    const navigate = useNavigate()
    const setting = [
        {
            icon: SettingsMajor,
            name: "General",
            text: "Unlock a range of options to customize your wishlist's General settings.",
            link: "settings/general"
        },
        {
            icon: ThemesMajor,
            name: "Wishlist Design",
            text: "Manage the design settings of your wishlist specifically for the product and collection pages.",
            link: "settings/wishlist-design"
        },
        {
            icon: EmailMajor,
            name: "Wishlist Email",
            text: "Adjust your email preferences for wishlist items, price-drop alerts, and restock notifications for products in your wishlist.",
            link: "settings/email"

        },
        {
            icon: LanguageMinor,
            name: "Language",
            text: "Customize the wishlist alert message, wishlist page, and popup label here.",
            link: "settings/language"
        },
        {
            icon: DomainNewMajor,
            name: "Headless",
            text: "Utilize this API to personalize your wishlist according to your unique needs.",
            link: "settings/headless"
        },
        {
            icon: BillingStatementDollarMajor,
            name: "Plan & Price",
            text: "This option displays the pricing plans that are available.",
            link: "settings/plan"
        },
        {
            icon: InstallMinor,
            name: "Installation",
            text: "The manual installation processes are displayed in this option.",
            link: "settings/installation"
        },
        {
            icon: DnsSettingsMajor,
            name: "Integrations",
            text: "Connect your other applications to the Wishlist Club.",
            link: "settings/integration"
        },
        {
            icon: CircleInformationMajor,
            name: 'What’s New',
            text: 'Stay informed with all the app updates and submit feature requests to help us improve.',
            link: 'settings/feedback',
        },
    ];

    const onRedirect = (link) => {
        navigate(`${baseUrl}/${link}`);
    }

    return (
        <Fragment>
            <Page title={"Settings"}>
                <Layout>
                    <Layout.Section>
                        <WishlistCardMenu data={setting} onRedirect={(link) => onRedirect(link)} column="three"/>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

export default Settings;