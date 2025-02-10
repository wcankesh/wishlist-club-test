import React from 'react';
import { Banner, Layout, Link } from "@shopify/polaris";
import { openUrlInNewWindow } from "../../utils/Constant";

const CustomErrorBanner = ({ message, setMessage, setIsError, isError, link, isCardBanner = false , bannerType = 'critical' }) => {

    const onDismissBanner = () => {
        setMessage("");
        setIsError(false);
    };

    if (message === "" || !isError) return null;

    if (isCardBanner) {
        return (
            <Banner onDismiss={onDismissBanner} tone={bannerType}>
                <p>
                    <span dangerouslySetInnerHTML={{ __html: message }} />&nbsp;&nbsp;
                    <Link url={link || "#"} external={true}>{"Get support"}</Link>
                </p>
            </Banner>
        );
    }

    return (
        <Layout.Section variant={"fullWidth"}>
            <Banner
                title={"Error"}
                tone={bannerType}
                onDismiss={onDismissBanner}
                action={link ? { content: "Get support", onAction: () => openUrlInNewWindow(link) } : undefined}
            >
                <p dangerouslySetInnerHTML={{ __html: message }} />
            </Banner>
        </Layout.Section>
    );
};

export default CustomErrorBanner;
