import React, {Fragment} from 'react';
import {Layout, LegacyCard, FormLayout, TextField, Checkbox, LegacyStack, Text, Button, Tooltip} from "@shopify/polaris"
import {SwitchButton} from "../../../SwitchButton";
import {ColorInput} from "../../../ColorInput";
import {Icons} from "../../../../utils/Icons";
import {Helmet} from "react-helmet";
import {ToastMessage} from "../../../ToastMessage";

export function CollectionPage({backInStockDesign, setBackInStockDesign, message, setMessage}) {
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
            <ToastMessage message={message} setMessage={setMessage}/>
            <Layout.Section oneHalf>
                <LegacyCard>
                    <LegacyCard.Header title={"Customize Button"}>
                        <Tooltip dismissOnMouseOut preferredPosition="above"
                                 content={`Collection page ${backInStockDesign.collection_page_widget.is_active == 1 ? "enabled" : "disabled"} in back in stock`}>
                            <SwitchButton
                                checked={backInStockDesign.collection_page_widget.is_active == 1}
                                onChange={handleChange} name={"is_active"}/>
                        </Tooltip>
                    </LegacyCard.Header>
                    <LegacyCard.Section>
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
                                    checked={backInStockDesign.collection_page_widget.button_type == "1"}
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
                            <FormLayout.Group condensed>
                                <ColorInput label={"Icon Color"}
                                            name="icon_color"
                                            onChange={handleChange}
                                            value={backInStockDesign.collection_page_widget.icon_color}
                                />
                                <div></div>
                            </FormLayout.Group>
                        </FormLayout>
                    </LegacyCard.Section>
                </LegacyCard>

            </Layout.Section>
            <Layout.Section oneHalf>
                <LegacyCard title={"Preview"} sectioned>
                    <LegacyStack wrap distribution={"center"}>
                        <img src={"https://wishlist.thimatic-apps.com/assets/images/product3.jpg"} width={"200px"}/>
                        <LegacyStack>
                            <LegacyStack spacing='tight' vertical>
                                <Text as='h3' fontWeight={"bold"}>AKAMAI TOP // PALMS COLLIDE</Text>
                                <Text>Rs. 80.00</Text>
                                <Button outline>Add to cart</Button>
                                <button className="wl_btn_common wl_collection_preview">
                                    {backInStockDesign.collection_page_widget.button_type == "1" ? Icons.notifyIcon : ""} {backInStockDesign.collection_page_widget.text}
                                </button>
                            </LegacyStack>
                        </LegacyStack>
                    </LegacyStack>
                </LegacyCard>

            </Layout.Section>
        </Fragment>
    );
};

