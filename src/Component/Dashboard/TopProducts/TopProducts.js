import React, { Fragment, } from 'react';
import {
    InlineStack, Card, Thumbnail, Text, EmptySearchResult, IndexTable, Box
} from '@shopify/polaris';
import { currencySymbol } from "../../../utils/Constant";
import { useSelector } from "react-redux";
import { tableLoading } from "../../../utils/RenderLoading";
import { Icons } from "../../../utils/Icons";

const TopProducts = ({ topProducts, isLoading }) => {
    const shopDetails = useSelector((state) => state.shopDetails)

    const resourceNameWishlistProduct = { singular: 'product wishlist', plural: 'product wishlists' };

    const rowMarkup = (topProducts || []).map((x, i) => {
        return (
            <IndexTable.Row key={i} id={i}>
                <IndexTable.Cell>
                    <InlineStack blockAlign={"center"} gap="200" wrap={false}>
                        <Thumbnail size={"small"}
                            source={x?.product?.image ? x?.product?.image : Icons.ImageIcon} />
                        <Text as={"span"}>{x?.product?.title || ""}</Text>
                    </InlineStack>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as={"span"}
                        alignment={"end"}>{currencySymbol[shopDetails.currency]}{x?.product?.price || ""}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as={"span"} alignment={"end"}>{x.total}</Text>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    })

    return (
        <Box paddingInline={200}>
            <IndexTable
                resourceName={resourceNameWishlistProduct}
                itemCount={isLoading ? 10 : topProducts.length}
                loading={isLoading}
                emptyState={<EmptySearchResult title={'No product wishlist found'} withIllustration={!isLoading} />}
                hasMoreItems={isLoading}
                headings={[
                    { title: 'Product' },
                    { title: 'Price', alignment: 'end' },
                    { title: 'Item Count', alignment: 'end' },
                ]}
                selectable={false} >
                {isLoading ? tableLoading(10, 3) : rowMarkup}
            </IndexTable>
        </Box>
    );
};

export default TopProducts;