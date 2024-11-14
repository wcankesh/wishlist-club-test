import React, {Fragment, useEffect, useState} from 'react';
import {
    BlockStack,
    Box,
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    Divider,
    FormLayout,
    InlineStack,
    Layout,
    Modal,
    Page,
    Text
} from '@shopify/polaris'
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl, capitalizeMessage, isChecked, toggleFlag} from "../../../utils/Constant";
import ToastMessage from "../../Comman/ToastMessage"
import CopyCode from "../../Comman/CopyCode"
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {RenderLoading} from "../../../utils/RenderLoading";
import {useSelector} from "react-redux";

const General = () => {
    const navigate = useNavigate();
    const shopDetails = useSelector(state => state.shopDetails);
    const [setting, setSetting] = useState({
        app_enable: 0,
        guest_wishlist: 0,
        multiple_wishlist: 0,
        share_wishlist: 0,
        is_dispaly_add_to_cart_all: 0,
        is_variant_wishlist: 0,
        redirect_type: 0,
        remove_wishlist_type: 2,
        is_clear_cart:'0',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [activeGuestModal, setActiveGuestModal] = useState(false);
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")

    const handleChangeModal = () => {
        setActiveGuestModal(!activeGuestModal)
    }

    const general = [
        {
            title: "App enable",
            description: "Switch setting to enable or disable app functionality.",
            name: "app_enable",
        },
        {
            title: "Guest wishlist",
            description: "The Guest Wishlist lets customers add items easily without logging in, allowing anyone on the same network to see them. Once they sign up and log in, all items will be saved to their account.",
            name: "guest_wishlist",
        },
        {
            title: "Multiple wishlists",
            description: "Let your customers make wishlists in multiple categories and give them more flexibility to manage",
            name: "multiple_wishlist",
        },
        {
            title: "Share wishlist",
            description: "Share your full wishlist on social media or provide a separate public link.",
            name: "share_wishlist",
        },
        {
            title: "Add to cart all the products",
            description: "Allow your customer to add all the wishlist products in the cart.",
            name: "is_dispaly_add_to_cart_all",
            input:[
                {
                    title: "Keep or Clear Cart on Add All",
                    description: "Allow your customers the flexibility to decide whether to keep existing items in their cart or clear it before adding all products from a wishlist, enhancing their shopping experience.",
                    name: "is_clear_cart",
                },
            ],
        },
    ]

    const Setting = async () => {
        setIsLoading(true)
        const response = await apiService.getSetting();
        if (response.status === 200) {
            setSetting(response.data)
            setIsError(false)
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
        setIsLoading(false)
    }
    useEffect(() => {
        Setting();
    }, []);

    const handleChange = async (e) => {
        const {name, value} = e.target;
        if (name === "guest_wishlist" && value == 0) {
            setActiveGuestModal(true)
        } else {
         if (name === 'is_dispaly_add_to_cart_all' && !isChecked(value)) {
             setting.is_clear_cart = toggleFlag(setting.is_clear_cart, true);
         }
            setSetting({...setting, [name]: value})
            let payload = {...setting, [name]: value}
            delete payload.is_bis_email_enable;
            delete payload.bis_id;
            const response = await apiService.updateSetting(payload, setting.id)
            if (response.status === 200) {
                setIsError(false)
                setMessage(capitalizeMessage(response.message))
            } else if (response.status === 500) {
                setMessage(capitalizeMessage(response.message))
                setIsErrorServer(true);
            } else {
                setMessage(capitalizeMessage(response.message))
                setIsError(true)
            }
        }
    }

    const GuestWishlistConfirmation = async () => {
        setIsLoading(true)
        setSetting({...setting, guest_wishlist: "0"})
        let payload = {...setting, guest_wishlist: "0"}
        delete payload.is_bis_email_enable;
        delete payload.bis_id;
        const response = await apiService.updateSetting(payload, setting.id)
        if (response.status === 200) {
            setIsError(false)
            setMessage(capitalizeMessage(response.message))
            setIsLoading(false)
            setActiveGuestModal(false);
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsLoading(false)
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsLoading(false)
        }
    }

    const removeProduct = [
        {label: 'When added to cart', value: 1},
        {label: 'When an order is placed', value: 2},
        {label: 'Never', value: 3},
    ];

    const ProductVariantList = [
        {label: 'First variant', value: 0},
        {label: 'Specific variant', value: 1},
        {label: 'All variant', value: 2},
    ];

    return (
        <Fragment>
            <Page title={"General"} backAction={{content: 'Settings', onAction: () => navigate(`${baseUrl}/settings`)}}>
                <Layout>
                    {message !== "" && isError === false ?
                        <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                                      setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner link={AppDocsLinks.article["423"]} message={message} setMessage={setMessage}
                                       setIsError={setIsError} isError={isError}/>
                    <Layout.Section>
                        {isLoading ? <Card> {RenderLoading.commonParagraph} </Card> :
                            <Card padding={"0"}>
                                {general.map((x, i) => {
                                    return (
                                        <Fragment>
                                            <InlineStack key={i} blockAlign={"start"}>
                                                <Box padding={"500"}>
                                                    <InlineStack gap={400} wrap={false}>
                                                        <Checkbox checked={isChecked(setting?.[x.name])} disabled={isLoading}
                                                                  onChange={(checked) => handleChange({
                                                                      target: {
                                                                          name: x.name,
                                                                          value: toggleFlag(setting?.[x.name])
                                                                      }
                                                                  })}/>
                                                        <div className={"cursor-pointer"} onClick={() => handleChange({
                                                            target: {name: x.name, value: toggleFlag(setting?.[x.name])}
                                                        })}>
                                                            <BlockStack gap={"150"}>
                                                                <Text as={"span"} fontWeight='semibold'>{x.title}</Text>
                                                                <Text as={"span"}>{x.description}</Text>
                                                            </BlockStack>
                                                        </div>
                                                    </InlineStack>
                                                    {isChecked(setting?.[x.name]) ?
                                                        x.input && (x.input || []).map((y,subIndex) => {
                                                            return (
                                                                <Box padding={"500"}  key={subIndex} paddingInlineStart={'1000'}>
                                                                    <InlineStack gap={400} wrap={false}>
                                                                        <Checkbox checked={isChecked(setting?.[y.name])} disabled={isLoading}
                                                                                  onChange={(checked) => handleChange({
                                                                                      target: {
                                                                                          name: y.name,
                                                                                          value: toggleFlag(setting?.[y.name])
                                                                                      }
                                                                                  })}/>
                                                                        <div className={"cursor-pointer"} onClick={() => handleChange({
                                                                            target: {name: y.name, value: toggleFlag(setting?.[y.name])}
                                                                        })}>
                                                                            <BlockStack gap={"150"}>
                                                                                <Text as={"span"} fontWeight='semibold'>{y.title}</Text>
                                                                                <Text as={"span"}>{y.description}</Text>
                                                                            </BlockStack>
                                                                        </div>
                                                                    </InlineStack>
                                                                </Box>
                                                            )
                                                        }) : ''}
                                                </Box>
                                            </InlineStack>
                                            <Divider/>
                                        </Fragment>
                                    )
                                })}
                                <Divider/>
                                <Box padding={"500"}>
                                    <BlockStack gap={"200"}>
                                        <Text fontWeight='semibold' as={"span"}>Product variant wishlists</Text>
                                        <ButtonGroup variant="segmented">
                                            {(ProductVariantList || []).map((x, i) => {
                                                return (
                                                    <Button
                                                        disabled={isLoading}
                                                        pressed={setting?.is_variant_wishlist === x.value}
                                                        onClick={() => handleChange({
                                                            target: {name: "is_variant_wishlist", value: x.value}
                                                        })}
                                                    > {x.label}</Button>
                                                )
                                            })}
                                        </ButtonGroup>
                                        <Text tone="caution" as={"span"}>
                                            {`Please note: If you wish to see the wishlist for a specific product variant, you will need to add this shortcode.`}
                                        </Text>
                                        <Text tone="caution" as={"span"}>
                                            {`If you choose variant wishlist, make sure to add the below shortcode. Otherwise, the wishlist will not be shown.`}</Text>
                                        <FormLayout>
                                            <FormLayout.Group>
                                                <BlockStack gap={"150"}>
                                                    <Text as={"span"}>Product page shortcode</Text>
                                                    <CopyCode
                                                        value={`<div class="th_prd_wl_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                </BlockStack>
                                                <BlockStack gap={"150"}>
                                                    <Text as={"span"}>Collection page shortcode</Text>
                                                    <CopyCode
                                                        value={`<div class="th_wl_col_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                </BlockStack>
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </BlockStack>
                                </Box>
                                {/*<Box padding={"500"}>
                                    <InlineStack gap={"400"} blockAlign={"start"} wrap={false}>
                                        <Checkbox checked={setting.is_variant_wishlist == "1"} disabled={isLoading}
                                                  onChange={(checked) => handleChange({
                                                      target: {name: "is_variant_wishlist", value: checked ? "1" : "0"}
                                                  })}/>
                                        <BlockStack gap={"100"}>
                                            <div className={"cursor-pointer"} onClick={() => handleChange({
                                                target: {
                                                    name: "is_variant_wishlist",
                                                    value: setting.is_variant_wishlist == "1" ? "0" : "1"
                                                }
                                            })}>
                                                <Text fontWeight='semibold' as={"span"}>Product variant
                                                    wishlists </Text>
                                                <Text as={"span"}>
                                                    {`If enabled, wishlists will be shown based on the product variant, whereas disabling it will result in wishlists being displayed solely based on products.`}
                                                </Text>
                                            </div>
                                            <Text tone="caution" as={"span"}>
                                                {`Please note: If you wish to see the wishlist for a specific product variant, you will need to add this shortcode.`}
                                            </Text>
                                            <Text tone="caution" as={"span"}>
                                                {`If you choose variant wishlist, make sure to add the below shortcode. Otherwise, the wishlist will not be shown.`}</Text>
                                            <FormLayout>
                                                <FormLayout.Group>
                                                    <BlockStack gap={"150"}>
                                                        <Text as={"span"}>Product page shortcode</Text>
                                                        <CopyCode
                                                            value={`<div class="th_prd_wl_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                    </BlockStack>
                                                    <BlockStack gap={"150"}>
                                                        <Text as={"span"}>Collection page shortcode</Text>
                                                        <CopyCode
                                                            value={`<div class="th_wl_col_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                    </BlockStack>
                                                </FormLayout.Group>
                                            </FormLayout>
                                        </BlockStack>
                                    </InlineStack>
                                </Box>*/}
                                <Divider/>
                                <Box padding={"500"}>
                                    <BlockStack gap={"200"}>
                                        <Text fontWeight='semibold' as={"span"}>Add to Cart Redirection Options{'  '}
                                            {shopDetails.shop !== 'french-beauty-co.myshopify.com' && shopDetails.plan_type < '7' ? <div className={'planText'}>Advance</div>
                                            : ''
                                            }
                                        </Text>
                                        <Text as={"span"}>Select the next step the user will be directed to after <strong>'Add to cart'</strong></Text>
                                        <ButtonGroup variant="segmented">
                                            {Array.from(Array(3)).map((_, i) => {
                                                return (
                                                    <Button
                                                        disabled={shopDetails.shop !== 'french-beauty-co.myshopify.com' && shopDetails.plan_type < '7'}
                                                        pressed={setting?.redirect_type === i}
                                                        onClick={() => handleChange({
                                                            target: {name: "redirect_type", value: i}
                                                        })}
                                                    > {i === 0 ? "Cart" : i === 1 ? "Checkout" : "Callback"}</Button>
                                                )
                                            })}
                                        </ButtonGroup>
                                        {setting?.redirect_type === 2 ?
                                            <CopyCode value={`<script>window.$wc_item_added_to_cart = function(){ }</script>`}/>
                                            : ""}
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"500"}>
                                    <BlockStack gap={"200"}>
                                        <Text fontWeight='semibold' as={"span"}>Wishlist Auto-Remove{'  '}
                                            {shopDetails.plan_type < '6' && <div className={'planText'}>Pro</div>}
                                        </Text>
                                        <ButtonGroup variant="segmented">
                                            {(removeProduct || []).map((x, i) => {
                                                return (
                                                    <Button key={i}
                                                            disabled={shopDetails.plan_type < '6'}
                                                            pressed={setting?.remove_wishlist_type === x.value}
                                                            onClick={() => handleChange({
                                                                target: {
                                                                    name: "remove_wishlist_type",
                                                                    value: x.value
                                                                }
                                                            })}>{x.label}</Button>
                                                )
                                            })}
                                        </ButtonGroup>
                                        <Text as={'span'} variant={'bodyMd'}>
                                            {`Choose when to remove products from the wishlist: upon adding to cart, placing an order, or not at all. By default, wishlist items will be removed when the customer purchases the product.`}
                                        </Text>
                                    </BlockStack>
                                </Box>
                            </Card>
                        }
                    </Layout.Section>
                </Layout>
            </Page>
            {
                activeGuestModal &&
                <Modal open={activeGuestModal} onClose={handleChangeModal}
                       title={"Really want to deactivate Guest Wishlist?"}
                       primaryAction={{content: 'Yes', onAction: GuestWishlistConfirmation, loading: isLoading}}
                       secondaryActions={[{content: 'No', onAction: handleChangeModal,}]}>
                    <Modal.Section>
                        <Text as={"span"}>
                            <Text as={"span"} tone={"warning"} fontWeight={"semibold"}>WARNING! </Text>
                            {`All the Guest Customers Product Information will be removed from our server and there is no way back. Are you sure you want to do this?`}
                        </Text>
                    </Modal.Section>
                </Modal>
            }
        </Fragment>
    );
}
export default General;