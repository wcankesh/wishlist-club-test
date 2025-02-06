import React from 'react';
import {Button, Text, ButtonGroup, Card, BlockStack, InlineStack} from '@shopify/polaris';
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {openUrlInNewWindow} from "../../../utils/Constant";
import {Icons} from "../../../utils/Icons";

const Feedback = ({onRemoveBanner}) => {
    return (
        <React.Fragment>
            <Card padding={"400"}>
                <BlockStack gap={"400"}>
                    <InlineStack align={"space-between"}>
                        <Text as={"span"} variant="headingMd" fontWeight={"medium"}>Share your feedback</Text>
                        <Button variant={"plain"} icon={Icons.XCircleIcon} onClick={() => onRemoveBanner("share_feedback")}/>
                    </InlineStack>
                    <InlineStack align={"space-between"} wrap={false} gap={"200"}>
                        <BlockStack gap={300}>
                            <Text as={"span"}>How would you describe your experience using the Wishlist Club app?</Text>
                            <ButtonGroup>
                                <Button size="large" icon={Icons.SmileyHappyIcon}
                                        onClick={() => openUrlInNewWindow(AppDocsLinks.writeReviewModal)}>Good</Button>
                                <Button size="large" icon={Icons.SmileySadIcon}
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