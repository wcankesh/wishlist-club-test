import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
    Text,
    Button,
    LegacyCard,
    LegacyStack,
    Collapsible,
    List,
    Modal,
    Icon,
    Link,
    Select,
    FormLayout,
    Checkbox,
    TextField,
    Divider
} from "@shopify/polaris"
import {CaretUpMinor, CaretDownMinor, ThumbsUpMajor, ThumbsDownMajor} from "@shopify/polaris-icons"
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

            <div className={"reb-card"}>
                <div className={"reb-card-section"}>
                    <div className={"reb-card-heading-boding"} onClick={handleToggle}>
                        <LegacyStack vertical spacing={"tight"}>
                            <LegacyStack alignment={"center"} wrap={false}>
                                <LegacyStack.Item fill>
                                    <Text variant="headingSm" as="h2"
                                          breakWord={true}>{"Wishlist app setting is easy just follow 1 to 4 steps to set up and display wishlist icon on your store."}</Text>
                                </LegacyStack.Item>
                                <LegacyStack.Item>
                                    <div onClick={handleToggle}><Icon source={open ? CaretUpMinor : CaretDownMinor}/>
                                    </div>
                                </LegacyStack.Item>
                            </LegacyStack>
                        </LegacyStack>
                    </div>
                </div>
                <Collapsible
                    open={open} id="basic-collapsible" expandOnPrint
                    transition={{duration: "500ms", timingFunction: "ease-in-out"}}>
                    <Divider/>
                    <div className={"reb-card-section"}>
                        {
                            (boardingOptions || []).map((x, i) => {
                                return (
                                    <Fragment key={i}>
                                        <div className={"mb-1 cursor-pointer"}
                                             onClick={() => setSelectedBoarding(x.selected)}>
                                            <div className={"reb-card-analytics"}
                                                 style={{background: selectedBoarding === x.selected ? 'var(--p-color-bg-subdued)' : ""}}>
                                                <LegacyStack spacing={"extraTight"} wrap={false}>
                                                    <LegacyStack.Item>
                                                        <div
                                                            className={`boding-count ${selectedBoarding === x.selected ? "boding-count-active" : ""}`}>{i + 1}</div>
                                                        &nbsp;
                                                        &nbsp;
                                                        &nbsp;
                                                        &nbsp;
                                                    </LegacyStack.Item>
                                                    <LegacyStack.Item fill>
                                                        <LegacyStack> <LegacyStack.Item>{selectedBoarding === x.selected ?
                                                            <Text variant="headingSm" as="h3">{x.title}</Text> :
                                                            <Text variant="headingSm" as="h3"
                                                                  fontWeight={"regular"}>{x.title}</Text>}
                                                        </LegacyStack.Item>
                                                        </LegacyStack>
                                                        {selectedBoarding === x.selected && x.selected === 0 && (
                                                            <div style={{marginTop: 12}}>
                                                                <LegacyStack vertical>
                                                                    <LegacyStack.Item>
                                                                        <LegacyStack spacing={"tight"} vertical>
                                                                            <LegacyStack.Item><Text variant="headingSm" as="h3">Product Page</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>Open <Text as={"span"} fontWeight={"bold"}>product-form.liquid</Text> file or <Text as={"span"} fontWeight={"bold"}>main-product.liquid</Text> file or <Text as={"span"} fontWeight={"bold"}>product-template.liquid</Text> file.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>Please add the below code where you want to show the wishlist icon.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item>
                                                                                <CopyCode value={`<div class="th_prd_wl_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                                            </LegacyStack.Item>
                                                                        </LegacyStack>
                                                                    </LegacyStack.Item>
                                                                    <LegacyStack.Item>
                                                                        <LegacyStack spacing={"tight"} vertical>
                                                                            <LegacyStack.Item><Text variant="headingSm" as="h3">Collection Page</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>Open <Text as={"span"} fontWeight={"bold"}>card-product.liquid</Text> file or <Text as={"span"} fontWeight={"bold"}>product-card-grid.liquid </Text>file or <Text as={"span"} fontWeight={"bold"}>product-card-list.liquid </Text>file or<Text as={"span"} fontWeight={"bold"}>product-grid-item.liquid </Text> file.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>Please add the below code where you want to show the wishlist icon.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item> <CopyCode value={`<div class="th_wl_col_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/></LegacyStack.Item>
                                                                        </LegacyStack>
                                                                    </LegacyStack.Item>
                                                                </LegacyStack>
                                                            </div>
                                                        )}
                                                        {selectedBoarding === x.selected && x.selected === 2 && (
                                                            <div style={{marginTop: 12}}>
                                                                <LegacyStack vertical>
                                                                    <LegacyStack.Item>
                                                                        <LegacyStack spacing={"tight"} vertical>
                                                                            <LegacyStack.Item><Text>1. Open your Shopify store Theme <Link url={`https://${shopDetails.shop}/admin/themes`} removeUnderline external> open</Link></Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>2. Then click on the <Text as={"span"} fontWeight={"bold"}>Customize</Text> button.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>3. Then click on the <Text as={"span"} fontWeight={"bold"}>Theme settings</Text> button and click on <Text as={"span"} fontWeight={"bold"}>App embeds</Text>tab.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>4. Then turn on <Text as={"span"} fontWeight={"bold"}>Wishlist Club</Text> App.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item>
                                                                                <Link
                                                                                    url={"https://wishlist.thimatic-apps.com/api/public/assets/images/start-our-app.png"}
                                                                                    external>
                                                                                    <img
                                                                                        src="https://wishlist.thimatic-apps.com/api/public/assets/images/start-our-app.png"
                                                                                        alt="Black choker necklace"
                                                                                        className={"install-img"}
                                                                                    />
                                                                                </Link>
                                                                            </LegacyStack.Item>
                                                                        </LegacyStack>
                                                                    </LegacyStack.Item>
                                                                </LegacyStack>
                                                            </div>

                                                        )}
                                                        {selectedBoarding === x.selected && x.selected === 3 && (
                                                            <div style={{marginTop: 12}}>
                                                            <LegacyStack vertical>
                                                                <LegacyStack.Item>
                                                                    <Text> Check your wishlist preview directly from here.</Text>
                                                                </LegacyStack.Item>
                                                                <LegacyStack.Item>
                                                                    <Button primary onClick={() => window.open(`https://${shopDetails.shop}`)}>Preview
                                                                        Wishlist</Button>
                                                                </LegacyStack.Item>
                                                            </LegacyStack>
                                                            </div>
                                                        )}
                                                        {selectedBoarding === x.selected && x.selected === 1 && (
                                                            <div style={{marginTop: 12}}>
                                                                <LegacyStack vertical>
                                                                    <LegacyStack.Item>
                                                                        <LegacyStack spacing={"tight"} vertical>
                                                                            <LegacyStack.Item><Text variant="headingSm" as="h3">Add wishlist icon in header</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>Open <Text as={"span"} fontWeight={"bold"}>product-form.liquid</Text> file or <Text as={"span"} fontWeight={"bold"}>main-product.liquid</Text> file or <Text as={"span"} fontWeight={"bold"}>product-template.liquid</Text> file.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>Please add the below code where you want to show the wishlist icon.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item>
                                                                                <CopyCode value={`<div class="th_prd_wl_btn" data-product_id="{{product.id}}" data-variant_id="{{product.selected_or_first_available_variant.id}}"></div>`}/>
                                                                            </LegacyStack.Item>
                                                                        </LegacyStack>
                                                                    </LegacyStack.Item>
                                                                    <LegacyStack.Item>
                                                                        <LegacyStack spacing={"tight"} vertical>
                                                                            <LegacyStack.Item><Text variant="headingSm" as="h3">Add wishlist menu in header</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>1. Open your Shopify store main navigation<Link url={`https://${shopDetails.shop}/admin/themes`} removeUnderline external> open</Link></Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>2. Then select your main menu and click on <Text as={"span"} fontWeight={"bold"}> Add menu item</Text> to add a new menu item.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>3. Choose menu name.</Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>4. Paste the following link into the Link text box: <Text as={"span"} fontWeight={"bold"}>/apps/wishlist/</Text></Text></LegacyStack.Item>
                                                                            <LegacyStack.Item><Text>5. Click on Save Menu</Text></LegacyStack.Item>
                                                                        </LegacyStack>
                                                                    </LegacyStack.Item>
                                                                </LegacyStack>
                                                            </div>

                                                            )}
                                                    </LegacyStack.Item>

                                                    <LegacyStack.Item>
                                                        {selectedBoarding === x.selected && x.selected === 0 ?
                                                        <Button size={"slim"} primary onClick={handleModalChange}>Request
                                                            code setup</Button> : <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> }
                                                    </LegacyStack.Item>
                                                </LegacyStack>
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            })
                        }
                    </div>

                </Collapsible>

            </div>
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
                    <LegacyStack vertical>
                        <LegacyStack.Item>
                            <Select
                                name={"theme"}
                                label="Theme"
                                options={themeList}
                                onChange={(value) => setSelectedValue(value)}
                                value={selectedValue}
                                helpText={"Please select the theme you would like us to install the Wishlist Club on."}
                            />
                        </LegacyStack.Item>
                        <LegacyStack.Item>
                            <Text as={"h5"} fontWeight={"semibold"}>Where do you want to display wishlist icon?</Text>
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
                        </LegacyStack.Item>
                        <LegacyStack.Item>
                            <TextField
                                multiline={4}
                                label={"Message"}
                                value={requestMsg}
                                onChange={(e) => setRequestMsg(e)}
                                helpText={"You can speed things up by providing your your collaborator request code if your store requires one."}
                            />
                        </LegacyStack.Item>
                    </LegacyStack>
                </Modal.Section>
            </Modal>
        </Fragment>
    );
};

export default OnBoarding;