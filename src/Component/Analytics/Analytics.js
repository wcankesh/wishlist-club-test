import React from 'react';
import {Page, Layout} from "@shopify/polaris";
import BisStockAnalytics from './BisStockAnalytics';
import CountAnalytics from './CountAnalytics';
import Chart from './Chart';

const Analytics = () => {
    return (
        <Page title={"Analytics"}>
            <Layout>
                <CountAnalytics/>
                <Chart/>
                <BisStockAnalytics/>
            </Layout>
        </Page>
    );
};

export default Analytics;