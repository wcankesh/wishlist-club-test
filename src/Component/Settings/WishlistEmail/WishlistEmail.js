import React, {useEffect, useState} from 'react';
import {
    Page, Layout, TextField, Text, Button, Card, BlockStack, InlineStack, Box, Divider, Badge,
    Checkbox, OptionList, Select
} from "@shopify/polaris";
import {apiService, baseUrl, capitalizeMessage, isChecked, toggleFlag, validateForm} from "../../../utils/Constant";
import {useNavigate} from "react-router-dom"
import ToastMessage from "../../Comman/ToastMessage";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {RenderLoading} from "../../../utils/RenderLoading";
import {initialKeys} from "./Common";
import SwitchButton from "../../Comman/SwitchButton";

const initialState = {
    subject: "",
    from_name: "",
    from_email: "",
    is_email_reminder_on_off: 0,
    is_email_reminder_on_off_price: 0,
    is_email_reminder_on_off_restock: 0,
    offer_reminder: 0,
    stock_reminder: 0,
    weekly_reminder: 0,
    is_notification_mail: 0,
    is_multiple_restock_mail: 0,
    reply_to_mail: '',
};
const initialStateError = {from_email: ""};

const WishlistEmail = () => {
    const navigate = useNavigate();
    const [emailSetting, setEmailSetting] = useState(initialState);
    const [emailSettingError, setEmailSettingError] = useState(initialStateError);
    const [isLoading, setIsLoading] = useState(true);
    const [isSave, setIsSave] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isErrorServer, setIsErrorServer] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedOption, setSelectedOption] = useState("1");
    const Customization_Email = [
        {
            title: "Wishlist Items",
            description: "Users will receive a wishlist reminder email based on the specified number of days.",
            path: "settings/email/wishlist-items",
            name: "is_email_reminder_on_off",
            value: emailSetting.is_email_reminder_on_off,
            checked: emailSetting.is_email_reminder_on_off == 0,
            key: initialKeys?.wishlistItems,
        },
        {
            title: "Price Drop Alerts",
            description: "An email notification will be sent to if the price of a wishlist item drops.",
            path: "settings/email/price-drop-alert",
            name: "is_email_reminder_on_off_price",
            value: emailSetting.is_email_reminder_on_off_price,
            checked: emailSetting.is_email_reminder_on_off_price == 0,
            key: initialKeys?.priceDropAlert,
        },
        {
            title: "Restock Alerts",
            description: "Email notification will be send when the wishlist item is restocked.",
            path: "settings/email/restock-alert",
            name: "is_email_reminder_on_off_restock",
            value: emailSetting.is_email_reminder_on_off_restock,
            checked: emailSetting.is_email_reminder_on_off_restock == 0,
            key: initialKeys?.restockAlert,
        },
    ];

    const CustomizationEmailSettings = [
        {
            title: 'Acknowledgements',
            inputs: [
                {
                    title: "Added to Wishlist",
                    description: "Great choice! This item has been successfully added to your wishlist. You can easily find it later and purchase when you're ready. Don't wait too long—popular items sell out fast!",
                    path: "settings/email/restock-alert",
                    name: "is_email_reminder_on_off_restock",
                    value: emailSetting?.add_wishlist_setting?.is_enable,
                    checked: emailSetting?.add_wishlist_setting?.is_enable == 1,
                    key: initialKeys?.addedWishlist,
                },
                {
                    title: "Removed from Wishlist",
                    description: "This item has been removed from your wishlist. Changed your mind? No worries! You can always add it back to keep track of your favorite products.",
                    path: "settings/email/restock-alert",
                    name: "is_email_reminder_on_off_restock",
                    value: emailSetting?.remove_wishlist_setting?.is_enable,
                    checked: emailSetting?.remove_wishlist_setting?.is_enable == 1,
                    key: initialKeys?.removeWishlist,
                },
            ]
        },
        {
            title: 'Reminders',
            inputs: [
                {
                    title: "Abandonment Reminder",
                    description: "Still thinking it over? The items in your wishlist are waiting for you, but they might not be available for long. Complete your purchase now before they sell out!",
                    path: "settings/email/restock-alert",
                    name: "is_email_reminder_on_off_restock",
                    value: emailSetting?.abandonment_reminder_setting?.is_enable,
                    checked: emailSetting?.abandonment_reminder_setting?.is_enable == 1,
                    key: initialKeys?.abandonmentReminder,
                },
            ]
        },
        {
            title: 'Alerts',
            inputs: [

                {
                    title: "Low Stock Alert",
                    description: "Only a few left! This item is in high demand and stock is running low. Secure yours now before it's gone for good!",
                    path: "settings/email/restock-alert",
                    name: "is_email_reminder_on_off_restock",
                    value: emailSetting?.low_stock_setting?.is_enable,
                    checked: emailSetting?.low_stock_setting?.is_enable == 1,
                    key: initialKeys?.lowStockAlert,
                },
            ]
        },
    ];

    const EmailSetting = async () => {
        const response = await apiService.emailSetting();
        if (response.status === 200) {
            setIsError(false)
            setEmailSetting(response.data)
            setIsLoading(false)
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsLoading(false)
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true);
            setIsLoading(false)
        }
    }

    useEffect(() => {
        EmailSetting()
    }, []);

    const formValidate = (name, value) => {
        const validEmailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        switch (name) {
            case "from_email":
                if (!value || value.trim() === "") {
                    return "Email is required";
                } else if (!value?.match(validEmailRegex)) {
                    return "Enter a valid email address";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onChangeReportWishlist = async (name, value) => {
        const payload = {
            ...emailSetting,
            wishlist_report_setting: {...emailSetting?.wishlist_report_setting, [name]: value}
        };
        setEmailSetting(payload);
        await saveEmailSetting('wishlist_report_setting', payload);
    }

    const saveEmailSetting = async (field, FieldPayload) => {
        if (field !== 'wishlist_report_setting') {
            const isValidForm = validateForm(emailSetting, setEmailSettingError, formValidate)
            if (isValidForm) {
                return;
            }
        }
        setIsSave(true);
        const payload = field === 'wishlist_report_setting' ? {...FieldPayload} : {...emailSetting};
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload))
        const response = await apiService.updateEmailSetting(formData, emailSetting.id);
        if (response.status === 200) {
            setIsError(false)
            setIsSave(false);
            setMessage(capitalizeMessage(response.message))
            // EmailSetting();
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsSave(false);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsSave(false);
        }
    }

    const notificationUpdate = async (e) => {
        const {name, value} = e.target;
        const payload = {...emailSetting, [name]: value,}
        setEmailSetting(payload)
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload))
        const response = await apiService.updateEmailSetting(formData, emailSetting.id);
        if (response.status === 200) {
            setMessage(capitalizeMessage(response.message))
            EmailSetting()
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
        setEmailSetting({...emailSetting, [name]: value})
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setEmailSetting({...emailSetting, [name]: value})
        setEmailSettingError({...emailSettingError, [name]: value.trim() ? "" : emailSettingError[name]})
    }

    const onBlur = (e) => {
        const {name, value} = e.target
        setEmailSettingError({...emailSettingError, [name]: formValidate(name, value)})
    }

    const onBack = () => {
        navigate(`${baseUrl}/settings`);
    };

    const WishlistNotifications = [
        {
            label: 'Notification mail',
            name: 'is_notification_mail',
            help: 'Enabling this setting allows store owners to stay updated through email notifications when users add products to their wishlist.'
        },
        {
            label: 'Multiple Restock Notification',
            name: 'is_multiple_restock_mail',
            help: 'If you disabled this feature, restock notifications will be sent only once per item. Enable to notify customers each time the item is restocked.'
        },
    ]

    const onRedirect = (link) => {
        navigate(`${baseUrl}/settings/email/email-customization?active_email_tab=${link}`);
    };

    const RenderCardItem = ({item}) => {
        return (
            <Card>
                <InlineStack align={"space-between"} blockAlign={"start"} wrap={false}
                             gap={"200"}>
                    <InlineStack gap={"400"} wrap={false}>
                        <BlockStack gap={"100"}>
                            <Text fontWeight='semibold' as={"span"}>{item.title}</Text>
                            <Text tone={"subdued"} as={"span"}>{item.description}</Text>
                        </BlockStack>
                    </InlineStack>
                    {isLoading ? <Badge>
                        <div style={{width: 62}}>&nbsp;</div>
                    </Badge> : <Badge
                        tone={item.checked ? "success" : "critical"}>{item.checked ? "Enabled" : "Disabled"} </Badge>}
                </InlineStack>
            </Card>
        )
    }

    return (
        <Page title={"Wishlist Email"} backAction={{content: 'Settings', onAction: onBack}}>
            <div className="sticky-component">
                <Layout>
                    {message !== "" && isError === false ?
                        <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                                      setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner link={AppDocsLinks.article["425"]} message={message} setMessage={setMessage}
                                       setIsError={setIsError} isError={isError}/>


                    <Layout.Section variant="oneThird">
                        {isLoading ? <Card>{RenderLoading.commonParagraph}</Card> :
                            <Card padding={"100"}>
                                <OptionList onChange={(event) => setSelectedOption(event[0])} selected={selectedOption}
                                            options={[
                                                {value: "1", label: "From Email & Name"},
                                                {value: "2", label: "Email Customization"},
                                                {value: "3", label: "Wishlist Notifications"},
                                            ]}/>
                            </Card>
                        }
                    </Layout.Section>

                    {isLoading ? <Layout.Section><Card>{RenderLoading.commonParagraph}</Card></Layout.Section> :
                        <Layout.Section>
                            {selectedOption === "1" &&
                            <Card padding={"0"}>
                                <Box padding={"400"}>
                                    <BlockStack gap={"100"}>
                                        <Text as={"span"} variant={"headingMd"}>From Email & Name</Text>
                                        <Text as={"span"} tone={"subdued"}>Add the "Name" in From name and "Email id" in
                                            From email you want users to see while receiving the Wishlist alerts</Text>
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"400"}>
                                    <BlockStack gap={"400"}>
                                        <TextField label="From name" value={emailSetting.from_name}
                                                   onChange={(value) => handleChange({
                                                       target: {name: "from_name", value}
                                                   })}/>
                                        <TextField type="email" label="From email" value={emailSetting.from_email}
                                                   name={"from_email"} error={emailSettingError.from_email}
                                                   onBlur={onBlur}
                                                   onChange={(value) => handleChange({
                                                       target: {name: "from_email", value}
                                                   })}/>
                                        <TextField type="email" label="Reply to email"
                                                   value={emailSetting.reply_to_mail}
                                                   name={"reply_to_mail"}
                                                   onChange={(value) => handleChange({
                                                       target: {name: "reply_to_mail", value}
                                                   })}/>
                                        <InlineStack align={"end"}>
                                            <Button variant={"primary"} loading={isSave}
                                                    onClick={saveEmailSetting}>Save</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Card>}

                            {selectedOption === "2" &&
                            <BlockStack gap={'300'}>
                                <Card padding={"0"}>
                                    <Box padding={"400"}>
                                        <BlockStack gap={"100"}>
                                            <Text as={"span"} variant={"headingMd"}>Email Customization</Text>
                                            <Text as={"span"} tone={"subdued"}>Send alerts when the products are on
                                                Wishlist.
                                                Also, send price drop & restock alerts for the products in
                                                Wishlist.</Text>
                                            <Text as={"span"} tone={"caution"}><b>Note: </b> These notifications
                                                (Wishlist
                                                Items,
                                                Price Drop Alerts, and Restock Alerts) are exclusively sent to
                                                registered
                                                users
                                                and
                                                not to guest users.</Text>
                                        </BlockStack>
                                    </Box>
                                    <Divider/>
                                    {
                                        (Customization_Email || []).map((x, i) => {
                                            return (
                                                <div onClick={() => onRedirect(x.key)}
                                                     className={"cursor-pointer"} key={i}>
                                                    <Box padding={"400"}>
                                                        <InlineStack align={"space-between"} blockAlign={"start"}
                                                                     wrap={false}
                                                                     gap={"200"}>
                                                            <InlineStack gap={"400"} wrap={false}>
                                                                <BlockStack gap={"100"}>
                                                                    <Text fontWeight='semibold'
                                                                          as={"span"}>{x.title}</Text>
                                                                    <Text tone={"subdued"}
                                                                          as={"span"}>{x.description}</Text>
                                                                </BlockStack>
                                                            </InlineStack>
                                                            {isLoading ? <Badge>
                                                                <div style={{width: 62}}>&nbsp;</div>
                                                            </Badge> : <Badge
                                                                tone={x.checked ? "success" : "critical"}>{x.checked ? "Enabled" : "Disabled"} </Badge>}
                                                        </InlineStack>
                                                    </Box>
                                                    <Divider/>
                                                </div>
                                            )
                                        })}
                                </Card>

                                <Card padding={'0'}>
                                    <BlockStack inlineAlign={'start'} gap={'300'}>
                                        {(CustomizationEmailSettings || []).map((x, i) => {
                                            return (
                                                <BlockStack inlineAlign={'start'} gap={'200'}>
                                                    <Box paddingInline={'400'} paddingBlockEnd={'0'}
                                                         paddingBlockStart={'400'}>
                                                        <Text as={'span'} variant={'headingMd'}>{x.title}</Text>
                                                    </Box>
                                                    <BlockStack inlineAlign={'start'} gap={'200'}>
                                                        {(x.inputs && x.inputs || []).map((item, inputIndex) => {
                                                            return (
                                                                <div key={inputIndex}
                                                                     onClick={() => onRedirect(item.key)}
                                                                     className={"cursor-pointer"}>
                                                                    <Box padding={"400"}>
                                                                        <InlineStack align={"space-between"}
                                                                                     blockAlign={"start"}
                                                                                     wrap={false}
                                                                                     gap={"200"}>
                                                                            <InlineStack gap={"400"} wrap={false}>
                                                                                <BlockStack gap={"100"}>
                                                                                    <Text fontWeight='semibold'
                                                                                          as={"span"}>{item.title}</Text>
                                                                                    <Text tone={"subdued"}
                                                                                          as={"span"}>{item.description}</Text>
                                                                                </BlockStack>
                                                                            </InlineStack>
                                                                            {isLoading ? <Badge>
                                                                                <div style={{width: 62}}>&nbsp;</div>
                                                                            </Badge> : <Badge
                                                                                tone={item.checked ? "success" : "critical"}>{item.checked ? "Enabled" : "Disabled"} </Badge>}
                                                                        </InlineStack>
                                                                    </Box>
                                                                    <Divider/>
                                                                </div>
                                                            )
                                                        })}
                                                    </BlockStack>
                                                </BlockStack>
                                            )
                                        })}

                                        <Box padding={'400'}>
                                            <BlockStack inlineAlign={'start'} gap={'200'}>
                                                <Text as={'span'} variant={'headingMd'}>{'Reports'}</Text>
                                                <BlockStack inlineAlign={'start'} gap={'200'}>
                                                    <InlineStack align={"space-between"} blockAlign={"start"}
                                                                 wrap={false}
                                                                 gap={"200"}>
                                                        <InlineStack gap={"400"} wrap={false}>
                                                            <BlockStack gap={"100"}>
                                                                <InlineStack gap={'150'} align={'start'}
                                                                             blockAlign={'center'}>
                                                                    <Text fontWeight='semibold' as={"span"}>Wishlist
                                                                        Report Setting</Text>
                                                                    <SwitchButton
                                                                        checked={emailSetting?.wishlist_report_setting?.is_enable == 1}
                                                                        onChange={() => onChangeReportWishlist('is_enable', toggleFlag(emailSetting?.wishlist_report_setting?.is_enable))}
                                                                        name={"is_enable"}/>
                                                                    <Select
                                                                        label="Type"
                                                                        labelInline
                                                                        options={[
                                                                            {label: 'Weekly', value: '1'},
                                                                            {label: 'Monthly', value: '2'},
                                                                        ]}
                                                                        name={'type'}
                                                                        onChange={(value) => onChangeReportWishlist('type', value)}
                                                                        value={emailSetting?.wishlist_report_setting?.type}
                                                                    />
                                                                </InlineStack>
                                                                <Text tone={"subdued"} as={"span"}>wishlist_report_setting
                                                                    Only a few left! This item is in high demand and
                                                                    stock is running low. Secure yours now before it's
                                                                    gone for good!</Text>
                                                            </BlockStack>
                                                        </InlineStack>
                                                        {isLoading ? <Badge>
                                                            <div style={{width: 62}}>&nbsp;</div>
                                                        </Badge> : <Badge
                                                            tone={emailSetting?.wishlist_report_setting?.is_enable == 1 ? "success" : "critical"}>{emailSetting?.wishlist_report_setting?.is_enable == 1 ? "Enabled" : "Disabled"} </Badge>}
                                                    </InlineStack>
                                                </BlockStack>
                                            </BlockStack>
                                        </Box>
                                    </BlockStack>
                                </Card>
                            </BlockStack>
                            }

                            {selectedOption === "3" &&
                            <Card>
                                <BlockStack gap={"400"}>
                                    <BlockStack gap={"100"}>
                                        <Text as={"span"} variant={"headingMd"}>Wishlist Notifications</Text>
                                        {/*<Text as={"span"} tone={"subdued"}>Enabling this setting allows store owners to stay updated through email notifications when users add products to their wishlist.</Text>*/}
                                    </BlockStack>
                                    {/* <Checkbox label={"Notification mail"} onChange={(checked) => notificationUpdate({
                                target: {name: "is_notification_mail", value: checked ? 1 : 0}
                            })} checked={emailSetting.is_notification_mail === 1}/>*/}

                                    <BlockStack gap={"100"}>
                                        {(WishlistNotifications || []).map((x, i) => {
                                            return (
                                                <Checkbox key={i} label={x.label}
                                                          checked={isChecked(emailSetting?.[x.name])}
                                                          helpText={x.help}
                                                          onChange={() => notificationUpdate({
                                                              target: {
                                                                  name: x.name,
                                                                  value: toggleFlag(emailSetting?.[x.name])
                                                              }
                                                          })}
                                                />
                                            )
                                        })}
                                    </BlockStack>
                                </BlockStack>
                            </Card>}
                        </Layout.Section>
                    }
                </Layout>
            </div>
        </Page>

    );
};
export default WishlistEmail;