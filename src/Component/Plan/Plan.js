import React, {Fragment, useState} from 'react';
import {Page, Layout, ProgressBar, Button, Banner, Grid, Text, BlockStack, InlineStack, Card} from "@shopify/polaris";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {Icons} from "../../utils/Icons";
import {apiService, baseUrl} from "../../utils/Constant";
import {Shop_details} from "../../redux/action/action";
import {useNavigate} from "react-router-dom";

const Plan = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState("");
    const shopDetails = useSelector(state => state.shopDetails);
    const navigate = useNavigate();
    const onUpdatePlan = async (planType) => {
        setIsLoading(planType)
        const response = await apiService.upgradePlan({planType: planType, plan_interval: "0"})
        if (response.status === 200) {
            if (planType === "1") {
                dispatch(Shop_details({...shopDetails, plan_type: planType}));
                setIsLoading("")
            }
            if (response && response.data && response.data.confirmation_url) {
                window.open(response.data.confirmation_url, '_top');
            }
        } else {
            setIsLoading("")
        }
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
    }
    const plan = [
        {
            plan: "Free",
            planType: "1",
            price: "0",
            btn_text: "Downgrade"

        },
        {
            plan: "Basic",
            planType: "5",
            price: "4.99",
            btn_text: "Activated"

        },
        {
            plan: "Pro",
            planType: "6",
            price: "9.99",
            btn_text: "Upgrade"

        },
        {
            plan: "Advance",
            planType: "7",
            price: "14.99",
            btn_text: "Upgrade"

        },
        {
            plan: "Plus",
            planType: "8",
            price: "19.99",
            btn_text: "Upgrade"
        },
    ]

    const planTable = [
        {
            title: 'Email for Price drop, Restock, Wishlist, Back in stock',
            free: "50",
            basic: "500",
            pro: "2000",
            advance: "5000",
            enterprise: "10000"
        },
        {
            title: 'Unlimited Wishlist',
            free: true,
            basic: true,
            pro: true,
            advance: true,
            enterprise: true,
        },
        {
            title: 'Back In Stock',
            free: true,
            basic: true,
            pro: true,
            advance: true,
            enterprise: true,
        },
        {
            title: 'Share Wishlist',
            free: true,
            basic: true,
            pro: true,
            advance: true,
            enterprise: true,
        },
        {
            title: 'Import/Export Wishlist',
            free: true,
            basic: true,
            pro: true,
            advance: true,
            enterprise: true,
        },
        {
            title: 'Button Customization',
            free: true,
            basic: true,
            pro: true,
            advance: true,
            enterprise: true,
        },
        {
            title: 'Advance Analytics',
            free: true,
            basic: true,
            pro: true,
            advance: true,
            enterprise: true,
        },
        {
            title: 'Email Customization',
            free: true,
            basic: true,
            pro: true,
            advance: true,
            enterprise: true,
        },
        {
            title: 'Guest Wishlist',
            free: true,
            basic: true,
            pro: true,
            advance: true,
            enterprise: true,
        },
        {
            title: 'Multiple Wishlist',
            free: true,
            basic: true,
            pro: true,
            advance: true,
            enterprise: true,
        },
        {
            title: 'Headless Integration',
            free: false,
            basic: false,
            pro: false,
            advance: false,
            enterprise: true,
        },

    ];

    const newBackInStockPlan = () => {
        return (
            <Fragment>
                <Layout.Section>
                    <Grid>
                        <Grid.Cell columnSpan={{xs: 6, sm: 2, md: 2, lg: 4, xl: 2}}>
                            <Card padding={"500"}>
                                <BlockStack gap={"400"}>
                                    <Text as={"h4"} variant={"headingLg"} fontWeight={"semibold"}>Current Plan
                                        :{(shopDetails.plan_type === "0" || shopDetails.plan_type === "1") ? "Free" : shopDetails.plan_type === "5" ? "Basic" : shopDetails.plan_type === "6" ? "Pro" : shopDetails.plan_type === "7" ? "Advance" : shopDetails.plan_type === "8" ? "Plus" : ""}</Text>
                                    <Text>{moment(shopDetails?.billing_schedule?.billing_start_date).format("MMMM DD")} - {moment(shopDetails?.billing_schedule?.billing_end_date).format("MMMM DD")}</Text>
                                    <Text as={"span"}>Mail
                                        sent {`${shopDetails.sent_email}/${(shopDetails.plan_type === "0" || shopDetails.plan_type === "1") ? "50" : shopDetails.plan_type === "5" ? "500" : shopDetails.plan_type === "6" ? "2000" : shopDetails.plan_type === "7" ? "5000" : shopDetails.plan_type === "8" ? "10000" : ""}`}</Text>
                                    <ProgressBar progress={productPercent} size="small" tone="primary"/>
                                </BlockStack>
                            </Card>
                        </Grid.Cell>
                        {(plan || []).map((x, i) => {
                            return (
                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 2, lg: 4, xl: 2}}>
                                    <Card padding={"500"}>
                                        <BlockStack gap={"400"}>
                                            <Text as={"h4"} variant={"headingLg"} fontWeight={"semibold"}
                                                  alignment={"center"}>{x.plan}</Text>
                                            <div>
                                                <Text as={"h1"} variant={"headingXl"} alignment={"center"}>
                                                    <Text as={"span"} variant={"bodyLg"}><sup>$</sup></Text>
                                                    {x.price}
                                                    <Text as={"span"}
                                                          variant={"bodyLg"}><sub>/month</sub></Text>
                                                </Text>
                                            </div>

                                            <InlineStack align={"center"}>
                                                <Button
                                                    variant={"primary"}
                                                    onClick={() => onUpdatePlan(x.planType)}
                                                    loading={isLoading == x.planType}
                                                    disabled={shopDetails.plan_type == x.planType ? true : false}>
                                                    {shopDetails.plan_type == x.planType ? "Activated" : shopDetails.is_older_shop == 1 ? "Upgrade" : shopDetails.plan_type < x.planType ? "Upgrade" : "Downgrade"}
                                                </Button>
                                            </InlineStack>
                                        </BlockStack>
                                    </Card>
                                </Grid.Cell>
                            )
                        })}
                    </Grid>
                </Layout.Section>
                <Layout.Section>
                    <Card padding={"0"}>
                        <div className="planpriceWrap">
                            <ul className="PlanPriceList ">
                                {
                                    (planTable || []).map((y, j) => {
                                        return (
                                            <li className="ppl_item" key={j}>
                                                <div className="pplLabel">{y.title}</div>
                                                <div className="pplContent">
                                                    <div className="row">
                                                        <div
                                                            className="col col-5">{(y.free === true || y.free === false) ?
                                                            <span
                                                                className="icons">{y.free === true ? Icons.rightIcon : Icons.cancelIcon}</span> : y.free}</div>
                                                        <div
                                                            className="col col-5">{y.basic === true || y.basic === false ?
                                                            <span
                                                                className="icons">{y.basic === true ? Icons.rightIcon : Icons.cancelIcon}</span> : y.basic}</div>
                                                        <div
                                                            className="col col-5">{(y.pro === true || y.pro === false) ?
                                                            <span
                                                                className="icons">{y.pro === true ? Icons.rightIcon : Icons.cancelIcon}</span> : y.pro}</div>
                                                        <div
                                                            className="col col-5">{(y.advance === true || y.advance === false) ?
                                                            <span
                                                                className="icons">{y.advance === true ? Icons.rightIcon : Icons.cancelIcon}</span> : y.advance}</div>
                                                        <div
                                                            className="col col-5">{(y.enterprise === true || y.enterprise === false) ?
                                                            <span
                                                                className="icons">{y.enterprise === true ? Icons.rightIcon : Icons.cancelIcon}</span> : y.enterprise}</div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </Card>
                </Layout.Section>
            </Fragment>
        )
    }
    return (
        <Fragment>
            <Page title={"Plan & Price"} fullWidth backAction={shopDetails.plan_type == "0" || shopDetails.is_older_shop == 1 ? "" :{content: 'BAckInStock', onAction: () => navigate(`${baseUrl}/settings`)}}>
                <Layout>
                    {shopDetails.is_older_shop == 1 ? <Layout.Section><Banner
                        title="Update your plan"
                        tone="warning"
                    >
                        <p>
                            Please revise your plan by or before September 30th 2023. Failure to do so will result in
                            the app's backend and frontend functionality being disabled.
                        </p>
                    </Banner></Layout.Section> : ""}
                    {newBackInStockPlan()}
                </Layout>
            </Page>
        </Fragment>
    );
};

export default Plan;