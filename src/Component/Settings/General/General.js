import React, {Fragment, useEffect, useState} from 'react';
import {
    ButtonGroup, Button, Text, Layout, Page, FormLayout, Modal, BlockStack, InlineStack, Card,
    Divider, Box, Checkbox
} from '@shopify/polaris'
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl, capitalizeMessage} from "../../../utils/Constant";
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
        remove_wishlist_type: 1,
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
            checked: setting.app_enable === 1
        },
        {
            title: "Guest wishlist",
            description: "Allow your customers to add their favorite items to wishlist without login. All items will be migrated to your account, once they log in.",
            name: "guest_wishlist",
            checked: setting.guest_wishlist === 1
        },
        {
            title: "Multiple wishlists",
            description: "Let your customers make wishlists in multiple categories and give them more flexibility to manage",
            name: "multiple_wishlist",
            checked: setting.multiple_wishlist === 1
        },
        {
            title: "Share wishlist",
            description: "Share your full wishlist on social media or provide a separate public link.",
            name: "share_wishlist",
            checked: setting.share_wishlist === 1
        },
        {
            title: "Add to cart all the products",
            description: "Allow your customer to add all the wishlist products in the cart.",
            name: "is_dispaly_add_to_cart_all",
            checked: setting.is_dispaly_add_to_cart_all === 1
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
                                                        <Checkbox checked={x.checked} disabled={isLoading}
                                                                  onChange={(checked) => handleChange({
                                                                      target: {
                                                                          name: x.name,
                                                                          value: x.checked ? 0 : 1
                                                                      }
                                                                  })}/>
                                                        <div className={"cursor-pointer"} onClick={() => handleChange({
                                                            target: {name: x.name, value: x.checked ? 0 : 1}
                                                        })}>
                                                            <BlockStack gap={"150"}>
                                                                <Text as={"span"} fontWeight='semibold'>{x.title}</Text>
                                                                <Text as={"span"}>{x.description}</Text>
                                                            </BlockStack>
                                                        </div>
                                                    </InlineStack>
                                                </Box>
                                            </InlineStack>
                                            <Divider/>
                                        </Fragment>
                                    )
                                })}
                                <Box padding={"500"}>
                                    <BlockStack gap={"200"}>
                                        <Text fontWeight='semibold' as={"span"}>Redirect Type
                                            {shopDetails.plan_type < '7' && <div className={'planText'}>Pro</div>}
                                        </Text>
                                        <ButtonGroup variant="segmented">
                                            {Array.from(Array(3)).map((_, i) => {
                                                return (
                                                    <Button
                                                        pressed={setting?.redirect_type === i}
                                                        onClick={() => handleChange({
                                                            target: {name: "redirect_type", value: i}
                                                        })}
                                                    > {i === 0 ? "Cart" : i === 1 ? "Checkout" : "Callback"}</Button>
                                                )
                                            })}
                                        </ButtonGroup>
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"500"}>
                                    <BlockStack gap={"200"}>
                                        <Text fontWeight='semibold' as={"span"}>Remove Product
                                            {shopDetails.plan_type < '7' && <div className={'planText'}>Pro</div>}
                                        </Text>
                                        <ButtonGroup variant="segmented">
                                            <Button
                                                pressed={setting?.remove_wishlist_type === 1}
                                                onClick={() => handleChange({
                                                    target: {name: "remove_wishlist_type", value: 1}
                                                })}>{"After add to cart"}</Button>

                                            <Button
                                                pressed={setting?.remove_wishlist_type === 2}
                                                onClick={() => handleChange({
                                                    target: {name: "remove_wishlist_type", value: 2}
                                                })}> {"After place order"}</Button>
                                        </ButtonGroup>
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"500"}>
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