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
    TextField
} from "@shopify/polaris"
import {CaretUpMinor, CaretDownMinor, ThumbsUpMajor, ThumbsDownMajor} from "@shopify/polaris-icons"
import {ToastMessage} from "../../ToastMessage";
import {CopyCode} from '../../CopyCode'
import {apiService} from "../../../utils/Constant";
import {useSelector} from "react-redux";


export function OnBoarding() {
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
            setIsLoading(true)
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
                setIsLoading(false)
            } else {
                setIsLoading(false)
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
    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    const handleModalChange = useCallback(() => setActive(!active), [active]);

    const handleClose = () => {
        handleModalChange();
    };

    return (
        <Fragment>
            <ToastMessage message={message} setMessage={setMessage}/>
            <LegacyCard>
                <LegacyCard.Section
                    title={"Wishlist app setting is easy just follow 1 to 5 steps to set up and display wishlist icon on your store."}
                    actions={[
                        {content: <Icon source={open ? CaretUpMinor : CaretDownMinor}/>, onAction: handleToggle}
                    ]}/>
                <Collapsible
                    open={open}
                    id="basic-collapsible"
                    transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                    expandOnPrint
                >
                    <div className="rows no-gutters">
                        <div className="col col-lg-3 col-12">
                            <ul className="boringListNav">
                                <li className={selectedBoarding === 0 ? "is-active-nav" : ""}
                                    onClick={() => setSelectedBoarding(0)}>
                                    <span>1</span> Setup code
                                </li>
                                <li className={selectedBoarding === 1 ? "is-active-nav" : ""}
                                    onClick={() => setSelectedBoarding(1)}>
                                    <span>2</span> Wishlist Page
                                </li>
                                <li className={selectedBoarding === 2 ? "is-active-nav" : ""}
                                    onClick={() => setSelectedBoarding(2)}>
                                    <span>3</span> Turn On Our App
                                </li>
                                <li className={selectedBoarding === 3 ? "is-active-nav" : ""}
                                    onClick={() => setSelectedBoarding(3)}>
                                    <span>4</span> Preview Wishlist
                                </li>
                                <li className={selectedBoarding === 4 ? "is-active-nav" : ""}
                                    onClick={() => setSelectedBoarding(4)}>
                                    <span>5</span> Enjoy
                                </li>
                            </ul>
                        </div>
                        <div className="col col-md-9 col-12">
                            <div className="boringListContain">
                                {selectedBoarding === 0 && (
                                    <LegacyStack vertical>
                                        <LegacyStack distribution={"equalSpacing"} wrap spacing={"tight"}
                                                     alignment={"center"}>
                                            <Text variant="headingMd" as="h6">Set-Up Code Easily</Text>
                                            <Button primary onClick={handleModalChange}>Request code setup</Button>
                                        </LegacyStack>
                                        <List type="bullet">
                                            <List.Item>Product Page</List.Item>
                                            <LegacyStack>
                                                <Text>Open <Text as={"span"}
                                                                 fontWeight={"bold"}>product-form.liquid</Text> file
                                                    or <Text as={"span"} fontWeight={"bold"}>main-product.liquid</Text>file
                                                    or <Text as={"span"}
                                                             fontWeight={"bold"}>product-template.liquid</Text>file.</Text>
                                                <Text>Please add the below code where you want to show the wishlist
                                                    icon.</Text>
                                            </LegacyStack>
                                        </List>
                                        <CopyCode
                                            value={`<div class="th_wl_btn" data-product_id="{{product.id}}" data-variant_id={{product.selected_or_first_available_variant.id}}></div>`}/>
                                        <List type="bullet">
                                            <List.Item>Collection Page</List.Item>
                                            <LegacyStack>
                                                <Text>Open <Text as={"span"}
                                                                 fontWeight={"bold"}>card-product.liquid</Text> file
                                                    or <Text as={"span"}
                                                             fontWeight={"bold"}>product-card-grid.liquid </Text>file
                                                    or <Text as={"span"}
                                                             fontWeight={"bold"}>product-card-list.liquid </Text>file or<Text
                                                        as={"span"}
                                                        fontWeight={"bold"}>product-grid-item.liquid </Text> file.</Text>
                                                <Text>Please add the below code where you want to show the wishlist
                                                    icon.</Text>
                                            </LegacyStack>
                                        </List>
                                        <CopyCode
                                            value={`<div class="th_wl_btn" data-product_id="{{product.id}}" data-variant_id={{product.selected_or_first_available_variant.id}}></div>`}/>
                                    </LegacyStack>
                                )}
                                {selectedBoarding === 1 && (
                                    <LegacyStack vertical>
                                        <LegacyStack.Item>
                                            <Text variant="headingMd" as="h6">Set-up Wishlist on Header</Text>
                                        </LegacyStack.Item>
                                        <LegacyStack.Item>
                                            <List type="bullet">
                                                <List.Item>Add wishlist icon in header</List.Item>
                                                <List type="number">
                                                    <List.Item>Open your Shopify store Theme<Link
                                                        url={`https://${shopDetails.shop}/admin/themes`}
                                                        removeUnderline={true} external> open</Link></List.Item>
                                                    <List.Item>Then click on the <Text as={"span"}
                                                                                       fontWeight={"bold"}> Actions</Text> button
                                                        and click on <Text as={"span"} fontWeight={"bold"}> Edit
                                                            code.</Text></List.Item>
                                                    <List.Item>Open<Text as={"span"}
                                                                         fontWeight={"bold"}> header.liquid </Text>file.</List.Item>
                                                    <List.Item> Please add the below code if you want to display the
                                                        wishlist icon in the header.</List.Item>
                                                </List>
                                            </List>
                                        </LegacyStack.Item>
                                        <LegacyStack.Item>
                                            <CopyCode
                                                value={`<a href="/apps/wishlist" class="th_wlc_position_relative"><div class="th_wlc_product_count"></div><svg width="26" height="23" viewBox="0 0 26 23" fill="none"><path d="M24.8759 3.27339C24.1475 2.06525 23.0806 1.12141 21.8207 0.57048C20.3932 -0.0562504 18.7897 -0.169062 17.1839 0.245058C15.7124 0.624602 14.279 1.4478 13 2.64198C11.7209 1.44769 10.2874 0.624442 8.8156 0.244952C7.20974 -0.169327 5.60622 -0.0564097 4.17865 0.570745C2.91872 1.12185 1.8519 2.06588 1.12359 3.27418C0.360858 4.53529 -0.0271625 6.06892 0.00147825 7.70909C0.128635 15.0007 10.5135 21.6311 12.594 22.8863C12.7175 22.9608 12.8575 23 13 23C13.1425 23 13.2825 22.9608 13.406 22.8863C15.4867 21.6309 25.8725 14.9993 25.9986 7.70782C26.0269 6.06775 25.6387 4.53428 24.8759 3.27339V3.27339ZM24.3739 7.67728C24.3332 10.0348 22.8306 12.7835 20.0288 15.6259C17.4342 18.258 14.4828 20.242 13 21.1651C11.5172 20.2422 8.56627 18.2584 5.97185 15.6262C3.16993 12.784 1.66731 10.0356 1.62618 7.67808C1.58129 5.10386 2.77074 3.03273 4.80794 2.13773C5.4756 1.84606 6.19237 1.69728 6.91592 1.70019C8.78442 1.70019 10.7609 2.64623 12.4206 4.41138C12.4962 4.49179 12.5864 4.55566 12.6859 4.59926C12.7853 4.64285 12.8921 4.6653 12.9999 4.6653C13.1078 4.6653 13.2145 4.64285 13.314 4.59926C13.4134 4.55566 13.5036 4.49179 13.5792 4.41138C15.885 1.95916 18.8021 1.08796 21.1913 2.13757C23.2287 3.03225 24.4183 5.10307 24.3739 7.67712V7.67728Z" fill="black"></path></svg></a>`}/>
                                        </LegacyStack.Item>
                                        <LegacyStack.Item>
                                            <List type="bullet">
                                                <List.Item>Add wishlist menu in header</List.Item>
                                                <List type="number">
                                                    <List.Item> Open your Shopify store main navigation<Link
                                                        url={`https://${shopDetails.shop}/admin/themes`}
                                                        removeUnderline external> open</Link></List.Item>
                                                    <List.Item>Then select your main menu and click on <Text as={"span"}
                                                                                                             fontWeight={"bold"}> Add
                                                        menu item</Text> to add a new menu item</List.Item>
                                                    <List.Item> Choose menu name.</List.Item>
                                                    <List.Item> Paste the following link into the Link text box: <Text
                                                        as={"span"}
                                                        fontWeight={"bold"}>/apps/wishlist/</Text></List.Item>
                                                    <List.Item>Click on Save Menu</List.Item>
                                                </List>
                                            </List>
                                        </LegacyStack.Item>
                                    </LegacyStack>
                                )}
                                {selectedBoarding === 2 && (
                                    <LegacyStack vertical>
                                        <LegacyStack.Item>
                                            <Text variant="headingMd" as="h6">Turn On Our App</Text>
                                        </LegacyStack.Item>
                                        <LegacyStack.Item>
                                            <List type={"number"} spacing={"loose"}>
                                                <List.Item>Open your Shopify store Theme <Link
                                                    url={`https://${shopDetails.shop}/admin/themes`} removeUnderline
                                                    external> open</Link></List.Item>
                                                <List.Item>Then click on the <Text as={"span"}
                                                                                   fontWeight={"bold"}>Customize</Text> button.</List.Item>
                                                <List.Item>Then click on the <Text as={"span"} fontWeight={"bold"}>Theme
                                                    settings</Text> button and click on <Text as={"span"}
                                                                                              fontWeight={"bold"}>App
                                                    embeds</Text>tab.</List.Item>
                                                <List.Item>Then turn on <Text as={"span"} fontWeight={"bold"}>Wishlist
                                                    Club</Text> App.</List.Item>
                                            </List>
                                        </LegacyStack.Item>
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
                                )}
                                {selectedBoarding === 3 && (
                                    <LegacyStack vertical>
                                        <LegacyStack.Item>
                                            <Text variant="headingMd" as="h6">Preview Wishlist Directly</Text>
                                        </LegacyStack.Item>
                                        <LegacyStack.Item>
                                            <Text> Check your wishlist preview directly from here.</Text>
                                        </LegacyStack.Item>
                                        <LegacyStack.Item>
                                            <Button primary
                                                    onClick={() => window.open(`https://${shopDetails.shop}`)}>Preview
                                                Wishlist</Button>
                                        </LegacyStack.Item>
                                    </LegacyStack>
                                )}
                                {selectedBoarding === 4 && (
                                    <LegacyStack vertical>
                                        <Text as="span">Drive sales, engagement, and retention with Wishlist</Text>
                                        <LegacyStack>

                                            <div className='alert-info'>
                                                <p>If you have a minute. Tell us about your experiences with our
                                                    App?</p>
                                                <button className='px-1'>Good<Icon
                                                    source={ThumbsUpMajor}
                                                    color="base"
                                                /></button>
                                                <button>Bad<Icon
                                                    source={ThumbsDownMajor}
                                                    color="base"
                                                /></button>
                                            </div>
                                        </LegacyStack>
                                    </LegacyStack>
                                )}
                            </div>
                        </div>
                    </div>
                </Collapsible>
            </LegacyCard>
            <Modal
                open={active}
                onClose={handleClose}
                title="Request code setup"
                primaryAction={{
                    content: 'Submit',
                    onAction: onSubmitMail,
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
