import React, { Fragment } from 'react';
import { Layout, Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../utils/Constant";
import WishlistCardMenu from "../Comman/WishlistCardMenu";
import { Icons } from "../../utils/Icons";

const Settings = () => {
    const navigate = useNavigate()
    const setting = [
        // {
        //     icon: Icons.SettingsIcon,
        //     name: "General",
        //     text: "Unlock a range of options to customize your wishlist's General settings.",
        //     link: "settings/general"
        // },
        // {
        //     icon: Icons.ThemeIcon,
        //     name: "Wishlist Design",
        //     text: "Manage the design settings of your wishlist specifically for the product and collection pages.",
        //     link: "settings/wishlist-design"
        // },
        {
            icon: Icons.EmailIcon,
            name: "Email Customisation",
            text: "Adjust your email preferences for wishlist items, price-drop alerts, and restock notifications for products in your wishlist.",
            link: "settings/email?step=0"

        },
        // {
        //     icon: Icons.LanguageIcon,
        //     name: "Language",
        //     text: "Customize the wishlist alert message, wishlist page, and popup label here.",
        //     link: "settings/language"
        // },
        {
            icon: Icons.DomainNewIcon,
            name: "APIs",
            text: "Utilize this API to personalize your wishlist according to your unique needs.",
            link: "settings/headless"
        },
        // {
        //     icon: Icons.ReceiptDollarFilledIcon,
        //     name: "Plan & Price",
        //     text: "This option displays the pricing plans that are available.",
        //     link: "settings/plan"
        // },
        {
            icon: Icons.ImportIcon,
            name: "Installation",
            text: "The manual installation processes are displayed in this option.",
            link: "settings/installation"
        },
        {
            icon: Icons.DnsSettingsIcon,
            name: "Integrations",
            text: "Connect your other applications to the Wishlist Club.",
            link: "settings/integration"
        },
        {
            icon: Icons.InfoIcon,
            name: 'What’s New',
            text: 'Stay informed with all the app updates and submit feature requests to help us improve.',
            link: 'settings/feedback',
        },
    ];

    const onRedirect = (link) => {
        if (link === 'settings/feedback') {
            window.Featurebase('manually_open_changelog_popup');
        } else {
            navigate(`${baseUrl}/${link}`);
        }
    }

    return (
        <Fragment>
            <Page title={"Settings"}>
                <Layout>
                    <Layout.Section>
                        <WishlistCardMenu data={setting} onRedirect={(link) => onRedirect(link)} column="three" />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

export default Settings;