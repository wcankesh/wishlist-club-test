import React, {Fragment, useEffect, useState} from 'react';
import {
  LegacyCard,
  LegacyStack,
  Thumbnail,
  Text,
  EmptySearchResult, IndexTable,
} from '@shopify/polaris';
import {apiService, currencySymbol} from "../../../utils/Constant";
import moment from "moment"
import {useSelector} from "react-redux";

const TopProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({startDate: moment().subtract(29, 'days'), endDate: moment(),});
  const [topProducts, setTopProducts] = useState({top10Products: []})
  const shopDetails = useSelector((state) => state.shopDetails)

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
  const resourceNameWishlistProduct = {
    singular: 'product wishlist',
    plural: 'product wishlists',
  };

  return (
    <Fragment>
      <LegacyCard title={"Top 10 Product in Wishlists"}>
        <IndexTable
          resourceName={resourceNameWishlistProduct}
          itemCount={isLoading ? 0 : topProducts.top10Products.length}
          loading={isLoading}
          emptyState={<EmptySearchResult title={'No product wishlist found'}
                                         withIllustration={(!isLoading) || !isLoading}/>}
          hasMoreItems={isLoading}
          headings={[
            {title: 'Product'},
            {title: 'Price', alignment: 'end'},
            {title: 'Item Count', alignment: 'end'},
          ]}
          selectable={false}
        >{(topProducts.top10Products || []).map((x, i) => {
          return (
            <IndexTable.Row key={i} id={i}>
              <IndexTable.Cell>
                <LegacyStack alignment="center" wrap={false}>
                  <Thumbnail size={"small"} source={x.product.image}/>
                  <LegacyStack.Item fill>
                    <Text as={"span"}>{x.product.title}</Text>
                  </LegacyStack.Item>
                </LegacyStack>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Text alignment={"end"}>{currencySymbol[shopDetails.currency]}{x.product.price}</Text>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Text alignment={"end"}>{x.total}</Text>
              </IndexTable.Cell>
            </IndexTable.Row>
          )
        })}
        </IndexTable>
      </LegacyCard>
    </Fragment>
  );
};

export default TopProducts;