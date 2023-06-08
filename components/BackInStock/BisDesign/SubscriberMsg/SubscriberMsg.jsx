import React, {Fragment} from 'react';
import {Layout, LegacyCard, FormLayout, TextField, LegacyStack, Text, Button} from "@shopify/polaris"
import {ColorInput} from "../../../ColorInput";
import {ToastMessage} from "../../../ToastMessage";
import {Helmet} from "react-helmet";

export function SubscriberMsg({backInStockDesign, setBackInStockDesign, message, setMessage}) {
    const handleChange = (e) => {
        const {name, value} = e.target;
        setBackInStockDesign({
            ...backInStockDesign,
            subscription_message: {...backInStockDesign.subscription_message, [name]: value},
        })
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
            <ToastMessage message={message} setMessage={setMessage}/>
            <Layout.Section oneHalf>
                <LegacyCard title={"Customize Button"} sectioned>
                    <FormLayout>
                        <FormLayout.Group condensed>
                            <TextField
                                label="Message"
                                multiline={4}
                                value={backInStockDesign.subscription_message.success_message}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "success_message",
                                            value
                                        }
                                    })
                                }}
                            />
                            <TextField
                                label="Already Subscribed Message"
                                multiline={4}
                                value={backInStockDesign.subscription_message.already_subscribed_message}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "already_subscribed_message",
                                            value
                                        }
                                    })
                                }}
                            />
                        </FormLayout.Group>
                        <FormLayout.Group condensed>
                            <ColorInput label={"Toast Text Color"}
                                        name="text_color"
                                        onChange={handleChange}
                                        value={backInStockDesign.subscription_message.text_color}
                            />
                            <ColorInput label={"Toast Background Color"}
                                        name="background_color"
                                        onChange={handleChange}
                                        value={backInStockDesign.subscription_message.background_color}
                            />
                        </FormLayout.Group>
                    </FormLayout>
                </LegacyCard>
            </Layout.Section>
            <Layout.Section oneHalf>
                <LegacyCard title={"Preview"} sectioned>
                    <LegacyStack vertical spacing={"extraLoose"}>
                        <LegacyStack wrap={false} distribution={"center"}>
                            <img src={"https://wishlist.thimatic-apps.com/assets/images/product3.jpg"} width={"140px"}/>
                            <LegacyStack.Item fill>
                                <LegacyStack spacing='tight' vertical>
                                    <Text as='h3' fontWeight={"bold"}>AKAMAI TOP // PALMS COLLIDE</Text>
                                    <Text>Rs. 80.00</Text>
                                    <Button outline>Add to cart</Button>
                                </LegacyStack>
                            </LegacyStack.Item>
                        </LegacyStack>
                        <LegacyStack distribution={"trailing"}>
                            <div className="wl_btn_common wl_subscription_msg_preview sub_msg">
                                {backInStockDesign.subscription_message.already_subscribed_message}
                            </div>
                        </LegacyStack>
                    </LegacyStack>
                </LegacyCard>
            </Layout.Section>
        </Fragment>
    );
};
