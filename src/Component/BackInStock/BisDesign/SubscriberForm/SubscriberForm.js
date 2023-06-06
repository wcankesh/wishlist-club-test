import React, {Fragment} from 'react';
import {Layout, LegacyCard, FormLayout, TextField, LegacyStack, Text} from "@shopify/polaris"
import ColorInput from "../../../Common/ColorInput";
import {Helmet} from "react-helmet";
import ToastMessage from "../../../Common/ToastMessage";

const SubscriberForm = ({backInStockDesign, setBackInStockDesign, message, setMessage}) => {
    const handleChange = (e) => {
        const {name, value} = e.target;
        setBackInStockDesign({
            ...backInStockDesign,
            subscription_form: {...backInStockDesign.subscription_form, [name]: value},
        })
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
            <ToastMessage message={message} setMessage={setMessage}/>
            <Layout.Section oneHalf>
                <LegacyCard title={"Customize Button"} sectioned>
                    <FormLayout>
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
                            />
                            <ColorInput label={"Text Color"}
                                        name="text_color"
                                        onChange={handleChange}
                                        value={backInStockDesign.subscription_form.text_color}
                            />
                        </FormLayout.Group>
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
                    </FormLayout>
                </LegacyCard>

            </Layout.Section>
            <Layout.Section oneHalf>
                <LegacyCard title={"Preview Popup"} sectioned>
                    <LegacyCard title={backInStockDesign.subscription_form.title} sectioned>
                        <FormLayout>
                            <FormLayout.Group>
                                <TextField label={backInStockDesign.subscription_form.email_lable}
                                           placeholder={backInStockDesign.subscription_form.email_placeholder}
                                           helpText={<Text
                                               color={"critical"}>{backInStockDesign.subscription_form.email_validation_message}</Text>}/>
                            </FormLayout.Group>
                        </FormLayout>
                        <LegacyStack distribution={"center"}>
                            <button
                                className="wl_btn_common wl_subscription_form_preview">{backInStockDesign.subscription_form.submit_button_text}</button>
                        </LegacyStack>
                    </LegacyCard>
                </LegacyCard>
            </Layout.Section>
        </Fragment>
    );
};

export default SubscriberForm;