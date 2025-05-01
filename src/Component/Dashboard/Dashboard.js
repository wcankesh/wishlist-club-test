import React, { Fragment, useEffect } from 'react';
import { InlineStack, Layout, Page } from "@shopify/polaris";
import HelpDesk from "./HelpDesk/HelpDesk"
import { useDispatch, useSelector } from "react-redux";
import Feedback from "./Feedback/Feedback";
import { Shop_details } from "../../redux/action/action";
import { apiService } from "../../utils/Constant";
import { Icons } from "../../utils/Icons";
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
                            onClick={() => { window.Featurebase('manually_open_changelog_popup'); }}
                            className="Polaris-Button Polaris-Button--primary"
                        >
                            {Icons.announcement}
                        </button>
                    </InlineStack>
                }
            >
                <Layout>
                    <Layout.Section >
                        <Notifications />
                    </Layout.Section>
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
// import {
//     BlockStack,
//     Box,
//     Button,
//     CalloutCard,
//     Card,
//     InlineGrid,
//     InlineStack,
//     Page,
//     Popover,
//     RadioButton,
//     Scrollable,
//     Spinner,
//     Tabs,
//     Text,
//     Tooltip,
// } from '@shopify/polaris';
// import React, { Fragment, Suspense, useEffect, useState } from 'react';
// import { Icons } from '../../utils/Icons';
// import { SetupGuide } from '../SetupGuide/SetupGuide';
// import moment from 'moment';
// import { CalendarIcon } from '@shopify/polaris-icons';
// import TopProducts from './TopProducts/TopProducts';
// import Feedback from './Feedback/Feedback';
// import { useDispatch, useSelector } from 'react-redux';
// import { Shop_details } from "../../redux/action/action";
// import { apiService } from '../../utils/Constant';
// import Notifications from "./Notifications";
// import HelpDesk from "./HelpDesk/HelpDesk"

// const ITEMS = [
//     {
//         id: 0,
//         title: "Add your first product",
//         description:
//             "If checking out takes longer than 30 seconds, half of all shoppers quit. Let your customers check out quickly with a one-step payment solution.",
//         image: {
//             url: "https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/onboarding/shop_pay_task-70830ae12d3f01fed1da23e607dc58bc726325144c29f96c949baca598ee3ef6.svg",
//             alt: "Illustration highlighting ShopPay integration",
//         },
//         complete: false,
//         primaryButton: {
//             content: "Add product",
//             props: {
//                 url: "https://www.example.com",
//                 external: true,
//             },
//         },
//         secondaryButton: {
//             content: "Import products",
//             props: {
//                 url: "https://www.example.com",
//                 external: true,
//             },
//         },
//     },
//     {
//         id: 1,
//         title: "Share your online store",
//         description:
//             "Drive awareness and traffic by sharing your store via SMS and email, and on communities like Instagram, TikTok, Facebook, and Reddit.",
//         image: {
//             url: "https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/onboarding/detail-images/home-onboard-share-store-b265242552d9ed38399455a5e4472c147e421cb43d72a0db26d2943b55bdb307.svg",
//             alt: "Illustration showing an online storefront with a 'share' icon",
//         },
//         complete: false,
//         primaryButton: {
//             content: "Copy store link",
//             props: {
//                 onAction: () => console.log("Copied store link!"),
//             },
//         },
//     },
//     {
//         id: 2,
//         title: "Translate your store",
//         description:
//             "Translating your store improves cross-border conversion. Add languages for localized browsing, notifications, and checkout.",
//         image: {
//             url: "https://cdn.shopify.com/b/shopify-guidance-dashboard-public/nqjyaxwdnkg722ml73r6dmci3cpn.svgz",
//         },
//         complete: false,
//         primaryButton: {
//             content: "Add a language",
//             props: {
//                 url: "https://www.example.com",
//                 external: true,
//             },
//         },
//     },
// ];
// const staticRows = new Array(5).fill(null).map((_, i) => ({
//     id: i + 1,
//     product: {
//         image: "https://the-fitness-outlet.de/cdn/shop/products/Core-Champs-Whey-66-Servings-Vanilla-Banner_870x1131_cb0ffc04-40e9-412d-81ff-2b52b4168b5d.png?v=1710342083&width=1800",
//         title: `Product ${String.fromCharCode(65 + i)}`,
//         Price: `100`,
//     },
//     currency: `CUC`,
//     total: Math.floor(Math.random() * 200),
// }));
// const dateOptions = [
//     { label: "7 days", value: { startDate: moment().subtract(6, "days").toDate(), endDate: moment().toDate() } },
//     { label: "30 days", value: { startDate: moment().subtract(29, "days").toDate(), endDate: moment().toDate() } },
//     { label: "90 days", value: { startDate: moment().subtract(89, "days").toDate(), endDate: moment().toDate() } },
//     { label: "Lifetime", value: { startDate: '', endDate: '' } },
// ];

