import React, {Fragment, useEffect} from 'react';
import {InlineStack, Layout, Page} from "@shopify/polaris";
import HelpDesk from "./HelpDesk/HelpDesk"
import {useDispatch, useSelector} from "react-redux";
import Feedback from "./Feedback/Feedback";
import {Shop_details} from "../../redux/action/action";
import {apiService} from "../../utils/Constant";
import {Icons} from "../../utils/Icons";
import Notifications from "./Notifications";

const Dashboard = () => {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayName = days[new Date().getDay()];
    let hours = new Date().getHours();
    const shopDetails = useSelector((state) => state.shopDetails)
    const dispatch = useDispatch();

    const onRemoveBanner = async (name) => {
        const payload = {
            banner_display_setting: { ...shopDetails.bannerDisplaySetting, [name]: "true" },
            id: shopDetails.id
        }
        dispatch(Shop_details({
            ...shopDetails,
            bannerDisplaySetting: { ...shopDetails.bannerDisplaySetting, [name]: "true" }
        }));
        const data = await apiService.updateShopDisplayBanner(payload)
    }
    const fetchextensionStatus = async () => {
        const extResponse = await apiService.ExtensionStatus({});
        dispatch(Shop_details({
            ...shopDetails,
            extension_status: extResponse.data.isEnabledExtension,
        }));
    }
    useEffect(() => {
        fetchextensionStatus()
    }, [])

    return (
        <Fragment>
            <Page
                title={`Good ${hours < 12 ? "Morning" : hours >= 12 && hours <= 17 ? "Afternoon" : hours >= 17 && hours <= 24 ? "Evening" : ""} , ${shopDetails.store_name}`}
                subtitle={`Happy ${dayName} from the WebContrive team`}
                primaryAction={
                    <InlineStack>
                        <button
                            data-featurebase-feedback-portal
                            onClick={() => {window.Featurebase('manually_open_changelog_popup');}}
                            className="Polaris-Button Polaris-Button--primary"
                        >
                            {Icons.announcement}
                        </button>
                    </InlineStack>
                }
            >
                <Layout>
                    <Notifications />

                    <Layout.Section variant={"fullWidth"}>
                        <HelpDesk />
                    </Layout.Section>
                    {
                        shopDetails && shopDetails.bannerDisplaySetting["share_feedback"] != "true" ?
                            <Layout.Section>
                                <Feedback onRemoveBanner={onRemoveBanner} />
                            </Layout.Section> : ""
                    }
                </Layout>
            </Page>
        </Fragment>
    );
};

export default Dashboard;