import React, {Fragment} from 'react';
import {Page, Layout} from "@shopify/polaris";
import CountAnalytics from "./CountAnalytics/CountAnalytics";
import Chart from "./Chart/Chart";
import BisStockAnalytics from "./BisStockAnalytics/BisStockAnalytics";

const Analytics = () => {
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
};

export default Analytics;