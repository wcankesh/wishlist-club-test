import React, {Fragment, useEffect, useState} from 'react';
import {LegacyCard, LegacyStack, Text, Layout, Page, FormLayout, Modal} from '@shopify/polaris'
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl, capitalizeMessage} from "../../../utils/Constant";
import ToastMessage from "../../Comman/ToastMessage"
import CopyCode from "../../Comman/CopyCode"
import SwitchButton from "../../Comman/SwitchButton"
import CustomErrorBanner from "../../Comman/CustomErrorBanner";

const General = () =>  {
    const navigate = useNavigate();
    const [setting, setSetting] = useState({
        app_enable: "1",
        guest_wishlist: "1",
        multiple_wishlist: "1",
        share_wishlist: "1",
        is_dispaly_add_to_cart_all: "1",
        is_variant_wishlist: "1",
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
            title: "Guest wishlist",
            description: "Allow your customers to add their favorite items to wishlist without login. All items will be migrated to your account, once they log in.",
            name: "guest_wishlist",
            checked: setting.guest_wishlist == "1"
        },
        {
            title: "Multiple wishlists",
            description: "Let your customers make wishlists in multiple categories and give them more flexibility to manage",
            name: "multiple_wishlist",
            checked: setting.multiple_wishlist == "1"
        },
        {
            title: "Share wishlist",
            description: "Share your full wishlist on social media or provide a separate public link.",
            name: "share_wishlist",
            checked: setting.share_wishlist == "1"
        },
        {
            title: "Add to cart all the products",
            description: "Allow your customer to add all the wishlist products in the cart.",
            name: "is_dispaly_add_to_cart_all",
            checked: setting.is_dispaly_add_to_cart_all == "1"
        },
    ]

    useEffect(() => {
        const Setting = async () => {
            const response = await apiService.getSetting();
            if (response.status === 200) {
                setSetting(response.data)
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
        Setting();
    }, []);

    const handleChange = async (e) => {
        const {name, value} = e.target;
        if (name === "guest_wishlist" && value == 0) {
            setActiveGuestModal(true)
        } else {
            setSetting({
                ...setting,
                [name]: value
            })
            let payload = {
                ...setting,
                [name]: value
            }
            const response = await apiService.updateSetting(payload, setting.id)
            if (response.status === 200) {
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
    const onBack = () => {
        navigate(`${baseUrl}/settings`)
    }

    const GuestWishlistConfirmation = async () => {
        setIsLoading(true)
        setSetting({
            ...setting,
            guest_wishlist: "0"
        })
        let payload = {
            ...setting,
            guest_wishlist: "0"
        }
        const response = await apiService.updateSetting(payload, setting.id)
        if (response.status === 200) {
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
            <Page title={"General"} backAction={{content: 'Settings', onAction: onBack}}>
                <Layout>
                    {message !== "" && isError === false ? <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner message={message} setMessage={setMessage} setIsError={setIsError} isError={isError} link={""}/>
                    <Layout.Section>
                        <LegacyCard >
                            <LegacyCard.Section>
                                <LegacyStack wrap={false}>
                                    <LegacyStack.Item>
                                        <SwitchButton checked={setting.app_enable == "1"} onChange={handleChange} name="app_enable"/>
                                    </LegacyStack.Item>
                                    <LegacyStack.Item fill>
                                        <LegacyStack spacing='extraTight' vertical>
                                            <Text fontWeight='semibold'>App enable</Text>
                                            <Text>Switch setting to enable or disable app functionality. </Text>
                                        </LegacyStack>
                                    </LegacyStack.Item>
                                </LegacyStack>
                            </LegacyCard.Section>
                            {general.map((x, i) => {
                                return (
                                    <LegacyCard.Section key={i}>
                                        <LegacyStack wrap={false}>
                                            <LegacyStack.Item>
                                                <SwitchButton
                                                    checked={x.checked}
                                                    onChange={handleChange} name={x.name}
                                                />
                                            </LegacyStack.Item>
                                            <LegacyStack.Item fill>
                                                <LegacyStack spacing='extraTight' vertical>
                                                    <Text fontWeight='semibold'>{x.title}</Text>
                                                    <Text>{x.description}</Text>
                                                </LegacyStack>
                                            </LegacyStack.Item>
                                        </LegacyStack>
                                    </LegacyCard.Section>
                                )
                            })
                            }
                            <LegacyCard.Section>
                                <LegacyStack wrap={false}>
                                    <LegacyStack.Item>
                                        <SwitchButton checked={setting.is_variant_wishlist == "1"}
                                                      onChange={handleChange} name="is_variant_wishlist"
                                        />
                                    </LegacyStack.Item>
                                    <LegacyStack.Item fill>
                                        <LegacyStack spacing='extraTight' vertical>
                                            <Text fontWeight='semibold'>Product variant wishlists</Text>
                                            <Text>If enabled, wishlists will be shown based on the product variant,
                                                whereas disabling it will result in wishlists being displayed solely
                                                based on products.</Text>
                                            <Text color="critical">Please note: If you wish to see the wishlist for a
                                                specific product variant, you will need to add this shortcode.</Text>
                                            <Text color="critical">If you choose variant wishlist, make sure to add the
                                                below shortcode. Otherwise, the wishlist will not be shown.</Text>
                                            <FormLayout>
                                                <FormLayout.Group>
                                                    <LegacyStack vertical spacing={"tight"}>
                                                        <Text>Product page shortcode</Text>
                                                        <CopyCode value={`<div class="th_prd_wl_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                    </LegacyStack>
                                                    <LegacyStack vertical spacing={"tight"}>
                                                        <Text>Collection page shortcode</Text>
                                                        <CopyCode value={`<div class="th_wl_col_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                    </LegacyStack>
                                                </FormLayout.Group>
                                            </FormLayout>
                                        </LegacyStack>
                                    </LegacyStack.Item>
                                </LegacyStack>
                            </LegacyCard.Section>
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
            </Page>
            {
                activeGuestModal &&
                <Modal
                    open={activeGuestModal}
                    onClose={handleChangeModal}
                    title={"Really want to deactivate Guest Wishlist?"}
                    primaryAction={{
                        content: 'Yes',
                        onAction: GuestWishlistConfirmation,
                        loading:isLoading
                    }}
                    secondaryActions={[
                        {
                            content: 'No',
                            onAction: handleChangeModal,
                        },
                    ]}

                >
                    <Modal.Section>
                        <Text>
                            <Text as={"span"} color={"warning"} fontWeight={"semibold"}>WARNING!</Text> All the Guest Customers Product Information will be removed from our server and there is no way back. Are you sure you want to do this?
                        </Text>
                    </Modal.Section>
                </Modal>
            }

        </Fragment>
    );
}
export default General

