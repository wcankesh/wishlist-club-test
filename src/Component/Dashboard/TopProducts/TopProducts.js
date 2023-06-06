import React, {Fragment, useEffect, useState} from 'react';
import {LegacyCard, DataTable, SkeletonBodyText, LegacyStack, Thumbnail, Text} from '@shopify/polaris';
import {apiService} from "../../../Utills/Constant";
import moment from "moment"
import NoDataFound from "../../Common/NoDataFound";

const TopProducts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState({startDate: moment().subtract(29, 'days'), endDate: moment(),});
    const [topProducts, setTopProducts] = useState({top10Products: []})

    useEffect(() => {
        const Analytics = async () => {
            setIsLoading(true);
            const payload = {
                start_date: moment(state.startDate).format("YYYY-MM-DD"),
                end_date: moment(state.endDate).format("YYYY-MM-DD")
            }
            const response = await apiService.Analytics(payload);
            if (response.status === 200) {
                setTopProducts(response.data)
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        }
        Analytics();
    }, []);

    const topProductData = () => {
        let productData = [];
        if (isLoading) {
            Array.from(Array(10)).map((_, i) => {
                let obj = [<SkeletonBodyText lines={1}/>, <SkeletonBodyText lines={1}/>, <SkeletonBodyText lines={1}/>];
                productData.push(obj);
            })
        } else if (topProducts.top10Products.length > 0) {
            topProducts.top10Products.map((x, i) => {
                let Obj = [
                    <LegacyStack alignment="center" wrap={false}>
                        <Thumbnail size={"small"} source={x.product.image}/>
                        <LegacyStack.Item fill>
                            <Text as={"span"}>{x.product.title}</Text>
                        </LegacyStack.Item>
                    </LegacyStack>,
                    <Text>{"$"}{x.product.price}</Text>,
                    <Text>{x.total}</Text>
                ]
                productData.push(Obj)
            })
        } else {
            let NoDataObj = [<NoDataFound title="No Data Found"/>]
            productData.push(NoDataObj);
        }
        return productData;
    }

    return (
        <Fragment>
            <LegacyCard title={"Top 10 Product in Wishlists"}>
                <DataTable
                    hideScrollIndicator={true}
                    columnContentTypes={[
                        'text',
                        'numeric',
                        'numeric',
                    ]}
                    headings={[
                        'Product',
                        'Price',
                        'Item count',
                    ]}
                    rows={topProductData()}
                />
            </LegacyCard>
        </Fragment>
    );
};

export default TopProducts;