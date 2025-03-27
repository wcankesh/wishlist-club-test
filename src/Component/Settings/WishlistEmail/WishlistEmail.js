import React, { useEffect, useState } from 'react';
import {
    Page, Layout, TextField, Text, Button, Card, BlockStack, InlineStack, Box, Divider, Badge,
    Checkbox, Select,
    Tabs,
    PageActions
} from "@shopify/polaris";
import { apiService, baseUrl, capitalizeMessage, isChecked, toggleFlag, validateForm } from "../../../utils/Constant";
import { useNavigate } from "react-router-dom"
import ToastMessage from "../../Comman/ToastMessage";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import { AppDocsLinks } from "../../../utils/AppDocsLinks";
import { RenderLoading } from "../../../utils/RenderLoading";
import { initialKeys } from "./Common";
import SwitchButton from "../../Comman/SwitchButton";
import { Icons } from "../../../utils/Icons";
import qs from "qs";
import BackInStockEmail from '../../BackInStock/BackInStockEmail/BackInStockEmail';

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
const initialStateError = { from_email: "" };

const WishlistEmail = () => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(0);
    const [backInStockDesign, setBackInStockDesign] = useState(initialState);
    const [backInStockDesignError, setBackInStockDesignError] = useState(initialStateError);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const urlParams = new URLSearchParams(window.location.search);
    const urlStep = urlParams.get("step") || '0';
    const [emailSetting, setEmailSetting] = useState(initialState);
    const [emailSettingError, setEmailSettingError] = useState(initialStateError);
    const [isSave, setIsSave] = useState(false);
    const [selectedOption, setSelectedOption] = useState(Number(urlStep));
    useEffect(() => {
        bisSetting()
    }, []);
    const bisSetting = async () => {
        const response = await apiService.bisSetting();
        if (response.status === 200) {
            setBackInStockDesign(response.data);
            setIsError(false)
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
    }

    const updateBisSetting = async () => {

        let validationErrors = {};
        let tempObj = {
            submit_button_text: backInStockDesign.subscription_form.submit_button_text,
            success_message: backInStockDesign.subscription_message.success_message,
            already_subscribed_message: backInStockDesign.subscription_message.already_subscribed_message
        }
        Object.keys(tempObj).forEach((name) => {
            const error = formValidate(name, tempObj[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setBackInStockDesignError(validationErrors);
            return;
        }
        setIsLoading(true)
        delete backInStockDesign.bis_logo
        delete backInStockDesign.thankyou_logo

        const formData = new FormData();
        const updatedObject = { ...backInStockDesign, id: backInStockDesign.id ? backInStockDesign.id : "" };
        const updatedInnerObject = { ...updatedObject.product_page_widget };
        updatedInnerObject.button_type = "1";
        updatedObject.product_page_widget = updatedInnerObject;

        formData.append("payload", JSON.stringify(backInStockDesign))
        const response = await apiService.updateBisSetting(formData)
        if (response.status === 200) {
            setIsLoading(false)
            setMessage(capitalizeMessage(response.message))
            setIsError(false)
            bisSetting();
        } else if (response.status === 500) {
            setIsLoading(false)
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setIsLoading(false)
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }

    }


    const handleTabChange = (selectedTabIndex) => {
        let IsTabChange = true
        Object.keys(backInStockDesignError).map((x) => {
            if (backInStockDesignError[x] !== "") {
                IsTabChange = false
            }
        })
        if (IsTabChange) {
            setSelected(selectedTabIndex)
        }
    }

    const tabs1 = [
        { id: 'all-customers-1', content: 'Product Page', panelID: 'all-customers-content-1' },
        { id: 'accepts-marketing-1', content: 'Home Page', panelID: 'accepts-marketing-content-1' },
        { id: 'repeat-customers-1', content: 'Collection Page', panelID: 'repeat-customers-content-1' },
        { id: 'prospects-1', content: 'Subscriber Form', panelID: 'prospects-content-1' },
        { id: 'subscriber-1', content: 'Subscriber Message', panelID: 'prospects-content-1' },
    ];
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
                    description: "Customize email notifications sent to customers when they add products to their wishlist, keeping them engaged.",
                    path: "settings/email/restock-alert",
                    name: "is_email_reminder_on_off_restock",
                    value: emailSetting?.add_wishlist_setting?.is_enable,
                    checked: emailSetting?.add_wishlist_setting?.is_enable == 1,
                    key: initialKeys?.addedWishlist,
                },
                {
                    title: "Removed from Wishlist",
                    description: "Personalize emails to inform customers about items they’ve removed from their wishlist for a tailored experience.",
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
                    description: "Design automated email reminders to nudge customers about their wishlist items and boost conversions.",
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
                    description: "Create custom email alerts to inform customers when their wishlist items are low in stock, driving urgency.",
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

    const saveReportWishlistEmailSetting = async (field, FieldPayload) => {
        const payload = {
            type: 6,
            "wishlist_report_setting": {
                "is_enable": FieldPayload?.wishlist_report_setting?.is_enable,
                "type": FieldPayload?.wishlist_report_setting?.type,
            },
        };
        const response = await apiService.onUpdateV2EmailSetting(payload, emailSetting.id);
        if (response.status === 200) {
            setIsError(false)
            setMessage(capitalizeMessage(response.message))
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
    }


    const onChangeReportWishlist = async (name, value) => {
        const payload = {
            ...emailSetting,
            wishlist_report_setting: { ...emailSetting?.wishlist_report_setting, [name]: value }
        };
        setEmailSetting(payload);
        await saveReportWishlistEmailSetting('wishlist_report_setting', payload);
    }


    const saveEmailSetting = async (field, FieldPayload) => {
        if (field !== 'wishlist_report_setting') {
            const isValidForm = validateForm(emailSetting, setEmailSettingError, formValidate)
            if (isValidForm) {
                return;
            }
        }
        setIsSave(true);
        const payload = field === 'wishlist_report_setting' ? { ...FieldPayload } : { ...emailSetting };
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
        const { name, value } = e.target;
        const payload = { ...emailSetting, [name]: value, }
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
        setEmailSetting({ ...emailSetting, [name]: value })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEmailSetting({ ...emailSetting, [name]: value })
        setEmailSettingError({ ...emailSettingError, [name]: value.trim() ? "" : emailSettingError[name] })
    }

    const onBlur = (e) => {
        const { name, value } = e.target
        setEmailSettingError({ ...emailSettingError, [name]: formValidate(name, value) })
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

    const onChangeTab = (event) => {
        const params = Object.fromEntries(urlParams);
        navigate({ pathname: `${baseUrl}/settings/email`, search: qs.stringify({ ...params, step: event }) });
        setSelectedOption(event);
    }
    const tabs = [
        {
            id: 0,
            content: "Email Option",
            panelID: "design-content",
            subTabs: [{ content: "From Email" }], // Default selected sub-tab
        },
        {
            id: 1,
            content: "Wishlist Alerts",
            panelID: "customisation-content",
            subTabs: [{ content: "Email Template" }],
        },
        {
            id: 2,
            content: "Back In Stock Alerts",
            panelID: "back-in-stock-content",
            subTabs: [
                { content: "Product Page" },
                { content: "Home Page" },
                { content: "Collection Page" },
                { content: "Subscriber Form" },
                { content: "Subscriber Message" },
            ],
        },
    ];

    return (
        <Page title={"Email Customisation"} backAction={{ content: 'Settings', onAction: onBack }}>
            <div className="sticky-component">
                <Layout>
                    {message !== "" && isError === false ?
                        <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                            setIsErrorServer={setIsErrorServer} /> : ""}
                    <CustomErrorBanner link={AppDocsLinks.article["425"]} message={message} setMessage={setMessage}
                        setIsError={setIsError} isError={isError} />
                    <Layout.Section fullWidth>
                        <Card padding={0} roundedAbove={"md"}>
                            <Tabs tabs={tabs} selected={selectedOption}
                                onSelect={onChangeTab} />
                        </Card>
                    </Layout.Section>



                    {isLoading ?
                        <Layout.Section><Card>{RenderLoading.commonParagraph}</Card></Layout.Section> :
                        <Layout.Section>
                            {selectedOption == '0' && <>
                                <BlockStack gap={'300'}>
                                    <Card >
                                        <Box>
                                            <BlockStack gap={"400"} >
                                                <Text as={"span"} variant={"headingMd"} >From Email & Name</Text>
                                                <Text as={"span"} tone={"subdued"}>Add the "Name" in From name and "Email id" in
                                                    From email you want users to see while receiving the Wishlist alerts</Text>
                                            </BlockStack>
                                        </Box>
                                        <Divider />
                                        <Box paddingBlockEnd={400} >
                                            <BlockStack gap={"400"}>
                                                <TextField label="From name" value={emailSetting.from_name}
                                                    onChange={(value) => handleChange({
                                                        target: { name: "from_name", value }
                                                    })} />
                                                <TextField type="email" label="From email" value={emailSetting.from_email}
                                                    name={"from_email"} error={emailSettingError.from_email}
                                                    onBlur={onBlur}
                                                    onChange={(value) => handleChange({
                                                        target: { name: "from_email", value }
                                                    })} />
                                                <TextField type="email" label="Reply to email"
                                                    value={emailSetting.reply_to_mail}
                                                    name={"reply_to_mail"}
                                                    onChange={(value) => handleChange({
                                                        target: { name: "reply_to_mail", value }
                                                    })} />

                                                <BlockStack gap={"400"}>
                                                    <BlockStack >
                                                        <Text as={"span"} variant={"headingMd"}>Wishlist Notifications</Text>
                                                    </BlockStack>
                                                    <BlockStack >
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
                                            </BlockStack>
                                        </Box>
                                        <InlineStack align={"end"} >
                                            <Button variant={"primary"} loading={isSave}
                                                onClick={saveEmailSetting}>Save</Button>
                                        </InlineStack>
                                    </Card>
                                </BlockStack>
                            </>
                            }
                            {selectedOption == '1' &&
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
                                        <Divider />
                                        {
                                            (Customization_Email || []).map((x, i) => {
                                                return (
                                                    <div className={""} key={i}>
                                                        <Box padding={"400"}>
                                                            <InlineStack align={"space-between"} blockAlign={"start"} wrap={false} gap={"200"}>
                                                                <BlockStack gap={"100"}>
                                                                    <InlineStack gap={"100"} wrap={false} align={'start'} blockAlign={'center'}>
                                                                        <Text fontWeight='semibold' as={"span"}>{x.title}</Text>
                                                                        {isLoading ?
                                                                            <Badge><div style={{ width: 62 }}>&nbsp;</div></Badge> :
                                                                            <Badge tone={x.checked ? "success" : "critical"}>{x.checked ? "Enabled" : "Disabled"} </Badge>
                                                                        }
                                                                    </InlineStack>
                                                                    <Text tone={"subdued"} as={"span"}>{x.description}</Text>
                                                                </BlockStack>
                                                                <Button variant={'secondary'} icon={Icons.EditIcon} onClick={() => onRedirect(x.key)}></Button>
                                                            </InlineStack>
                                                        </Box>
                                                        <Divider />
                                                    </div>
                                                )
                                            })}
                                    </Card>

                                    <Card padding={'400'}>
                                        <BlockStack gap={'400'}>
                                            <InlineStack align={'space-between'}>
                                                <InlineStack align={'start'}>
                                                    <div className="pcTag">New</div>
                                                </InlineStack>
                                                <Button variant={'plain'} icon={Icons.ExternalIcon} onClick={() => onRedirect('5')} textAlign={'end'}>View Button Settings</Button>
                                            </InlineStack>

                                            {(CustomizationEmailSettings || []).map((x, i) => {
                                                return (
                                                    <BlockStack inlineAlign={'start'} gap={'200'} className="w-full">
                                                        <Text as={'span'} variant={'headingMd'}>{x.title}</Text>
                                                        <div className={'email-customise-list'}>
                                                            <BlockStack inlineAlign={'start'} gap={'200'} className="w-full">
                                                                {(x.inputs && x.inputs || []).map((item, inputIndex) => {
                                                                    return (
                                                                        <div key={inputIndex} className={""}>
                                                                            <Box padding={"300"}>
                                                                                <InlineStack align={"space-between"} blockAlign={"start"} wrap={false} gap={"200"}>
                                                                                    <BlockStack gap={"100"}>
                                                                                        <InlineStack gap={"100"} wrap={false} align={'start'} blockAlign={'center'}>
                                                                                            <Text fontWeight='semibold' as={"span"}>{item.title}</Text>
                                                                                            {isLoading ?
                                                                                                <Badge><div style={{ width: 62 }}>&nbsp;</div></Badge> :
                                                                                                <Badge tone={item.checked ? "success" : "critical"}>{item.checked ? "Enabled" : "Disabled"} </Badge>
                                                                                            }
                                                                                        </InlineStack>
                                                                                        <Text tone={"subdued"} as={"span"}>{item.description}</Text>
                                                                                    </BlockStack>
                                                                                    <Button variant={'secondary'} icon={Icons.EditIcon} onClick={() => onRedirect(item.key)} size={'medium'}></Button>
                                                                                </InlineStack>
                                                                            </Box>
                                                                            {x.inputs.length - 1 !== inputIndex ? <Divider /> : ''}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </BlockStack>
                                                        </div>
                                                    </BlockStack>
                                                )
                                            })}

                                            <BlockStack inlineAlign={'start'} gap={'200'} className="w-full">
                                                <Text as={'span'} variant={'headingMd'}>{'Reports'}</Text>
                                                <div className={'email-customise-list'}>
                                                    <Box padding={"300"}>
                                                        <BlockStack inlineAlign={'start'} gap={'200'} className="w-full">
                                                            <InlineStack align={"space-between"} blockAlign={"start"} wrap={false} gap={"200"}>
                                                                <InlineStack gap={"400"} wrap={false} align={'start'} blockAlign={'center'}>
                                                                    <BlockStack gap={"100"}>
                                                                        <InlineStack gap={'150'} align={'start'} blockAlign={'center'}>
                                                                            <Text fontWeight='semibold' as={"span"}>Wishlist Report Setting</Text>
                                                                            {isLoading ? <Badge>
                                                                                <div style={{ width: 62 }}>&nbsp;</div>
                                                                            </Badge> : <Badge
                                                                                tone={emailSetting?.wishlist_report_setting?.is_enable == 1 ? "success" : "critical"}>{emailSetting?.wishlist_report_setting?.is_enable == 1 ? "Enabled" : "Disabled"} </Badge>}
                                                                        </InlineStack>
                                                                        <Text tone={"subdued"} as={"span"}>Tailor email summaries with detailed wishlist insights to help you optimize customer engagement and sales.</Text>
                                                                    </BlockStack>
                                                                    <InlineStack gap={'150'} align={'end'} blockAlign={'center'}>
                                                                        <SwitchButton
                                                                            checked={emailSetting?.wishlist_report_setting?.is_enable == 1}
                                                                            onChange={() => onChangeReportWishlist('is_enable', toggleFlag(emailSetting?.wishlist_report_setting?.is_enable))}
                                                                            name={"is_enable"} />
                                                                        <Select
                                                                            label="Type"
                                                                            labelInline
                                                                            options={[
                                                                                { label: 'Weekly', value: '1' },
                                                                                { label: 'Monthly', value: '2' },
                                                                            ]}
                                                                            name={'type'}
                                                                            onChange={(value) => onChangeReportWishlist('type', value)}
                                                                            value={emailSetting?.wishlist_report_setting?.type}
                                                                        />
                                                                    </InlineStack>
                                                                </InlineStack>
                                                            </InlineStack>
                                                        </BlockStack>
                                                    </Box>
                                                </div>
                                            </BlockStack>
                                        </BlockStack>
                                    </Card>
                                </BlockStack>
                            }
                            {selectedOption == '2' &&
                                <>
                                    <BackInStockEmail />
                                </>
                            }
                        </Layout.Section>
                    }
                </Layout>
            </div>
        </Page>
    );
};
export default WishlistEmail;