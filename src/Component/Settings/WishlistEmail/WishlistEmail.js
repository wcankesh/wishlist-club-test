import React, {Fragment, useEffect, useState} from 'react';
import {Page, Layout, LegacyCard, FormLayout, TextField, Text, Button, LegacyStack} from "@shopify/polaris";
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
}
const initialStateError = {
    from_email: ""
}
const WishlistEmail = () =>  {
    const navigate = useNavigate();
    const [emailSetting, setEmailSetting] = useState(initialState);
    const [emailSettingError, setEmailSettingError] = useState(initialStateError);
    const [isLoading, setIsLoading] = useState(false)
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
            } else if (response.status === 500) {
                setMessage(capitalizeMessage(response.message))
                setIsErrorServer(true);
            } else {
                setMessage(capitalizeMessage(response.message))
                setIsError(true)
            }
        }
        EmailSetting()
    }, []);


    const saveEmailSetting = async (record, loading) => {
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
        setIsLoading(loading === false ? false : true);
        const payload = {
            ...emailSetting,
            ...record
        }
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload))
        const response = await apiService.updateEmailSetting(formData, emailSetting.id);
        if (response.status === 200) {
            setIsLoading(false);
            setMessage(capitalizeMessage(response.message))
            // EmailSetting();
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsLoading(false);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setEmailSetting({
            ...emailSetting,
            [name]: value
        })
        setEmailSettingError({...emailSettingError, [name]: value.trim()  ? "" : emailSettingError[name]})
    }

    const handleSwitch = async (e) => {
        setEmailSetting({
            ...emailSetting,
            [e.target.name]: e.target.value
        })
        saveEmailSetting({[e.target.name]: e.target.value}, false)
    }

    const onBlur = (e) => {
        const {name, value} = e.target
        setEmailSettingError({...emailSettingError, [name]: formValidate(name, value)})
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "from_email":
                if (value.trim() !== "" && !value.match(/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/)) {
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
                    {message !== "" && isError === false ? <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner message={message} setMessage={setMessage} setIsError={setIsError} isError={isError} link={""}/>
                    <Layout.Section>
                        <LegacyCard footerActionAlignment={"right"} primaryFooterAction={{content: "Save", loading: isLoading, onAction: () => saveEmailSetting({})}}>
                            <LegacyCard.Section>
                                <LegacyStack vertical spacing={"extraTight"}>
                                    <Text as={"h2"} variant={"headingMd"}>From Email & Name</Text>
                                    <Text as={"p"} color={"subdued"}>Add the "Name" in From name and "Email id" in From email you want users to see while receiving the Wishlist alerts</Text>
                                </LegacyStack>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
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
                            </LegacyCard.Section>
                        </LegacyCard>
                    </Layout.Section>
                    <Layout.Section>
                        <LegacyCard>
                            <LegacyCard.Section>
                                <LegacyStack vertical spacing={"extraTight"}>
                                    <Text as={"h2"} variant={"headingMd"}>Email Customization</Text>
                                    <Text as={"p"} color={"subdued"}>
                                        Send alerts when the products are on Wishlist. Also,
                                        send price drop & restock alerts for the products in
                                        Wishlist.
                                    </Text>
                                    <Text as={"p"} color={"critical"}>
                                        <b>Note: </b> These all the
                                        notifications(Wishlist Items, Price Drop Alerts, and
                                        Restock Alerts) are sent to customers if the <b>Guest
                                        Wishlist</b> option disable.
                                    </Text>
                                </LegacyStack>
                            </LegacyCard.Section>
                            {
                                (Customization_Email || []).map((x, i) => {
                                return (
                                    <LegacyCard.Section key={i} >
                                        <LegacyStack wrap={false}>
                                            <LegacyStack.Item>
                                                <div className='switch-button'>
                                                    <input type="checkbox"
                                                           className="switch-btn-input"
                                                           id={x.name}
                                                           name={x.name}
                                                           onChange={(e) => handleSwitch({
                                                               target: {
                                                                   name: x.name,
                                                                   value: e.target.checked ? 0 : 1
                                                               }
                                                           })}
                                                           checked={x.checked}
                                                    />
                                                    <label className="witch-button-label" htmlFor={x.name}/>
                                                </div>
                                            </LegacyStack.Item>
                                            <LegacyStack.Item fill>
                                                <LegacyStack vertical spacing={"extraTight"}>
                                                    <LegacyStack.Item>
                                                        <Text fontWeight='semibold'>
                                                            {x.title}
                                                        </Text>
                                                    </LegacyStack.Item>
                                                    <LegacyStack.Item>
                                                        <Text color={"subdued"}>
                                                            {x.description}
                                                        </Text>
                                                    </LegacyStack.Item>
                                                </LegacyStack>
                                            </LegacyStack.Item>
                                            <LegacyStack.Item>
                                                <Button  onClick={() => navigate(`${baseUrl}/${x.path}`)}>Edit</Button>
                                            </LegacyStack.Item>
                                        </LegacyStack>

                                    </LegacyCard.Section>
                                )
                            })
                            }
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
            </Page>

        </Fragment>
    );
}
export default WishlistEmail