// function Dashboard() {
//     const [showGuide, setShowGuide] = useState(true);
//     const [popoverActive, setPopoverActive] = useState(false);
//     const [items, setItems] = useState(ITEMS);
//     const [selected, setSelected] = useState(0);
//     const [selectedLabel, setSelectedLabel] = useState("7 days");
//     // let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     // let dayName = days[new Date().getDay()];
//     // let hours = new Date().getHours();
//     const shopDetails = useSelector((state) => state.shopDetails)
//     const dispatch = useDispatch();
//     const onRemoveBanner = async (name) => {
//         const payload = {
//             banner_display_setting: { ...shopDetails.bannerDisplaySetting, [name]: "true" },
//             id: shopDetails.id
//         }
//         dispatch(Shop_details({
//             ...shopDetails,
//             bannerDisplaySetting: { ...shopDetails.bannerDisplaySetting, [name]: "true" }
//         }));
//         await apiService.updateShopDisplayBanner(payload)
//     }
//     const fetchextensionStatus = async () => {
//         const extResponse = await apiService.ExtensionStatus({});
//         dispatch(Shop_details({
//             ...shopDetails,
//             extension_status: extResponse.data.isEnabledExtension,
//         }));
//     }
//     useEffect(() => {
//         fetchextensionStatus()
//     }, [])
//     const onStepComplete = async (id) => {
//         try {
//             await new Promise((res) => setTimeout(res, 1000));
//             setItems((prev) =>
//                 prev.map((item) => (item.id === id ? { ...item, complete: !item.complete } : item))
//             );
//         } catch (e) {
//             console.error(e);
//         }
//     };
//     if (!showGuide) return <Button onClick={() => setShowGuide(true)}>Show Setup Guide</Button>;
//     const handleTabChange = (selectedTabIndex) => setSelected(selectedTabIndex);
//     const tabs = [
//         {
//             id: 'all-customers-1',
//             content: 'Top Wishlist Products',
//             panelID: 'all-customers-content-1',
//         },
//         {
//             id: 'accepts-marketing-1',
//             content: 'Top Back In Stock Products',
//             panelID: 'accepts-marketing-content-1',
//         },
//     ];
//     return (
//         <Fragment>
//             <Page
//                 title={`Welcome to the Dashboard, ${shopDetails.store_name}`}
//                 primaryAction={
//                     <Button onClick={() => window.Featurebase('manually_open_changelog_popup')}>
//                         {Icons.announcement}
//                     </Button>
//                 }
//             >
//                 <BlockStack gap={400} >
//                     <Box padding={'0'}>
//                         <Notifications />
//                     </Box>
//                     <CalloutCard
//                         title="Free setup assistance"
//                         illustration="https://subscriptionstaging.webcontrive.com/admin-test/static/media/SetupAssistance.5ad74856d4d3cb55c870.webp"
//                         primaryAction={{ content: 'Schedule a meeting with us' }}
//                         onDismiss={() => { }}
//                     >
//                         <p>Schedule a meeting to get help with setup, styling, or any questions.</p>
//                     </CalloutCard>

