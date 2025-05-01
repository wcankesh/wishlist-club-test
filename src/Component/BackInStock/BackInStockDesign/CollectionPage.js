import React, {Fragment} from 'react';
import {Layout, FormLayout, TextField, Checkbox, Text, Button, Tooltip, BlockStack, Card, InlineStack} from "@shopify/polaris"
import SwitchButton from "../../Comman/SwitchButton";
import ColorInput from "../../Comman/ColorInput";

import {Icons} from "../../../utils/Icons";
import {Helmet} from "react-helmet";
import {Product3} from "../../../utils/AppImages";


const CollectionPage = ({backInStockDesign, setBackInStockDesign,}) => {
    const handleChange = (e) => {
        const {name, value} = e.target;
        setBackInStockDesign({
            ...backInStockDesign,
            collection_page_widget: {...backInStockDesign.collection_page_widget, [name]: value},
        })
    }
    return (
        <Fragment>
            <Helmet style={[{
                "cssText": `
                .wl_collection_preview{
                            color: ${backInStockDesign.collection_page_widget.text_color};
                            background-color:${backInStockDesign.collection_page_widget.bg_color};
                            border-radius:${backInStockDesign.collection_page_widget.border_radius}px;
                            border:${backInStockDesign.collection_page_widget.border_size}px solid ${backInStockDesign.collection_page_widget.border_color};
                            padding:${backInStockDesign.collection_page_widget.button_top_bottom_padding}px ${backInStockDesign.collection_page_widget.button_left_right_padding}px;
                                }
                .wl_collection_preview svg path{fill:${backInStockDesign.collection_page_widget.icon_color}}`
            }]}>
            </Helmet>

            <Layout.Section>
                <Card padding={"400"}>
                    <BlockStack gap={"400"}>
                        <InlineStack align={"space-between"}>
                            <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Customize Collection Page Button</Text>
                            <Tooltip dismissOnMouseOut preferredPosition="above" content={`Collection page ${backInStockDesign.collection_page_widget.is_active == 1 ? "enabled" : "disabled"} in back in stock`}>
                                <SwitchButton
                                    checked={backInStockDesign.collection_page_widget.is_active == 1}
                                    onChange={handleChange} name={"is_active"}/>
                            </Tooltip>
                        </InlineStack>
                        <FormLayout>
                            <FormLayout.Group condensed>
                                <TextField
                                    label="Text"
                                    value={backInStockDesign.collection_page_widget.text}
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
                                            value={backInStockDesign.collection_page_widget.text_color}
                                />
                            </FormLayout.Group>
                            <FormLayout.Group condensed>
                                <ColorInput label={"Background Color"}
                                            name="bg_color"
                                            onChange={handleChange}
                                            value={backInStockDesign.collection_page_widget.bg_color}
                                />
                                <TextField
                                    label="Border Raduis"
                                    type="number"
                                    suffix="PX"
                                                   min={0}
                                    value={backInStockDesign.collection_page_widget.border_radius}
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
                                            value={backInStockDesign.collection_page_widget.border_color}
                                />
                                <TextField
                                    label="Border Size"
                                    type="number"
                                    suffix="PX"
                                                   min={0}
                                    value={backInStockDesign.collection_page_widget.border_size}
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
                                                   min={0}
                                    value={backInStockDesign.collection_page_widget.button_top_bottom_padding}
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
                                                   min={0}
                                    value={backInStockDesign.collection_page_widget.button_left_right_padding}
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
                            <FormLayout.Group>
                                <Checkbox
                                    label="Show icon"
                                    checked={backInStockDesign.collection_page_widget.is_icon == "1"}
                                    onChange={(checked) => {
                                        handleChange({
                                            target: {
                                                name: "is_icon",
                                                value: checked ? "1" : "0"
                                            }
                                        })
                                    }}
                                />
                            </FormLayout.Group>
                            <FormLayout.Group condensed>
                                <ColorInput label={"Icon Color"}
                                            name="icon_color"
                                            onChange={handleChange}
                                            value={backInStockDesign.collection_page_widget.icon_color}
                                />
                                <div></div>
                            </FormLayout.Group>
                        </FormLayout>
                    </BlockStack>
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
                                <Button size={"large"} fullWidth>Add to cart</Button>
                                <button className="wl_btn_common wl_collection_preview">
                                    {backInStockDesign.collection_page_widget.is_icon == "1" ? Icons.notifyIcon : ""} {backInStockDesign.collection_page_widget.text}
                                </button>
                            </BlockStack>

                        </BlockStack>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </Fragment>
    );
};

export default CollectionPage;