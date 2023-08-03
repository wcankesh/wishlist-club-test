import React, {Fragment, useCallback, useState} from 'react';
import {
    FormLayout,
    TextField,
    Layout,
    LegacyCard,
    LegacyStack,
    RadioButton,
    Thumbnail,
    DropZone,
    Text,
    Checkbox,
    Select,
    Button
} from "@shopify/polaris";
import {Icons} from "../../../../utils/Icons";
import {ColorInput} from "../../../ColorInput";
import {Helmet} from "react-helmet";


export function CollectionDesign({wishlistSetting, setWishlistSetting, file, setFile, isSVGLoading, updateIcon, deleteIcon}){

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
                                    <LegacyStack.Item fill>
                                      <div className="wl_logo" dangerouslySetInnerHTML={{__html: wishlistSetting && wishlistSetting.icon}}/>
                                    </LegacyStack.Item> : ""
                        }
                        <br/>
                        <br/>
                    </LegacyStack>
                }
            </Fragment>
        );

        return (
            <Fragment>
                <Helmet style={[{
                    "cssText": `
                .wl_collection_btn_before{
                                        border:${wishlistSetting.product_collection_button_border_width}px solid ${wishlistSetting.product_collection_button_border_color_before};
                                        border-radius:${wishlistSetting.product_collection_button_border_radius}px;padding:${wishlistSetting.product_collection_button_top_bottom_padding}px ${wishlistSetting.product_collection_button_left_right_padding}px;
                                        color: ${wishlistSetting.product_collection_button_color_before};background-color:${wishlistSetting.product_collection_button_type === "1" ? "transparent" : wishlistSetting.product_collection_button_bg_color_before};
                                        width:${wishlistSetting.product_collection_button_position == "4" ? "100%" : "auto"}
                                        }
                  .wl_collection_btn_before svg, .wl_collection_btn_after svg{width: 26px;height:23px}
                 .wl_collection_btn_before svg path{fill: ${wishlistSetting.product_collection_button_color_before}}                                          
                .wl_collection_btn_position{justify-content:${wishlistSetting.product_collection_button_position == "1" ? "left" : wishlistSetting.product_collection_button_position == "2" ? "right" : wishlistSetting.product_collection_button_position == "3" || wishlistSetting.product_collection_button_position == "4" ? "center" : ''}}
                .wl_collection_btn_after svg path {fill: ${wishlistSetting.product_collection_button_color_after}} 
                .wl_collection_btn_after{border:${wishlistSetting.product_collection_button_border_width}px solid ${wishlistSetting.product_collection_button_border_color_after};
                                        border-radius:${wishlistSetting.product_collection_button_border_radius}px;padding:${wishlistSetting.product_collection_button_top_bottom_padding}px ${wishlistSetting.product_collection_button_left_right_padding}px;
                                        color: ${wishlistSetting.product_collection_button_color_after};background-color:${wishlistSetting.product_collection_button_type === "1" ? "transparent" : wishlistSetting.product_collection_button_bg_color_after};
                                         width:${wishlistSetting.product_collection_button_position == "4" ? "100%" : "auto"}
                                        }
                `
                }]}>
                </Helmet>
                <Layout.Section oneHalf>
                    <LegacyCard title="Select wishlist button style" sectioned>
                        <LegacyStack>
                            <RadioButton
                                label={Icons.wishlistIcon}
                                checked={wishlistSetting.product_collection_button_type === "1"}
                                id="disabled"
                                name="product_collection_button_type"
                                value={wishlistSetting.product_collection_button_type}
                                onChange={() => handleChange({
                                    target: {
                                        name: "product_collection_button_type",
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
                                name="product_collection_button_type"
                                checked={wishlistSetting.product_collection_button_type === "3"}
                                value={wishlistSetting.product_collection_button_type}
                                onChange={() => handleChange({
                                    target: {
                                        name: "product_collection_button_type",
                                        value: "3"
                                    }
                                })}
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
                                           value={wishlistSetting.product_collection_button_border_width}
                                           onChange={(value) => handleChange({
                                               target: {
                                                   name: "product_collection_button_border_width",
                                                   value
                                               }
                                           })}
                                           suffix="PX"
                                />
                                <TextField label="Border Radius"
                                           type="number"
                                           value={wishlistSetting.product_collection_button_border_radius}
                                           onChange={(value) => handleChange({
                                               target: {
                                                   name: "product_collection_button_border_radius",
                                                   value
                                               }
                                           })}
                                           suffix="PX"
                                />
                            </FormLayout.Group>
                            <FormLayout.Group condensed>
                                <TextField label="Top & Bottom padding"
                                           type="number"
                                           value={wishlistSetting.product_collection_button_top_bottom_padding}
                                           onChange={(value) => handleChange({
                                               target: {
                                                   name: "product_collection_button_top_bottom_padding",
                                                   value
                                               }
                                           })}
                                           suffix="PX"
                                />
                                <TextField label="Left & Right padding"
                                           type="number"
                                           value={wishlistSetting.product_collection_button_left_right_padding}
                                           onChange={(value) => handleChange({
                                               target: {
                                                   name: "product_collection_button_left_right_padding",
                                                   value
                                               }
                                           })}
                                           suffix="PX"
                                />
                            </FormLayout.Group>
                            <FormLayout.Group condensed>
                                <Select label="Wishlist button position" options={btn_options}
                                        value={wishlistSetting.product_collection_button_position}
                                        onChange={(value) => {
                                            handleChange({
                                                target: {
                                                    name: "product_collection_button_position",
                                                    value
                                                }
                                            })
                                        }}/>
                                <div></div>
                            </FormLayout.Group>
                            <FormLayout.Group>
                                <Checkbox
                                    label="Show how many times the product has been added to the wishlist."
                                    checked={wishlistSetting.product_collection_total_count == "1"}
                                    onChange={(checked) => {
                                        handleChange({
                                            target: {
                                                name: "product_collection_total_count",
                                                value: checked ? "1" : "0"
                                            }
                                        })
                                    }}
                                />
                            </FormLayout.Group>

                        </FormLayout>
                    </LegacyCard>
                    {wishlistSetting.product_collection_button_type === '1' ?
                        <Fragment>
                            <LegacyCard title={"Customize Wishlist Button Before Adding"} sectioned>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <ColorInput label={"Button color"}
                                                    value={wishlistSetting.product_collection_button_color_before}
                                                    name="product_collection_button_color_before" onChange={handleChange}/>
                                        <div></div>
                                    </FormLayout.Group>
                                </FormLayout>
                            </LegacyCard>
                            <LegacyCard title={"Customize Wishlist Button After Adding"} sectioned>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <ColorInput label={"Button color"}
                                                    value={wishlistSetting.product_collection_button_color_after}
                                                    name="product_collection_button_color_after" onChange={handleChange}/>
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
                                        <TextField label="Button text"
                                                   value={wishlistSetting.product_collection_button_text_before}
                                                   onChange={(value) => handleChange({
                                                       target: {
                                                           name: "product_collection_button_text_before",
                                                           value
                                                       }
                                                   })}
                                        />
                                        <ColorInput label={"Button color"}
                                                    value={wishlistSetting.product_collection_button_color_before}
                                                    name="product_collection_button_color_before" onChange={handleChange}/>
                                    </FormLayout.Group>
                                    <FormLayout.Group condensed>
                                        <ColorInput label={"Button background color"}
                                                    value={wishlistSetting.product_collection_button_bg_color_before}
                                                    name="product_collection_button_bg_color_before"
                                                    onChange={handleChange}/>
                                        <ColorInput label={"Border Color"}
                                                    value={wishlistSetting.product_collection_button_border_color_before}
                                                    name="product_collection_button_border_color_before"
                                                    onChange={handleChange}/>
                                    </FormLayout.Group>
                                </FormLayout>
                            </LegacyCard>
                            <LegacyCard title={"Customize Wishlist Button After Adding"} sectioned>
                                <FormLayout>
                                    <FormLayout.Group condensed>
                                        <TextField label="Button text"
                                                   value={wishlistSetting.product_collection_button_text_after}
                                                   onChange={(value) => handleChange({
                                                       target: {
                                                           name: "product_collection_button_text_after",
                                                           value
                                                       }
                                                   })}
                                        />
                                        <ColorInput label={"Button color"}
                                                    value={wishlistSetting.product_collection_button_color_after}
                                                    name="product_collection_button_color_after"
                                                    onChange={handleChange}/>
                                    </FormLayout.Group>
                                    <FormLayout.Group condensed>
                                        <ColorInput label={"Button background color"}
                                                    value={wishlistSetting.product_collection_button_bg_color_after}
                                                    name="product_collection_button_bg_color_after"
                                                    onChange={handleChange}/>
                                        <ColorInput label={"Border Color"}
                                                    value={wishlistSetting.product_collection_button_border_color_after}
                                                    name="product_collection_button_border_color_after"
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
                        <LegacyStack distribution={"fill"}>
                            <div className={"relative"}>
                                <img src={"https://wishlist.thimatic-apps.com/assets/images/product3.jpg"} width={"200px"}/>
                                <div className="btn-collection">
                                    <div className="d-flex wl_collection_btn_position">
                                        <button
                                            className="d-flex align-items-center wl_collection_btn_before">
                                            {wishlistSetting && wishlistSetting.icon ?
                                                <div
                                                    dangerouslySetInnerHTML={{__html: wishlistSetting && wishlistSetting.icon}}/>
                                                :
                                                Icons.wishlistIcon
                                            }
                                            &nbsp;
                                            {wishlistSetting.product_collection_button_type == "3" ? wishlistSetting.product_collection_button_text_before : ""} (10)
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={"relative"}>
                                <img src={"https://wishlist.thimatic-apps.com/assets/images/product3.jpg"} width={"200px"}/>
                                <div className="btn-collection">
                                    <div className="d-flex wl_collection_btn_position">
                                        <button
                                            className="d-flex align-items-center wl_collection_btn_before">
                                            {wishlistSetting && wishlistSetting.icon ?
                                                <div
                                                    dangerouslySetInnerHTML={{__html: wishlistSetting && wishlistSetting.icon}}/>
                                                :
                                                Icons.wishlistIcon
                                            }
                                            &nbsp;
                                            {wishlistSetting.product_collection_button_type == "3" ? wishlistSetting.product_collection_button_text_before : ""} (10)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </LegacyStack>
                    </LegacyCard>
                    <LegacyCard title="Preview (after adding to wishlist)" sectioned>
                        <LegacyStack distribution={"fill"}>
                            <div className={"relative"}>
                                <img src={"https://wishlist.thimatic-apps.com/assets/images/product3.jpg"} width={"200px"}/>
                                <div className="btn-collection">
                                    <div className="d-flex wl_collection_btn_position">
                                        <button
                                            className="d-flex align-items-center wl_collection_btn_after">
                                            {wishlistSetting && wishlistSetting.icon ?
                                                <div
                                                    dangerouslySetInnerHTML={{__html: wishlistSetting && wishlistSetting.icon}}/>
                                                :
                                                Icons.wishlistIconFill
                                            }
                                            &nbsp;
                                            {wishlistSetting.product_collection_button_type == "3" ? wishlistSetting.product_collection_button_text_after : ""}
                                            &nbsp;
                                            {wishlistSetting.product_collection_total_count == "1" ? "(10)" : ""}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={"relative"}>
                                <img src={"https://wishlist.thimatic-apps.com/assets/images/product3.jpg"} width={"200px"}/>
                                <div className="btn-collection">
                                    <div className="d-flex wl_collection_btn_position">
                                        <button
                                            className="d-flex align-items-center wl_collection_btn_after">
                                            {wishlistSetting && wishlistSetting.icon ?
                                                <div
                                                    dangerouslySetInnerHTML={{__html: wishlistSetting && wishlistSetting.icon}}/>
                                                :
                                                Icons.wishlistIconFill
                                            }
                                            &nbsp;
                                            {wishlistSetting.product_collection_button_type == "3" ? wishlistSetting.product_collection_button_text_after : ""}
                                            &nbsp;
                                            {wishlistSetting.product_collection_total_count == "1" ? "(10)" : ""}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </LegacyStack>
                    </LegacyCard>
                </Layout.Section>
            </Fragment>
        );
    }
;

