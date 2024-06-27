import React, {Fragment} from 'react';
import {BlockStack, Button, Card, InlineGrid, InlineStack, Layout, Page, Text} from "@shopify/polaris";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../../utils/Constant";
import CrownTooltip from "../../Comman/CrownTooltip";
import {integrationOptions, threeColumns} from "./CommonUse/CommonUse";

const Integration = () => {
    const navigate = useNavigate();
    const shopDetails = useSelector((state) => state.shopDetails);

    const onRedirect = (link) => {
        navigate(`${baseUrl}/${link}`);
    }

    return (
        <Fragment>
            <Page backAction={{content: 'Settings', onAction: () => navigate(`${baseUrl}/settings`)}}
                  title="Integration">
                <Layout>
                    <Layout.Section variant="fullWidth">

                        <InlineGrid gap={"400"} columns={threeColumns}>
                            {(integrationOptions || []).map((x, index) => {
                                return (
                                    <Card key={index}>
                                        <BlockStack gap={'400'}>
                                            <InlineStack gap={"200"} align={"space-between"} blockAlign={"start"}
                                                         wrap={false}>
                                                <BlockStack gap={'400'}>
                                                    <InlineStack gap={"200"} wrap={false} align={'start'}
                                                                 blockAlign={'center'}>
                                                        <img src={x.image} alt={x.name} width={"50px"} height={"50px"}/>
                                                        <Text as="span" variant="headingMd" breakWord> {x.name} </Text>
                                                    </InlineStack>
                                                    <Text tone="subdued" variant="bodyMd" as="span"
                                                          breakWord>{x.text}</Text>
                                                </BlockStack>
                                                {shopDetails && shopDetails.plan_type !== '8' ?
                                                    <CrownTooltip x={x} onRedirect={onRedirect}/>
                                                    : ""}
                                            </InlineStack>
                                            <Button fullWidth size={'large'} onClick={() => onRedirect(x.link)}
                                                    disabled={x.buttonDisable || shopDetails.plan_type !== '8'}>{x.buttonText}</Button>
                                        </BlockStack>
                                    </Card>
                                );
                            })}
                        </InlineGrid>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    )
}
export default Integration;