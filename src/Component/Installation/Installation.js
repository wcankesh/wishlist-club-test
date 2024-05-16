import React, {useState} from 'react'
import {Grid, Layout, List, Page, Text, Link, Card, BlockStack, Box, Divider, OptionList} from '@shopify/polaris'
import CopyCode from "../Comman/CopyCode"
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/Constant";
import {
    BsiCollectionPage, BsiCollectionPre, BsiProductPage, BsiProductPre, StartOurApp, WlActionCodeEdit,
    WlActionCodeEdit1, WlActionCodeEdit2, WlCollection, WlCollectionPre, WlProduct1, WlProductPre
} from "../../utils/AppImages";

const Installation = () => {
    const shopDetails = useSelector((state) => state.shopDetails)
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState(["1"]);

    const renderLinkImage = (imageData) => {
        return (
            <Link url={imageData} external>
                <img loading={"lazy"} className='install-img' src={imageData} width="100%" height="100%"/>
            </Link>
        )
    };

    return (
        <Page backAction={{content: 'BAckInStock', onAction: () => navigate(`${baseUrl}/settings`)}}
              title={"Installation"}>
            <Layout>
                <Layout.Section variant="oneThird">
                    <Card padding={"100"}>
                        <OptionList onChange={setSelectedOption} selected={selectedOption}
                                    options={[
                                        {value: "1", label: "Activate App Embed"},
                                        {value: "2", label: "Manually Install"},
                                    ]}/>
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    {selectedOption.includes("1") &&
                    <Card>
                        <BlockStack gap={"400"}>
                            <Text variant='headingMd' as={"span"}
                                  fontWeight={"bold"}> {`Configure Wishlist Club widget on your theme`} </Text>
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                    <Text variant='bodyMd'>Please click&nbsp;<Link
                                        url={`https://${shopDetails.shop}/admin/themes/current/editor?context=apps&amp;appEmbed=gid://shopify/OnlineStoreThemeAppEmbed/wishlist-club`}
                                        removeUnderline target="_top">here</Link>&nbsp;to activate embedded block of
                                        Wishlist Club widget from your theme settings. You can deactivate it
                                        anytime.</Text>
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                    {renderLinkImage(StartOurApp)}
                                </Grid.Cell>
                            </Grid>
                        </BlockStack>
                    </Card>
                    }

                    {selectedOption.includes("2") &&
                    <BlockStack gap={"400"}>

                        <Card>
                            <BlockStack gap={"400"}>
                                <Text variant='headingMd' as={"span"} fontWeight={"bold"}>{`Manually Install`}</Text>
                                <Text as={"h2"} variant={"headingMd"}>
                                    {`Please follow the steps to add wishlist icon in header`}</Text>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                        <BlockStack gap={"400"}>
                                            <List type="number">
                                                <List.Item> Open your Shopify store Theme <Link
                                                    url={`https://${shopDetails.shop}/admin/themes`} target="_blank"
                                                    removeUnderline>open</Link></List.Item>
                                                <List.Item>
                                                    <Text as={"span"}> Then click on the <b>Actions</b> button and click
                                                        on <b>Edit code</b>. </Text>
                                                </List.Item>
                                                <List.Item>
                                                    <Text as={"span"}> Open <b>header.liquid</b> file. </Text>
                                                </List.Item>
                                                <List.Item> {`Please add the below code if you want to display the wishlist icon in the header.`}</List.Item>
                                            </List>
                                            <CopyCode
                                                value={`<a href="/apps/wishlist" class="th_wlc_position_relative"><div class="th_wlc_product_count"></div><svg width="26" height="23" viewBox="0 0 26 23" fill="none"><path d="M24.8759 3.27339C24.1475 2.06525 23.0806 1.12141 21.8207 0.57048C20.3932 -0.0562504 18.7897 -0.169062 17.1839 0.245058C15.7124 0.624602 14.279 1.4478 13 2.64198C11.7209 1.44769 10.2874 0.624442 8.8156 0.244952C7.20974 -0.169327 5.60622 -0.0564097 4.17865 0.570745C2.91872 1.12185 1.8519 2.06588 1.12359 3.27418C0.360858 4.53529 -0.0271625 6.06892 0.00147825 7.70909C0.128635 15.0007 10.5135 21.6311 12.594 22.8863C12.7175 22.9608 12.8575 23 13 23C13.1425 23 13.2825 22.9608 13.406 22.8863C15.4867 21.6309 25.8725 14.9993 25.9986 7.70782C26.0269 6.06775 25.6387 4.53428 24.8759 3.27339V3.27339ZM24.3739 7.67728C24.3332 10.0348 22.8306 12.7835 20.0288 15.6259C17.4342 18.258 14.4828 20.242 13 21.1651C11.5172 20.2422 8.56627 18.2584 5.97185 15.6262C3.16993 12.784 1.66731 10.0356 1.62618 7.67808C1.58129 5.10386 2.77074 3.03273 4.80794 2.13773C5.4756 1.84606 6.19237 1.69728 6.91592 1.70019C8.78442 1.70019 10.7609 2.64623 12.4206 4.41138C12.4962 4.49179 12.5864 4.55566 12.6859 4.59926C12.7853 4.64285 12.8921 4.6653 12.9999 4.6653C13.1078 4.6653 13.2145 4.64285 13.314 4.59926C13.4134 4.55566 13.5036 4.49179 13.5792 4.41138C15.885 1.95916 18.8021 1.08796 21.1913 2.13757C23.2287 3.03225 24.4183 5.10307 24.3739 7.67712V7.67728Z" fill="black"></path></svg></a>`}/>
                                        </BlockStack>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                        <BlockStack gap={"400"}>
                                            {renderLinkImage(WlActionCodeEdit)}
                                            {renderLinkImage(WlActionCodeEdit1)}
                                            {renderLinkImage(WlActionCodeEdit2)}
                                        </BlockStack>
                                    </Grid.Cell>
                                </Grid>
                            </BlockStack>
                        </Card>

                        <Card padding={"0"}>
                            <BlockStack>
                                <Box padding={"400"}>
                                    <BlockStack gap={"500"}>
                                        <Text as={"h2"} variant={"headingMd"}>A: Wishlist shortcode</Text>
                                        <Grid>
                                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                                <BlockStack gap={"400"}>
                                                    <Text as={"span"}
                                                          fontWeight={"bold"}>{`1. Paste this code to display Wishlist Button Product Page`}</Text>
                                                    <Text as={"span"}>
                                                        Open <b>product-form.liquid</b> file
                                                        or <b>main-product.liquid </b> file
                                                        or <b> product-template.liquid </b> file.
                                                    </Text>
                                                    <Text
                                                        as={"span"}>{`Please add the below code under your add to cart button.`}</Text>
                                                    <CopyCode
                                                        value={`<div class="th_prd_wl_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                </BlockStack>
                                            </Grid.Cell>
                                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                                <BlockStack gap={"400"}>
                                                    {renderLinkImage(WlProduct1)}
                                                    {renderLinkImage(WlProductPre)}
                                                </BlockStack>
                                            </Grid.Cell>
                                        </Grid>
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"400"}>
                                    <Grid>
                                        <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                            <BlockStack gap={"400"}>
                                                <Text as={"span"}>
                                                    <b>{`2. Paste this code to display Wishlist Button Collection Page`}</b>
                                                </Text>
                                                <Text as={"span"}>
                                                    Open <b>card-product.liquid</b> file
                                                    or <b>product-card-grid.liquid </b>file
                                                    or <b>product-card-list.liquid</b> file
                                                    or <b>product-card.liquid </b>file
                                                    or <b>product-grid-item.liquid </b>file.
                                                </Text>

                                                <Text
                                                    as={"span"}> {`Please add the below code under the product price.`} </Text>
                                                <CopyCode
                                                    value={`<div class="th_wl_col_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                            </BlockStack>
                                        </Grid.Cell>
                                        <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                            <BlockStack gap={"400"}>
                                                {renderLinkImage(WlCollection)}
                                                {renderLinkImage(WlCollectionPre)}
                                            </BlockStack>
                                        </Grid.Cell>
                                    </Grid>
                                </Box>
                                <Divider/>
                                <Box padding={"400"}>
                                    <Grid>
                                        <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                            <BlockStack gap={"400"}>
                                                <Text fontWeight={"bold"}
                                                      as={"span"}>{`3. Please follow the steps to add menu`}</Text>
                                                <List type="number" spacing="loose">
                                                    <List.Item> Open your Shopify site's main navigation <a
                                                        href={`https://${shopDetails.shop}/admin/themes`}
                                                        target="_blank"
                                                        className='text-decoeation-none'>open</a></List.Item>
                                                    <List.Item> <Text as={"span"}> Then select your main menu and
                                                        click on <b>Add menu item</b> to add a new menu item.
                                                    </Text></List.Item>
                                                    <List.Item>Choose menu name.</List.Item>
                                                    <List.Item> Paste the following link into the Link text
                                                        box: <Text as={"span"}
                                                                   fontWeight={"bold"}>/apps/wishlist/</Text></List.Item>
                                                    <List.Item> Click on Save Menu</List.Item>
                                                </List>
                                            </BlockStack>
                                        </Grid.Cell>
                                    </Grid>
                                </Box>
                            </BlockStack>
                        </Card>

                        <Card padding={"0"}>
                            <BlockStack>
                                <Box padding={"500"}>
                                    <BlockStack gap={"400"}>
                                        <Text as={"span"} variant={"headingMd"}>B: Back in stock shortcode</Text>
                                        <Grid>
                                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                                <BlockStack gap={"400"}>
                                                    <Text as={"span"} fontWeight={"bold"}>
                                                        {`1.Paste this code to display Back in stock Button Product Page`}
                                                    </Text>
                                                    <Text as={"span"}>
                                                        Open <b>product-form.liquid</b> file
                                                        or <b>main-product.liquid </b> file
                                                        or <b> product-template.liquid </b> file.
                                                    </Text>
                                                    <Text
                                                        as={"span"}>{`Please add the below code under your add to cart button.`}</Text>
                                                    <CopyCode
                                                        value={`<div class="wc_wl_bis_btn" data-product_id="{{ product.id }}" data-variant_id="{{ product.selected_or_first_available_variant.id }}"></div>`}/>
                                                </BlockStack>
                                            </Grid.Cell>
                                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                                <BlockStack gap={"400"}>
                                                    {renderLinkImage(BsiProductPage)}
                                                    {renderLinkImage(BsiProductPre)}
                                                </BlockStack>
                                            </Grid.Cell>
                                        </Grid>
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"400"}>
                                    <Grid>
                                        <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                            <BlockStack gap={"400"}>
                                                <Text as={"span"}
                                                      fontWeight={"bold"}>{`2. Paste this code to display Back in stock Button Collection Page`}</Text>
                                                <Text as={"span"}>
                                                    Open <b>card-product.liquid</b> file
                                                    or <b>product-card-grid.liquid </b>file
                                                    or <b>product-card-list.liquid</b> file
                                                    or <b>product-card.liquid </b>file
                                                    or <b>product-grid-item.liquid </b>file.
                                                </Text>
                                                <Text
                                                    as={"span"}>{`Please add the below code under the product price.`}</Text>
                                            </BlockStack>
                                            <CopyCode
                                                value={`<div class="wc_wl_bis_btn" data-product_id="{{ product.id }}" data-variant_id="{{ product.selected_or_first_available_variant.id }}"></div>`}/>
                                        </Grid.Cell>
                                        <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 12, lg: 12, xl: 12}}>
                                            <BlockStack gap={"400"}>
                                                {renderLinkImage(BsiCollectionPage)}
                                                {renderLinkImage(BsiCollectionPre)}
                                            </BlockStack>
                                        </Grid.Cell>
                                    </Grid>
                                </Box>
                            </BlockStack>
                        </Card>
                    </BlockStack>
                    }
                </Layout.Section>
            </Layout>
        </Page>
    )
};

export default Installation;