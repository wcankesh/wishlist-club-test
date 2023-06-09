import React, {Fragment} from 'react'
import {Grid, Layout, LegacyCard, LegacyStack, List, Page, Text, Link} from '@shopify/polaris'
import {CopyCode} from '../../../components'

export default function Installation(){
    return (
        <Fragment>
            <Page>
                <Layout>
                    <Layout.Section>
                        <Text variant='headingLg' fontWeight={"bold"}>Configure Wishlist Club widget on your theme</Text>
                    </Layout.Section>
                    <Layout.Section>
                        <LegacyCard sectioned>
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                    <Text variant='bodyMd'>Please click &nbsp;<Link
                                        url="https://wc-ankesh.myshopify.com/admin/themes/current/editor?context=apps&amp;appEmbed=gid://shopify/OnlineStoreThemeAppEmbed/wishlist-club"
                                        removeUnderline target="_top">here</Link>&nbsp;to activate embedded block of
                                        Wishlist Club widget from your theme settings. You can deactivate it
                                        anytime.</Text>
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                    <Link
                                        url='https://wishlist.thimatic-apps.com/api/public/assets/images/start-our-app.png'
                                        external>
                                        <img className='install-img'
                                             src="https://wishlist.thimatic-apps.com/api/public/assets/images/start-our-app.png"
                                             width="100%" height="100%"/>
                                    </Link>
                                </Grid.Cell>
                            </Grid>
                        </LegacyCard>
                    </Layout.Section>

                    <Layout.Section>
                        <Text variant='headingLg' fontWeight={"bold"}>Manually Install</Text>
                    </Layout.Section>
                    <Layout.Section>
                        <LegacyCard sectioned title="Please follow the steps to add wishlist icon in header">
                            <Grid>
                                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                    <LegacyStack vertical>
                                        <List type="number">
                                            <List.Item> Open your Shopify store Theme <Link
                                                url="https://wc-ankesh.myshopify.com/admin/themes" target="_blank"
                                                removeUnderline>open</Link></List.Item>
                                            <List.Item>Then click on the <Text as={"span"}
                                                                               fontWeight={"bold"}>Actions</Text> button
                                                and click on <Text as={"span"} fontWeight={"bold"}>Edit
                                                    code.</Text></List.Item>
                                            <List.Item> Open <Text as={"span"}
                                                                   fontWeight={"bold"}>header.liquid</Text> file.</List.Item>
                                            <List.Item> Please add the below code if you want to display the wishlist
                                                icon in the header.</List.Item>
                                        </List>
                                        <CopyCode
                                            value={`<a href="/apps/wishlist" class="th_wlc_position_relative"><div class="th_wlc_product_count"></div><svg width="26" height="23" viewBox="0 0 26 23" fill="none"><path d="M24.8759 3.27339C24.1475 2.06525 23.0806 1.12141 21.8207 0.57048C20.3932 -0.0562504 18.7897 -0.169062 17.1839 0.245058C15.7124 0.624602 14.279 1.4478 13 2.64198C11.7209 1.44769 10.2874 0.624442 8.8156 0.244952C7.20974 -0.169327 5.60622 -0.0564097 4.17865 0.570745C2.91872 1.12185 1.8519 2.06588 1.12359 3.27418C0.360858 4.53529 -0.0271625 6.06892 0.00147825 7.70909C0.128635 15.0007 10.5135 21.6311 12.594 22.8863C12.7175 22.9608 12.8575 23 13 23C13.1425 23 13.2825 22.9608 13.406 22.8863C15.4867 21.6309 25.8725 14.9993 25.9986 7.70782C26.0269 6.06775 25.6387 4.53428 24.8759 3.27339V3.27339ZM24.3739 7.67728C24.3332 10.0348 22.8306 12.7835 20.0288 15.6259C17.4342 18.258 14.4828 20.242 13 21.1651C11.5172 20.2422 8.56627 18.2584 5.97185 15.6262C3.16993 12.784 1.66731 10.0356 1.62618 7.67808C1.58129 5.10386 2.77074 3.03273 4.80794 2.13773C5.4756 1.84606 6.19237 1.69728 6.91592 1.70019C8.78442 1.70019 10.7609 2.64623 12.4206 4.41138C12.4962 4.49179 12.5864 4.55566 12.6859 4.59926C12.7853 4.64285 12.8921 4.6653 12.9999 4.6653C13.1078 4.6653 13.2145 4.64285 13.314 4.59926C13.4134 4.55566 13.5036 4.49179 13.5792 4.41138C15.885 1.95916 18.8021 1.08796 21.1913 2.13757C23.2287 3.03225 24.4183 5.10307 24.3739 7.67712V7.67728Z" fill="black"></path></svg></a>`}/>
                                    </LegacyStack>
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                    <LegacyStack vertical>
                                        <Link
                                            url='https://wishlist.thimatic-apps.com/api/public/assets/images/wl_action_code_edit.png'
                                            external>
                                            <img className='install-img'
                                                 src="https://wishlist.thimatic-apps.com/api/public/assets/images/wl_action_code_edit.png"
                                                 width="100%" height="100%"/>
                                        </Link>
                                        <Link
                                            url='https://wishlist.thimatic-apps.com/api/public/assets/images/wl_action_code_edit_1.png'
                                            external>
                                            <img className='install-img'
                                                 src="https://wishlist.thimatic-apps.com/api/public/assets/images/wl_action_code_edit_1.png"
                                                 width="100%" height="100%"/>
                                        </Link>
                                        <Link
                                            url='https://wishlist.thimatic-apps.com/api/public/assets/images/wl_action_code_edit_2.png'
                                            external>
                                            <img className='install-img'
                                                 src="https://wishlist.thimatic-apps.com/api/public/assets/images/wl_action_code_edit_2.png"
                                                 width="100%" height="100%"/>
                                        </Link>
                                    </LegacyStack>
                                </Grid.Cell>
                            </Grid>
                        </LegacyCard>
                    </Layout.Section>

                    <Layout.Section>
                        <LegacyCard  title="A: Wishlist shortcode">
                            <LegacyCard.Section>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                        <LegacyStack vertical>
                                            <Text as={"h5"} fontWeight={"bold"}>1. Paste this code to display Wishlist
                                                Button Product Page</Text>
                                            <Text as={"span"}>Open <Text as={"span"}
                                                                         fontWeight={"bold"}>product-form.liquid</Text> file
                                                or <Text as={"span"}
                                                         fontWeight={"bold"}>main-product.liquid </Text> file
                                                or <Text as={"span"}
                                                         fontWeight={"bold"}> product-template.liquid </Text> file.</Text>
                                            <Text>Please add the below code under your add to cart button.</Text>
                                            <CopyCode
                                                value={`<div class="th_wl_btn" data-product_id="{{  product.id }}" data-variant_id={{ product.selected_or_first_available_variant.id }}></div>`}/>
                                        </LegacyStack>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                        <LegacyStack vertical>
                                            <Link
                                                url='https://wishlist.thimatic-apps.com/api/public/assets/images/wl_product.png'
                                                external>
                                                <img className='install-img'
                                                     src="https://wishlist.thimatic-apps.com/api/public/assets/images/wl_product.png"
                                                     width="100%" height="100%"/>
                                            </Link>
                                            <Link
                                                url='https://wishlist.thimatic-apps.com/api/public/assets/images/wl_product_pre.png'
                                                external>
                                                <img className='install-img'
                                                     src="https://wishlist.thimatic-apps.com/api/public/assets/images/wl_product_pre.png"
                                                     width="100%" height="100%"/>
                                            </Link>
                                        </LegacyStack>
                                    </Grid.Cell>
                                </Grid>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                        <LegacyStack vertical>
                                            <Text as={"h5"} fontWeight={"bold"}>2. Paste this code to display Wishlist
                                                Button
                                                Collection Page</Text>
                                            <Text>Open <Text as={"span"}
                                                             fontWeight={"bold"}>card-product.liquid</Text> file
                                                or <Text as={"span"}
                                                         fontWeight={"bold"}>product-card-grid.liquid </Text>file
                                                or <Text as={"span"}
                                                         fontWeight={"bold"}>product-card-list.liquid</Text> file
                                                or <Text as={"span"} fontWeight={"bold"}>product-card.liquid </Text>file
                                                or <Text as={"span"}
                                                         fontWeight={"bold"}>product-grid-item.liquid </Text>file.</Text>
                                            <Text>Please add the below code under the product price.</Text>
                                            <CopyCode
                                                value={`<div class="th_wl_btn" data-product_id="{{  product.id }}" data-variant_id={{ product.selected_or_first_available_variant.id }}></div>`}/>
                                        </LegacyStack>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                        <LegacyStack vertical>
                                            <Link
                                                url='https://wishlist.thimatic-apps.com/api/public/assets/images/wl_collection.png'
                                                external>
                                                <img className='install-img'
                                                     src="https://wishlist.thimatic-apps.com/api/public/assets/images/wl_collection.png"
                                                     width="100%" height="100%"/>
                                            </Link>
                                            <Link
                                                url='https://wishlist.thimatic-apps.com/api/public/assets/images/wl_collection_pre.png'
                                                external>
                                                <img className='install-img'
                                                     src="https://wishlist.thimatic-apps.com/api/public/assets/images/wl_collection_pre.png"
                                                     width="100%" height="100%"/>
                                            </Link>
                                        </LegacyStack>
                                    </Grid.Cell>
                                </Grid>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 12, lg: 12, xl: 12}}>
                                        <LegacyStack vertical>
                                            <Text fontWeight={"bold"}>3. Please follow the steps to add menu</Text>
                                            <List type="number" spacing="loose">
                                                <List.Item> Open your Shopify site's main navigation <a
                                                    href="https://wc-ankesh.myshopify.com/admin/themes" target="_blank"
                                                    className='text-decoeation-none'>open</a></List.Item>
                                                <List.Item>Then select your main menu and click on <Text as={"span"}
                                                                                                         fontWeight={"bold"}>Add
                                                    menu
                                                    item </Text>to add a new menu item.</List.Item>
                                                <List.Item>Choose menu name.</List.Item>
                                                <List.Item> Paste the following link into the Link text
                                                    box: <Text as={"span"}
                                                               fontWeight={"bold"}>/apps/wishlist/</Text></List.Item>
                                                <List.Item> Click on Save Menu</List.Item>
                                            </List>
                                        </LegacyStack>
                                    </Grid.Cell>
                                </Grid>
                            </LegacyCard.Section>
                        </LegacyCard>
                    </Layout.Section>
                    <Layout.Section>
                        <LegacyCard title="B: Back in stock shortcode">
                            <LegacyCard.Section>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                        <LegacyStack vertical>
                                            <Text as={"h5"} fontWeight={"bold"}>1.Paste this code to display Back in
                                                stock Button Product Page</Text>
                                            <Text as={"span"}>Open <Text as={"span"}
                                                                         fontWeight={"bold"}>product-form.liquid</Text> file
                                                or <Text as={"span"}
                                                         fontWeight={"bold"}>main-product.liquid </Text> file
                                                or <Text as={"span"}
                                                         fontWeight={"bold"}> product-template.liquid </Text> file.</Text>
                                            <Text>Please add the below code under your add to cart button.</Text>
                                            <CopyCode
                                                value={`<div class="wc_wl_bis_btn" data-product_id="{{ product.id }}" data-variant_id="{{ product.selected_or_first_available_variant.id }}"></div>`}/>
                                        </LegacyStack>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                        <LegacyStack vertical>
                                            <Link
                                                url='https://wishlist.thimatic-apps.com/api/public/assets/images/bsi_product_page.png'
                                                external>
                                                <img className='install-img'
                                                     src="https://wishlist.thimatic-apps.com/api/public/assets/images/bsi_product_page.png"
                                                     width="100%" height="100%"/>
                                            </Link>
                                            <Link
                                                url='https://wishlist.thimatic-apps.com/api/public/assets/images/bsi_product_pre.png'
                                                external>
                                                <img className='install-img'
                                                     src="https://wishlist.thimatic-apps.com/api/public/assets/images/bsi_product_pre.png"
                                                     width="100%" height="100%"/>
                                            </Link>
                                        </LegacyStack>
                                    </Grid.Cell>
                                </Grid>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                        <LegacyStack vertical>
                                            <Text as={"h5"} fontWeight={"bold"}>2. Paste this code to display Back in
                                                stock Button Collection Page</Text>
                                            <Text>Open <Text as={"span"}
                                                             fontWeight={"bold"}>card-product.liquid</Text> file
                                                or <Text as={"span"}
                                                         fontWeight={"bold"}>product-card-grid.liquid </Text>file
                                                or <Text as={"span"}
                                                         fontWeight={"bold"}>product-card-list.liquid</Text> file
                                                or <Text as={"span"} fontWeight={"bold"}>product-card.liquid </Text>file
                                                or <Text as={"span"}
                                                         fontWeight={"bold"}>product-grid-item.liquid </Text>file.</Text>
                                            <Text>Please add the below code under the product price.</Text>
                                            <CopyCode
                                                value={`<div class="th_wl_btn" data-product_id="{{  product.id }}" data-variant_id={{ product.selected_or_first_available_variant.id }}></div>`}/>
                                        </LegacyStack>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                                        <LegacyStack vertical>
                                            <Link
                                                url='https://wishlist.thimatic-apps.com/api/public/assets/images/bsi_collection_page.png'
                                                external>
                                                <img className='install-img'
                                                     src="https://wishlist.thimatic-apps.com/api/public/assets/images/bsi_collection_page.png"
                                                     width="100%" height="100%"/>
                                            </Link>
                                            <Link
                                                url='https://wishlist.thimatic-apps.com/api/public/assets/images/bsi_collection_pre.png'
                                                external>
                                                <img className='install-img'
                                                     src="https://wishlist.thimatic-apps.com/api/public/assets/images/bsi_collection_pre.png"
                                                     width="100%" height="100%"/>
                                            </Link>
                                        </LegacyStack>
                                    </Grid.Cell>
                                </Grid>
                            </LegacyCard.Section>
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    )
}


