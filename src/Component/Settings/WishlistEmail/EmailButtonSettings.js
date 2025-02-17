import React, {Fragment, useEffect, useState} from 'react';
import {
    BlockStack,
    Box,
    Button,
    Card,
    Divider,
    InlineGrid,
    InlineStack,
    Layout,
    Page,
    Text,
    TextField
} from "@shopify/polaris";
import {apiService, baseUrl, capitalizeMessage} from "../../../utils/Constant";
import ColorInput from "../../Comman/ColorInput"
import ToastMessage from "../../Comman/ToastMessage"
import {useNavigate} from "react-router-dom";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {useAppBridge} from "@shopify/app-bridge-react";
import {RenderLoading} from "../../../utils/RenderLoading";
import {Product3} from "../../../utils/AppImages";
import {Icons} from "../../../utils/Icons";

const initialState = {
    "add_to_cart_button_text": "Add To Cart",
    "add_to_cart_btn_bg_color": "#000000",
    "view_product_button_text": "View",
    "view_product_btn_bg_color": "#000000",
    "add_to_cart_btn_text_color": "#ffffff",
    "add_to_cart_btn_border_size": 1,
    "view_product_btn_text_color": "#ffffff",
    "add_to_cart_btn_border_color": "#000000",
    "view_product_btn_border_size": 1,
    "add_to_cart_btn_border_radius": 10,
    "view_product_btn_border_color": "#000000",
    "view_product_btn_border_radius": 10,
    "add_to_cart_btn_vertical_padding": 20,
    "view_product_btn_vertical_padding": 20,
    "add_to_cart_btn_horizontal_padding": 24,
    "view_product_btn_horizontal_padding": 24
};

