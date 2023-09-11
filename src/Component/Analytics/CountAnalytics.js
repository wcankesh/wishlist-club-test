import React, {Fragment, useEffect, useState} from 'react';
import {LegacyCard, LegacyStack, Text, Layout} from "@shopify/polaris";
import moment from "moment";
import {apiService, currencySymbol} from "../../utils/Constant";


const initialState = {
    wishlistOrderAmount: 0,
    wishlistPageView: 0,
    totalItem: 10,
    totalWishlist: 5,
    totalUniqueItem: 8,
    cartProduct: 0,
    wishlistOrder: 0,
}
const CountAnalytics = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState({startDate: moment().subtract(29, 'days'), endDate: moment(),});
    const [analytics, SetAnalytics] = useState(initialState);
    const [currency, setCurrency] = useState("INR");

    useEffect(() => {
        const getAnalytics = async () => {
            setIsLoading(true);
            const payload = {
                start_date: moment(state.startDate).format("YYYY-MM-DD"),
                end_date: moment(state.endDate).format("YYYY-MM-DD")
            }
            const response = await apiService.Analytics(payload);
            if (response.status === 200) {
                SetAnalytics(response.data)
                setCurrency(response.data.currency);
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        }
        getAnalytics();
    }, []);

    const analyticsCard = [
        {
            analytics1: [
                {
                    title: "Wishlist Page View",
                    value: analytics.wishlistPageView
                },
                {
                    title: "Total Items In Wishlist",
                    value: analytics.totalItem
                },
                {
                    title: "Total Customers in Wishlist",
                    value: analytics.totalWishlist
                },
            ],
            analytics2: [
                {
                    title: "Unique Product In Wishlist",
                    value: analytics.totalUniqueItem
                },
                {
                    title: "Order From Wishlist",
                    value: analytics.cartProduct
                },
                {
                    title: "Cart From Wishlist",
                    value: analytics.wishlistOrder
                },]
        },

    ]

    return (
        <Fragment>
            <Layout.Section>
                <LegacyStack alignment="center" distribution="fill">
                    <LegacyStack.Item>
                        <LegacyCard sectioned>
                            <br/><br/><br/>
                            <Text as={"h6"} alignment={"center"} variant={"headingSm"} color={"subdued"}>Revenue
                                Generated</Text>
                            <Text as={"h3"} alignment={"center"}
                                  variant={"headingLg"}>{currencySymbol[currency]}{analytics.wishlistOrderAmount ? analytics.wishlistOrderAmount : 0}</Text>
                            <br/><br/>
                        </LegacyCard>
                    </LegacyStack.Item>

                    <LegacyStack.Item>
                        {
                            (analyticsCard || []).map((x, i) => {
                                return (
                                    <LegacyStack vertical key={i}>
                                        <LegacyStack.Item >
                                            <LegacyStack distribution={"fillEvenly"}>
                                                {(x.analytics1 || []).map((y, j) => {
                                                    return (
                                                        <LegacyStack.Item key={j}>
                                                            <LegacyCard sectioned>
                                                                <Text variant={"headingSm"} as={"h6"}
                                                                      color={"subdued"}>
                                                                    {y.title}
                                                                </Text>
                                                                <Text variant={"headingLg"} as={"h3"}>
                                                                    {y.value ? y.value : 0}
                                                                </Text>
                                                            </LegacyCard>
                                                        </LegacyStack.Item>
                                                    )
                                                })
                                                }
                                            </LegacyStack>
                                        </LegacyStack.Item>
                                        <LegacyStack.Item>
                                            <LegacyStack distribution={"fillEvenly"}>
                                                {(x.analytics2 || []).map((z, k) => {
                                                    return (
                                                        <LegacyStack.Item key={k}>
                                                            <LegacyCard sectioned>
                                                                <Text variant={"headingSm"} as={"h6"}
                                                                      color={"subdued"}>
                                                                    {z.title}
                                                                </Text>
                                                                <Text variant={"headingLg"} as={"h3"}>
                                                                    {z.value ? z.value : 0}
                                                                </Text>
                                                            </LegacyCard>
                                                        </LegacyStack.Item>
                                                    )
                                                })
                                                }
                                            </LegacyStack>
                                        </LegacyStack.Item>
                                    </LegacyStack>
                                )
                            })
                        }
                    </LegacyStack.Item>
                </LegacyStack>
            </Layout.Section>
        </Fragment>
    );
};

export default CountAnalytics;