//                     <Text variant="headingMd" fontWeight='bold'>Performance  </Text>
//                     <Card padding={'0'}>
//                         <div className={"d-flex"}>
//                             <Box
//                                 minWidth="130px"
//                                 width="130px"
//                                 height="70px"
//                                 padding="300"
//                                 borderInlineEndWidth="025"
//                                 borderStyle="solid"
//                                 borderColor="border-secondary"
//                             >
//                                 <Popover
//                                     active={popoverActive}
//                                     className="d-flex m-auto"
//                                     onClose={() => setPopoverActive(false)}
//                                     activator={
//                                         <div className="d-flex align-items-center justify-center m-3">
//                                             <Button
//                                                 variant="monochromePlain"
//                                                 icon={CalendarIcon}
//                                                 onClick={() => setPopoverActive(!popoverActive)}
//                                             >
//                                                 {selectedLabel}
//                                             </Button>
//                                         </div>
//                                     }
//                                 >
//                                     <BlockStack style={{ margin: 12, display: 'block' }} >
//                                         {dateOptions.map((option, index) => (
//                                             <RadioButton className="m-3"
//                                                 key={index}
//                                                 label={option.label}
//                                                 checked={selectedLabel === option.label}
//                                                 onChange={() => setSelectedLabel(option.label)}
//                                                 helpText={
//                                                     option.label === "Lifetime"
//                                                         ? "Compared to the Lifetime"
//                                                         : `Compared to the previous ${option.label}`
//                                                 }
//                                             />
//                                         ))}
//                                     </BlockStack>
//                                 </Popover>
//                             </Box>

//                             <Scrollable shadow vertical={false} horizontal
//                                 className="d-flex dashboard-flex align-items-center justify-between w-100"
//                                 scrollbarWidth={"thin"}>
//                                 {[...Array(4)].map((_, index) => (
//                                     <Box key={index} minWidth="155px" paddingInline="300">
//                                         <Box
//                                             paddingBlock="200"
//                                             paddingInline="300"
//                                             borderStyle="solid"
//                                             borderColor="border-secondary"
//                                         >
//                                             <BlockStack gap="150">
//                                                 <Text variant="headingXs" tone="subdued" fontWeight="medium" as="h2">
//                                                     <Tooltip content="Metric tooltip" hasUnderline dismissOnMouseOut>
//                                                         <Text as="span">Metric {index + 1}</Text>
//                                                     </Tooltip>
//                                                 </Text>
//                                                 <InlineStack gap="200" wrap={false} blockAlign="center">
//                                                     <Text variant="headingMd">123</Text>
//                                                     <Box>
//                                                         <Box width="10px" minHeight="2px" background="bg-fill-secondary-active" />
//                                                     </Box>
//                                                 </InlineStack>
//                                             </BlockStack>
//                                         </Box>
//                                     </Box>
//                                 ))}
//                             </Scrollable>
//                         </div>
//                     </Card>
//                     <Text variant="headingMd" fontWeight='bold'>Get started with Wishlist</Text>
//                     <Card padding={'0'}>
//                         <SetupGuide
//                             onDismiss={() => {
//                                 setShowGuide(false);
//                                 setItems(ITEMS);
//                             }}
//                             onStepComplete={onStepComplete}
//                             items={items}
//                         />
//                     </Card>
//                     <InlineGrid columns={{ xs: 1, sm: 1, md: 1, lg: 1 }} gap={'300'}>
//                         <Suspense
//                             fallback={
//                                 <Box padding="400" display="flex" alignItems="center" justifyContent="center">
//                                     <Spinner size="large" />
//                                 </Box>
//                             }
//                         >
//                             <Card padding={"0"}>
//                                 <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
//                                 <TopProducts topProducts={staticRows} />
//                             </Card>
//                         </Suspense>
//                     </InlineGrid>
//                     <HelpDesk />
//                     {/* {shopDetails && shopDetails.bannerDisplaySetting['share_feedback'] != 'true' ? ( */}
//                     {/* <Layout.Section> */}
//                     {
//                         shopDetails && shopDetails.bannerDisplaySetting["share_feedback"] !== "true" ?
//                             <Feedback onRemoveBanner={onRemoveBanner} />
//                             : ""
//                     }
//                     {/* </Layout.Section> */}
//                     {/* ) : (
//                         ''
//                     )} */}
//                 </BlockStack>
//             </Page >
//         </Fragment >
//     );
// }

// export default Dashboard; 