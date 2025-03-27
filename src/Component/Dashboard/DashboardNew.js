import React, { Fragment, lazy, Suspense, useState } from 'react';
import { Banner, BlockStack, Box, Button, Card, Icon, InlineGrid, InlineStack, Layout, Page, Spinner, Text, useBreakpoints } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import { Shop_details } from "../../redux/action/action";
import { apiService, baseUrl, openUrlInNewWindow } from "../../utils/Constant";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../utils/Icons";
import {
    CartSaleIcon,
    CashDollarIcon,
    ChartDonutIcon,
    OrdersStatusIcon,
    PageHeartIcon,
    PersonSegmentIcon,
    ProductListIcon
} from '@shopify/polaris-icons';
import { CartIcon } from "@shopify/polaris-icons";

const HelpDesk = lazy(() => import('./HelpDesk/HelpDesk'));
const Feedback = lazy(() => import('./Feedback/Feedback'));
const ConformationModal = lazy(() => import('../Comman/ConformationModal'));
const TopProducts = lazy(() => import('../Dashboard/TopProducts/TopProducts'));

const Dashboard = () => {
    const breakpoints = useBreakpoints();
    const [active, setActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayName = days[new Date().getDay()];
    let hours = new Date().getHours();
    const shopDetails = useSelector((state) => state.shopDetails)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [bannerDisplayText, setBannerDisplayText] = useState('');
    const staticRows = new Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        product: {
            image: "https://the-fitness-outlet.de/cdn/shop/products/Core-Champs-Whey-66-Servings-Vanilla-Banner_870x1131_cb0ffc04-40e9-412d-81ff-2b52b4168b5d.png?v=1710342083&width=1800",
            title: `Product ${String.fromCharCode(65 + i)}`,
            Price: `100`,
        },
        currency: `CUC`,
        total: Math.floor(Math.random() * 200),
    }));
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

    const onCloseEmailBanner = () => {
        dispatch(Shop_details({ ...shopDetails, addon_email_notification: false }));
    }

    const handleUpgradeNow = (text) => {
        setActive((prevActive) => !prevActive);
        setBannerDisplayText(text);
    }
    const handleConfirmation = async () => {
        setIsLoading(true);
        const payload = {
            new_wishlist_template: 1,
            new_price_drop_template: 1,
            new_restock_template: 1,
            new_bis_template: 1,
            new_thankyou_template: 1,
        }
        const response = await apiService.templateConfirmation(payload);
        if (response.status === 200) {
            setIsLoading(false);
            setActive((active) => !active);
            await onRemoveBanner(bannerDisplayText);
        } else {
            setIsLoading(false);
            setActive((active) => !active)
        }
    }
    const wishlistAnalyticsData = [
        {
            id: "customers",
            title: "Total Customers",
            description: "Number of customers who have added products to their wishlist.",
            value: 1200,
            icon: PersonSegmentIcon,
        },
        {
            id: "products",
            title: "Wishlisted Products",
            description: "Products that have been added to at least one wishlist.",
            value: 75,
            icon: PageHeartIcon,
        },
        {
            id: "guestWishlist",
            title: "Guest Wishlist Items",
            description: "Wishlist items added by guests without an account.",
            value: 250,
            icon: OrdersStatusIcon,
        },
        {
            id: "potentialEarning",
            title: "Potential Earning",
            description: "Estimated revenue if wishlisted products were purchased.",
            value: "$10,500",
            icon: CashDollarIcon,
        },
        {
            id: "conversionRate",
            title: "Conversion Rate",
            description: "Percentage of wishlist users who made a purchase.",
            value: "15%",
            icon: ChartDonutIcon,
        },
        {
            id: "cartWishlist",
            title: "Wishlisted in Cart",
            description: "Products that were wishlisted and later added to cart.",
            value: 320,
            icon: CartSaleIcon,
        },
    ];


    return (
        <Fragment>
            <Page
                title={`Good ${hours < 12 ? "Morning" : hours >= 12 && hours <= 17 ? "Afternoon" : hours >= 17 && hours <= 24 ? "Evening" : ""} , ${shopDetails?.shop.store_name}`}
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
                {active ? (
                    <Suspense
                        fallback={
                            <Box padding="400" display="flex" alignItems="center" justifyContent="center">
                                <Spinner size="large" />
                            </Box>
                        }
                    >
                        <ConformationModal
                            active={active}
                            onClose={handleUpgradeNow}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            setActive={setActive}
                            isEditor={false}
                            handleConfirmation={handleConfirmation}
                        />
                    </Suspense>
                ) : (
                    ''
                )}
                <Layout>
                    {(shopDetails.shopify_plan === 'affiliate' ||
                        shopDetails.shopify_plan === 'staff' ||
                        shopDetails.shopify_plan === 'plus_partner_sandbox' ||
                        shopDetails.shopify_plan === 'partner_test') &&
                        shopDetails &&
                        shopDetails.bannerDisplaySetting['development_store'] !== 'true' ? (
                        <Layout.Section>
                            <Banner
                                title={"You're currently in the development store."}
                                tone="info"
                                onDismiss={() => onRemoveBanner('development_store')}
                            >
                                <p>
                                    All features are accessible in Dev stores. To access all of our app's features, once you've chosen
                                    your Shopify plan, you'll also need to upgrade our app plan.
                                </p>
                            </Banner>
                        </Layout.Section>
                    ) : (
                        ''
                    )}
                    {/* {shopDetails.extension_status === false &&
                        shopDetails &&
                        shopDetails.bannerDisplaySetting['extension_status'] !== 'true' ? (
                        <Layout.Section>
                            <Banner
                                action={{
                                    content: 'Activate',
                                    onAction: () => openUrlInNewWindow(`https://${shopDetails}/admin/themes/current/editor?context=apps`),
                                }}
                                title={'Activate Wishlist Club App'}
                                tone={'warning'}
                                onDismiss={() => onRemoveBanner('extension_status')}
                            >
                                <Text as={'span'}>
                                    {`Add the wishlist feature to your website. Activate Wishlist Club App Embed.`}
                                </Text>
                            </Banner>
                        </Layout.Section>
                    ) : (
                        ''
                    )} */}
                    {shopDetails.notification.length > 0
                        ? shopDetails.notification.map((x, i) => {
                            return shopDetails && shopDetails.bannerDisplaySetting[x.notification_title.replaceAll(' ', '_')] !== 'true' ? (
                                <Layout.Section key={i}>
                                    <Banner
                                        title={x?.notification_title}
                                        tone={x?.type}
                                        onDismiss={x?.is_close ? () => onRemoveBanner(x?.notification_title.replaceAll(' ', '_')) : null}
                                        action={
                                            x.button_text
                                                ? {
                                                    content: x.button_text,
                                                    onAction: x.is_custom_click
                                                        ? () => handleUpgradeNow(x?.notification_title.replaceAll(' ', '_'))
                                                        : () => navigate(`${baseUrl}/${x.button_link}`),
                                                }
                                                : ''
                                        }
                                    >
                                        <BlockStack gap={'100'}>
                                            <span dangerouslySetInnerHTML={{ __html: x?.notification_description }} />
                                        </BlockStack>
                                    </Banner>
                                </Layout.Section>
                            ) : (
                                ''
                            );
                        })
                        : ''}
                    {shopDetails?.shop.addon_email_notification && (
                        <Layout.Section variant={'fullWidth'}>
                            <Banner
                                title={'Attention: 80% Notification Limit Exceeded of your current plan!'}
                                tone={'warning'}
                                onDismiss={() => onCloseEmailBanner()}
                                action={{
                                    content: 'Upgrade Email Plan',
                                    onAction: () => navigate(`${baseUrl}/settings/plan`),
                                }}
                            >
                                <Text as={'span'}>
                                    {`You’re Nearing your email limit on the current plan. Ensure uninterrupted communication by purchasing AddOn Emails.`}
                                </Text>
                            </Banner>
                        </Layout.Section>
                    )}
                    <Layout.Section variant={'fullWidth'}>
                        <Box paddingInline={breakpoints.smDown ? 400 : 0}>
                            <InlineGrid gap={'300'}>
                                <Text as={'span'} variant={'headingMd'} fontWeight={'bold'}>
                                    {'Analytics'}
                                </Text>
                                <InlineGrid columns={{ xs: 1, sm: 2, md: 3, lg: 3 }} gap={'300'}>
                                    {wishlistAnalyticsData.map((item) => {
                                        return (
                                            <Card key={item.id} sectioned>
                                                <InlineStack align={'start'}>
                                                    <Box>
                                                        <div
                                                            className="icons-box"
                                                            style={{
                                                                width: '48px',
                                                                height: '48px',
                                                                background: '#f4f6f8',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Icon source={item.icon} tone="textSuccess" style={{ width: 50, height: 28 }} />
                                                        </div>
                                                    </Box>
                                                    <Box paddingInlineStart={breakpoints.smUp ? 400 : 200}>
                                                        <Text variant={'headingMd'} as="h3" fontWeight="bold">
                                                            {item.title}
                                                        </Text>
                                                        <Text variant={'bodyLg'} as="h2" fontWeight="bold" tone="success">
                                                            {item.value}
                                                        </Text>
                                                    </Box>
                                                </InlineStack>
                                                <Box paddingBlockStart={300}>
                                                    <Text variant="bodyMd" as="p" tone="subdued">
                                                        {item.description}
                                                    </Text>
                                                </Box>
                                            </Card>
                                        );
                                    })}
                                </InlineGrid>
                                {/* <Banner title="Upgrade to Enterprise Plan for Premium Benefits" tone="info">
                                    <InlineStack align={'start'} gap={200}>
                                        <p>
                                            We offer <b>one-on-one Slack support</b> for Enterprise plan users. Get the{' '}
                                            <b>custom grid design</b> you want, along with <b>faster loading speed</b> for your normal page.
                                        </p>
                                        <Button>Upgrade</Button>
                                    </InlineStack>
                                </Banner> */}
                                <InlineGrid columns={{ xs: 1, sm: 1, md: 1, lg: 2 }} gap={'300'}>
                                    <Suspense
                                        fallback={
                                            <Box padding="400" display="flex" alignItems="center" justifyContent="center">
                                                <Spinner size="large" />
                                            </Box>
                                        }
                                    >
                                        <TopProducts topProducts={staticRows} isLoading={isLoading} />
                                    </Suspense>
                                    <Suspense
                                        fallback={
                                            <Box padding="400" display="flex" alignItems="center" justifyContent="center">
                                                <Spinner size="large" />
                                            </Box>
                                        }
                                    >
                                        <TopProducts topProducts={staticRows} isLoading={isLoading} />
                                    </Suspense>
                                </InlineGrid>
                                <Suspense
                                    fallback={
                                        <Box padding="400" display="flex" alignItems="center" justifyContent="center">
                                            <Spinner size="large" />
                                        </Box>
                                    }
                                >
                                    <HelpDesk />
                                </Suspense>
                            </InlineGrid>
                        </Box>
                    </Layout.Section>
                    <Suspense
                        fallback={
                            <Box padding="400" display="flex" alignItems="center" justifyContent="center">
                                <Spinner size="large" />
                            </Box>
                        }
                    >
                        {shopDetails && shopDetails.bannerDisplaySetting['share_feedback'] != 'true' ? (
                            <Layout.Section>
                                <Feedback onRemoveBanner={onRemoveBanner} />
                            </Layout.Section>
                        ) : (
                            ''
                        )}
                    </Suspense>
                </Layout>
            </Page>
        </Fragment>
    );
};

export default Dashboard;