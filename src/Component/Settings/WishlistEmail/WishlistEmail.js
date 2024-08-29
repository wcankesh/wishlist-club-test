import React, {useEffect, useState} from 'react';
import {
    Page, Layout, TextField, Text, Button, Card, BlockStack, InlineStack, Box, Divider, Badge,
    Checkbox, OptionList
} from "@shopify/polaris";
import {apiService, baseUrl, capitalizeMessage,validateForm} from "../../../utils/Constant";
import {useNavigate} from "react-router-dom"
import ToastMessage from "../../Comman/ToastMessage";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {formValidate} from "../../Comman/formValidate";

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


    const saveEmailSetting = async () => {
        if (validateForm(emailSetting, setEmailSettingError,formValidate)) {
            return;
        }
        setIsSave(true);
        const payload = {...emailSetting};
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

    return (
        <Page title={"Wishlist Email"} backAction={{content: 'Settings', onAction: onBack}}>
            <Layout>
                {message !== "" && isError === false ?
                    <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                                  setIsErrorServer={setIsErrorServer}/> : ""}
                <CustomErrorBanner link={AppDocsLinks.article["425"]} message={message} setMessage={setMessage}
                                   setIsError={setIsError} isError={isError}/>

                <Layout.Section variant="oneThird">
                    <Card padding={"100"}>
                        <OptionList onChange={(event) => setSelectedOption(event[0])} selected={selectedOption}
                                    options={[
                                        {value: "1", label: "From Email & Name"},
                                        {value: "2", label: "Email Customization"},
                                        {value: "3", label: "Wishlist Notifications"},
                                    ]}/>
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    {selectedOption=== "1" &&
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
                                <InlineStack align={"end"}>
                                    <Button variant={"primary"} loading={isSave}
                                            onClick={saveEmailSetting}>Save</Button>
                                </InlineStack>
                            </BlockStack>
                        </Box>
                    </Card>}

                    {selectedOption=== "2" &&
                    <Card padding={"0"}>
                        <Box padding={"400"}>
                            <BlockStack gap={"100"}>
                                <Text as={"span"} variant={"headingMd"}>Email Customization</Text>
                                <Text as={"span"} tone={"subdued"}>Send alerts when the products are on Wishlist.
                                    Also, send price drop & restock alerts for the products in Wishlist.</Text>
                                <Text as={"span"} tone={"caution"}><b>Note: </b> These notifications (Wishlist Items,
                                    Price Drop Alerts, and Restock Alerts) are exclusively sent to registered users and
                                    not to guest users.</Text>
                            </BlockStack>
                        </Box>
                        <Divider/>
                        {
                            (Customization_Email || []).map((x, i) => {
                                return (
                                    <div onClick={() => navigate(`${baseUrl}/${x.path}`)}
                                         className={"cursor-pointer"} key={i}>
                                        <Box padding={"400"}>
                                            <InlineStack align={"space-between"} blockAlign={"start"} wrap={false}
                                                         gap={"200"}>
                                                <InlineStack gap={"400"} wrap={false}>
                                                    <BlockStack gap={"100"}>
                                                        <Text fontWeight='semibold' as={"span"}>{x.title}</Text>
                                                        <Text tone={"subdued"} as={"span"}>{x.description}</Text>
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
                    </Card>}

                    {selectedOption=== "3" &&
                    <Card>
                        <BlockStack gap={"400"}>
                            <BlockStack gap={"100"}>
                                <Text as={"span"} variant={"headingMd"}>Wishlist Notifications</Text>
                                <Text as={"span"} tone={"subdued"}>
                                    Enabling this setting allows store owners to stay updated through email
                                    notifications when users add products to their wishlist.
                                </Text>
                            </BlockStack>
                            <Checkbox label={"Notification mail"} onChange={(checked) => notificationUpdate({
                                target: {name: "is_notification_mail", value: checked ? 1 : 0}
                            })} checked={emailSetting.is_notification_mail === 1}/>
                        </BlockStack>
                    </Card>}
                </Layout.Section>
            </Layout>
        </Page>

    );
}
export default WishlistEmail

