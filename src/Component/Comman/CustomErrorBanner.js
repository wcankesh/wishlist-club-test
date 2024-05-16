import React from 'react';
import {Banner, Layout} from "@shopify/polaris";
import {openUrlInNewWindow} from "../../utils/Constant";

const CustomErrorBanner = ({message, setMessage, setIsError, isError, link}) => {
    const onDismissBanner = () => {
        setMessage("");
        setIsError(false);
    }
    return (
        message !== "" && isError ?
            <Layout.Section fullWidth>
                <Banner title={"Error"} tone="critical" onDismiss={onDismissBanner}
                        action={link ? {content: "Get support", onAction: () => openUrlInNewWindow(link)} : ""}>
                    <p dangerouslySetInnerHTML={{__html: message}}/>
                </Banner>
            </Layout.Section> : ""
    );
};

export default CustomErrorBanner;