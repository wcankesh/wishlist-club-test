import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
    Text,
    Button,
    BlockStack,
    Card,
    InlineStack,
    Collapsible,
    Modal,
    Icon,
    Link,
    Select,
    FormLayout,
    Checkbox,
    TextField,
    Divider, Box
} from "@shopify/polaris"
import {CaretUpMinor, CaretDownMinor} from "@shopify/polaris-icons"
import ToastMessage from "../../Comman/ToastMessage";
import CopyCode from '../../Comman/CopyCode'
import {apiService} from "../../../utils/Constant";
import {useSelector} from "react-redux";

const OnBoarding = () => {
    const [active, setActive] = useState(false);
    const [open, setOpen] = useState(true);
    const [selectedBoarding, setSelectedBoarding] = useState(0)
    const [selectedValue, setSelectedValue] = useState("");
    const [themeList, setThemeList] = useState([])
    const [setUpChecked, setSetUpChecked] = useState([]);
    const [requestMsg, setRequestMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const shopDetails = useSelector((state) => state.shopDetails)

    useEffect(() => {
        const getThemes = async () => {
            const response = await apiService.getThemes();
            if (response.status === 200) {
                let newArray = [];
                response.data.map((x, i) => {
                    let Obj = {
                        label: x.name,
                        value: x.id.toString()
                    }
                    newArray.push(Obj)
                })
                setThemeList(newArray);
            }
        }
        getThemes();
    }, [])

    const onSubmitMail = async () => {
        setIsLoading(true)
        const themeName = themeList.find((x) => x.value == selectedValue) || {value: ''}
        const payload = {
            shop: shopDetails.shop,
            theme: themeName.value,
            setup_code: JSON.stringify(setUpChecked),
            message: requestMsg
        }
        const response = await apiService.codeSetup(payload)
        if (response.status === 200) {
            setSetUpChecked([]);
            setRequestMsg('');
            setSelectedValue('');
            setIsLoading(false)
            setActive(false)
            setMessage(response.message)
        } else {
            setMessage(response.message)
            setIsLoading(false)
        }
    }

    const onChangeChecked = (e) => {
        const clone = [...setUpChecked];
        const index = clone.findIndex((x) => x === e);
        if (index === -1) {
            clone.push(e)
        } else {
            clone.splice(index, 1)
        }
        setSetUpChecked(clone)
    }

    const handleToggle = () => {
        setOpen(!open)
    };

    const handleModalChange = useCallback(() => setActive(!active), [active]);

    const handleClose = () => {
        handleModalChange();
    };

    const boardingOptions = [
        {
            selected: 0,
            title: "Set-Up Code Easily"
        },
        {
            selected: 1,
            title: "Set-up Wishlist on Header"
        },
        {
            selected: 2,
            title: "Turn On Our App"
        },
        {
            selected: 3,
            title: "Preview Wishlist Directly"
        },
    ]

    return (
        <Fragment>
            <ToastMessage message={message} setMessage={setMessage} isErrorServer={false}/>

            <Card padding={"0"}>

                <Box padding={"400"}>
                    <div className={"reb-card-heading-boding"} onClick={handleToggle}>
                        <BlockStack>
                            <InlineStack wrap={false} align={"space-between"}>
                                <Text variant="headingSm" as="h2" fontWeight={"medium"}
                                      breakWord={true}>{"Wishlist app setting is easy just follow 1 to 4 steps to set up and display wishlist icon on your store."}</Text>
                                <div onClick={handleToggle}><Icon source={open ? CaretUpMinor : CaretDownMinor}/>
                                </div>
                            </InlineStack>
                        </BlockStack>
                    </div>
                </Box>

                <Collapsible
                    open={open} id="basic-collapsible" expandOnPrint
                    transition={{duration: "500ms", timingFunction: "ease-in-out"}}>

                    <Divider/>

                    <Box padding={"200"}>
                        {
                            (boardingOptions || []).map((x, i) => {
                                return (
                                    <Fragment key={i}>
                                        <div onClick={() => setSelectedBoarding(x.selected)}>
                                            <div className={"reb-card-analytics"}
                                                 style={{background: selectedBoarding === x.selected ? 'var(--p-color-bg-surface-secondary)' : ""}}>
                                                <BlockStack gap={"0"}>
                                                    <InlineStack wrap={false} align={"space-between"}>
                                                        <InlineStack gap="300" wrap={false}>
                                                            <div
                                                                className={`boding-count ${selectedBoarding === x.selected ? "boding-count-active" : ""}`}>
                                                                {i + 1}
                                                            </div>
                                                            {selectedBoarding === x.selected ?
                                                                <Text variant="headingSm" as="h3"
                                                                      fontWeight={"medium"}>{x.title}</Text> :
                                                                <Text variant="headingSm" as="h3"
                                                                      fontWeight={"regular"}>{x.title}</Text>}
                                                        </InlineStack>
                                                        <InlineStack>
                                                            {selectedBoarding === x.selected && x.selected === 0 ?
                                                                <Button variant="primary" size={"slim"}
                                                                        onClick={handleModalChange}>
                                                                    Request code setup
                                                                </Button> : ""
                                                            }
                                                        </InlineStack>
                                                    </InlineStack>

                                                    <InlineStack>
                                                        {selectedBoarding === x.selected && x.selected === 0 && (
                                                            <div style={{paddingLeft: 32}}>
                                                                <BlockStack gap={"400"}>
                                                                    <BlockStack gap={"100"}>
                                                                        <Text variant="headingSm" as="h3"
                                                                              fontWeight={"medium"}>Product Page</Text>
                                                                        <Text>Open <Text as={"span"}
                                                                                         fontWeight={"bold"}>product-form.liquid</Text> file
                                                                            or <Text as={"span"}
                                                                                     fontWeight={"bold"}>main-product.liquid</Text> file
                                                                            or <Text as={"span"}
                                                                                     fontWeight={"bold"}>product-template.liquid</Text> file.</Text>
                                                                        <Text>Please add the below code where you want
                                                                            to show the wishlist icon.</Text>
                                                                        <CopyCode
                                                                            value={`<div class="th_prd_wl_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                                    </BlockStack>
                                                                    <BlockStack gap={"100"}>
                                                                        <Text variant="headingSm" as="h3"
                                                                              fontWeight={"medium"}>Collection
                                                                            Page</Text>
                                                                        <Text>Open <Text as={"span"}
                                                                                         fontWeight={"bold"}>card-product.liquid</Text> file
                                                                            or <Text as={"span"}
                                                                                     fontWeight={"bold"}>product-card-grid.liquid </Text>file
                                                                            or <Text as={"span"}
                                                                                     fontWeight={"bold"}>product-card-list.liquid </Text>file
                                                                            or<Text as={"span"}
                                                                                    fontWeight={"bold"}>product-grid-item.liquid </Text> file.</Text>
                                                                        <Text>Please add the below code where you want
                                                                            to show the wishlist icon.</Text>
                                                                        <CopyCode
                                                                            value={`<div class="th_wl_col_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                                    </BlockStack>
                                                                </BlockStack>
                                                            </div>
                                                        )}
                                                        {selectedBoarding === x.selected && x.selected === 2 && (
                                                            <div style={{paddingLeft: 32}}>
                                                                <BlockStack gap="400">
                                                                    <BlockStack gap={"100"}>
                                                                        <Text>1. Open your Shopify store Theme <Link
                                                                            url={`https://${shopDetails.shop}/admin/themes`}
                                                                            removeUnderline external> open</Link></Text>
                                                                        <Text>2. Then click on the <Text as={"span"}
                                                                                                         fontWeight={"bold"}>Customize</Text> button.</Text>
                                                                        <Text>3. Then click on the <Text as={"span"}
                                                                                                         fontWeight={"bold"}>Theme
                                                                            settings</Text> button and click on <Text
                                                                            as={"span"} fontWeight={"bold"}>App
                                                                            embeds</Text>tab.</Text>
                                                                        <Text>4. Then turn on <Link url={"https://wishlist.thimatic-apps.com/api/public/assets/images/start-our-app.png"} removeUnderline external><Text as={"span"} fontWeight={"bold"}>Wishlist Club</Text></Link> App.</Text>
                                                                    </BlockStack>
                                                                </BlockStack>
                                                            </div>

                                                        )}
                                                        {selectedBoarding === x.selected && x.selected === 3 && (
                                                            <div style={{paddingLeft: 32}}>
                                                                <BlockStack gap={"300"}>
                                                                    <Text> Check your wishlist preview directly from
                                                                        here.</Text>
                                                                    <InlineStack>
                                                                        <Button variant={"primary"}
                                                                                onClick={() => window.open(`https://${shopDetails.shop}`)}>Preview
                                                                            Wishlist</Button>
                                                                    </InlineStack>
                                                                </BlockStack>
                                                            </div>
                                                        )}
                                                        {selectedBoarding === x.selected && x.selected === 1 && (
                                                            <div style={{paddingLeft: 32}}>
                                                                <BlockStack gap={"400"}>
                                                                    <BlockStack gap={"100"}>
                                                                        <Text variant="headingSm" as="h3"
                                                                              fontWeight={"medium"}>Add wishlist icon in
                                                                            header</Text>
                                                                        <Text>Open <Text as={"span"}
                                                                                         fontWeight={"bold"}>product-form.liquid</Text> file
                                                                            or <Text as={"span"}
                                                                                     fontWeight={"bold"}>main-product.liquid</Text> file
                                                                            or <Text as={"span"}
                                                                                     fontWeight={"bold"}>product-template.liquid</Text> file.</Text>
                                                                        <Text>Please add the below code where you want
                                                                            to show the wishlist icon.</Text>
                                                                        <CopyCode
                                                                            value={`<div class="th_prd_wl_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                                    </BlockStack>
                                                                    <BlockStack gap={"100"}>
                                                                        <Text variant="headingSm" as="h3"
                                                                              fontWeight={"medium"}>Add wishlist menu in
                                                                            header</Text>
                                                                        <Text>1. Open your Shopify store main navigation<Link
                                                                            url={`https://${shopDetails.shop}/admin/themes`}
                                                                            removeUnderline external> open</Link></Text>
                                                                        <Text>2. Then select your main menu and click
                                                                            on <Text as={"span"}
                                                                                     fontWeight={"bold"}> Add menu
                                                                                item</Text> to add a new menu
                                                                            item.</Text>
                                                                        <Text>3. Choose menu name.</Text>
                                                                        <Text>4. Paste the following link into the Link
                                                                            text box: <Text as={"span"}
                                                                                            fontWeight={"bold"}>/apps/wishlist/</Text></Text>
                                                                        <Text>5. Click on Save Menu</Text>
                                                                    </BlockStack>
                                                                </BlockStack>
                                                            </div>

                                                        )}
                                                    </InlineStack>
                                                </BlockStack>
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            })
                        }
                    </Box>
                </Collapsible>
            </Card>

            <Modal
                open={active}
                onClose={handleClose}
                title="Request code setup"
                primaryAction={{
                    content: 'Submit',
                    onAction: onSubmitMail,
                    loading: isLoading
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleClose,
                    },
                ]}
            >
                <Modal.Section>
                    <BlockStack gap={400}>
                        <Select
                            name={"theme"}
                            label="Theme"
                            options={themeList}
                            onChange={(value) => setSelectedValue(value)}
                            value={selectedValue}
                            helpText={"Please select the theme you would like us to install the Wishlist Club on."}
                        />
                        <BlockStack>
                            <Text as={"h5"} fontWeight={"medium"}>Where do you want to display wishlist icon?</Text>
                            <FormLayout>
                                <FormLayout.Group>
                                    <Checkbox
                                        label="Product Page"
                                        onChange={() => onChangeChecked('Product Page')}
                                        checked={setUpChecked.includes("Product Page")}
                                    />
                                    <Checkbox
                                        label="Collection Page"
                                        onChange={() => onChangeChecked('Collection Page')}
                                        checked={setUpChecked.includes("Collection Page")}
                                    />
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Checkbox
                                        label="Add wishlist icon in header"
                                        onChange={() => onChangeChecked('Add wishlist icon in header')}
                                        checked={setUpChecked.includes("Add wishlist icon in header")}
                                    />
                                    <Checkbox
                                        label="Add wishlist menu in header"
                                        onChange={() => onChangeChecked('Add wishlist menu in header')}
                                        checked={setUpChecked.includes("Add wishlist menu in header")}
                                    />
                                </FormLayout.Group>
                            </FormLayout>
                        </BlockStack>
                        <InlineStack>
                            <TextField
                                multiline={4}
                                label={"Message"}
                                value={requestMsg}
                                onChange={(e) => setRequestMsg(e)}
                                helpText={"You can speed things up by providing your your collaborator request code if your store requires one."}
                            />
                        </InlineStack>
                    </BlockStack>
                </Modal.Section>
            </Modal>
        </Fragment>
    );
};

export default OnBoarding;