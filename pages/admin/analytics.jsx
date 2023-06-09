import React, {Fragment} from 'react';
import {Page, Layout} from "@shopify/polaris";
import {CountAnalytics, Chart, BisStockAnalytics} from "../../components";

export default function Analytics() {
    return (
        <Fragment>
            <Page title={"Analytics"}>
                <Layout>
                    <CountAnalytics/>
                    <Chart/>
                    <BisStockAnalytics/>
                </Layout>
            </Page>
        </Fragment>
    );
}