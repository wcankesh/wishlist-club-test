import React from 'react';
import {Banner, Layout} from "@shopify/polaris";


const CustomErrorBanner = ({message, setMessage,setIsError, isError, link}) => {

    const onDismissBanner = () => {
        setMessage("");
        setIsError(false);
    }
    return (
        message !== "" && isError ?
            <Layout.Section fullWidth>
                <Banner
                    title={"Error"}
                    status="critical"
                    onDismiss={onDismissBanner}
                    action={link ? {content: "Get support", onAction: () => window.open(link, "_blank")} : ""}
                >
                    <p dangerouslySetInnerHTML={{__html: message}}/>
                </Banner>
            </Layout.Section> : ""
    );
};

export default CustomErrorBanner;