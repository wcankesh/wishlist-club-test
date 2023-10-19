import React, {Fragment} from 'react';
import {Layout, FormLayout, TextField, Checkbox, Text, Button, Tooltip, BlockStack, Card, InlineStack, Bleed} from "@shopify/polaris"
import SwitchButton from "../../Comman/SwitchButton";
import ColorInput from "../../Comman/ColorInput";

import {Icons} from "../../../utils/Icons";
import {Helmet} from "react-helmet";


const ProductPage = ({backInStockDesign, setBackInStockDesign}) => {
    const handleChange = (e) => {
        const {name, value} = e.target;
        setBackInStockDesign({
            ...backInStockDesign,
            product_page_widget: {...backInStockDesign.product_page_widget, [name]: value},

        })
    }

    return (
        <Fragment>
            <Helmet style={[{
                "cssText": `
                .wl_preview{
                            color: ${backInStockDesign.product_page_widget.text_color};
                            background-color:${backInStockDesign.product_page_widget.bg_color};
                            border-radius:${backInStockDesign.product_page_widget.border_radius}px;
                            border:${backInStockDesign.product_page_widget.border_size}px solid ${backInStockDesign.product_page_widget.border_color};
                            padding:${backInStockDesign.product_page_widget.button_top_bottom_padding}px ${backInStockDesign.product_page_widget.button_left_right_padding}px;
                                }
                .wl_preview svg path{fill:${backInStockDesign.product_page_widget.icon_color}}`
            }]}>
            </Helmet>

            <Layout.Section variant={"oneHalf"}>
                <Card padding={"500"}>
                    <BlockStack gap={"400"}>
                        <InlineStack align={"space-between"}>
                            <Text as={"h2"} variant={"headingMd"} fontWeight={"medium"}>Customize Product Page Button</Text>
                        <Tooltip preferredPosition="above" dismissOnMouseOut
                                 content={`Product page ${backInStockDesign.product_page_widget.is_active == 1 ? "enabled" : "disabled"} in back in stock`}>
                            <SwitchButton checked={backInStockDesign.product_page_widget.is_active == 1}
                                          onChange={handleChange} name={"is_active"}/>
                        </Tooltip>
                        </InlineStack>
                    <FormLayout>
                        <BlockStack gap={"300"}>
                            <Bleed marginInlineStart={"150"}>
                        <FormLayout.Group condensed>
                            <TextField
                                label="Text"
                                value={backInStockDesign.product_page_widget.text}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "text",
                                            value
                                        }
                                    })
                                }}
                            />
                            <ColorInput label={"Text Color"}
                                        name="text_color"
                                        onChange={handleChange}
                                        value={backInStockDesign.product_page_widget.text_color}
                            />
                        </FormLayout.Group>
                            </Bleed>
                            <Bleed marginInlineStart={"150"}>
                        <FormLayout.Group condensed>
                            <ColorInput label={"Background Color"}
                                        name="bg_color"
                                        onChange={handleChange}
                                        value={backInStockDesign.product_page_widget.bg_color}
                            />
                            <TextField
                                label="Border Raduis"
                                type="number"
                                suffix="PX"
                                value={backInStockDesign.product_page_widget.border_radius}
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
                                        value={backInStockDesign.product_page_widget.border_color}
                            />
                            <TextField
                                label="Border Size"
                                type="number"
                                suffix="PX"
                                value={backInStockDesign.product_page_widget.border_size}
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
                                value={backInStockDesign.product_page_widget.button_top_bottom_padding}
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
                                value={backInStockDesign.product_page_widget.button_left_right_padding}
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
                            <Bleed marginInlineStart={"150"}>
                        <FormLayout.Group>
                            <Checkbox
                                label="Show icon"
                                checked={backInStockDesign.product_page_widget.button_type == "1"}
                                onChange={(checked) => {
                                    handleChange({
                                        target: {
                                            name: "button_type",
                                            value: checked ? "1" : "0"
                                        }
                                    })
                                }}
                            />
                        </FormLayout.Group>
                            </Bleed>
                            <Bleed marginInlineStart={"150"}>
                        <FormLayout.Group condensed>
                            <ColorInput label={"Icon Color"}
                                        name="icon_color"
                                        onChange={handleChange}
                                        value={backInStockDesign.product_page_widget.icon_color}
                            />
                            <div></div>
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
                    <Text as={"h2"} variant={"headingMd"} fontWeight={"medium"}>Preview</Text>
                    <InlineStack gap={"400"}>
                        <img src={"https://wishlist.thimatic-apps.com/assets/images/product3.jpg"} width={"140px"}/>
                        <InlineStack>
                            <BlockStack gap={400}>
                                <Text as='h3' fontWeight={"bold"}>AKAMAI TOP // PALMS COLLIDE</Text>
                                <Text>Rs. 80.00</Text>
                                <InlineStack>
                                <Button>Add to cart</Button>
                                </InlineStack>
                                <button className="wl_btn_common wl_preview">
                                    {backInStockDesign.product_page_widget.button_type == "1" ? Icons.notifyIcon : ""} {backInStockDesign.product_page_widget.text}
                                </button>
                            </BlockStack>
                        </InlineStack>
                    </InlineStack>
                    </BlockStack>
                </Card>

            </Layout.Section>
        </Fragment>
    );
};

export default ProductPage;