const EmailButtonSettings = () => {
    const shopify = useAppBridge();

    const navigate = useNavigate();
    const [emailSetting, setEmailSetting] = useState(initialState);
    const [allEmailSetting, setAllEmailSetting] = useState({});
    const [isLoading, setIsLoading] = useState('')
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const [emailId, setEmailId] = useState(null)

    const onBack = () => {
        navigate(`${baseUrl}/settings/email?step=2`)
    }

    useEffect(() => {
        EmailSetting()
    }, []);

    const EmailSetting = async () => {
        setIsLoading('details');
        const response = await apiService.emailSetting();
        if (response.status === 200) {
            setAllEmailSetting(response.data);
            setEmailId(response.data?.id)
            const result = response.data && response.data.email_buttons;
            setEmailSetting((state) => ({...state, ...result}))
            setIsLoading('');
        } else if (response.status === 500) {
            shopify.toast.show(capitalizeMessage(response.message), {isError: true})
            setIsLoading('');
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            shopify.toast.show(capitalizeMessage(response.message), {isError: true})
            setIsLoading('');
        }
    }

    const saveEmailSetting = async () => {
        setIsLoading('save');

        const payload = {
            type: 5,
            "wishlist_report_setting": {
                "is_enable": allEmailSetting?.wishlist_report_setting?.is_enable,
                "type": allEmailSetting?.wishlist_report_setting?.type,
            },
            "email_buttons" : {...emailSetting},
        };

        const response = await apiService.onUpdateV2EmailSetting(payload, emailId);
        if (response.status === 200) {
            setIsError(false);
            shopify.toast.show(capitalizeMessage(response.message))
            setIsLoading('');
        } else if (response.status === 500) {
            shopify.toast.show(capitalizeMessage(response.message), {isError: true})
            setIsLoading('');
        } else {
            setMessage(capitalizeMessage(response.message));
            setIsError(true);
            shopify.toast.show(capitalizeMessage(response.message), {isError: true})
            setIsLoading('');
        }
    }


    const onChangeStyle = (e) => {
        const {name, value} = e.target;
        setEmailSetting({...emailSetting, [name]: value})
    };

    const buttonConfigs = [
        {
            title: "Add to Cart Button customization",
            fields: [
                {type: "text", name: "add_to_cart_button_text", label: `"Add to cart" label`},
                {type: "color", name: "add_to_cart_btn_bg_color", label: "Button Background color"},
                {type: "color", name: "add_to_cart_btn_text_color", label: "Button Text color"},
                {type: "color", name: "add_to_cart_btn_border_color", label: "Button Border color"},
                {type: "number", name: "add_to_cart_btn_border_size", label: "Border Width", suffix: "PX", min: 0, max: 10},
                {type: "number", name: "add_to_cart_btn_vertical_padding", label: "Top & Bottom padding", suffix: "PX", min: 0, max: 25},
                {type: "number", name: "add_to_cart_btn_horizontal_padding", label: "Left & Right padding", suffix: "PX", min: 0, max: 25},
                {type: "number", name: "add_to_cart_btn_border_radius", label: "Border Radius", suffix: "PX", min: 0}
            ]
        },
        {
            title: "View Product Button customization",
            fields: [
                {type: "text", name: "view_product_button_text", label: `"Visit product" label`},
                {type: "color", name: "view_product_btn_bg_color", label: "Button Background color"},
                {type: "color", name: "view_product_btn_text_color", label: "Button Text color"},
                {type: "color", name: "view_product_btn_border_color", label: "Button Border color"},
                {type: "number", name: "view_product_btn_border_size", label: "Border Width", suffix: "PX", min: 0},
                {type: "number", name: "view_product_btn_vertical_padding", label: "Top & Bottom padding", suffix: "PX", min: 0},
                {type: "number", name: "view_product_btn_horizontal_padding", label: "Left & Right padding", suffix: "PX", min: 0},
                {type: "number", name: "view_product_btn_border_radius", label: "Border Radius", suffix: "PX", min: 0}
            ]
        }
    ];

    return (
        <Fragment>
            <Page
                title={"Button settings"}
                subtitle={'Manage View Button Settings specifically for Added to Wishlist, Removed from Wishlist, Abandonment Reminder, and Low Stock Alert.'}
                backAction={{content: 'Settings', onAction: onBack}}
                  primaryAction={
                      <Fragment>
                          <Button variant="primary" onClick={() => saveEmailSetting()}
                                  loading={isLoading === 'save'}> Save</Button>
                      </Fragment>
                  }
            >
                <Layout>
                    {message !== "" && isError === false ?
                        <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                                      setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner link={AppDocsLinks.article["425"]} message={message} setMessage={setMessage}
                                       setIsError={setIsError} isError={isError}/>

                    <Layout.Section>
                        <Card padding={"0"}>
                            {isLoading === 'details' ? <Box padding={'400'}>{RenderLoading.commonParagraph}</Box> :
                                <BlockStack gap="0">
                                    {(buttonConfigs || []).map((config, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Box padding="400">
                                                    <BlockStack gap="200">
                                                        <Text as="span" variant="headingMd" fontWeight="medium">
                                                            {config.title}
                                                        </Text>
                                                        <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 2, xl: 2}}
                                                                    gap="150">
                                                            {config.fields.map((field, fieldIndex) => {
                                                                return (
                                                                    <React.Fragment key={fieldIndex}>
                                                                        {field.type === "color" ? (
                                                                            <ColorInput
                                                                                key={fieldIndex}
                                                                                label={field.label}
                                                                                name={field.name}
                                                                                onChange={onChangeStyle}
                                                                                value={emailSetting?.[field.name]}
                                                                            />
                                                                        ) : field.type === "number" ? (
                                                                            <TextField
                                                                                key={fieldIndex}
                                                                                label={field.label}
                                                                                type="number"
                                                                                name={field.name}
                                                                                value={emailSetting?.[field.name]}
                                                                                onChange={(value) =>
                                                                                    onChangeStyle({
                                                                                        target: {
                                                                                            name: field.name,
                                                                                            value
                                                                                        },
                                                                                    })
                                                                                }
                                                                                suffix={field.suffix}
                                                                                min={field.min}
                                                                                max={field.max}
                                                                            />
                                                                        ) : field.type === "text" ? (
                                                                            <TextField
                                                                                key={fieldIndex}
                                                                                label={field.label}
                                                                                type="text"
                                                                                name={field.name}
                                                                                value={emailSetting?.[field.name]}
                                                                                onChange={(value) =>
                                                                                    onChangeStyle({
                                                                                        target: {
                                                                                            name: field.name,
                                                                                            value
                                                                                        },
                                                                                    })
                                                                                }
                                                                            />
                                                                        ) : ''}
                                                                    </React.Fragment>
                                                                )
                                                            })}
                                                        </InlineGrid>
                                                    </BlockStack>
                                                </Box>
                                                {buttonConfigs.length - 1 !== index ? <Divider/> : ''}
                                            </React.Fragment>
                                        )
                                    })}
                                </BlockStack>
                            }
                        </Card>
                    </Layout.Section>

                    <Layout.Section variant={"oneThird"}>
                        <Card padding={"400"}>
                            <BlockStack gap={"400"}>
                                <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Preview</Text>
                                <BlockStack gap={"400"}>
                                    <InlineStack align={"center"}>
                                        <img src={Product3} width={"140px"}/>
                                    </InlineStack>
                                    <BlockStack gap={"300"}>
                                        <Text as='span' fontWeight={"bold"}>AKAMAI TOP // PALMS COLLIDE</Text>
                                        <Text as={"span"}>Rs. 80.00</Text>
                                        <button className="wl_btn_common wl_preview"
                                                style={{
                                                    backgroundColor:`${emailSetting?.add_to_cart_btn_bg_color}`,
                                                    color:`${emailSetting?.add_to_cart_btn_text_color}`,
                                                    border:`${emailSetting?.add_to_cart_btn_border_size}px solid ${emailSetting?.add_to_cart_btn_border_color}`,
                                                    borderRadius:`${emailSetting?.add_to_cart_btn_border_radius}px`,
                                                    padding:`${emailSetting?.add_to_cart_btn_vertical_padding}px ${emailSetting?.add_to_cart_btn_horizontal_padding}px`,
                                        }}
                                        >
                                            {emailSetting?.add_to_cart_button_text}
                                        </button>
                                        <button className="wl_btn_common wl_preview"
                                                style={{
                                                    backgroundColor:`${emailSetting?.view_product_btn_bg_color}`,
                                                    color:`${emailSetting?.view_product_btn_text_color}`,
                                                    border:`${emailSetting?.view_product_btn_border_size}px solid ${emailSetting?.view_product_btn_border_color}`,
                                                    borderRadius:`${emailSetting?.view_product_btn_border_radius}px`,
                                                    padding:`${emailSetting?.view_product_btn_vertical_padding}px ${emailSetting?.view_product_btn_horizontal_padding}px`,
                                                }}
                                        >
                                            {emailSetting?.view_product_button_text}
                                        </button>
                                    </BlockStack>

                                </BlockStack>
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

export default EmailButtonSettings;