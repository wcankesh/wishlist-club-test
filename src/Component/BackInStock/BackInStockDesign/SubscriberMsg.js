import React, {Fragment} from 'react';
import {Layout, FormLayout, TextField, Text, Button, BlockStack, Card, InlineStack} from "@shopify/polaris"
import ColorInput from "../../Comman/ColorInput";
import {Helmet} from "react-helmet";
import {Product3} from "../../../utils/AppImages";

const SubscriberMsg = (props) => {
    const {
        backInStockDesign, setBackInStockDesign, setBackInStockDesignError, backInStockDesignError, formValidate
    } = props

    const handleChange = (e) => {
        const {name, value} = e.target;
        setBackInStockDesign({
            ...backInStockDesign,
            subscription_message: {...backInStockDesign.subscription_message, [name]: value},
        })
        if (backInStockDesignError[name]) {
            setBackInStockDesignError({
                ...backInStockDesignError,
                [name]: value.trim() ? "" : backInStockDesignError[name]
            })
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
                .wl_subscription_msg_preview{
                            color: ${backInStockDesign.subscription_message.text_color};
                            background-color:${backInStockDesign.subscription_message.background_color}; } `
            }]}>
            </Helmet>
            <Layout.Section>
                <Card padding={"400"}>
                    <BlockStack gap={"400"}>
                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Customize Subscriber Message</Text>
                        <FormLayout>
                            <FormLayout.Group condensed>
                                <TextField label="Message" multiline={4} name={"success_message"} onBlur={onBlur}
                                           value={backInStockDesign.subscription_message.success_message}
                                           error={backInStockDesignError.success_message}
                                           onChange={(value) =>
                                               handleChange({target: {name: "success_message", value}})
                                           }/>
                            </FormLayout.Group>
                            <FormLayout.Group condensed>
                                <TextField label="Already Subscribed Message" multiline={4} onBlur={onBlur}
                                           name={"already_subscribed_message"}
                                           error={backInStockDesignError.already_subscribed_message}
                                           value={backInStockDesign.subscription_message.already_subscribed_message}
                                           onChange={(value) =>
                                               handleChange({target: {name: "already_subscribed_message", value}})
                                           }/>
                            </FormLayout.Group>
                            <FormLayout.Group condensed>
                                <ColorInput label={"Toast Text Color"} name="text_color" onChange={handleChange}
                                            value={backInStockDesign.subscription_message.text_color}/>
                                <ColorInput label={"Toast Background Color"} name="background_color"
                                            onChange={handleChange}
                                            value={backInStockDesign.subscription_message.background_color}/>
                            </FormLayout.Group>
                        </FormLayout>
                    </BlockStack>
                </Card>
            </Layout.Section>

            <Layout.Section variant={"oneThird"}>
                <Card padding={"400"}>
                    <BlockStack gap={"400"}>
                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Preview</Text>
                        <BlockStack gap={"600"}>
                            <InlineStack gap={"300"} wrap={false}>
                                <img src={Product3} width={"100px"}/>
                                <BlockStack gap={"200"}>
                                    <Text as='span' fontWeight={"bold"}>AKAMAI TOP // PALMS COLLIDE</Text>
                                    <Text as={"span"}>Rs. 80.00</Text>
                                    <Button size={"large"}>Add to cart</Button>
                                </BlockStack>
                            </InlineStack>
                            <InlineStack align={"end"}>
                                <div className="wl_btn_common wl_subscription_msg_preview sub_msg">
                                    {backInStockDesign.subscription_message.already_subscribed_message}
                                </div>
                            </InlineStack>
                        </BlockStack>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </Fragment>
    );
};

export default SubscriberMsg;