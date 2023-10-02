import React from 'react';
import {Page, Layout} from "@shopify/polaris";
import BisStockAnalytics from './BisStockAnalytics';
import CountAnalytics from './CountAnalytics';
import Chart from './Chart';
import TopProducts from "../Dashboard/TopProducts/TopProducts";

const Analytics = () => {
    return (
        <Page title={"Analytics"}>
            <Layout>
                <CountAnalytics/>
                <Chart/>
                <Layout.Section>
                    <TopProducts/>
                </Layout.Section>
                <BisStockAnalytics/>
            </Layout>
        </Page>
    );
};

export default Analytics;