import React, {Fragment, useCallback, useState} from 'react';
import {FormLayout, TextField, Layout, LegacyCard, LegacyStack, RadioButton, Thumbnail, DropZone, Text, Checkbox, Select, Button} from "@shopify/polaris";
import {Icons} from "../../../../Utills/Icons";
import ColorInput from "../../../Common/ColorInput";
import {Helmet} from "react-helmet";


const ProductPage = ({wishlistSetting, setWishlistSetting, updateIcon, file, setFile, isSVGLoading, deleteIcon}) => {
        const options = [
            {label: 'Grid', value: '0'},
            {label: 'List', value: '1'},
        ];
        const btn_options = [
            {label: 'Left', value: '1'},
            {label: 'Right', value: '2'},
            {label: 'Center', value: '3'},
            {label: 'FullWidth', value: '4'},
        ];

        const handleChange = (e) => {
            const {name, value} = e.target;
            setWishlistSetting({
                ...wishlistSetting,
                [name]: value
            })
        }
        const handleDropZoneDrop = useCallback(
            (_dropFiles, acceptedFiles, _rejectedFiles) =>
                setFile(acceptedFiles[0]),
            [],
        );

        const fileUpload = (!file && !wishlistSetting.icon) ? <DropZone.FileUpload/> : "";

        const uploadedFile = (
                <Fragment>
                    {
                        (file.name || wishlistSetting && wishlistSetting.icon) &&
                        <LegacyStack alignment={"center"} vertical spacing={"tight"}>
                            <br/>
                            <br/>
                            {
                                file.name ? <Thumbnail
                                        size="small"
                                        alt={file.name}
                                        source={window.URL.createObjectURL(file)}
                                    />
                                    :
                                    wishlistSetting && wishlistSetting.icon ?
                                        <div className="wl_logo" dangerouslySetInnerHTML={{__html: wishlistSetting && wishlistSetting.icon}}/> : ""
                            }
                        <br/>
                        <br/>
                        </LegacyStack>
                    }
                </Fragment>
            )
        ;
        return (
            <Fragment>
                <Helmet style={[{
                    "cssText": `
                .wishlist_btn_before{border:${wishlistSetting.button_border_width}px solid ${wishlistSetting.button_border_color_before};border-radius:${wishlistSetting.button_border_radius}px;padding:${wishlistSetting.button_top_bottom_padding}px ${wishlistSetting.button_left_right_padding}px;color: ${wishlistSetting.button_color_before};background-color:${wishlistSetting.button_bg_color_before};
                                 width:${wishlistSetting.button_position == "4" ? "100%" : "auto"}
                }
                .wishlist_btn_before svg path{fill: ${wishlistSetting.button_color_before}}
                .wishlist_position{justify-content:${wishlistSetting.button_position == "1" ? "left" : wishlistSetting.button_position == "2" ? "right" : wishlistSetting.button_position == "3" || wishlistSetting.button_position == "4" ? "center" : ''} }            
                .wishlist_btn_after svg path{fill: ${wishlistSetting.button_color_after}}
                .wishlist_btn_after{border:${wishlistSetting.button_border_width}px solid ${wishlistSetting.button_border_color_after};border-radius:${wishlistSetting.button_border_radius}px;padding:${wishlistSetting.button_top_bottom_padding}px ${wishlistSetting.button_left_right_padding}px; color: ${wishlistSetting.button_color_after};background-color:${wishlistSetting.button_bg_color_after};
                                     width:${wishlistSetting.button_position == "4" ? "100%" : "auto"}
                `
                }]}>
                </Helmet>
                <Layout.Section oneHalf>
                    <LegacyCard title="Select wishlist button style" sectioned>
                        <LegacyStack>
                            <RadioButton
                                label={Icons.wishlistIcon}
                                checked={wishlistSetting.button_type === '1'}
                                id="disabled"
                                name="button_type"
                                value={wishlistSetting.button_type}
                                onChange={() => handleChange({
                                    target: {
                                        name: "button_type",
                                        value: "1"
                                    }
                                })}
                            />
                            <RadioButton
                                label={
                                    <LegacyStack>
                                        <LegacyStack.Item>
                                            {Icons.wishlistIcon}
                                        </LegacyStack.Item>
                                        <LegacyStack.Item>
                                            Wishlist
                                        </LegacyStack.Item>
                                    </LegacyStack>
                                }
                                id="optional"
                                name="button_type"
                                checked={wishlistSetting.button_type === '3'}
                                onChange={() => handleChange({
                                    target: {
                                        name: "button_type",
                                        value: "3"
                                    }
                                })}
                                value={wishlistSetting.button_type}
                            />
                        </LegacyStack>
                        <LegacyStack vertical spacing={"tight"}>
                            <DropZone
                                label="Select Icon"
                                accept=".svg"
                                allowMultiple={false}
                                errorOverlayText="File type must be.svg"
                                onDrop={handleDropZoneDrop}
                            >
                                {uploadedFile}
                                {fileUpload}
                            </DropZone>
                            <LegacyStack distribution={"equalSpacing"}>
                                <Text>Note: You can add only svg</Text>
                                {file &&
                                <Button size={"slim"} outline onClick={updateIcon} loading={isSVGLoading}>Upload</Button>}
                                {wishlistSetting.icon &&
                                <Button size={"slim"} outline onClick={deleteIcon} loading={isSVGLoading}>Remove</Button>}
                            </LegacyStack>
                        </LegacyStack>
                    </LegacyCard>
                    <LegacyCard title={"Wishlist Button"} sectioned>
                        <FormLayout>
                            <FormLayout.Group condensed>
                                <TextField label="Border width"
                                           type="number"
                                           value={wishlistSetting.button_border_width}
                                           onChange={(value) => handleChange({
                                               target: {
                                                   name: "button_border_width",
                                                   value
                                               }
                                           })}
                                           suffix="PX"
                                />
                                <TextField label="Border Radius" type="number"
                                           value={wishlistSetting.button_border_radius}
                                           onChange={(value) => handleChange({
                                               target: {
                                                   name: "button_border_radius",
                                                   value
                                               }
                                           })}
                                           suffix="PX"/>
                            </FormLayout.Group>
                            <FormLayout.Group condensed>
                                <TextField label="Top & Bottom padding" type="number"
                                           value={wishlistSetting.button_top_bottom_padding}
                                           onChange={(value) => handleChange({
                                               target: {
                                                   name: "button_top_bottom_padding",
                                                   value
                                               }
                                           })}
                                           suffix="PX"/>
                                <TextField label="Left & Right padding" type="number"
                                           value={wishlistSetting.button_left_right_padding}
                                           onChange={(value) => handleChange({
                                               target: {
                                                   name: "button_left_right_padding",
                                                   value
                                               }
                                           })}
                                           suffix="PX"/>
                            </FormLayout.Group>
                            <FormLayout.Group condensed>
                                <Select label="Button Postion"
                                        options={btn_options}
                                        value={wishlistSetting.button_position}
                                        onChange={(value) => {
                                            handleChange({
                                                target: {
                                                    name: "button_position",
                                                    value
                                                }
                                            })
                                        }}
                                />
                                <div></div>
                            </FormLayout.Group>
                            <FormLayout.Group>
                                <Checkbox
                                    label="Show how many times the product has been added to the wishlist."
                                    checked={wishlistSetting.total_count == "1"}
                                    onChange={(checked) => {
                                        handleChange({
                                            target: {
                                                name: "total_count",
                                                value: checked ? "1" : "0"
                                            }
                                        })
                                    }}
                                />
                            </FormLayout.Group>

                        </FormLayout>
                    </LegacyCard>
                    {wishlistSetting.button_type === '1' ?
                        <Fragment>
                            <LegacyCard title={"Customize Wishlist Button Before Adding"} sectioned>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <ColorInput label={"Button color"} name="button_color_before"
                                                    onChange={handleChange} value={wishlistSetting.button_color_before}/>
                                        <div></div>
                                    </FormLayout.Group>
                                </FormLayout>
                            </LegacyCard>
                            <LegacyCard title={"Customize Wishlist Button After Adding"} sectioned>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <ColorInput label={"Button color"} name="button_color_after" onChange={handleChange}
                                                    value={wishlistSetting.button_color_after}/>
                                        <div></div>
                                    </FormLayout.Group>
                                </FormLayout>
                            </LegacyCard>
                        </Fragment>
                        :
                        <Fragment>
                            <LegacyCard title={"Customize Wishlist Button Before Adding"} sectioned>
                                <FormLayout>
                                    <FormLayout.Group condensed>
                                        <TextField label="Button text" value={wishlistSetting.button_text_before}
                                                   onChange={(value) => handleChange({
                                                       target: {
                                                           name: "button_text_before",
                                                           value
                                                       }
                                                   })}/>
                                        <ColorInput label={"Button color"} name="button_color_before"
                                                    onChange={handleChange} value={wishlistSetting.button_color_before}/>
                                    </FormLayout.Group>
                                    <FormLayout.Group condensed>
                                        <ColorInput label={"Button background color"} name="button_bg_color_before"
                                                    value={wishlistSetting.button_bg_color_before} onChange={handleChange}/>
                                        <ColorInput label={"Border Color"} name="button_border_color_before"
                                                    value={wishlistSetting.button_border_color_before}
                                                    onChange={handleChange}/>
                                    </FormLayout.Group>
                                </FormLayout>
                            </LegacyCard>
                            <LegacyCard title={"Customize Wishlist Button After Adding"} sectioned>
                                <FormLayout>
                                    <FormLayout.Group condensed>
                                        <TextField label="Button text"
                                                   value={wishlistSetting.button_text_after}
                                                   onChange={(value) => handleChange({
                                                       target: {
                                                           name: "button_text_after",
                                                           value
                                                       }
                                                   })}/>
                                        <ColorInput label={"Button color"} name="button_color_after" onChange={handleChange}
                                                    value={wishlistSetting.button_color_after}/>
                                    </FormLayout.Group>
                                    <FormLayout.Group condensed>
                                        <ColorInput label={"Button background color"} name="button_bg_color_after"
                                                    value={wishlistSetting.button_bg_color_after} onChange={handleChange}/>
                                        <ColorInput label={"Border Color"} name="button_border_color_after"
                                                    value={wishlistSetting.button_border_color_after}
                                                    onChange={handleChange}/>
                                    </FormLayout.Group>
                                </FormLayout>
                            </LegacyCard>
                        </Fragment>
                    }
                    <LegacyCard title={"Wishlist page layout"} sectioned>
                        <FormLayout>
                            <Select
                                options={options}
                                value={wishlistSetting.layout_type}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "layout_type",
                                            value
                                        }
                                    })
                                }}
                            />
                        </FormLayout>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section oneHalf>
                    <LegacyCard title="Preview" sectioned>
                        <LegacyStack wrap distribution={"center"}>
                            <img src={"https://wishlist.thimatic-apps.com/assets/images/product3.jpg"} width={"140px"}/>
                            <LegacyStack.Item fill>
                                <LegacyStack spacing='tight' vertical>
                                    <Text as='h3' fontWeight={"bold"}>AKAMAI TOP // PALMS COLLIDE</Text>
                                    <Text>Rs. 80.00</Text>
                                    <Button outline>Add to cart</Button>
                                    <div className="d-flex wishlist_position">
                                        <button className="wl_btn wishlist_btn_before">
                                            {wishlistSetting && wishlistSetting.icon ?
                                                <div
                                                    dangerouslySetInnerHTML={{__html: wishlistSetting && wishlistSetting.icon}}/>
                                                :
                                                Icons.wishlistIcon
                                            }
                                            &nbsp;
                                            {wishlistSetting.button_type == "3" ? wishlistSetting.button_text_before : ""}
                                            &nbsp;
                                            {wishlistSetting.total_count == "1" ? "(10)" : ""}
                                        </button>
                                    </div>
                                </LegacyStack>
                            </LegacyStack.Item>
                        </LegacyStack>
                    </LegacyCard>
                    <LegacyCard title="Preview (after adding to wishlist)" sectioned>
                        <LegacyStack wrap distribution={"center"}>
                            <img src={"https://wishlist.thimatic-apps.com/assets/images/product3.jpg"} width={"140px"}/>
                            <LegacyStack.Item fill>
                                <LegacyStack spacing='tight' vertical>
                                    <Text as='h3' fontWeight={"bold"}>AKAMAI TOP // PALMS COLLIDE</Text>
                                    <Text>Rs. 80.00</Text>
                                    <Button outline>Add to cart</Button>
                                    <div className=" d-flex wishlist_position">
                                        <button className="wl_btn wishlist_btn_after">
                                            {wishlistSetting && wishlistSetting.icon ?
                                                <div
                                                    dangerouslySetInnerHTML={{__html: wishlistSetting && wishlistSetting.icon}}/>
                                                :
                                                Icons.wishlistIconFill
                                            }
                                            &nbsp;
                                            {wishlistSetting.button_type == "3" ? wishlistSetting.button_text_after : ""}
                                            &nbsp;
                                            {wishlistSetting.total_count == "1" ? "(10)" : ""}
                                        </button>
                                    </div>
                                </LegacyStack>
                            </LegacyStack.Item>
                        </LegacyStack>
                    </LegacyCard>
                </Layout.Section>
            </Fragment>
        );
    }
;

export default ProductPage;


