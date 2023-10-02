import React, {Fragment} from 'react';
import {Layout, Page, ProgressBar, Text, LegacyStack, Banner} from "@shopify/polaris"
import OnBoarding from "./OnBoarding/OnBoarding";
import HelpDesk from "./HelpDesk/HelpDesk"
import {useSelector} from "react-redux";
import Feedback from "./Feedback/Feedback";

const Dashboard = () => {
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayName = days[new Date().getDay()];
  let hours = new Date().getHours();
  const shopDetails = useSelector((state) => state.shopDetails)

  let productPercent = 0;
  if (shopDetails.plan_type === "0" || shopDetails.plan_type === "1") {
    productPercent = (shopDetails.sent_email * 100 / 50)
  } else if (shopDetails.plan_type === "5") {
    productPercent = (shopDetails.sent_email * 100 / 500)
  } else if (shopDetails.plan_type === "6") {
    productPercent = (shopDetails.sent_email * 100 / 2000)
  } else if (shopDetails.plan_type === "7") {
    productPercent = (shopDetails.sent_email * 100 / 5000)
  } else if (shopDetails.plan_type === "8") {
    productPercent = (shopDetails.sent_email * 100 / 10000)
  }
  return (
      <Fragment>
        <Page
            title={`Good ${hours < 12 ? "Morning" : hours >= 12 && hours <= 17 ? "Afternoon" : hours >= 17 && hours <= 24 ? "Evening" : ""} , ${shopDetails.store_name}`}
            subtitle={`Happy ${dayName} from the WebContrive team`}>
          <Layout>
            {
              shopDetails.notification.length > 0 ?
                  shopDetails.notification.map((x, i) => {
                    return (
                        <Layout.Section>
                          <Banner
                              title={x.notification_title}
                              status={x.type}
                          >
                            <span dangerouslySetInnerHTML={{__html: x.notification_description}}/>
                          </Banner>
                        </Layout.Section>
                    )
                  })
                  : ''
            }
            <Layout.Section>
              <Text as={"span"}>Mail
                sent {`${shopDetails.sent_email}/${(shopDetails.plan_type === "0" || shopDetails.plan_type === "1") ? "50" : shopDetails.plan_type === "5" ? "500" : shopDetails.plan_type === "6" ? "2000" : shopDetails.plan_type === "7" ? "5000" : shopDetails.plan_type === "8" ? "10000" : ""}`}</Text>
              <LegacyStack alignment={"center"}>
                <LegacyStack.Item fill>
                  <ProgressBar progress={productPercent} size="small" color={"success"}/>
                </LegacyStack.Item>
                <Text>{productPercent}%</Text>
              </LegacyStack>
            </Layout.Section>
            <Layout.Section>
              <OnBoarding/>
            </Layout.Section>

            <Layout.Section>
              <HelpDesk/>
            </Layout.Section>
            <Layout.Section>
              <Feedback/>
            </Layout.Section>
          </Layout>
        </Page>
      </Fragment>
  );
};

export default Dashboard;