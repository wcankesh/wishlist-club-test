import React, { Fragment, useEffect, useCallback, useState } from 'react';
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
    Page,
    Text, Popover, ActionList
} from '@shopify/polaris'
import { useNavigate } from "react-router-dom";
import { apiService, baseUrl, capitalizeMessage, isChecked, toggleFlag } from "../../../utils/Constant";
import ToastMessage from "../../Comman/ToastMessage"
import CopyCode from "../../Comman/CopyCode"
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import { AppDocsLinks } from "../../../utils/AppDocsLinks";
import { RenderLoading } from "../../../utils/RenderLoading";
import { useSelector } from "react-redux";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";

const General = () => {
    const shopify = useAppBridge();
    const navigate = useNavigate();
    const shopDetails = useSelector(state => state.shopDetails);
    const [setting, setSetting] = useState({
        app_enable: 0,
        guest_wishlist: 0,
        multiple_wishlist: 0,
        share_wishlist: 0,
        is_same_wishlist: 0,
        is_dispaly_add_to_cart_all: 0,
        is_variant_wishlist: 0,
        redirect_type: 0,
        remove_wishlist_type: 2,
        is_clear_cart: '0',
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
            input: [
                {
                    title: "Same Item to Multiple List",
                    description: "This option allow customers to add same item to multiple list which gives customer more access to their list.",
                    name: "is_same_wishlist",
                },
            ],
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
            input: [
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
        const { name, value } = e.target;
        if (name === "guest_wishlist" && value == 0) {
            setActiveGuestModal(true)
        } else {
            if (name === 'is_dispaly_add_to_cart_all' && !isChecked(value)) {
                setting.is_clear_cart = toggleFlag(setting.is_clear_cart, true);
            }
            if (name === 'multiple_wishlist' && !isChecked(value)) {
                setting.is_same_wishlist = toggleFlag(setting.is_same_wishlist, true);
            }
            setSetting({ ...setting, [name]: value })
            let payload = { ...setting, [name]: value }
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
        setSetting({ ...setting, guest_wishlist: "0" })
        let payload = { ...setting, guest_wishlist: "0" }
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
        { label: 'When added to cart', value: 1 },
        { label: 'When an order is placed', value: 2 },
        { label: 'Never', value: 3 },
    ];

    const ProductVariantList = [
        { label: 'All variant', value: 0 },
        { label: 'Specific variant', value: 1 },
    ];
    const CustomPopover = ({ options, selectedValue, onSelect, isDisabled, label }) => {
        const [popoverActive, setPopoverActive] = useState(false);

        const togglePopover = useCallback(() => setPopoverActive((active) => !active), []);

        const selectedLabel = options.find((x) => x.value === selectedValue)?.label || label || "Select Option";

        return (
            <Popover active={popoverActive} activator={<Button onClick={togglePopover} disabled={isDisabled} disclosure>{selectedLabel}</Button>} onClose={togglePopover}>
                <ActionList items={options.map((x) => ({ content: x.label, onAction: () => { onSelect(x.value); setPopoverActive(false); } }))} />
            </Popover>
        );
    };
    return (
        <Fragment>
            <Page title={"General"} backAction={{ content: 'Settings', onAction: () => navigate(`${baseUrl}/settings`) }}>
                <Layout>
                    {message !== "" && isError === false ?
                        <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                            setIsErrorServer={setIsErrorServer} /> : ""}
                    <CustomErrorBanner link={AppDocsLinks.article["423"]} message={message} setMessage={setMessage}
                        setIsError={setIsError} isError={isError} />
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
                                                            })} />
                                                        <div className={"cursor-pointer"} onClick={() => handleChange({
                                                            target: { name: x.name, value: toggleFlag(setting?.[x.name]) }
                                                        })}>
                                                            <BlockStack gap={"150"}>
                                                                <Text as={"span"} fontWeight='semibold'>{x.title}</Text>
                                                                <Text as={"span"}>{x.description}</Text>
                                                            </BlockStack>
                                                        </div>
                                                    </InlineStack>
                                                    {isChecked(setting?.[x.name]) ?
                                                        x.input && (x.input || []).map((y, subIndex) => {
                                                            return (
                                                                <Box padding={"500"} key={subIndex} paddingInlineStart={'1000'}>
                                                                    <InlineStack gap={400} wrap={false}>
                                                                        <Checkbox checked={isChecked(setting?.[y.name])} disabled={isLoading}
                                                                            onChange={(checked) => handleChange({
                                                                                target: {
                                                                                    name: y.name,
                                                                                    value: toggleFlag(setting?.[y.name])
                                                                                }
                                                                            })} />
                                                                        <div className={"cursor-pointer"} onClick={() => handleChange({
                                                                            target: { name: y.name, value: toggleFlag(setting?.[y.name]) }
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
                                            <Divider />
                                        </Fragment>
                                    )
                                })}
                                <Divider />
                                <Box padding={"500"}>
                                    <BlockStack gap={"200"}>
                                        <Text fontWeight='semibold' as={"span"}>Product variant wishlists</Text>
                                        <CustomPopover
                                            options={ProductVariantList}
                                            selectedValue={setting?.is_variant_wishlist}
                                            onSelect={(value) => handleChange({ target: { name: "is_variant_wishlist", value } })}
                                            isDisabled={isLoading}
                                            label="Select Variant"
                                        />
                                    </BlockStack>
                                    <Box paddingBlock={"200"}>
                                        <Text tone="caution" as={"span"}>
                                            {`Please note: If you wish to see the wishlist for a specific product variant, you will need to add this shortcode.`}
                                        </Text>
                                        <Text tone="caution" as={"span"}>
                                            {`If you choose variant wishlist, make sure to add the below shortcode. Otherwise, the wishlist will not be shown.`}</Text>
                                    </Box>
                                    <FormLayout>
                                        <FormLayout.Group>
                                            <BlockStack gap={"150"}>
                                                <Text as={"span"}>Product page shortcode</Text>
                                                <CopyCode
                                                    value={`<div class="th_prd_wl_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`} />
                                            </BlockStack>
                                            <BlockStack gap={"150"}>
                                                <Text as={"span"}>Collection page shortcode</Text>
                                                <CopyCode
                                                    value={`<div class="th_wl_col_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`} />
                                            </BlockStack>
                                        </FormLayout.Group>
                                    </FormLayout>
                                </Box>
                                <Divider />
                                <Box padding={"500"}>
                                    <BlockStack gap={"200"}>
                                        <Text fontWeight='semibold' as={"span"}>Add to Cart Redirection Options{'  '}
                                            {shopDetails !== 'french-beauty-co.myshopify.com' && shopDetails.plan_type < '7' ? <div className={'planText'}>Advance</div>
                                                : ''
                                            }
                                        </Text>
                                        <Text as={"span"}>Select the next step the user will be directed to after <strong>'Add to cart'</strong></Text>
                                        <CustomPopover
                                            options={[
                                                { label: "Cart", value: 0 },
                                                { label: "Checkout", value: 1 },
                                                { label: "Callback", value: 2 },
                                            ]}
                                            selectedValue={setting?.redirect_type}
                                            onSelect={(value) => handleChange({ target: { name: "redirect_type", value } })}
                                            isDisabled={shopDetails !== 'french-beauty-co.myshopify.com' && shopDetails.plan_type < '7'}
                                            label="Select Redirect Type"
                                        />
                                        <Box paddingBlock={"200"}>
                                            {setting?.redirect_type === 2 ?
                                                <CopyCode value={`<script>window.$wc_item_added_to_cart = function(){ }</script>`} />
                                                : ""}
                                        </Box>
                                    </BlockStack>
                                </Box>
                                <Divider />
                                <Box padding={"500"}>
                                    <BlockStack gap={"200"}>
                                        <Text fontWeight='semibold' as={"span"}>Wishlist Auto-Remove{'  '}
                                            {shopDetails.plan_type < '6' && <div className={'planText'}>Pro</div>}
                                        </Text>
                                        <CustomPopover
                                            options={removeProduct}
                                            selectedValue={setting?.remove_wishlist_type}
                                            onSelect={(value) => handleChange({ target: { name: "remove_wishlist_type", value } })}
                                            isDisabled={shopDetails.plan_type < 6}
                                            label="Select Remove Wishlist Type"
                                        />

                                        <Box paddingBlock={"200"}>
                                            <Text as={'span'} variant={'bodyMd'}>
                                                {`Choose when to remove products from the wishlist: upon adding to cart, placing an order, or not at all. By default, wishlist items will be removed when the customer purchases the product.`}
                                            </Text>
                                        </Box>
                                    </BlockStack>
                                </Box>
                            </Card>
                        }
                    </Layout.Section>
                </Layout>
            </Page>
            {
                activeGuestModal ? (
                    <Modal open={activeGuestModal}>
                        <TitleBar title={"Really want to deactivate Guest Wishlist?"}>
                            <button variant="primary" loading={isLoading && ''} onClick={() => GuestWishlistConfirmation()}>Yes</button>
                            <button onClick={() => handleChangeModal()}>No</button>
                        </TitleBar>
                        <Box padding={'400'}>
                            <Text as={"span"}>
                                <Text as={"span"} tone={"warning"} fontWeight={"semibold"}>WARNING! </Text>
                                {`All the Guest Customers Product Information will be removed from our server and there is no way back. Are you sure you want to do this?`}
                            </Text>
                        </Box>
                    </Modal>
                ) : ''
            }
        </Fragment >
    );
}
export default General;