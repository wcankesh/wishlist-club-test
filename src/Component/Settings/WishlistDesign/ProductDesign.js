import React, { Fragment, useCallback, useState } from 'react';
import {
    FormLayout,
    TextField,
    Layout,
    Box,
    Card,
    InlineStack,
    BlockStack,
    RadioButton,
    Thumbnail,
    DropZone,
    Text,
    Checkbox,
    Select,
    Button,
    Tabs, Divider,
    Grid,
    InlineGrid,
    Icon,
    Badge
} from "@shopify/polaris";
import { Icons } from "../../../utils/Icons";
import ColorInput from "../../Comman/ColorInput";
import { Helmet } from "react-helmet";
import { Product1, Product2, Product3, Product5 } from "../../../utils/AppImages";
import { StarIcon } from '@shopify/polaris-icons';

const ProductDesign = ({ wishlistSetting, setWishlistSetting, updateIcon, file, setFile, isSVGLoading, deleteIcon }) => {
    const [selected, setSelected] = useState(0);

    const btn_options = [
        { label: 'Left', value: '1' },
        { label: 'Right', value: '2' },
        { label: 'Center', value: '3' },
        { label: 'FullWidth', value: '4' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
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

    const fileUpload = (!file && !wishlistSetting.icon) ? <DropZone.FileUpload /> : "";

    const uploadedFile = (
        <Fragment>
            {
                (file.name || wishlistSetting && wishlistSetting.icon) ?
                    <div className={"uploadedFile"}>
                        {
                            file.name ? <Thumbnail alt={file.name} source={window.URL.createObjectURL(file)} /> : wishlistSetting && wishlistSetting.icon ?
                                <div className="wl_logo" dangerouslySetInnerHTML={{ __html: wishlistSetting && wishlistSetting.icon }} /> : ""
                        }
                    </div> : ""
            }
        </Fragment>
    );

    const handleTabChange = (selectedTabIndex) => {
        setSelected(selectedTabIndex)
    }
    const tabs = [
        {
            id: 'wishlist-button',
            content: 'Button UI',
            panelID: 'wishlist-button',
        },
        {
            id: 'button-before',
            content: 'Before & After Button',
            panelID: 'button-before',
        },
        // {
        //     id: 'button-after',
        //     content: 'Button after',
        //     panelID: 'button-after',
        // },
    ];
    const WishlistPreview = ({ wishlistSetting, preview }) => {
        return (
            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 5, xl: 5 }}>
                    <InlineGrid columns={2} gap="200">
                        <img src={Product1} alt="Product 1" style={{ width: '100%', borderRadius: '6px' }} />
                        <img src={Product2} alt="Product 2" style={{ width: '100%', borderRadius: '6px' }} />
                        <img src={Product3} alt="Product 3" style={{ width: '100%', borderRadius: '6px' }} />
                        <img src={Product5} alt="Product 4" style={{ width: '100%', borderRadius: '6px' }} />
                    </InlineGrid>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 7, xl: 7 }}>
                    <BlockStack gap="400"  >
                        <BlockStack gap="200">
                            <Text variant="headingLg" as="h1" fontWeight='regular'>Women Hand Bag</Text>
                            <Text variant="bodyMd" tone="subdued" >Solid Leather Structured Handheld bag</Text>
                            <Box
                                maxWidth="fit-content"
                                padding="100"
                                borderWidth="050"
                                borderColor="border"
                                borderRadius="base"
                            >
                                <InlineStack gap="4" blockAlign="center" wrap={false}>
                                    <Box
                                        borderInlineEndWidth="050"
                                        borderColor="border"
                                        paddingInline={100}
                                    >
                                        <InlineStack gap="2" blockAlign="center" wrap={false}>
                                            <Text variant="bodySm">4.5</Text>
                                            <Box paddingBlockEnd="025">
                                                <Icon source={StarIcon} tone="warning" />
                                            </Box>
                                        </InlineStack>
                                    </Box>
                                    <Box paddingInline={100}  >
                                        <Text variant="bodySm" color="subdued">
                                            90 Ratings
                                        </Text>
                                    </Box>
                                </InlineStack>
                            </Box>
                        </BlockStack>
                        <Box maxWidth="fit-content"  >
                            <BlockStack gap="300" >
                                <InlineStack gap="200" blockAlign="center" wrap={false}>
                                    <Text variant="headingLg" fontWeight="bold">
                                        $1159
                                    </Text>
                                    <h3 > $3998</h3>
                                    <Text tone="critical" >
                                        (71% OFF)
                                    </Text>
                                </InlineStack>
                                <Text variant="bodyMd" >
                                    inclusive of all taxes
                                </Text>
                                <InlineStack gap="200" blockAlign="stretch" wrap={false} align='center'>
                                    <button className="custom-green-btn" >
                                        ADD TO BAG
                                    </button>
                                    <div className=" d-flex wishlist_position">
                                        <button className={`wl_btn ${preview == "after" ? "wishlist_btn_after" : "wishlist_btn_before"} `}>
                                            {wishlistSetting && wishlistSetting.icon ?
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: wishlistSetting && wishlistSetting.icon }} />
                                                :
                                                preview == "after" ? Icons.wishlistIconFill : Icons.wishlistIcon
                                            }
                                            &nbsp;&nbsp;
                                            {wishlistSetting.button_type == "3" ? preview == "after" ? wishlistSetting.button_text_after : wishlistSetting.button_text_before : ""}
                                            &nbsp;
                                            {wishlistSetting.total_count == "1" ? "(10)" : ""}
                                        </button>
                                    </div>
                                </InlineStack>
                            </BlockStack>
                        </Box>
                    </BlockStack>
                </Grid.Cell>

            </Grid>

        );
    };

    return (
        <Fragment>
            <Helmet style={[{
                "cssText": `
                .custom-green-btn { background-color: #ccfe90 !important;
    border: none;
    border-radius: 5px;
    padding: 0px 34px; border-radius:${wishlistSetting.button_border_radius}px;} h3 { text-decoration: line-through;}
                .wishlist_btn_before{border:${wishlistSetting.button_border_width}px solid ${wishlistSetting.button_border_color_before};border-radius:${wishlistSetting.button_border_radius}px;padding:${wishlistSetting.button_top_bottom_padding}px ${wishlistSetting.button_left_right_padding}px;color: ${wishlistSetting.button_color_before};background-color:${wishlistSetting.button_bg_color_before};width:${wishlistSetting.button_position == "4" ? "100%" : "auto"}}
                .wishlist_btn_before svg path{fill: ${wishlistSetting.button_color_before}}
                .wishlist_btn_before svg, .wishlist_btn_after svg{width: 20px;height:18px}
                .wishlist_position{justify-content:${wishlistSetting.button_position == "1" ? "left" : wishlistSetting.button_position == "2" ? "right" : wishlistSetting.button_position == "3" || wishlistSetting.button_position == "4" ? "center" : ''} }            
                .wishlist_btn_after svg path{fill: ${wishlistSetting.button_color_after}}
                .wishlist_btn_after{border:${wishlistSetting.button_border_width}px solid ${wishlistSetting.button_border_color_after};border-radius:${wishlistSetting.button_border_radius}px;padding:${wishlistSetting.button_top_bottom_padding}px ${wishlistSetting.button_left_right_padding}px; color: ${wishlistSetting.button_color_after};background-color:${wishlistSetting.button_bg_color_after};
                                     width:${wishlistSetting.button_position == "4" ? "100%" : "auto"}
                `
            }]}>
            </Helmet>
            <Layout.Section >
                <Grid gap={{
                    xs: '3',
                    sm: '4',
                    md: '5',
                    lg: 100,
                }} >
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4 }}>
                        <Card padding={"0"}>
                            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
                            <Divider />
                            {
                                selected === 0 &&
                                <Box padding={"400"} paddingBlockStart={"200"}>
                                    <FormLayout>
                                        <FormLayout.Group condense>
                                            <InlineStack align={"space-between"}>
                                                <RadioButton label={Icons.wishlistIcon}
                                                    checked={wishlistSetting.button_type === '1'} id="disabled"
                                                    name="button_type" value={wishlistSetting.button_type}
                                                    onChange={() => handleChange({
                                                        target: {
                                                            name: "button_type",
                                                            value: "1"
                                                        }
                                                    })}
                                                />
                                                <RadioButton label={<InlineStack gap={"400"}>{Icons.wishlistIcon}Wishlist</InlineStack>}
                                                    id="optional" name="button_type"
                                                    checked={wishlistSetting.button_type === '3'}
                                                    onChange={() => handleChange({
                                                        target: {
                                                            name: "button_type",
                                                            value: "3"
                                                        }
                                                    })} value={wishlistSetting.button_type}
                                                />
                                                &nbsp;
                                                <div></div>
                                            </InlineStack>
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <BlockStack gap={"100"}>
                                                <DropZone
                                                    label={
                                                        <div className={"Polaris-Label-full"}>
                                                            <InlineStack align={"space-between"}>
                                                                Choose Icon File
                                                                {file &&
                                                                    <Button size={"slim"} outline onClick={updateIcon} loading={isSVGLoading}>Upload</Button>
                                                                }
                                                                {wishlistSetting.icon &&
                                                                    <Button size={"slim"} outline onClick={deleteIcon} loading={isSVGLoading}>Remove</Button>
                                                                }
                                                            </InlineStack>
                                                        </div>}
                                                    accept=".svg"
                                                    allowMultiple={false}
                                                    errorOverlayText="File type must be.svg"
                                                    onDrop={handleDropZoneDrop}
                                                >
                                                    {uploadedFile}
                                                    {fileUpload}
                                                </DropZone>
                                                <Text tone={"subdued"} as={"span"}>Only SVG files are allowed for optimal quality</Text>
                                            </BlockStack>
                                        </FormLayout.Group>
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
                                                min={0}
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
                                                suffix="PX"
                                                min={0}
                                            />
                                        </FormLayout.Group>
                                        <FormLayout.Group condensed >
                                            <TextField label="Vertical Padding " type="number"
                                                value={wishlistSetting.button_top_bottom_padding}
                                                onChange={(value) => handleChange({
                                                    target: {
                                                        name: "button_top_bottom_padding",
                                                        value
                                                    }
                                                })}
                                                min={0}
                                                suffix="PX" />
                                            <TextField label="Horizontal Padding" type="number"
                                                value={wishlistSetting.button_left_right_padding}
                                                onChange={(value) => handleChange({
                                                    target: {
                                                        name: "button_left_right_padding",
                                                        value
                                                    }
                                                })}
                                                min={0}

                                                suffix="PX"
                                            />
                                        </FormLayout.Group>
                                        <FormLayout.Group condensed>
                                            <Select label="Button Postion"
                                                options={btn_options}
                                                value={wishlistSetting.button_position}
                                                onChange={(value) => {
                                                    handleChange({ target: { name: "button_position", value } })
                                                }}
                                            />
                                            <div></div>
                                        </FormLayout.Group>
                                        <FormLayout.Group>
                                            <Checkbox
                                                label="Show how many times the product has been added to the wishlist."
                                                checked={wishlistSetting.total_count == "1"}
                                                onChange={(checked) => {
                                                    handleChange({ target: { name: "total_count", value: checked ? "1" : "0" } })
                                                }}
                                            />
                                        </FormLayout.Group>
                                    </FormLayout>
                                </Box>

                            }
                            {
                                selected === 1 && <Fragment>
                                    <Box padding={"400"} paddingBlockStart={"200"}>
                                        <Box paddingBlock={"200"}><Text variant='headingMd' >Before  Button</Text></Box>
                                        <FormLayout >
                                            <FormLayout.Group condensed>
                                                <TextField
                                                    label="Button text"
                                                    value={wishlistSetting.button_text_before}
                                                    onChange={(value) => handleChange({
                                                        target: {
                                                            name: "button_text_before",
                                                            value
                                                        }
                                                    })}
                                                />
                                                <ColorInput
                                                    label={"Button color"}
                                                    name="button_color_before"
                                                    onChange={handleChange}
                                                    value={wishlistSetting.button_color_before}
                                                />
                                            </FormLayout.Group>
                                            {/* <FormLayout.Group condensed> */}
                                            <ColorInput
                                                label={"Button background color"}
                                                name="button_bg_color_before"
                                                value={wishlistSetting.button_bg_color_before}
                                                onChange={handleChange}
                                            />
                                            <ColorInput
                                                label={"Border Color"}
                                                name="button_border_color_before"
                                                value={wishlistSetting.button_border_color_before}
                                                onChange={handleChange}
                                            />
                                            {/* </FormLayout.Group> */}
                                        </FormLayout>
                                    </Box>
                                </Fragment>
                            }
                            {
                                selected === 1 && <Fragment>
                                    <Box padding={"400"} paddingBlockStart={"200"}>
                                        <Box paddingBlock={"200"}><Text variant='headingMd' >After  Button</Text></Box>
                                        <FormLayout>
                                            <FormLayout.Group condensed>
                                                <TextField
                                                    label="Button text"
                                                    value={wishlistSetting.button_text_after}
                                                    onChange={(value) => handleChange({
                                                        target: {
                                                            name: "button_text_after",
                                                            value
                                                        }
                                                    })}
                                                />
                                                <ColorInput
                                                    label={"Button color"}
                                                    name="button_color_after"
                                                    onChange={handleChange}
                                                    value={wishlistSetting.button_color_after}
                                                />
                                            </FormLayout.Group>
                                            {/* <FormLayout.Group condensed> */}
                                            <ColorInput
                                                label={"Button background color"}
                                                name="button_bg_color_after"
                                                value={wishlistSetting.button_bg_color_after}
                                                onChange={handleChange} />
                                            <ColorInput
                                                label={"Border Color"}
                                                name="button_border_color_after"
                                                value={wishlistSetting.button_border_color_after}
                                                onChange={handleChange}
                                            />
                                            {/* </FormLayout.Group> */}
                                        </FormLayout>
                                    </Box>
                                </Fragment>
                            }

                        </Card>
                    </Grid.Cell >
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 8 }}>
                        <BlockStack gap={"400"}>
                            <Card padding={"400"}>
                                <BlockStack gap={"300"}>
                                    <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Preview (before  adding to wishlist)</Text>
                                    <WishlistPreview wishlistSetting={wishlistSetting} preview={"before"} />
                                </BlockStack>
                            </Card >
                            <Card padding={"400"}>
                                <BlockStack gap={"300"}>
                                    <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Preview (after adding to wishlist)</Text>
                                    <WishlistPreview wishlistSetting={wishlistSetting} preview={"after"} />
                                </BlockStack>
                            </Card>
                        </BlockStack >
                    </Grid.Cell>
                </Grid>
            </Layout.Section >
        </Fragment >
    );
}
export default ProductDesign
