import React, {Fragment} from 'react';
import {LegacyCard, Text, LegacyStack, Page, Layout, Grid, Icon} from "@shopify/polaris";
import {LanguageMinor, DomainNewMajor, ThemesMajor, SettingsMajor, EmailMajor} from "@shopify/polaris-icons";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../../../utils/Constant";


export default function Settings() {
    const navigate = useNavigate()
    const setting = [
        {
            icon: SettingsMajor,
            tabName: "General",
            description: "Unlock a range of options to customize your wishlist's general settings.",
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
    ]
    return (
        <Fragment>
            <Page title={"Settings"}>
                <Layout>
                    <Layout.Section>
                        <LegacyCard>
                            <LegacyStack.Item>
                                <LegacyCard sectioned>
                                    <Grid>
                                        {(setting || []).map((x, i) => {
                                            return (
                                                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 3, lg: 4, xl: 4}} key={i}>
                                                    <div className='setting-pointer' onClick={() => {
                                                        navigate(`${baseUrl}/${x.path}`)
                                                    }}>
                                                        <LegacyStack wrap={false}>
                                                            <LegacyStack.Item>
                                                                <div className='setting-icon'>
                                                                    <Icon source={x.icon} color="base"/>
                                                                </div>
                                                            </LegacyStack.Item>
                                                            <LegacyStack.Item fill>
                                                                <LegacyStack spacing='extraTight' vertical>
                                                                    <Text as='h6'
                                                                          fontWeight="semibold">{x.tabName}</Text>
                                                                    <Text color={"subdued"}>{x.description}</Text>
                                                                </LegacyStack>
                                                            </LegacyStack.Item>
                                                        </LegacyStack>
                                                    </div>
                                                </Grid.Cell>
                                            )
                                        })
                                        }
                                    </Grid>
                                </LegacyCard>
                            </LegacyStack.Item>
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

