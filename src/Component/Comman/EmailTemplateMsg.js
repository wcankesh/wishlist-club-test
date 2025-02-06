import React from 'react';
import {BlockStack, Text,List} from "@shopify/polaris";

const EmailTemplateMsg = ({msgArray}) => {
    return (
        <BlockStack>
            <Text as={'span'} variant={'headingSm'}>Use the following variable</Text>
            <List type="bullet">
                {
                    (msgArray || []).map((x,i)=>{
                        return(
                            <List.Item key={i}>{x}</List.Item>
                        )
                    })
                }
            </List>
        </BlockStack>
    );
};
export default EmailTemplateMsg;