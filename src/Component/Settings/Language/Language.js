import React, {Fragment, useEffect, useState} from 'react';
import {
    Page, Layout, TextField, PageActions, Text, Card, BlockStack, Grid, OptionList
} from "@shopify/polaris"
import {useNavigate} from "react-router-dom"
import {apiService, baseUrl, capitalizeMessage} from "../../../utils/Constant";
import ColorInput from "../../Comman/ColorInput"
import ToastMessage from "../../Comman/ToastMessage"
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {useSelector} from "react-redux";

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
    clear_cart_message:'Do you want to remove all existing items from your cart and add all wishlist products?',
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
};

const Language = () => {
    const navigate = useNavigate();
    const shopDetails = useSelector(state => state.shopDetails);
    const [labelData, setLabelData] = useState(initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [selectedOption, setSelectedOption] = useState("1");
    const [emailVeriMsg, setEmailVeriMsg] = useState({
        id: 0,
        email_verify_message: 'We have sent verification mail to your email. Please verify your email.',
        email_body_text: "You have subscribed to the product to notify you whenever it's in stock. Please verify your email using the below button to get notified.",
        email_button_text: 'Verify Email',
    })

    const Label = async () => {
        const response = await apiService.getLabel();
        if (response.status === 200) {
            setIsError(false)
            setLabelData(response.data)
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
    }

    const getEmailVerification = async () => {
        const response = await apiService.getEmailVerification();
        if (response.status === 200) {
            setIsError(false)
            setEmailVeriMsg((state) => ({
                ...state,
                id: response.data.id,
                email_verify_message: response.data.email_verify_message,
                email_body_text: response.data.email_body_text,
                email_button_text: response.data.email_button_text,
            }))
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
    }

    useEffect(() => {
        if (selectedOption === "4") {
            getEmailVerification()
        } else {
            Label()
        }
    }, [selectedOption]);

    const updateEmailVerification = async () => {
        setIsLoading(true)
        let payload = {...emailVeriMsg}
        const response = await apiService.updateEmailVerification(payload)
        if (response.status === 200) {
            setIsError(false)
            setIsLoading(false)
            setMessage(capitalizeMessage(response.message))
            getEmailVerification()
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

    const updateLabel = async () => {
        setIsLoading(true)
        let payload = {...labelData}
        const response = await apiService.updateLabel(payload, labelData.id)
        if (response.status === 200) {
            setIsError(false)
            setIsLoading(false)
            setMessage(capitalizeMessage(response.message))
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

    const handleChange = (e) => {
        const {name, value} = e.target;
        setLabelData({...labelData, [name]: value,})
    };

    const Languages = [
        {
            title: "Wishlist Page Label", tab: "1",
            PageLabel: [
                {
                    label: "Default wishlist title", filed: "text", name: "default_wishlist_title",
                    value: labelData.default_wishlist_title
                },
                {
                    label: "Wishlist page title", filed: "text",
                    name: "wishlist_page_title", value: labelData.wishlist_page_title
                },
                {
                    label: "Share title", filed: "text",
                    name: "share_title", value: labelData.share_title
                },
                {
                    label: "Share description", filed: "text",
                    name: "share_description", value: labelData.share_description
                },
                {
                    label: "Add to cart button", filed: "text",
                    name: "add_to_cart", value: labelData.add_to_cart
                },
                {
                    label: "Remove product button", filed: "text",
                    name: "remove_product", value: labelData.remove_product
                },
                {
                    label: "Text if no product found", filed: "text",
                    name: "no_product", value: labelData.no_product
                },
                {
                    label: "Wishlist page login button text", filed: "text",
                    name: "wishlist_page_login_text", value: labelData.wishlist_page_login_text
                },
                {
                    label: "OR", filed: "text",
                    name: "Wishlist_page_login_or_register", value: labelData.Wishlist_page_login_or_register
                },
                {
                    label: "Wishlist page register button text", filed: "text",
                    name: "wishlist_page_Register_text", value: labelData.wishlist_page_Register_text
                },
                {
                    label: "Wishlist page register description", filed: "text",
                    name: "wishlist_page_description", value: labelData.wishlist_page_description
                },
                {
                    label: "All product Add to cart button", filed: "text",
                    name: "all_product_add_to_cart_button_text", value: labelData.all_product_add_to_cart_button_text
                },
                {label: "Clear Cart Message", filed: "text", name: "clear_cart_message", value: labelData.clear_cart_message,},
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
                {label: "Sold out text", filed: "text", name: "sold_out", value: labelData.sold_out},
                {label: "Load more button text", filed: "text", name: "load_more_button_text", value: labelData.load_more_button_text},
                {
                    label: "Load more button background color",
                    filed: "color",
                    name: "load_more_button_bg_color",
                    value: labelData.load_more_button_bg_color
                },
                {
                    label: "Load more button text color",
                    filed: "color",
                    name: "load_more_button_text_color",
                    value: labelData.load_more_button_text_color
                },
            ],
        },
        {
            title: "Wishlist Popup Label", tab: "2",
            PageLabel: [
                {
                    label: "Wishlist modal title", filed: "text",
                    name: "wishlist_model_title", value: labelData.wishlist_model_title
                },
                {
                    label: "Wishlist text label", filed: "text",
                    name: "wishlist_model_label", value: labelData.wishlist_model_label
                },
                {
                    label: "Wishlist text placeholder", filed: "text",
                    name: "wishlist_model_placeholder", value: labelData.wishlist_model_placeholder
                },
                {
                    label: "Wishlist model description", filed: "text",
                    name: "wishlist_model_description", value: labelData.wishlist_model_description
                },
                {
                    label: "Wishlist model create button text", filed: "text",
                    name: "wishlist_model_create_button", value: labelData.wishlist_model_create_button
                },
                {
                    label: "Wishlist model cancel button text", filed: "text",
                    name: "wishlist_model_cancel_button", value: labelData.wishlist_model_cancel_button
                },
                {
                    label: "Wishlist create dropdown text", filed: "text",
                    name: "wishlist_dropdown_text", value: labelData.wishlist_dropdown_text
                },
                {
                    label: "Create button color", filed: "color",
                    name: "wishlist_model_create_button_text_colour",
                    value: labelData.wishlist_model_create_button_text_colour
                },
                {
                    label: "Create button background color", filed: "color",
                    name: "wishlist_model_create_button_bg_colour",
                    value: labelData.wishlist_model_create_button_bg_colour
                },
                {
                    label: "Cancel button color", filed: "color",
                    name: "wishlist_model_cancel_button_text_colour",
                    value: labelData.wishlist_model_cancel_button_text_colour
                },
                {
                    label: "Cancel button background color", filed: "color",
                    name: "wishlist_model_cancel_button_bg_colour",
                    value: labelData.wishlist_model_cancel_button_bg_colour
                },
            ],
        },
        {
            title: "Wishlist Alert Message", tab: "3",
            PageLabel: [
                {
                    label: "Product added to wishlist text", filed: "text",
                    name: "product_add_to_wishlist", value: labelData.product_add_to_wishlist
                },
                {
                    label: "Product remove from wishlist text", filed: "text",
                    name: "product_remove_wishlist", value: labelData.product_remove_wishlist
                },
                {
                    label: "Product added to cart text", filed: "text",
                    name: "product_add_to_cart", value: labelData.product_add_to_cart
                },
                {
                    label: "Product added to cart error title", filed: "text",
                    name: "product_add_to_cart_error_title", value: labelData.product_add_to_cart_error_title
                },
                {
                    label: "Product added to cart error message", filed: "text",
                    name: "product_add_to_cart_error_message", value: labelData.product_add_to_cart_error_message
                },
                {
                    label: "Success message background color", filed: "color",
                    name: "success_message_bg_color", value: labelData.success_message_bg_color
                },
                {
                    label: "Success message color", filed: "color",
                    name: "success_message_text_color", value: labelData.success_message_text_color
                },
                {
                    label: "Error message background color", filed: "color",
                    name: "error_message_bg_color", value: labelData.error_message_bg_color
                },
                {
                    label: "Error message color", filed: "color",
                    name: "error_message_text_color", value: labelData.error_message_text_color
                },
            ],
        }
    ];

    const EmailVerificationFields = [
        {
            label: "Email Verification Message",
            field: "text",
            name: "email_verify_message",
            value: emailVeriMsg?.email_verify_message,
            disabled : false,
            helpText : <Text as={'span'}><strong>Note:</strong> This message will be displayed to the user on the website immediately after they signup for Back In Stock.</Text>,
        },
        {
            label: "Email Body",
            field: "text",
            name: "email_body_text",
            value: emailVeriMsg?.email_body_text,
            disabled : shopDetails.plan_type < '5',
            helpText: '',
        },
        {
            label: "Verify Button Title",
            field: "text",
            name: "email_button_text",
            value: emailVeriMsg?.email_button_text,
            disabled : shopDetails.plan_type < '5',
            helpText: '',
        },
    ];

    const onBack = () => {
        navigate(`${baseUrl}/settings`)
    };

    return (
        <Page title={"Language"} backAction={{content: 'Settings', onAction: onBack}}
              primaryAction={{
                  content: "Save", onAction: () => {
                      selectedOption === "4" ? updateEmailVerification() : updateLabel()
                  }, loading: isLoading
              }}>
            <Layout>
                {message !== "" && isError === false ?
                    <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                                  setIsErrorServer={setIsErrorServer}/> : ""}
                <CustomErrorBanner link={AppDocsLinks.article["426"]} message={message} setMessage={setMessage}
                                   setIsError={setIsError} isError={isError}/>

                <Layout.Section variant="oneThird">
                    <Card padding={"100"}>
                        <OptionList onChange={(event) => setSelectedOption(event[0])} selected={selectedOption}
                                    options={[
                                        {value: "1", label: "Wishlist Page Label"},
                                        {value: "2", label: "Wishlist Popup Label"},
                                        {value: "3", label: "Wishlist Alert Message"},
                                        {value: "4", label: "Email Verification Message"},
                                    ]}/>
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    {(Languages || []).map((x, i) => {
                        return (
                            selectedOption === x.tab &&
                            <Card padding={"400"} key={i}>
                                <BlockStack gap={"400"}>
                                    <Text as={"span"} variant={"headingMd"}>{x.title}</Text>
                                    <Grid gap="4" columns={{xs: 1, sm: 1, md: 2, lg: 2, xl: 2}} alignItems="end">
                                        {(x.PageLabel || []).map((y, j) => {
                                            return (
                                                <Fragment key={j}>
                                                    {y.filed == "text" ?
                                                        <TextField label={y.label} value={y.value}
                                                                   onChange={(value) => handleChange({
                                                                       target: {name: y.name, value}
                                                                   })}/> :
                                                        <ColorInput label={y.label} name={y.name} onChange={handleChange} value={y.value}/>
                                                    }
                                                </Fragment>
                                            )
                                        })}
                                    </Grid>
                                </BlockStack>
                            </Card>
                        )
                    })}

                    {
                        selectedOption === "4" &&
                        <Card padding={"400"}>
                            <BlockStack gap={"400"}>
                                <BlockStack gap={'100'}>
                                    <Text as={"span"} variant={"headingMd"}>{'Email Verification Message'}</Text>
                                    <Text as={"span"} tone="subdued" variant="bodyMd" breakWord>
                                        {'Customers receive an email verification upon subscribing. Please compose the email verification note below.'}
                                    </Text>
                                </BlockStack>
                                <Grid gap="4" columns={{xs: 1, sm: 1, md: 1, lg: 1, xl: 1}} alignItems="end">
                                    {(EmailVerificationFields || []).map((x,i) => {
                                        return(
                                            <React.Fragment key={i}>
                                                {x.field === 'text' ?
                                                    <TextField
                                                        label={x.label}
                                                        value={x.value}
                                                        onChange={(value) => setEmailVeriMsg({...emailVeriMsg, [x.name]: value})}
                                                        disabled={x.disabled}
                                                        helpText={x.helpText}
                                                    />
                                                : ''}
                                            </React.Fragment>
                                        )
                                    })}
                                </Grid>
                            </BlockStack>
                        </Card>
                    }
                </Layout.Section>
            </Layout>
            <PageActions primaryAction={{
                content: 'Save', onAction: () => {
                    selectedOption === "4" ? updateEmailVerification() : updateLabel()
                }, loading: isLoading
            }}/>
        </Page>
    );
};

export default Language;