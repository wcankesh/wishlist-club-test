import React, {Fragment, useState} from 'react';
import {Page, Layout, LegacyCard, LegacyStack, ProgressBar, Button, Banner, Text,} from "@shopify/polaris";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {Icons} from "../../../utils/Icons";
import {apiService} from "../../../utils/Constant";
import {Shop_details} from "../../../redux/action/action";

export default function Plan(){
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState("");
    const shopDetails = useSelector(state => state.shopDetails);

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
    if (shopDetails.plan_type === "0") {
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
            plan: "Enterprise",
            planType: "8",
            price: "19.99",
            btn_text: "Uprade"

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
        },
        {
            title: 'Back In Stock',
        },
        {
            title: 'Share Wishlist',
        },
        {
            title: 'Import/Export Wishlist',
        },
        {
            title: 'Button Customization',
        },
        {
            title: 'Advance Analytics',
        },
        {
            title: 'Email Customization',
        },
        {
            title: 'Guest Wishlist',
        },
        {
            title: 'Multiple Wishlist',
        },

    ];

    const newBackInStockPlan = () => {
        return (
            <Layout>
                <Layout.Section>
                    <LegacyStack distribution={"fill"}>
                        <LegacyCard
                            title={<Text as={"h4"} variant={"headingLg"} fontWeight={"semibold"}>Current Plan :
                                Basic</Text>} sectioned>
                            <LegacyStack vertical>
                                <Text>{moment(shopDetails?.billing_schedule?.billing_start_date).format("MMMM DD")} - {moment(shopDetails?.billing_schedule?.billing_end_date).format("MMMM DD")}</Text>
                                <Text as={"span"}>Mail
                                    sent {`${shopDetails.sent_email}/${shopDetails.plan_type === "0" ? "50" : shopDetails.plan_type === "5" ? "500" : shopDetails.plan_type === "6" ? "2000" : shopDetails.plan_type === "7" ? "5000" : shopDetails.plan_type === "8" ? "10000" : ""}`}</Text>
                                <ProgressBar progress={productPercent} size="small" color={"success"}/>
                            </LegacyStack>
                        </LegacyCard>
                        {(plan || []).map((x, i) => {
                            return (
                                <LegacyStack.Item key={i}>
                                    <LegacyStack distribution={"fillEvenly"}>
                                        <LegacyStack.Item>
                                            <LegacyCard sectioned>
                                                <LegacyStack distribution={"fillEvenly"} vertical>
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

                                                    <LegacyStack distribution={"center"}>
                                                        <Button
                                                            primary
                                                            onClick={() => onUpdatePlan(x.planType)}
                                                            loading={isLoading == x.planType}
                                                            disabled={shopDetails.plan_type == x.planType ? true : false}>
                                                            {shopDetails.plan_type == x.planType ? "Activated" : shopDetails.is_older_shop == 1 ? "Upgrade" : shopDetails.plan_type < x.planType ? "Upgrade" : "Downgrade"}
                                                        </Button>

                                                    </LegacyStack>
                                                </LegacyStack>
                                            </LegacyCard>
                                        </LegacyStack.Item>
                                    </LegacyStack>
                                </LegacyStack.Item>
                            )
                        })}
                    </LegacyStack>
                </Layout.Section>
                <Layout.Section>
                    <LegacyStack.Item>
                        <LegacyCard>
                            <div className="planpriceWrap">
                                <ul className="PlanPriceList ">
                                    {
                                        (planTable || []).map((y, j) => {
                                            return (
                                                <li className="ppl_item" key={j}>
                                                    <div className="pplLabel">{y.title}</div>
                                                    <div className="pplContent">
                                                        <div className="row">
                                                            <div className="col col-5">{y?.free ? y.free :
                                                                <span className="icons">{Icons.rightIcon}</span>}</div>
                                                            <div className='col col-5'>{y?.basic ? y.basic :
                                                                <span className="icons">{Icons.rightIcon}</span>}</div>
                                                            <div className='col col-5'>{y?.pro ? y.pro :
                                                                <span className="icons">{Icons.rightIcon}</span>}</div>
                                                            <div className='col col-5'>{y?.advance ? y.advance :
                                                                <span className="icons">{Icons.rightIcon}</span>}</div>
                                                            <div className='col col-5'>{y?.enterprise ? y.enterprise :
                                                                <span className="icons">{Icons.rightIcon}</span>}</div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }

                                </ul>
                            </div>
                        </LegacyCard>
                    </LegacyStack.Item>
                </Layout.Section>
            </Layout>
        )
    }
    return (
        <Fragment>
            <Page title={"Plan & Price"} fullWidth>
                {shopDetails.is_older_shop == 1 ? <Banner
                    title="Our Plan and Pricing have been updated."
                    status="warning"
                >
                    <p>
                        We kindly request you to upgrade your plan to reflect the new changes.
                    </p>
                </Banner> : ""}
                {newBackInStockPlan()}
            </Page>
        </Fragment>
    );
};
