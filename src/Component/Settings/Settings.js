import React, {Fragment} from 'react';
import {Text, Page, Layout, Icon, BlockStack, InlineStack, Card, Divider, Box} from "@shopify/polaris";
import {LanguageMinor, DomainNewMajor, ThemesMajor, SettingsMajor, EmailMajor, BillingStatementDollarMajor, InstallMinor} from "@shopify/polaris-icons";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/Constant";

const Settings = () => {
    const navigate = useNavigate()
    const setting = [
        {
            icon: SettingsMajor,
            tabName: "General",
            description: "Unlock a range of options to customize your wishlist's General settings.",
            path: "settings/general"
        },
        {
            icon: ThemesMajor,
            tabName: "Wishlist Design",
            description: "Manage the design settings of your wishlist specifically for the product and collection pages.",
            path: "settings/wishlist-design"
        },
        {
            icon: EmailMajor,
            tabName: "Wishlist Email",
            description: "Adjust your email preferences for wishlist items, price-drop alerts, and restock notifications for products in your wishlist.",
            path: "settings/email"

        },
        {
            icon: LanguageMinor,
            tabName: "Language",
            description: "Customize the wishlist alert message, wishlist page, and popup label here.",
            path: "settings/language"
        },
        {
            icon: DomainNewMajor,
            tabName: "Headless",
            description: "Utilize this API to personalize your wishlist according to your unique needs.",
            path: "settings/headless"
        },
        {
            icon: BillingStatementDollarMajor,
            tabName: "Plan & Price",
            description: "This option displays the pricing plans that are available.",
            path: "settings/plan"
        },
        {
            icon: InstallMinor,
            tabName: "Installation",
            description: "The manual installation processes are displayed in this option.",
            path: "settings/installation"
        },
    ]
    return (
        <Fragment>
            <Page title={"Settings"}>
                <Layout>
                    <Layout.Section>
                        <Card padding={"0"}>
                                {(setting || []).map((x, i) => {
                                    return (
                                        <div className={"cursor-pointer"} onClick={() => navigate(`${baseUrl}/${x.path}`)}>
                                            <Box padding={"500"}>
                                                <InlineStack wrap={false} gap={"400"} blockAlign={"start"}>
                                                    <div className={"sgi_icon"}><Icon source={x.icon} tone={"subdued"}/></div>
                                                    <BlockStack>
                                                        <Text fontWeight='medium'>{x.tabName}</Text>
                                                        <Text tone={"subdued"}>{x.description}</Text>
                                                    </BlockStack>
                                                </InlineStack>
                                            </Box>
                                            {
                                                setting.length - 1 === i ? "" : <Divider/>
                                            }
                                        </div>
                                    )
                                })
                                }

                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

export default Settings;