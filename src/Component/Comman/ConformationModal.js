import React from 'react';
import {Box, BlockStack, List, Text, Link} from "@shopify/polaris";
import {Modal, TitleBar} from "@shopify/app-bridge-react";
const ConformationModal = ({active,onClose,isLoading,isEditor=false,handleConfirmation}) => {
    return (
        <Modal open={active}>
            <TitleBar title={"Confirm Upgrade to the New Email Template Editor?"}>
                <button variant="primary" loading={isLoading && ''} onClick={() => handleConfirmation()}>{'Confirm'}</button>
                <button onClick={() => onClose()}>Cancel</button>
            </TitleBar>
            <Box padding={'400'}>
                <BlockStack gap={"100"}>
                    <Text as={'span'}>Please note the following before proceeding:</Text>
                    <List>
                        <List.Item>
                            Once you switch to the new email template editor, <Text as={"span"}
                                                                                           variant={"headingMd"}>you
                            will not be able to revert back </Text> to the old version.
                        </List.Item>
                        {/*<List.Item>All of your current email template customizations will be Our default email template will be applied, and you can update it after the upgrade.</List.Item>*/}
                        <List.Item>
                            All of your current email template customizations (Wishlist, Re-stock, Back In Stock,
                            Price Drop) will be <Text as={"span"} variant={"headingMd"}> removed.</Text> Our default
                            email template will be applied, and you can update it after the upgrade.
                        </List.Item>
                        {isEditor && <List.Item>
                            Check out the difference here <Link
                            onClick={() => window.open("https://webcontrive.helpscoutdocs.com/article/847-difference-between-old-and-new-email-template?preview=66f53045f6180530271e2e3c", "_blank")}>Click
                            here</Link>
                        </List.Item>}
                    </List>
                </BlockStack>
            </Box>
        </Modal>
    );
};
export default ConformationModal;