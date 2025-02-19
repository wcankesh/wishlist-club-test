import React, {Fragment, useEffect, useState} from 'react';
import {Badge, BlockStack, Box, Button, Card, Divider, Icon, InlineStack, Layout, Page, Text} from '@shopify/polaris';
import {apiService, baseUrl} from "../../../utils/Constant";
import {useNavigate} from "react-router-dom"
import {RenderLoading} from "../../../utils/RenderLoading";
import {Icons} from "../../../utils/Icons";


const BackInStockEmail = () => {
    const navigate = useNavigate();
    const [bisEmail, setBisEmail] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const BisEmail = [
        {
            title: "Back In Stock Notification",
            description: `If customers have subscribed to "Notify me" for sold-out products and if the "Back in stock notification" option is enabled, they will receive a mail notification when the product is available again.`,
            name: "is_bis_email_enable",
            path: "back-in-stock/email/stock-notification",
            icon: Icons.NotificationFilledIcon,
            checked: bisEmail.is_bis_email_enable == 1,
        },
        {
            title: "Thank You Notification",
            description: `Customers will get Thank You Notification after subscribing to the "Notify me" alerts for the sold-out products and if this "Thank You Notification " option is enabled.`,
            name: "is_thankyou_email_enable",
            path: "back-in-stock/email/thank-you-notification",
            icon: Icons.NotificationIcon,
            checked: bisEmail.is_thankyou_email_enable == 1,

        },
    ]

    useEffect(() => {
        getBisEmail()
    }, []);
    const getBisEmail = async () => {
        const response = await apiService.bisSetting();
        if (response.status === 200) {
            setBisEmail(response.data);
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    };

    return (
        <Fragment>
            <Page title={"Back In Stock Email"}
                  backAction={{content: 'BAckInStock', onAction: () => navigate(`${baseUrl}/back-in-stock`)}}>
                <Layout>
                    <Layout.Section>
                        <Card padding={"0"}>
                            {(BisEmail || []).map((x, i) => {
                                return (
                                    <>
                                        <Box padding={"500"}>
                                            <InlineStack wrap={false} gap={"400"} blockAlign={"start"} align={'space-evenly'}>
                                                <div className={"sgi_icon"}>
                                                    <Icon source={x.icon} tone={"subdued"}/>
                                                </div>
                                                <BlockStack gap={'150'}>
                                                    <InlineStack gap={"100"} wrap={false} align={'start'} blockAlign={'center'}>
                                                        <Text as={"span"} fontWeight='medium'>{x.title}</Text>
                                                       {isLoading ? RenderLoading?.badge :
                                                        <Badge tone={x.checked ? "success" : "critical"}>{x.checked ? "Enabled" : "Disabled"} </Badge>
                                                       }
                                                    </InlineStack>
                                                    <Text as={"span"} tone={"subdued"}>{x.description}</Text>
                                                </BlockStack>
                                                <Button variant={'secondary'} icon={Icons.EditIcon} onClick={() => navigate(`${baseUrl}/${x.path}`)} size={'slim'}>Edit</Button>
                                            </InlineStack>
                                        </Box>
                                        {BisEmail.length - 1 === i ? "" : <Divider/>}
                                    </>
                                )
                            })}
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

export default BackInStockEmail;