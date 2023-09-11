import React, {Fragment} from 'react';
import {LegacyCard, Text, LegacyStack, Page, Layout, Thumbnail, Button} from "@shopify/polaris";
import {EmailMajor, ThemesMajor} from "@shopify/polaris-icons";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/Constant";

const BackInStock = () => {
    const navigate = useNavigate()
    const BackInStock = [
        {
            icon: EmailMajor,
            tabName: "Back In Stock Email",
            description: "Manage your preferences for back-in-stock notifications and thank-you notifications using this section.",
            path: "back-in-stock/email"
        },
        {
            icon: ThemesMajor,
            tabName: "Back In Stock Design",
            description: "Customize the design of your back-in-stock notifications for the home & collection page, subscriber form, and subscriber message.",
            path: "back-in-stock/design"
        },
    ]
    return (
        <Fragment>
            <Page title={"Back In Stock"}>
                <Layout>
                    <Layout.Section>
                        <LegacyCard>
                            {
                                (BackInStock || []).map((x, i) => {
                                return (
                                    <LegacyCard.Section key={i}>
                                        <LegacyStack wrap={false} >
                                            <LegacyStack.Item>
                                                <Thumbnail size={"small"} source={x.icon}/>
                                            </LegacyStack.Item>
                                            <LegacyStack.Item fill>
                                                <LegacyStack spacing='extraTight' vertical>
                                                    <Text as='h6'
                                                          fontWeight="semibold">{x.tabName}</Text>
                                                    <Text color={"subdued"}>{x.description}</Text>
                                                </LegacyStack>
                                            </LegacyStack.Item>
                                            <LegacyStack.Item>
                                                <Button onClick={() => {navigate(`${baseUrl}/${x.path}`)}}>Edit</Button>
                                            </LegacyStack.Item>
                                        </LegacyStack>
                                    </LegacyCard.Section>
                                )
                                })
                            }
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

export default BackInStock;