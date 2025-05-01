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
    InlineGrid, Badge, Icon,
    Select,
    Button, Tabs, Grid, Divider
} from "@shopify/polaris";
import { Icons } from "../../../utils/Icons";
import { Helmet } from "react-helmet";
import { StarIcon } from '@shopify/polaris-icons';
import ColorInput from "../../Comman/ColorInput";
import { Product1, Product2, Product3, Product5 } from "../../../utils/AppImages";

const CollectionDesign = ({ wishlistSetting, setWishlistSetting, file, setFile, isSVGLoading, updateIcon, deleteIcon }) => {
    const [selected, setSelected] = useState(0);
    const options = [
        { label: 'Grid', value: '0' },
        { label: 'List', value: '1' },
    ];
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
    ];
    const fileUpload = (!file && !wishlistSetting.icon) ? <DropZone.FileUpload /> : "";
    const uploadedFile = (
        <Fragment>
            {
                (file.name || wishlistSetting && wishlistSetting.icon) ?
                    <div className={"uploadedFile"}>
                        {
                            file.name ? <Thumbnail alt={file.name} source={window.URL.createObjectURL(file)} /> : wishlistSetting && wishlistSetting.icon ? <div className="wl_logo" dangerouslySetInnerHTML={{ __html: wishlistSetting && wishlistSetting.icon }} /> : ""
                        }
                    </div> : ""
            }
        </Fragment>
    );
    const products = [
        { id: 1, title: 'Grape Juice', image: Product1, price: 1159, compareAt: 3998, rating: 4.5, ratingsCount: 90 },
        { id: 3, title: 'Mango Mix', image: Product3, price: 1259, compareAt: 3999, rating: 4.8, ratingsCount: 120 },
        { id: 4, title: 'Berry Blast', image: Product5, price: 899, compareAt: 2999, rating: 4.3, ratingsCount: 65 },
    ];

    const CollectionPreview = ({ preview }) => {
        return (
            <InlineGrid columns={{ xs: 1, sm: 2, md: 2, lg: 3 }} gap="200">
                {products.map((product) => (
                    <Box key={product.id} padding="200" background="bg-surface" borderRadius="300" shadow="300">
                        <BlockStack gap="100">
                            <img
                                src={product.image}
                                alt={product.title}
                                style={{ width: '100%', borderRadius: '8px', }}
                            />
                            <Text variant="headingMd" as="h1" fontWeight='regular'>Women Hand Bag</Text>
                            <Box maxWidth="fit-content" >
                                <InlineStack gap="100" blockAlign="center" wrap={false}>
                                    <Text variant="headingMd" fontWeight="bold">
                                        $1159
                                    </Text>
                                </InlineStack>
                            </Box>
                            <div className="d-flex wl_collection_btn_position">
                                <button
                                    className={`d-flex align-items-center wl_btn_collection ${preview === "after" ? "wl_collection_btn_after" : "wl_collection_btn_before"}`}>
                                    {wishlistSetting && wishlistSetting.icon ?
                                        <div
                                            dangerouslySetInnerHTML={{ __html: wishlistSetting && wishlistSetting.icon }} />
                                        :
                                        preview == "after" ? Icons.wishlistIconFill : Icons.wishlistIcon
                                    }
                                    <p>
                                        &nbsp;
                                        {wishlistSetting.product_collection_button_type == "3" ? preview === "after" ? wishlistSetting.product_collection_button_text_after : wishlistSetting.product_collection_button_text_before : ""}
                                        &nbsp;
                                        {wishlistSetting.product_collection_total_count == "1" ? "(10)" : ""}
                                    </p>
                                </button>
                            </div>
                            <BlockStack gap="100">
                                <Button fullWidth tone="primary">Add to Cart</Button>
                            </BlockStack>
                        </BlockStack>
                    </Box>
                ))}
            </InlineGrid>
        );
    };

    return (
        <Fragment>
            <Helmet style={[{
                "cssText": `
                .Polaris-BlockStack{position: relative;}
                .wl_collection_btn_before{ border:${wishlistSetting.product_collection_button_border_width}px solid ${wishlistSetting.product_collection_button_border_color_before};border-radius:${wishlistSetting.product_collection_button_border_radius}px;padding:${wishlistSetting.product_collection_button_top_bottom_padding}px ${wishlistSetting.product_collection_button_left_right_padding}px;color: ${wishlistSetting.product_collection_button_color_before};background-color:${wishlistSetting.product_collection_button_bg_color_before};     width:${wishlistSetting.product_collection_button_position == "4" ? "100%" : "auto"}    }
                .wl_btn_collection p {  font-size: 13px; margin-bottom: 4px }
                .wl_collection_btn_before svg, .wl_collection_btn_after svg{width: 20px;height:18px}
                .wl_collection_btn_before svg path{fill: ${wishlistSetting.product_collection_button_color_before}}                                          
                .wl_collection_btn_position{position: absolute; width: 100%;padding:8px; justify-content:${wishlistSetting.product_collection_button_position == "1" ? "left" : wishlistSetting.product_collection_button_position == "2" ? "right" : wishlistSetting.product_collection_button_position == "3" || wishlistSetting.product_collection_button_position == "4" ? "center" : ''}}
                .wl_collection_btn_after svg path {fill: ${wishlistSetting.product_collection_button_color_after}} 
                .wl_collection_btn_after{border:${wishlistSetting.product_collection_button_border_width}px solid ${wishlistSetting.product_collection_button_border_color_after}; border-radius:${wishlistSetting.product_collection_button_border_radius}px;padding:${wishlistSetting.product_collection_button_top_bottom_padding}px ${wishlistSetting.product_collection_button_left_right_padding}px; color: ${wishlistSetting.product_collection_button_color_after};background-color:${wishlistSetting.product_collection_button_bg_color_after}; width:${wishlistSetting.product_collection_button_position == "4" ? "100%" : "auto"} }
                `
            }]}>
            </Helmet>

            <Layout.Section >
                <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4 }}>
                        <Card padding={"0"}>
                            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
                            <Divider />
                            {
                                selected === 0 &&
                                <Box padding={"400"} paddingBlockStart={"200"}>
                                    <FormLayout>
                                        <FormLayout.Group condensed>
                                            <InlineStack align={"space-between"}>
                                                <RadioButton label={Icons.wishlistIcon} checked={wishlistSetting.product_collection_button_type === "1"} id="disabled" name="product_collection_button_type" value={wishlistSetting.product_collection_button_type} onChange={() => handleChange({
                                                    target: {
                                                        name: "product_collection_button_type",
                                                        value: "1"
                                                    }
                                                })} />
                                                <RadioButton label={<InlineStack gap={"400"}>{Icons.wishlistIcon}Wishlist</InlineStack>} id="optional" name="product_collection_button_type" checked={wishlistSetting.product_collection_button_type === "3"} value={wishlistSetting.product_collection_button_type} onChange={() => handleChange({ target: { name: "product_collection_button_type", value: "3" } })} />
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
                                                                    <Button size={"slim"} outline onClick={updateIcon} loading={isSVGLoading}>Upload</Button>}
                                                                {wishlistSetting.icon &&
                                                                    <Button size={"slim"} outline onClick={deleteIcon} loading={isSVGLoading}>Remove</Button>}
                                                            </InlineStack>
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
                                                <Text tone={"subdued"} as={"span"}>Note: Only SVG files are allowed for optimal quality</Text>
                                            </BlockStack>
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
                                                min={0}
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
                                                min={0}
                                                suffix="PX"
                                            />
                                        </FormLayout.Group>
                                        <FormLayout.Group condensed>
                                            <TextField label="Vertical Padding"
                                                type="number"
                                                value={wishlistSetting.product_collection_button_top_bottom_padding}
                                                onChange={(value) => handleChange({
                                                    target: {
                                                        name: "product_collection_button_top_bottom_padding",
                                                        value
                                                    }
                                                })}
                                                min={0}
                                                suffix="PX"
                                            />
                                            <TextField label="Horizontal Padding"
                                                type="number"
                                                value={wishlistSetting.product_collection_button_left_right_padding}
                                                onChange={(value) => handleChange({
                                                    target: {
                                                        name: "product_collection_button_left_right_padding",
                                                        value
                                                    }
                                                })}
                                                min={0}
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
                                                }} />
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
                                </Box>
                            }
                            {
                                selected === 1 &&
                                <Fragment>
                                    <Box padding={"400"} paddingBlockStart={"200"}>
                                        <Box paddingBlock={"300"}>
                                            <Text variant='headingMd' >Before  Button</Text>
                                        </Box>
                                        <Box >
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
                                                        name="product_collection_button_color_before" onChange={handleChange} />
                                                </FormLayout.Group>
                                                {/* <FormLayout.Group condensed> */}
                                                <ColorInput label={"Button background color"}
                                                    value={wishlistSetting.product_collection_button_bg_color_before}
                                                    name="product_collection_button_bg_color_before"
                                                    onChange={handleChange} />
                                                <ColorInput label={"Border Color"}
                                                    value={wishlistSetting.product_collection_button_border_color_before}
                                                    name="product_collection_button_border_color_before"
                                                    onChange={handleChange} />
                                                {/* </FormLayout.Group> */}
                                            </FormLayout>
                                        </Box>
                                        <Box paddingBlock={"300"}><Text variant='headingMd' >After  Button</Text>
                                        </Box>
                                        <Box >
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
                                                        onChange={handleChange} />
                                                </FormLayout.Group>
                                                {/* <FormLayout.Group condensed> */}
                                                <ColorInput label={"Button background color"}
                                                    value={wishlistSetting.product_collection_button_bg_color_after}
                                                    name="product_collection_button_bg_color_after"
                                                    onChange={handleChange} />
                                                <ColorInput label={"Border Color"}
                                                    value={wishlistSetting.product_collection_button_border_color_after}
                                                    name="product_collection_button_border_color_after"
                                                    onChange={handleChange} />
                                                {/* </FormLayout.Group> */}
                                            </FormLayout>
                                        </Box>
                                    </Box>
                                </Fragment>
                            }
                        </Card>
                    </Grid.Cell >
                    <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 8 }}>
                        <BlockStack gap={"200"}>
                            <Card padding={"300"}>
                                <BlockStack gap={"100"}>
                                    <Text as={"span"} variant={"headingMd"}>Preview (before adding to wishlist)</Text>
                                    <CollectionPreview preview={"before"} />
                                </BlockStack>
                            </Card>
                            <Card padding={"300"}>
                                <BlockStack gap={"100"}>
                                    <Text as={"span"} variant={"headingMd"}>Preview (after adding to wishlist)</Text>
                                    <CollectionPreview preview={"after"} />
                                </BlockStack>
                            </Card>
                        </BlockStack>
                    </Grid.Cell>
                </Grid>
            </Layout.Section >
        </Fragment>
    );
}
export default CollectionDesign