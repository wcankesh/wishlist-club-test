import React, {Fragment} from 'react';
import {LegacyCard, Text, LegacyStack, Page, Layout, Grid, Icon} from "@shopify/polaris";
import {LanguageMinor, DomainNewMajor, PageMajor, SettingsMajor, EmailMajor} from "@shopify/polaris-icons";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../Utills/Constant";


const Settings = () => {
    const navigate = useNavigate()
    const setting = [
        {
            icon: SettingsMajor,
            tabName: "General",
            description: "Customize the bundle adjusting fonts, color, background, button, Offer tag, etc.",
            path: "general-settings"
        },
        {
            icon: PageMajor,
            tabName: "Wishlist Design",
            description: "Switch setting to enable or disable app functionality.",
            path: "design-settings"
        },
        {
            icon: EmailMajor,
            tabName: "Wishlist Email",
            description: "Check and update your Email Notification Setting.",
            path: "email-settings"

        },
        {
            icon: LanguageMinor,
            tabName: "Language",
            description: "Provide bundled information in any language to entice clients to make additional purchases.",
            path: "language-settings"
        },
        {
            icon: DomainNewMajor,
            tabName: "Headless",
            description: "Provide bundled information in any language to entice clients to make additional purchases.",
            path: "headless-settings"
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
                                                                    <Text>{x.description}</Text>
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

export default Settings;