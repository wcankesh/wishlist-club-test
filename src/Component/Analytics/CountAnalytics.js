import React, {Fragment, useEffect, useState} from 'react';
import {Text, Layout, Card, Grid} from "@shopify/polaris";
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
                    value: analytics.wishlistOrder
                },
                {
                    title: "Cart From Wishlist",
                    value: analytics.cartProduct
                },]
        },

    ]

    return (
        <Fragment>
            <Layout.Section>
                <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 3, xl: 3}}>
                        <Card padding={"500"}>
                            <br/><br/><br/>
                            <Text as={"h6"} alignment={"center"} variant={"headingSm"} fontWeight={"medium"}
                                  tone={"subdued"}>Revenue
                                Generated</Text>
                            <Text as={"h3"} alignment={"center"} fontWeight={"medium"}
                                  variant={"headingLg"}>{currencySymbol[currency]}{analytics.wishlistOrderAmount ? analytics.wishlistOrderAmount : 0}</Text>
                            <br/><br/>
                        </Card>
                    </Grid.Cell>
                    {
                        (analyticsCard || []).map((x, i) => {
                            return (
                                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 9, xl: 9}}>
                                    <Grid>
                                        {(x.analytics1 || []).map((y, j) => {
                                            return (
                                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 2, lg: 4, xl: 4}}>
                                                    <Card key={j} padding={"500"}>
                                                        <Text variant={"headingSm"} as={"h6"}
                                                              tone={"subdued"} fontWeight={"medium"}>
                                                            {y.title}
                                                        </Text>
                                                        <Text variant={"headingLg"} as={"h3"} fontWeight={"medium"}>
                                                            {y.value ? y.value : 0}
                                                        </Text>
                                                    </Card>
                                                </Grid.Cell>
                                            )
                                        })
                                        }

                                        {(x.analytics2 || []).map((z, k) => {
                                            return (
                                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 2, lg: 4, xl: 4}}>
                                                    <Card key={k} padding={"500"}>
                                                        <Text variant={"headingSm"} as={"h6"}
                                                              tone={"subdued"} fontWeight={"medium"}>
                                                            {z.title}
                                                        </Text>
                                                        <Text variant={"headingLg"} as={"h3"} fontWeight={"medium"}>
                                                            {z.value ? z.value : 0}
                                                        </Text>
                                                    </Card>
                                                </Grid.Cell>
                                            )
                                        })
                                        }
                                    </Grid>
                                </Grid.Cell>
                            )
                        })
                    }

                </Grid>

            </Layout.Section>
        </Fragment>
    );
};

export default CountAnalytics;