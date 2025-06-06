import React, {Fragment,} from 'react';
import {Text, Layout, Card, Grid, BlockStack} from "@shopify/polaris";
import {currencySymbol} from "../../utils/Constant";

const CountAnalytics = ({analytics, currency}) => {
    const analyticsCard = [
        {
            analytics1: [
                {title: "Wishlist Page View", value: analytics.wishlistPageView},
                {title: "Total Items In Wishlist", value: analytics.totalItem},
                {title: "Total Customers in Wishlist", value: analytics.totalWishlist},
            ],
            analytics2: [
                {title: "Unique Product In Wishlist", value: analytics.totalUniqueItem},
                {title: "Order From Wishlist", value: analytics.wishlistOrder},
                {title: "Cart From Wishlist", value: analytics.cartProduct},
            ]
        },
    ]

    return (
        <Fragment>
            <Layout.Section>
                <Grid>
                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 3, xl: 3}}>
                        <Card padding={"500"}>
                            <br/><br/><br/>
                            <Text as={"span"} alignment={"center"} variant={"headingSm"} fontWeight={"medium"}
                                  tone={"subdued"}>Revenue
                                Generated</Text>
                            <Text as={"span"} alignment={"center"} fontWeight={"medium"}
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
                                                        <BlockStack gap={"100"}>
                                                            <Text variant={"headingSm"} as={"span"}
                                                                  tone={"subdued"}
                                                                  fontWeight={"medium"}> {y.title} </Text>
                                                            <Text variant={"headingLg"} as={"span"}
                                                                  fontWeight={"medium"}> {y.value ? y.value : 0} </Text>
                                                        </BlockStack>
                                                    </Card>
                                                </Grid.Cell>
                                            )
                                        })
                                        }

                                        {(x.analytics2 || []).map((z, k) => {
                                            return (
                                                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 2, lg: 4, xl: 4}}>
                                                    <Card key={k} padding={"500"}>
                                                        <BlockStack gap={"100"}>
                                                            <Text variant={"headingSm"} as={"span"}
                                                                  tone={"subdued"}
                                                                  fontWeight={"medium"}> {z.title} </Text>
                                                            <Text variant={"headingLg"} as={"span"}
                                                                  fontWeight={"medium"}> {z.value ? z.value : 0} </Text>
                                                        </BlockStack>
                                                    </Card>
                                                </Grid.Cell>
                                            )
                                        })}
                                    </Grid>
                                </Grid.Cell>
                            )
                        })}
                </Grid>
            </Layout.Section>
        </Fragment>
    );
};

export default CountAnalytics;