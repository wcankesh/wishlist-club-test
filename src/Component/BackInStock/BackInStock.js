import React, {Fragment} from 'react';
import {Text, Divider, Page, Layout, Thumbnail, Icon, Card, BlockStack, InlineStack, Box} from "@shopify/polaris";
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
                        <Card padding={"0"}>
                            {
                                (BackInStock || []).map((x, i) => {
                                    return (
                                        <div onClick={() => navigate(`${baseUrl}/${x.path}`)} className={"cursor-pointer"}>
                                            <Box padding={"500"}>
                                                <InlineStack gap={400} wrap={false}>
                                                    <div className={"sgi_icon"}>
                                                        <Icon source={x.icon} tone={"subdued"}/>
                                                    </div>
                                                    <BlockStack>
                                                        <Text as={"span"} fontWeight="medium">{x.tabName}</Text>
                                                        <Text as={"span"} tone={"subdued"}>{x.description}</Text>
                                                    </BlockStack>
                                                </InlineStack>
                                            </Box>
                                            {
                                                BackInStock.length - 1 === i ? "" : <Divider/>
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

export default BackInStock;