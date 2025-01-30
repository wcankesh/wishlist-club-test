import React from "react";
import {BlockStack, Card, Icon, InlineGrid, InlineStack, Text} from "@shopify/polaris";

const twoColumns = {xs: 1, sm: 1, md: 2, lg: 2, xl: 2};
const threeColumns = {xs: 1, sm: 1, md: 2, lg: 3, xl: 3};

const WishlistCardMenu = ({data, onRedirect, shopDetails, column = "two"}) => {
    return (
        <Card>
            <InlineGrid gap={"400"} columns={column === "two" ? twoColumns : threeColumns}>
                {data.map((x, index) => {
                    return (
                        <button data-featurebase-feedback-portal className={"cursor-pointer"} onClick={() => onRedirect(x.link)} key={index}
                        style={{display: 'block', border: 'none', background:'transparent', textAlign: 'start'}}
                        >
                            <InlineStack gap={"200"} align={"space-between"} blockAlign={"start"} wrap={false}>
                                <InlineStack gap={"400"} wrap={false}>
                                    <div className="sgi_icon">
                                        <Icon source={x.icon} tone="subdued"/>
                                    </div>
                                    <BlockStack gap={"100"}>
                                        <Text as="span" variant="headingMd" breakWord fontWeight={"medium"}>
                                            {x.name}
                                        </Text>
                                        <Text as={"span"} tone="subdued" variant="bodyMd" breakWord>{x.text}</Text>
                                    </BlockStack>
                                </InlineStack>
                                {/*{shopDetails && shopDetails.client_plan < x.isPlan ?*/}
                                {/*    <CrownTooltip x={x} onRedirect={onRedirect}/> : ""}*/}
                            </InlineStack>
                        </button>
                    );
                })}
            </InlineGrid>
        </Card>

    );
};

export default WishlistCardMenu;
