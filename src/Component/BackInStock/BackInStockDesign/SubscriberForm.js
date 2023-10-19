import React, {Fragment} from 'react';
import {Layout, FormLayout, TextField, Text, BlockStack, Card, InlineStack, Bleed, Box} from "@shopify/polaris"
import ColorInput from "../../Comman/ColorInput";
import {Helmet} from "react-helmet";

const SubscriberForm = ({backInStockDesign, setBackInStockDesign, setBackInStockDesignError, backInStockDesignError, formValidate}) => {

    const handleChange = (e) => {
        const {name, value} = e.target;
        setBackInStockDesign({
            ...backInStockDesign,
            subscription_form: {...backInStockDesign.subscription_form, [name]: value},
        })
        if(backInStockDesignError[name]){
            setBackInStockDesignError({...backInStockDesignError, [name]: value.trim()  ? "" : backInStockDesignError[name]})
        }
    }


    const onBlur = (e) => {
        const {name, value} = e.target
        setBackInStockDesignError({...backInStockDesignError, [name]: formValidate(name, value)})
    }

    return (
        <Fragment>
            <Helmet style={[{
                "cssText": `
                .wl_subscription_form_preview{
                            color: ${backInStockDesign.subscription_form.text_color};
                            background-color:${backInStockDesign.subscription_form.background_color};
                            border-radius:${backInStockDesign.subscription_form.border_radius}px;
                            border:${backInStockDesign.subscription_form.border_size}px solid ${backInStockDesign.subscription_form.border_color};
                            padding:${backInStockDesign.subscription_form.button_top_bottom_padding}px ${backInStockDesign.subscription_form.button_left_right_padding}px;
                                }`
            }]}>
            </Helmet>

            <Layout.Section variant={"oneHalf"}>
                <Card padding={"500"}>
                    <BlockStack gap={"400"}>
                    <Text as={"h2"} variant={"headingMd"} fontWeight={"medium"}>Customize Subscriber Form</Text>
                    <FormLayout>
                        <BlockStack gap={"300"}>
                            <Bleed marginInlineStart={"150"}>
                        <FormLayout.Group condensed>
                            <TextField
                                label="Title"
                                value={backInStockDesign.subscription_form.title}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "title",
                                            value
                                        }
                                    })
                                }}
                            />
                            <TextField
                                label="Email Label"
                                value={backInStockDesign.subscription_form.email_lable}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "email_lable",
                                            value
                                        }
                                    })
                                }}
                            />
                        </FormLayout.Group>
                            </Bleed>
                            <Bleed marginInlineStart={"150"}>
                        <FormLayout.Group condensed>
                            <TextField
                                label="Email Placeholder"
                                value={backInStockDesign.subscription_form.email_placeholder}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "email_placeholder",
                                            value
                                        }
                                    })
                                }}
                            />
                            <TextField
                                label="Wrong Email Address Error"
                                value={backInStockDesign.subscription_form.email_validation_message}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "email_validation_message",
                                            value
                                        }
                                    })
                                }}
                            />
                        </FormLayout.Group>
                            </Bleed>
                            <Bleed marginInlineStart={"150"}>
                        <FormLayout.Group condensed>
                            <TextField
                                label="Submit Button Text"
                                value={backInStockDesign.subscription_form.submit_button_text}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "submit_button_text",
                                            value
                                        }
                                    })
                                }}
                                name={"submit_button_text"}
                                onBlur={onBlur}
                                error={backInStockDesignError.submit_button_text}
                            />
                            <ColorInput label={"Text Color"}
                                        name="text_color"
                                        onChange={handleChange}
                                        value={backInStockDesign.subscription_form.text_color}
                            />
                        </FormLayout.Group>
                            </Bleed>
                            <Bleed marginInlineStart={"150"}>
                        <FormLayout.Group condensed>
                            <ColorInput label={"Background Color"}
                                        name="background_color"
                                        onChange={handleChange}
                                        value={backInStockDesign.subscription_form.background_color}
                            />
                            <TextField
                                label="Border Raduis"
                                type="number"
                                suffix="PX"
                                value={backInStockDesign.subscription_form.border_radius}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "border_radius",
                                            value
                                        }
                                    })
                                }}
                            />
                        </FormLayout.Group>
                            </Bleed>
                            <Bleed marginInlineStart={"150"}>
                        <FormLayout.Group condensed>
                            <ColorInput label={"Border Color"}
                                        name="border_color"
                                        onChange={handleChange}
                                        value={backInStockDesign.subscription_form.border_color}
                            />
                            <TextField
                                label="Border Size"
                                type="number"
                                suffix="PX"
                                value={backInStockDesign.subscription_form.border_size}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "border_size",
                                            value
                                        }
                                    })
                                }}
                            />
                        </FormLayout.Group>
                            </Bleed>
                            <Bleed marginInlineStart={"150"}>
                        <FormLayout.Group condensed>
                            <TextField
                                label="Top & Bottom Padding"
                                type="number"
                                suffix="PX"
                                value={backInStockDesign.subscription_form.button_top_bottom_padding}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "button_top_bottom_padding",
                                            value
                                        }
                                    })
                                }}
                            />
                            <TextField
                                label="Left & Right Padding"
                                type="number"
                                suffix="PX"
                                value={backInStockDesign.subscription_form.button_left_right_padding}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "button_left_right_padding",
                                            value
                                        }
                                    })
                                }}
                            />
                        </FormLayout.Group>
                            </Bleed>
                        </BlockStack>
                    </FormLayout>
                    </BlockStack>
                </Card>

            </Layout.Section>
            <Layout.Section variant={"oneHalf"}>
                <Card padding={"500"}>
                    <BlockStack gap={"400"}>
                    <Text as={"h2"} variant={"headingMd"} fontWeight={"medium"}>Preview Popup</Text>
                    <Box padding={"400"} shadow={"400"} borderRadius={"200"}>
                        <BlockStack gap={"400"}>
                        <Text as={"h2"} variant={"headingMd"} fontWeight={"medium"}>Notify me via</Text>
                        <FormLayout>
                            <FormLayout.Group>
                                <TextField label={backInStockDesign.subscription_form.email_lable}
                                           placeholder={backInStockDesign.subscription_form.email_placeholder}
                                           helpText={<Text
                                               tone={"critical"}>{backInStockDesign.subscription_form.email_validation_message}</Text>}/>
                            </FormLayout.Group>
                        </FormLayout>
                        <InlineStack align={"center"}>
                            <button
                                className="wl_btn_common wl_subscription_form_preview">{backInStockDesign.subscription_form.submit_button_text}</button>
                            <div></div>
                        </InlineStack>
                        </BlockStack>
                    </Box>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </Fragment>
    );
};

export default SubscriberForm;