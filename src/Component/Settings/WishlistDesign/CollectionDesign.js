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
    Button, Tabs, Grid
} from "@shopify/polaris";
import {Icons} from "../../../utils/Icons";

import {Helmet} from "react-helmet";
import ColorInput from "../../Comman/ColorInput";

const CollectionDesign = ({
                              wishlistSetting,
                              setWishlistSetting,
                              file,
                              setFile,
                              isSVGLoading,
                              updateIcon,
                              deleteIcon
                          }) => {
    const [selected, setSelected] = useState(0);
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
    const handleTabChange = (selectedTabIndex) => {
        setSelected(selectedTabIndex)
    }
    const tabs = [
        {
            id: 'wishlist-button',
            content: 'Wishlist button',
            panelID: 'wishlist-button',
        },
        {
            id: 'button-before',
            content: 'Button before',
            panelID: 'button-before',
        },
        {
            id: 'button-after',
            content: 'Button after',
            panelID: 'button-after',
        },
    ];
    const fileUpload = (!file && !wishlistSetting.icon) ? <DropZone.FileUpload/> : "";
    const uploadedFile = (
        <Fragment>
            {
                (file.name || wishlistSetting && wishlistSetting.icon) ?
                <div className={"uploadedFile"}>
                    {
                        file.name ? <Thumbnail alt={file.name} source={window.URL.createObjectURL(file)}/> : wishlistSetting && wishlistSetting.icon ? <div className="wl_logo" dangerouslySetInnerHTML={{__html: wishlistSetting && wishlistSetting.icon}}/> : ""
                    }
                </div> : ""
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
                <LegacyCard>
                    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
                </LegacyCard>
                <LegacyCard>
                    {
                        selected === 0 && <LegacyCard.Section>
                            <FormLayout>
                                <FormLayout.Group condensed>
                                    <RadioButton label={Icons.wishlistIcon} checked={wishlistSetting.product_collection_button_type === "1"} id="disabled" name="product_collection_button_type" value={wishlistSetting.product_collection_button_type} onChange={() => handleChange({
                                            target: {
                                                name: "product_collection_button_type",
                                                value: "1"
                                            }
                                        })}/>
                                    <RadioButton label={<LegacyStack>
                                                <LegacyStack.Item>
                                                    {Icons.wishlistIcon}
                                                </LegacyStack.Item>
                                                <LegacyStack.Item>
                                                    Wishlist
                                                </LegacyStack.Item>
                                            </LegacyStack>} id="optional" name="product_collection_button_type" checked={wishlistSetting.product_collection_button_type === "3"} value={wishlistSetting.product_collection_button_type} onChange={() => handleChange({target: {name: "product_collection_button_type", value: "3"}})}/>
                                    <div/>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <LegacyStack vertical spacing={"extraTight"}>
                                        <DropZone
                                            label={
                                                <div className={"Polaris-Label-full"}>
                                                    <LegacyStack spacing={"none"} alignment={"baseline"}>
                                                        <LegacyStack.Item fill>Select Icon</LegacyStack.Item>
                                                        <LegacyStack.Item>{file &&
                                                        <Button size={"slim"} outline onClick={updateIcon} loading={isSVGLoading}>Upload</Button>}
                                                            {wishlistSetting.icon &&
                                                            <Button size={"slim"} outline onClick={deleteIcon} loading={isSVGLoading}>Remove</Button>}</LegacyStack.Item>
                                                    </LegacyStack>
                                                </div>
                                            }
                                            accept=".svg"
                                            allowMultiple={false}
                                            errorOverlayText="File type must be.svg"
                                            onDrop={handleDropZoneDrop}
                                        >
                                            {uploadedFile}
                                            {fileUpload}
                                        </DropZone>
                                        <Text color={"critical"}>Note: You can add only svg</Text>
                                    </LegacyStack>
                                </FormLayout.Group>
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
                        </LegacyCard.Section>
                    }
                    {
                        selected === 1 && <LegacyCard.Section>
                            {wishlistSetting.product_collection_button_type === '1' ? <FormLayout>
                                <FormLayout.Group condensed>
                                    <ColorInput label={"Button color"}
                                                value={wishlistSetting.product_collection_button_color_before}
                                                name="product_collection_button_color_before" onChange={handleChange}/>
                                    <div/>
                                </FormLayout.Group>
                            </FormLayout> : <FormLayout>
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
                            }
                        </LegacyCard.Section>
                    }
                    {
                        selected === 2 && <LegacyCard.Section>
                            {wishlistSetting.product_collection_button_type === '1' ? <FormLayout>
                                <FormLayout.Group>
                                    <ColorInput label={"Button color"}
                                                value={wishlistSetting.product_collection_button_color_after}
                                                name="product_collection_button_color_after" onChange={handleChange}/>
                                    <div></div>
                                </FormLayout.Group>
                            </FormLayout> : <FormLayout>
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
                            }
                        </LegacyCard.Section>
                    }
                </LegacyCard>

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
                <LegacyCard title="Preview (before adding to wishlist)" sectioned>
                    <Grid>
                        {
                            Array.from(Array(2)).map((_, i) => {
                               return(
                                   <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}} key={i}>
                                       <div className={"preview-collection"}>
                                           <figure>
                                               <img src={`https://wishlist.thimatic-apps.com/assets/images/product${i + 1}.jpg`}/>
                                           </figure>
                                           <div className="btn-collection">
                                               <div className="d-flex wl_collection_btn_position">
                                                   <button className="d-flex align-items-center wl_collection_btn_before">{wishlistSetting && wishlistSetting.icon ? <div dangerouslySetInnerHTML={{__html: wishlistSetting && wishlistSetting.icon}}/> : Icons.wishlistIcon}&nbsp;{wishlistSetting.product_collection_button_type == "3" ? wishlistSetting.product_collection_button_text_before : ""} (10)</button>
                                               </div>
                                           </div>
                                       </div>
                                   </Grid.Cell>
                               )
                            })
                        }
                    </Grid>

                </LegacyCard>
                <LegacyCard title="Preview (after adding to wishlist)" sectioned>
                    <Grid>
                        {
                            Array.from(Array(2)).map((_, i) => {
                                return(
                                    <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}} key={i}>
                                        <div className={"preview-collection"}>
                                            <figure>
                                                <img src={`https://wishlist.thimatic-apps.com/assets/images/product${i + 1}.jpg`}/>
                                            </figure>
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
                                    </Grid.Cell>
                                )
                            })
                        }
                    </Grid>
                </LegacyCard>
            </Layout.Section>
        </Fragment>
    );
}
export default CollectionDesign



