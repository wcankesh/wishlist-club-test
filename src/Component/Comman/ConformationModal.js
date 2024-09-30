import React from 'react';
import {Modal,BlockStack,List,Text,Link} from "@shopify/polaris";

const ConformationModal = ({active,onClose,isLoading,isEditor=false,handleConfirmation}) => {

    return (
        <div>
            <Modal
                open={active}
                onClose={onClose}
                title={"Confirm Upgrade to the New Email Template Editor?"}
                primaryAction={{
                    content: "Confirm",
                    onAction: handleConfirmation,
                    loading: isLoading
                }}
                secondaryActions={[
                    { content: "Cancel", onAction: onClose }
                ]}
            >
                <Modal.Section>
                    <BlockStack gap={"100"}>
                        <Text as={'span'}>Please note the following before proceeding:</Text>
                        <List>
                            <List.Item>Once you switch to the new email template editor, <Text as={"span"} variant={"headingMd"}>you will not be able to revert back </Text>  to the old version.</List.Item>
                            {/*<List.Item>All of your current email template customizations will be Our default email template will be applied, and you can update it after the upgrade.</List.Item>*/}
                            <List.Item>All of your current email template customizations (Wishlist, Re-stock, Back In Stock, Price Drop) will be  <Text as={"span"} variant={"headingMd"}> removed.</Text> Our default email template will be applied, and you can update it after the upgrade.</List.Item>
                            {isEditor && <List.Item>Check out the difference here <Link
                                onClick={() => window.open("https://webcontrive.helpscoutdocs.com/article/847-difference-between-old-and-new-email-template?preview=66f53045f6180530271e2e3c", "_blank")}>Click
                                here</Link></List.Item>}
                        </List>
                    </BlockStack>
                </Modal.Section>
            </Modal>
        </div>
    );
};

export default ConformationModal;