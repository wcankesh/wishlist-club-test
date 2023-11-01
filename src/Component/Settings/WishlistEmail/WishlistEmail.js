import React, {Fragment, useEffect, useState} from 'react';
import {Page, Layout, FormLayout, TextField, Text, Button, Card, BlockStack, InlineStack, Box, Divider, Badge, Checkbox} from "@shopify/polaris";
import {apiService, baseUrl, capitalizeMessage} from "../../../utils/Constant";
import {useNavigate} from "react-router-dom"
import ToastMessage from "../../Comman/ToastMessage";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";

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
}
const initialStateError = {
    from_email: ""
}
const WishlistEmail = () => {
    const navigate = useNavigate();
    const [emailSetting, setEmailSetting] = useState(initialState);
    const [emailSettingError, setEmailSettingError] = useState(initialStateError);
    const [isLoading, setIsLoading] = useState(true)
    const [isSave, setIsSave] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const Customization_Email = [
        {
            title: "Wishlist Items",
            description: "Email notification will be sent if the items have already been added to the wishlist.",
            path: "settings/email/wishlist-items",
            name: "is_email_reminder_on_off",
            value: emailSetting.is_email_reminder_on_off,
            checked: emailSetting.is_email_reminder_on_off == 0,
        },
        {
            title: "Price Drop Alerts",
            description: "An email notification will be sent to if the price of a wishlist item drops.",
            path: "settings/email/price-drop-alert",
            name: "is_email_reminder_on_off_price",
            value: emailSetting.is_email_reminder_on_off_price,
            checked: emailSetting.is_email_reminder_on_off_price == 0,
        },
        {
            title: "Restock Alerts",
            description: "Email notification will be send when the wishlist item is restocked.",
            path: "settings/email/restock-alert",
            name: "is_email_reminder_on_off_restock",
            value: emailSetting.is_email_reminder_on_off_restock,
            checked: emailSetting.is_email_reminder_on_off_restock == 0,
        }
    ]

    useEffect(() => {
        const EmailSetting = async () => {
            const response = await apiService.emailSetting();
            if (response.status === 200) {
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
        EmailSetting()
    }, []);


    const saveEmailSetting = async () => {
        let validationErrors = {};
        Object.keys(emailSetting).forEach((name) => {
            const error = formValidate(name, emailSetting[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setEmailSettingError(validationErrors);
            return;
        }
        setIsSave( true);
        const payload = {
            ...emailSetting
        }
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload))
        const response = await apiService.updateEmailSetting(formData, emailSetting.id);
        if (response.status === 200) {
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
        const payload = {
            ...emailSetting, [name]: value,
        }
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload))
        const response = await apiService.updateEmailSetting(formData, emailSetting.id);
        if (response.status === 200) {
            setMessage(capitalizeMessage(response.message))
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
        setEmailSetting({
            ...emailSetting,
            [name]: value
        })
        setEmailSettingError({...emailSettingError, [name]: value.trim() ? "" : emailSettingError[name]})
    }

    const onBlur = (e) => {
        const {name, value} = e.target
        setEmailSettingError({...emailSettingError, [name]: formValidate(name, value)})
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "from_email":
                if (value && !value?.match(/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/)) {
                    return "Enter a valid email address";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onBack = () => {
        navigate(`${baseUrl}/settings`)
    }


    return (
        <Fragment>
            <Page title={"Wishlist Email"} backAction={{content: 'Settings', onAction: onBack}}>
                <Layout>
                    {message !== "" && isError === false ?
                        <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                                      setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner message={message} setMessage={setMessage} setIsError={setIsError}
                                       isError={isError} link={""}/>
                    <Layout.Section>
                        <Card padding={"0"}>
                            <BlockStack>
                                <Box padding={"500"}>
                                    <BlockStack gap={"150"}>
                                        <Text as={"h2"} variant={"headingMd"}>From Email & Name</Text>
                                        <Text as={"p"} tone={"subdued"}>Add the "Name" in From name and "Email id" in
                                            From email you want users to see while receiving the Wishlist alerts</Text>
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"500"}>
                                    <BlockStack gap={"400"}>
                                        <FormLayout>
                                            <FormLayout.Group>
                                                <TextField
                                                    label="From name"
                                                    value={emailSetting.from_name}
                                                    onChange={(value) => handleChange({
                                                        target: {
                                                            name: "from_name",
                                                            value
                                                        }
                                                    })}
                                                />
                                                <TextField
                                                    type="email"
                                                    label="From email"
                                                    value={emailSetting.from_email}
                                                    onChange={(value) => handleChange({
                                                        target: {
                                                            name: "from_email",
                                                            value
                                                        }
                                                    })}
                                                    name={"from_email"}
                                                    error={emailSettingError.from_email}
                                                    onBlur={onBlur}
                                                />
                                            </FormLayout.Group>
                                        </FormLayout>
                                        <InlineStack align={"end"}>
                                            <Button variant={"primary"} loading={isSave}
                                                    onClick={saveEmailSetting}>Save</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <Card padding={"0"}>
                            <Box padding={"500"}>
                                <BlockStack gap={"100"}>
                                    <Text as={"h2"} variant={"headingMd"}>Email Customization</Text>
                                    <Text as={"p"} tone={"subdued"}>
                                        Send alerts when the products are on Wishlist. Also,
                                        send price drop & restock alerts for the products in
                                        Wishlist.
                                    </Text>
                                    <Text as={"p"} tone={"critical"}>
                                        <b>Note: </b> These all the
                                        notifications(Wishlist Items, Price Drop Alerts, and
                                        Restock Alerts) are sent to customers if the <b>Guest
                                        Wishlist</b> option disable.
                                    </Text>
                                </BlockStack>
                            </Box>
                            <Divider/>
                            {
                                (Customization_Email || []).map((x, i) => {
                                    return (
                                        <div onClick={() => navigate(`${baseUrl}/${x.path}`)} className={"cursor-pointer"} key={i}>
                                            <Box padding={"500"}>
                                                <InlineStack align={"space-between"} blockAlign={"start"} wrap={false} gap={"200"}>
                                                    <InlineStack gap={"400"} wrap={false}>
                                                        <BlockStack gap={"100"}>
                                                            <Text fontWeight='semibold'>{x.title}</Text>
                                                            <Text tone={"subdued"}>{x.description}</Text>
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
                                })
                            }
                        </Card>
                    </Layout.Section>

                    <Layout.Section>
                        <Card>
                            <BlockStack gap={"300"}>
                                <BlockStack gap={"100"}>
                                    <Text as={"h2"} variant={"headingMd"}>Wishlist Notifications</Text>
                                    <Text as={"p"} tone={"subdued"}>
                                        Enabling this setting allows store owners to stay updated through email notifications when users add products to their wishlist.
                                    </Text>
                                </BlockStack>

                                <span>
                                    <Checkbox label={"Notification mail"}
                                                onChange={(checked) => notificationUpdate({
                                                    target: {
                                                        name: "is_notification_mail",
                                                        value: checked ? "1" : "2"
                                                    }
                                                })} checked={emailSetting.is_notification_mail == 1}
                                        />
                                </span>
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
}
export default WishlistEmail

