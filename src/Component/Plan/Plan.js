import React, {Fragment, useEffect, useState} from 'react';
import {
    Page, Layout, ProgressBar, Button, Banner, Text, BlockStack, InlineStack, Card, Icon,
    Select, Grid, IndexTable, Box, Badge,Modal,
} from "@shopify/polaris";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {Icons} from "../../utils/Icons";
import {apiService, baseUrl, capitalizeMessage, openUrlInNewWindow} from "../../utils/Constant";
import {Shop_details} from "../../redux/action/action";
import {useNavigate} from "react-router-dom";
import {MinusMinor} from "@shopify/polaris-icons";
import ToastMessage from "../Comman/ToastMessage";

const minusIcon = <Icon source={MinusMinor}/>;

const Plan = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState("");
    const shopDetails = useSelector(state => state.shopDetails);
    const navigate = useNavigate();
    const [isEmailPlan, setIsEmailPlan] = useState("");
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isErrorServer, setIsErrorServer] = useState(false);
    const [billingData, setBillingData] = useState([]);
    const [activeEmailPlan, setActiveEmailPlan] = useState({});
    const [isPlan, setIsPlan] = useState();
    const [downgradeModal, setDowngradeModal] = useState(false);

    const onCloseModel = () => {
        setIsPlan('')
        setDowngradeModal(false);
    }

    const onPlanClickButton = (i) => {
        if (shopDetails && shopDetails.plan_type > i) {
            setIsPlan(i);
            setDowngradeModal(true);
        } else {
            onUpdatePlan(i);
        }
    };



    useEffect(() => {
        const getBilling = async () => {
            const response = await apiService.getBilling();
            if (response.status === 200) {
                setIsError(false);
                const activeObject = response.data.find((x) => x.is_active === 1);
                setActiveEmailPlan(activeObject);
                setBillingData(response.data);
            } else if (response.status === 500) {
                setMessage(capitalizeMessage(response.message))
                setIsErrorServer(true);
            }
        }
        getBilling();
    }, []);

    const onUpdatePlan = async (planType) => {
        setIsLoading(planType)
        const response = await apiService.upgradePlan({planType: planType, plan_interval: "0"})
        if (response.status === 200) {
            if (planType === "1") {
                dispatch(Shop_details({...shopDetails, plan_type: planType}));
                setIsLoading("")
            }
            if (response && response.data && response.data.confirmation_url) {
                openUrlInNewWindow(response.data.confirmation_url, '_top');
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
    } else if (shopDetails.plan_type === "9") {
        productPercent = (shopDetails.sent_email * 100 / 100)
    }
    const plan = [
        (shopDetails.plan_type === "1") ?  {
            plan: "Free",
            planType: "1",
            price: "0",
            btn_text: "Downgrade"

        } : "",
        {plan: "Basic", planType: "5", price: "4.99", btn_text: "Activated"},
        {plan: "Pro", planType: "6", price: "9.99", btn_text: "Upgrade"},
        {plan: "Advance", planType: "7", price: "14.99", btn_text: "Upgrade"},
        {plan: "Enterprise", planType: "8", price: "24.99", btn_text: "Upgrade"},
    ]

    const planTable = [
        {
            title: 'Email for Price drop, Restock, Wishlist, Back in stock',
            free: (shopDetails.plan_type === "1") ? "50" : "",
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
            title: 'Import/Export Back in Stock',
            free: false,
            basic: false,
            pro: false,
            advance: false,
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
        {
            title: 'Feature Customization',
            free: false,
            basic: false,
            pro: false,
            advance: false,
            enterprise: true,
        },
        {
            title: 'Klaviyo Integration',
            free: false,
            basic: false,
            pro: false,
            advance: false,
            enterprise: true,
        },

    ];

    const emailPlan = [
        {label: "Buy 1000 Emails at $2", value: "1000"},
        {label: "Buy 2000 Emails at $4", value: "2000"},
        {label: "Buy 3000 Emails at $6", value: "3000"},
        {label: "Buy 4000 Emails at $8", value: "4000"},
        {label: "Buy 5000 Emails at $10", value: "5000"},
    ];
    const emailPrice = {"1000": "2", "2000": "4", "3000": "6", "4000": "8", "5000": "10"};

    const onUpdateEmailPlan = async (emails, price) => {
        setIsEmailLoading(true);
        const payload = {emails: emails, price: price}
        const response = await apiService.upgradeEmailPlan(payload);
        if (response.status === 200) {
            if (response && response.data && response.data.confirmation_url) {
                openUrlInNewWindow(response.data.confirmation_url, '_top');
            }
        }
        setIsEmailLoading(false);
    }

    const resourceNameBillingData = {singular: 'billing', plural: 'billing'};

    const rowMarkupBillingData = (billingData || []).map((x, i) => (
            <IndexTable.Row key={i}>
                <IndexTable.Cell>
                    <Text as="span">{moment(x.created_at).format('YY-MM-DD')}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span">${x.price}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span">{x.emails}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span">{x.recurring_emails}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span">{x.total_emails}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span">{x.used_emails}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Badge
                        tone={x.is_active === 1 ? "success" : "attention"}>{x.is_active === 1 ? "Active" : "Inactive"}</Badge>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    const newBackInStockPlan = () => {
        return (
            <div className="planpriceWrap">
                <ul className="PlanPriceList ">
                    {/*<li className="ppl_item">*/}
                    {/*    <div className="pplLabel">*/}
                    {/*<BlockStack gap={"300"}>*/}
                    {/*    <Text variant="headingLg" as="span">Plans*/}
                    {/*    </Text>*/}
                    {/*    <Text variant="headingLg" as="span">Current Plan*/}
                    {/*        : {(shopDetails.plan_type === "0" || shopDetails.plan_type === "1") ? "Free" : shopDetails.plan_type === "5" ? "Basic" : shopDetails.plan_type === "6" ? "Pro" : shopDetails.plan_type === "7" ? "Advance" : shopDetails.plan_type === "8" ? "Enterprise" : shopDetails.plan_type === "9" ? "Starter" : ""}</Text>*/}
                    {/*    <Text*/}
                    {/*        as={"span"}>{moment(shopDetails?.billing_schedule?.billing_start_date).format("MMMM DD")} - {moment(shopDetails?.billing_schedule?.billing_end_date).format("MMMM DD")}</Text>*/}
                    {/*    <Text as={"span"}>Mail*/}
                    {/*        sent {`${shopDetails.sent_email}/${(shopDetails.plan_type === "0" || shopDetails.plan_type === "1") ? "50" : shopDetails.plan_type === "5" ? "500" : shopDetails.plan_type === "6" ? "2000" : shopDetails.plan_type === "7" ? "5000" : shopDetails.plan_type === "8" ? "10000" : shopDetails.plan_type === "9" ? "100" : ""}`}</Text>*/}
                    {/*    <ProgressBar progress={productPercent} size="small" tone="primary"/>*/}
                    {/*</BlockStack>*/}
                    {/*    </div>*/}
                    {/*    <div className="pplContent">*/}
                    {/*        <div className="row">*/}
                    {/*            {(plan || []).filter((x) => x).map((x, i) => {*/}
                    {/*                const col = shopDetails.plan_type == "1" ? "col col-5" : "col col-4";*/}
                    {/*                return (*/}
                    {/*                    <div className={col} key={i}>*/}
                    {/*                        <BlockStack gap={"300"}>*/}
                    {/*                            <Text variant="headingLg" as="h5">{x.plan}</Text>*/}
                    {/*                            <InlineStack blockAlign={"baseline"} align={"center"}>*/}
                    {/*                                <Text as="span" tone="success"*/}
                    {/*                                      variant="headingXl">${x.price}</Text>*/}
                    {/*                                <Text variant="bodySm" as="span">*/}
                    {/*                                    /month*/}
                    {/*                                </Text>*/}
                    {/*                            </InlineStack>*/}
                    {/*                            <InlineStack align={"center"}>*/}
                    {/*                                <Button variant={"primary"}*/}
                    {/*                                        onClick={() => onUpdatePlan(x.planType)}*/}
                    {/*                                        loading={isLoading == x.planType}*/}
                    {/*                                        disabled={shopDetails.plan_type == x.planType ? true : false}>*/}
                    {/*                                    {shopDetails.plan_type == x.planType ? "Activated" : shopDetails.is_older_shop == 1 ? "Upgrade" : shopDetails.plan_type === "9" ? "Upgrade" : shopDetails.plan_type > x.planType ? "Downgrade" : x.planType === "9" ? "Downgrade" : "Upgrade"}*/}
                    {/*                                </Button>*/}
                    {/*                            </InlineStack>*/}
                    {/*                        </BlockStack>*/}
                    {/*                    </div>*/}
                    {/*                )*/}
                    {/*            })}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</li>*/}
                    {
                        (planTable || []).map((y, j) => {
                            const col = shopDetails.plan_type == "1" ? "col col-5" : "col col-4";
                            return (
                                <li className="ppl_item" key={j}>
                                    <div className="pplLabel">{y.title}</div>
                                    <div className="pplContent">
                                        <div className="row">
                                            {
                                                shopDetails.plan_type == "1" ? <div
                                                    className={col}>{(y.free === true || y.free === false) ?
                                                    <span
                                                        className="icons">{y.free === true ? Icons.verifiedIcon : minusIcon}</span> : y.free}
                                                </div> : ""
                                            }

                                            <div className={col}>{y.basic === true || y.basic === false ?
                                                <span
                                                    className="icons">{y.basic === true ? Icons.verifiedIcon : minusIcon}</span> : `${y.basic}/Month`}</div>
                                            <div className={col}>{(y.pro === true || y.pro === false) ?
                                                <span
                                                    className="icons">{y.pro === true ? Icons.verifiedIcon : minusIcon}</span> : `${y.pro}/Month`}</div>
                                            <div
                                                className={col}>{(y.advance === true || y.advance === false) ?
                                                <span
                                                    className="icons">{y.advance === true ? Icons.verifiedIcon : minusIcon}</span> : `${y.advance}/Month`}</div>
                                            <div
                                                className={col}>{(y.enterprise === true || y.enterprise === false) ?
                                                <span
                                                    className="icons">{y.enterprise === true ? Icons.verifiedIcon : minusIcon}</span> : `${y.enterprise}/Month`}</div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }

    return (
        <Fragment>
            <Modal open={downgradeModal} titleHidden onClose={onCloseModel}>
                <Modal.Section>
                    <BlockStack gap={"500"}>
                        <Text as={"span"} variant={"headingLg"} alignment={"center"}>
                            {`Plan Downgrade Impact`}
                        </Text>
                        <Text as={"span"} variant={"bodyMd"} alignment={"center"}>
                            {`By downgrading from the your current plan, you may lose access to certain features and integrations. Each plan has different email notification limits, and any active integrations may be deactivated. Please ensure you understand these changes before proceeding with the downgrade.`}
                        </Text>
                        <InlineStack align={"center"} gap={"200"}>
                            <Button size={"large"} onClick={onCloseModel}>Cancel</Button>
                            <Button size={"large"} loading={isLoading == isPlan} variant={"primary"}
                                    onClick={() => onUpdatePlan(isPlan)}>Downgrade</Button>
                        </InlineStack>
                    </BlockStack>
                </Modal.Section>
            </Modal>


            <Page title={"Plan & Price"}
                  backAction={shopDetails.plan_type === "1" || shopDetails.is_older_shop == 1 ? "" : {
                      content: 'BAckInStock', onAction: () => navigate(`${baseUrl}/settings`)
                  }}>
                <Layout>
                    {message !== "" && isError === false ?
                        <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                                      setIsErrorServer={setIsErrorServer}/> : ""}
                    {shopDetails.is_older_shop == 1 ? <Layout.Section><Banner title="Update your plan" tone="warning">
                        <p>
                            Please revise your plan by or before September 30th 2023. Failure to do so will result in
                            the app's backend and frontend functionality being disabled.
                        </p>
                    </Banner></Layout.Section> : ""}
                    <Layout.Section variant={"fullWidth"}>
                        <BlockStack gap={"200"}>
                            <div className="planpriceWrap plan-header">
                                <ul className="PlanPriceList ">
                                    <li className="ppl_item">
                                        <div className="pplLabel">
                                            <Card>
                                                <BlockStack gap={"200"}>
                                                    <Text variant="headingLg" as="span">Current Plan
                                                        : {shopDetails.plan_type === "1" ? "Free" : shopDetails.plan_type === "5" ? "Basic" : shopDetails.plan_type === "6" ? "Pro" : shopDetails.plan_type === "7" ? "Advance" : shopDetails.plan_type === "8" ? "Enterprise" : shopDetails.plan_type === "9" ? "Starter" : ""}
                                                    </Text>
                                                    <Text
                                                        as={"span"}>{moment(shopDetails?.billing_schedule?.billing_start_date).format("MMMM DD")} - {moment(shopDetails?.billing_schedule?.billing_end_date).format("MMMM DD")}</Text>
                                                    <Text as={"span"}>Mail
                                                        sent {`${shopDetails.sent_email}/${shopDetails.plan_type === "1" ? "50" : shopDetails.plan_type === "5" ? "500" : shopDetails.plan_type === "6" ? "2000" : shopDetails.plan_type === "7" ? "5000" : shopDetails.plan_type === "8" ? "10000" : shopDetails.plan_type === "9" ? "100" : ""}`}</Text>
                                                    <ProgressBar progress={productPercent} size="small" tone="primary"/>
                                                    {activeEmailPlan && activeEmailPlan.is_active === 1 &&
                                                    <Text as={"span"}>Addon
                                                        Mail {`${activeEmailPlan.used_emails}/${activeEmailPlan.total_emails}`}</Text>
                                                    }
                                                </BlockStack>
                                            </Card>
                                        </div>
                                        <div className="pplContent">
                                            <div className="row">
                                                {(plan || []).filter((x) => x).map((x, i) => {
                                                    const col = shopDetails.plan_type == "1" ? "col col-5" : "col col-4";

                                                    return (
                                                        <div className={col}>
                                                            <Card key={i}>
                                                                <BlockStack
                                                                    gap={activeEmailPlan && activeEmailPlan.is_active === 1 ? "800" : "500"}>
                                                                    <Text variant="headingLg" as="h5"
                                                                          alignment={"center"}>{x.plan}</Text>
                                                                    <InlineStack blockAlign={"baseline"}
                                                                                 align={"center"} wrap={false}>
                                                                        <Text as="span" tone="success"
                                                                              variant="headingLg">${x.price}</Text>
                                                                        <Text variant="bodySm" as="span">
                                                                            /month
                                                                        </Text>
                                                                    </InlineStack>
                                                                    <InlineStack align={"center"}>
                                                                        <Button variant={"primary"}
                                                                                onClick={() => onPlanClickButton(x.planType)}
                                                                                loading={isLoading == x.planType}
                                                                                disabled={shopDetails.plan_type == x.planType ? true : false}>
                                                                            {shopDetails.plan_type == x.planType ? "Activated" : shopDetails.is_older_shop == 1 ? "Upgrade" : shopDetails.plan_type === "9" ? "Upgrade" : shopDetails.plan_type > x.planType ? "Downgrade" : x.planType === "9" ? "Downgrade" : "Upgrade"}
                                                                        </Button>
                                                                    </InlineStack>
                                                                </BlockStack>
                                                            </Card>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            {newBackInStockPlan()}

                            <Card padding={"025"} roundedAbove={false}>
                                <Box padding={"400"}>
                                    <BlockStack gap={"300"} align={"start"}>
                                        <BlockStack gap={"150"}>
                                            <Text as={"span"} variant={"headingMd"}>{"Add-on email"}</Text>
                                            <Text as={"span"} variant={"bodySm"}>
                                                {"If you’re nearing 80% of your current email notification limit, consider purchasing an AddOn to continue sending emails without interruption. Our AddOns offer extra email notifications at a one-time cost for life time, ensuring your communications remain uninterrupted. Please note that AddOns are non-refundable."}
                                            </Text>
                                        </BlockStack>


                                        <Grid>
                                            <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 9, xl: 9}}>
                                                <Select
                                                    label={<Text
                                                        variant={"headingSm"}>{"Here are the available AddOn options:"}</Text>}
                                                    placeholder={"Select plan"}
                                                    value={isEmailPlan} options={emailPlan}
                                                    onChange={(value) => setIsEmailPlan(value)}/>
                                            </Grid.Cell>
                                            <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 3, xl: 3}}>
                                                <div style={{paddingTop: "25px"}}>
                                                    <Button variant={"primary"} loading={isEmailLoading}
                                                            disabled={isEmailPlan === ""}
                                                            onClick={() => onUpdateEmailPlan(isEmailPlan, emailPrice[isEmailPlan])}>{"Buy now"}</Button>
                                                </div>
                                            </Grid.Cell>
                                        </Grid>
                                    </BlockStack>
                                </Box>

                                {billingData && billingData?.length > 0 &&
                                <IndexTable
                                    resourceName={resourceNameBillingData}
                                    itemCount={billingData.length}
                                    headings={[
                                        {title: 'Date'},
                                        {title: 'Price'},
                                        {title: 'Emails Limit'},
                                        {title: 'Recurring Emails'},
                                        {title: 'Total Emails'},
                                        {title: 'Used Emails'},
                                        {title: 'Status'},
                                    ]}
                                    selectable={false}>
                                    {rowMarkupBillingData}
                                </IndexTable>
                                }
                            </Card>
                        </BlockStack>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

export default Plan;