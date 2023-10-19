import React from 'react';
import {
    Button, Text, ButtonGroup, Card, BlockStack, InlineStack
} from '@shopify/polaris';
import {
    SmileyHappyMajor, SmileySadMajor
} from '@shopify/polaris-icons';

const Feedback = () => {
    return (
        <React.Fragment>
            <Card padding={"500"}>
                <BlockStack gap={500}>
                    <Text as={"h2"} variant="headingMd" fontWeight={"medium"}>Share your feedback</Text>
                    <InlineStack align={"space-between"} wrap={false} gap={"200"}>
                        <BlockStack gap={300}>
                            <Text>How would you describe your experience using the Wishlist Club app?</Text>
                            <ButtonGroup>
                                <Button size="large" icon={SmileyHappyMajor}
                                        onClick={() => window.open("https://apps.shopify.com/wishlist-club#modal-show=WriteReviewModal", "_blank")}>Good</Button>
                                <Button size="large" icon={SmileySadMajor}
                                        onClick={() => window.Beacon("toggle")}>Bad</Button>
                            </ButtonGroup>
                        </BlockStack>
                        <img width="100px"
                             src={"https://cdn.shopify.com/shopifycloud/discovery_app/bundles/cf65cfedfd71f577120a557e3b5f3baad816c9476e76a2fefdcf67d94efe4e34.svg"}/>
                    </InlineStack>
                </BlockStack>
            </Card>
        </React.Fragment>
    );
};

export default Feedback;