import React, {Fragment, useEffect, useState} from 'react';
import {Page, Layout, LegacyCard,  TextField, HorizontalGrid,  PageActions} from "@shopify/polaris"
import {apiService, baseUrl} from "../../../../../utils/Constant";
import {useNavigate} from "react-router-dom"
import {ToastMessage,ColorInput} from "../../../../../components";


const initialState = {
    default_wishlist_title: "My Wishlist",
    wishlist_page_title: "My Wishlist",
    share_title: "Share on",
    share_description: "Check my wishlist",
    add_to_cart: "Add to Cart",
    remove_product: "Remove Product",
    no_product: "There is no product in your wishlist!",
    wishlist_page_login_text: "login",
    Wishlist_page_login_or_register: "Or",
    wishlist_page_Register_text: "sign up",
    wishlist_page_description: "To save your wishlist please",
    all_product_add_to_cart_button_text: "Add to cart all",
    all_product_add_to_cart_button_bg_color: "#00000",
    all_product_add_to_cart_button_text_color: "#FFFFFF",
    wishlist_model_title: "Create Wishlist List",
    wishlist_model_label: "List name",
    wishlist_model_placeholder: "Create Wishlist List",
    wishlist_model_description: "Use lists to save items for later. All lists are private unless you share them with others.",
    wishlist_model_create_button: "Create List",
    wishlist_model_cancel_button: "Cancel",
    wishlist_dropdown_text: "Create another Wish List",
    wishlist_model_create_button_text_colour: "#fff",
    wishlist_model_create_button_bg_colour: "#000000",
    wishlist_model_cancel_button_text_colour: "#fff",
    wishlist_model_cancel_button_bg_colour: "#6c757d",
    product_add_to_wishlist: "Product added to Wishlist",
    product_remove_wishlist: "Product removed from wishlist",
    product_add_to_cart: "Product added to cart",
    product_add_to_cart_error_title: "There is an Error!!!",
    product_add_to_cart_error_message: "Product is not added to cart, please contact us",
    success_message_bg_color: "#04AA6D",
    success_message_text_color: "#FFFFFF",
    error_message_bg_color: "#f00000",
    error_message_text_color: "#FFFFFF\t",
}
export default function Language (){
    const navigate = useNavigate()
    const [labelData, setLabelData] = useState(initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        const Label = async () => {
            setIsLoading(false);
            const response = await apiService.getLabel();
            if (response.status === 200) {
                setLabelData(response.data)
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        }
        Label()
    }, []);

    const updateLabel = async () => {
        setIsLoading(true)
        let payload = {
            ...labelData
        }
        const response = await apiService.updateLabel(payload, labelData.id)
        if (response.status === 200) {
            setIsLoading(false)
            setMessage(response.message)
        } else {
            setIsLoading(false)
            setMessage(response.message)
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setLabelData({
            ...labelData,
            [name]: value,
        })
    }

    const Langaguge = [
        {
            title: "Wishlist Page Label",
            PageLabel: [
                {
                    label: "Default wishlist title",
                    filed: "text",
                    name: "default_wishlist_title",
                    value: labelData.default_wishlist_title
                },
                {
                    label: "Wishlist page title",
                    filed: "text",
                    name: "wishlist_page_title",
                    value: labelData.wishlist_page_title
                },
                {
                    label: "Share title",
                    filed: "text",
                    name: "share_title",
                    value: labelData.share_title
                },
                {
                    label: "Share description",
                    filed: "text",
                    name: "share_description",
                    value: labelData.share_description
                },
                {
                    label: "Add to cart button",
                    filed: "text",
                    name: "add_to_cart",
                    value: labelData.add_to_cart
                },
                {
                    label: "Remove product button",
                    filed: "text",
                    name: "remove_product",
                    value: labelData.remove_product
                },
                {
                    label: "Text if no product found",
                    filed: "text",
                    name: "no_product",
                    value: labelData.no_product
                },
                {
                    label: "Wishlist page login button text",
                    filed: "text",
                    name: "wishlist_page_login_text",
                    value: labelData.wishlist_page_login_text
                },
                {
                    label: "OR",
                    filed: "text",
                    name: "Wishlist_page_login_or_register",
                    value: labelData.Wishlist_page_login_or_register
                },
                {
                    label: "Wishlist page register button text",
                    filed: "text",
                    name: "wishlist_page_Register_text",
                    value: labelData.wishlist_page_Register_text
                },
                {
                    label: "Wishlist page register description",
                    filed: "text",
                    name: "wishlist_page_description",
                    value: labelData.wishlist_page_description
                },
                {
                    label: "All product Add to cart button",
                    filed: "text",
                    name: "all_product_add_to_cart_button_text",
                    value: labelData.all_product_add_to_cart_button_text
                },
                {
                    label: "All product Add to cart button background color",
                    filed: "color",
                    name: "all_product_add_to_cart_button_bg_color",
                    value: labelData.all_product_add_to_cart_button_bg_color
                },
                {
                    label: "All product Add to cart button color",
                    filed: "color",
                    name: "all_product_add_to_cart_button_text_color",
                    value: labelData.all_product_add_to_cart_button_text_color
                },
            ]
        },

        {
            title: "Wishlist Popup Label",
            PageLabel: [
                {
                    label: "Wishlist modal title",
                    filed: "text",
                    name: "wishlist_model_title",
                    value: labelData.wishlist_model_title
                },
                {
                    label: "Wishlist text label",
                    filed: "text",
                    name: "wishlist_model_label",
                    value: labelData.wishlist_model_label
                },
                {
                    label: "Wishlist text placeholder",
                    filed: "text",
                    name: "wishlist_model_placeholder",
                    value: labelData.wishlist_model_placeholder
                },
                {
                    label: "Wishlist model description",
                    filed: "text",
                    name: "wishlist_model_description",
                    value: labelData.wishlist_model_description
                },
                {
                    label: "Wishlist model create button text",
                    filed: "text",
                    name: "wishlist_model_create_button",
                    value: labelData.wishlist_model_create_button
                },
                {
                    label: "Wishlist model cancel button text",
                    filed: "text",
                    name: "wishlist_model_cancel_button",
                    value: labelData.wishlist_model_cancel_button
                },
                {
                    label: "Wishlist create dropdown text",
                    filed: "text",
                    name: "wishlist_dropdown_text",
                    value: labelData.wishlist_dropdown_text
                },
                {
                    label: "Create button color",
                    filed: " color",
                    name: "wishlist_model_create_button_text_colour",
                    value: labelData.wishlist_model_create_button_text_colour
                },
                {
                    label: "Create button background color",
                    filed: "color",
                    name: "wishlist_model_create_button_bg_colour",
                    value: labelData.wishlist_model_create_button_bg_colour
                },
                {
                    label: "Cancel button color",
                    filed: " color",
                    name: "wishlist_model_cancel_button_text_colour",
                    value: labelData.wishlist_model_cancel_button_text_colour
                },
                {
                    label: "Cancel button background color",
                    filed: " color",
                    name: "wishlist_model_cancel_button_bg_colour",
                    value: labelData.wishlist_model_cancel_button_bg_colour
                },
            ]
        },
        {
            title: "Wishlist Alert Message",
            PageLabel: [
                {
                    label: "Product added to wishlist text",
                    filed: "text",
                    name: "product_add_to_wishlist",
                    value: labelData.product_add_to_wishlist
                },
                {
                    label: "Product remove from wishlist text",
                    filed: "text",
                    name: "product_remove_wishlist",
                    value: labelData.product_remove_wishlist
                },
                {
                    label: "Product added to cart text",
                    filed: "text",
                    name: "product_add_to_cart",
                    value: labelData.product_add_to_cart
                },
                {
                    label: "Product added to cart error title",
                    filed: "text",
                    name: "product_add_to_cart_error_title",
                    value: labelData.product_add_to_cart_error_title
                },
                {
                    label: "Product added to cart error message",
                    filed: "text",
                    name: "product_add_to_cart_error_message",
                    value: labelData.product_add_to_cart_error_message
                },
                {
                    label: "Success message background color",
                    filed: "color",
                    name: "success_message_bg_color",
                    value: labelData.success_message_bg_color
                },
                {
                    label: "Success message color",
                    filed: " color",
                    name: "success_message_text_color",
                    value: labelData.success_message_text_color
                },
                {
                    label: "Error message background color",
                    filed: " color",
                    name: "error_message_bg_color",
                    value: labelData.error_message_bg_color
                },
                {
                    label: "Error message color",
                    filed: "color",
                    name: "error_message_text_color",
                    value: labelData.error_message_text_color
                },
            ]
        }
    ]

    const onBack = () => {
        navigate(`${baseUrl}/settings`)
    }
    return (
        <Fragment>
            <Page title={"Language"} backAction={{content: 'Settings', onAction: onBack}}
                  primaryAction={{content: "Save", onAction: updateLabel, loading: isLoading}}>
                <ToastMessage message={message} setMessage={setMessage}/>
                <Layout>
                    <Layout.Section>

                        {(Langaguge || []).map((x, i) => {
                            return (
                                <LegacyCard title={x.title} sectioned key={i}>
                                    <HorizontalGrid gap="4" columns={{xs: 1, sm: 2, md: 2, lg: 3, xl: 3}}
                                                    alignItems="end">
                                        {(x.PageLabel || []).map((y, j) => {
                                            return (
                                                <Fragment key={j}>
                                                    {y.filed == "text" ?
                                                        <TextField label={y.label}
                                                                   value={y.value}
                                                                   onChange={(value) => handleChange({
                                                                       target: {
                                                                           name: y.name,
                                                                           value
                                                                       }
                                                                   })}
                                                        />
                                                        :
                                                        <ColorInput label={y.label} name={y.name}
                                                                    onChange={handleChange} value={y.value}/>
                                                    }
                                                </Fragment>

                                            )
                                        })
                                        }
                                    </HorizontalGrid>
                                </LegacyCard>
                            )
                        })
                        }
                    </Layout.Section>
                    <Layout.Section>
                        <PageActions
                            primaryAction={{
                                content: 'Save',
                                onAction: updateLabel,
                                loading: isLoading
                            }}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

