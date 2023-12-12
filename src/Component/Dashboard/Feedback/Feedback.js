import React from 'react';
import {
    Button, Text, ButtonGroup, Card, BlockStack, InlineStack
} from '@shopify/polaris';
import {
    SmileyHappyMajor, SmileySadMajor, CancelMajor
} from '@shopify/polaris-icons';

const Feedback = ({onRemoveBanner}) => {
    return (
        <React.Fragment>
            <Card padding={"400"}>
                <BlockStack gap={"400"}>
                    <InlineStack align={"space-between"}>
                        <Text as={"h2"} variant="headingMd" fontWeight={"medium"}>Share your feedback</Text>
                        <Button variant={"plain"} icon={CancelMajor} onClick={() => onRemoveBanner("share_feedback")}/>
                    </InlineStack>
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
                    </InlineStack>
                </BlockStack>
            </Card>
        </React.Fragment>
    );
};

export default Feedback;