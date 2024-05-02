import React, {Fragment} from 'react';
import {Layout, Page, ProgressBar, Text, BlockStack, InlineStack, Banner, Card} from "@shopify/polaris"
import OnBoarding from "./OnBoarding/OnBoarding";
import HelpDesk from "./HelpDesk/HelpDesk"
import {useDispatch, useSelector} from "react-redux";
import Feedback from "./Feedback/Feedback";
import {Shop_details} from "../../redux/action/action";
import {apiService} from "../../utils/Constant";

const Dashboard = () => {
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayName = days[new Date().getDay()];
  let hours = new Date().getHours();
  const shopDetails = useSelector((state) => state.shopDetails)
  const dispatch = useDispatch();

  const onRemoveBanner = async (name) => {
    const payload = {
      banner_display_setting: {...shopDetails.bannerDisplaySetting, [name]: "true"},
      id:shopDetails.id
    }
    dispatch(Shop_details({...shopDetails, bannerDisplaySetting: {...shopDetails.bannerDisplaySetting, [name]: "true"}}));
    const data = await apiService.updateShopDisplayBanner(payload)
  }

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
  }else if (shopDetails.plan_type === "9") {
    productPercent = (shopDetails.sent_email * 100 / 100)
  }
  return (
      <Fragment>
        <Page
            title={`Good ${hours < 12 ? "Morning" : hours >= 12 && hours <= 17 ? "Afternoon" : hours >= 17 && hours <= 24 ? "Evening" : ""} , ${shopDetails.store_name}`}
            subtitle={`Happy ${dayName} from the WebContrive team`}>
          <Layout>
            {
              (shopDetails.shopify_plan === "affiliate" || shopDetails.shopify_plan === "staff" || shopDetails.shopify_plan === "plus_partner_sandbox" || shopDetails.shopify_plan === "partner_test") ?
                  shopDetails && shopDetails.bannerDisplaySetting["development_store"] !== "true" ?
                  <Layout.Section>
                    <Banner title={"You're currently in the development store."} tone="info"
                            onDismiss={() => onRemoveBanner("development_store")}>
                      <p>All features are accessible in Dev stores. To access all of our app's features, once you've chosen your Shopify plan, you'll also need to upgrade our app plan.</p>
                    </Banner>
                  </Layout.Section> : ""
                  : ""
            }
            {
              shopDetails.extension_status === false ? shopDetails && shopDetails.bannerDisplaySetting["extension_status"] !== "true" ? <Layout.Section>
                <Banner
                    action={{content: "Activate", onAction: () => window.open(`https://${shopDetails.shop}/admin/themes/current/editor?context=apps`, "_blank",)}}
                    title={"Activate Wishlist Club App"} tone={"warning"}
                    onDismiss={() => onRemoveBanner("extension_status")}
                >
                  <Text
                      as={"span"}>Add the wishlist feature to your website. Activate Wishlist Club App Embed.</Text>
                </Banner>
              </Layout.Section> : "" : ""
            }
            {
              shopDetails.notification.length > 0 ?
                  shopDetails.notification.map((x, i) => {
                    return (
                        shopDetails && shopDetails.bannerDisplaySetting[x.notification_title.replaceAll(" ", "_")] !== "true" ?
                        <Layout.Section>
                          <Banner
                              title={x.notification_title}
                              tone={x.type}
                              onDismiss={() => onRemoveBanner(x.notification_title.replaceAll(" ", "_"))}
                          >
                            <span dangerouslySetInnerHTML={{__html: x.notification_description}}/>
                          </Banner>
                        </Layout.Section> : ""
                    )
                  })
                  : ''
            }
            {/*<Layout.Section>*/}
            {/*  <Card>*/}
            {/*    <Text as={"span"}>Mail sent {`${shopDetails.sent_email}/${(shopDetails.plan_type === "0" || shopDetails.plan_type === "1") ? "50" : shopDetails.plan_type === "5" ? "500" : shopDetails.plan_type === "6" ? "2000" : shopDetails.plan_type === "7" ? "5000" : shopDetails.plan_type === "8" ? "10000" : shopDetails.plan_type === "9" ? "100" : ""}`}</Text>*/}
            {/*    <BlockStack>*/}
            {/*      <InlineStack wrap={false} blockAlign={"center"} gap="400">*/}
            {/*        <ProgressBar progress={productPercent} size="small" tone="primary"/>*/}
            {/*        <Text>{productPercent}%</Text>*/}
            {/*      </InlineStack >*/}
            {/*    </BlockStack>*/}
            {/*  </Card>*/}
            {/*</Layout.Section>*/}
            {/*<Layout.Section>*/}
            {/*  <OnBoarding/>*/}
            {/*</Layout.Section>*/}
            <Layout.Section>
              <HelpDesk/>
            </Layout.Section>
              {
                shopDetails && shopDetails.bannerDisplaySetting["share_feedback"] != "true" ? <Layout.Section>
                  <Feedback onRemoveBanner={onRemoveBanner}/>
                </Layout.Section> : ""
              }
          </Layout>
        </Page>
      </Fragment>
  );
};

export default Dashboard;