import React, {Fragment} from 'react';
import {Button, InlineStack, BlockStack, Text, Tooltip} from "@shopify/polaris";
import {Icons} from "../../utils/Icons";

const CrownTooltip = ({x, onRedirect}) => {
    return (
        <Fragment>
            <Tooltip padding={"400"} width={"wide"} content={
                <div className="tooltip-box" onClick={(e) => {
                    onRedirect('settings/plan');
                    e.stopPropagation();
                }}>
                    <BlockStack gap={"300"}>
                        <InlineStack align={"space-between"} gap={"200"} wrap={false} blockAlign={"center"}>
                            <Text variant="headingMd" as="h2">{x.name}</Text>
                            <Button size="slim">View Plan</Button>
                        </InlineStack>
                        <Text>{x.text}</Text>
                        <Text tone="success">
                            <Text as="span" fontWeight="bold">{x.tooltipPlan}</Text> {"Plan"}
                        </Text>
                    </BlockStack>
                </div>
            }>
                <span className="tooltip-crown">{Icons.Crown}</span>
            </Tooltip>
        </Fragment>
    );
};

export default CrownTooltip;