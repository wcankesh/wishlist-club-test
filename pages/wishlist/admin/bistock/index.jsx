import React, {Fragment} from 'react';
import {LegacyCard, Text, LegacyStack, Page, Layout, Grid, Icon} from "@shopify/polaris";
import {EmailMajor, ThemesMajor} from "@shopify/polaris-icons";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../../../utils/Constant";


export default function BackInStock() {
    const navigate = useNavigate()
    const BackInStock = [
        {
            icon: EmailMajor,
            tabName: "Back In Stock Email",
            description: "Manage your preferences for back-in-stock notifications and thank-you notifications using this section.",
            path: "bistock/bistock-email"
        },
        {
            icon: ThemesMajor,
            tabName: "Back In Stock Design",
            description: "Customize the design of your back-in-stock notifications for the home & collection page, subscriber form, and subscriber message.",
            path: "bistock/bistock-design"
        },
    ]

    return (
        <Fragment>
            <Page title={"Back In Stock"}>
                <Layout>
                    <Layout.Section>
                        <LegacyCard>
                            <LegacyStack.Item>
                                <LegacyCard sectioned>
                                    <Grid>
                                        {(BackInStock || []).map((x, i) => {
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

