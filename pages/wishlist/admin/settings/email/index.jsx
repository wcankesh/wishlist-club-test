import React, {Fragment, useEffect, useState} from 'react';
import {Page, Layout, LegacyCard, FormLayout, TextField, Text, Button, LegacyStack} from "@shopify/polaris";
import {apiService, baseUrl} from "../../../../../utils/Constant";
import {useNavigate} from "react-router-dom"
import {ToastMessage} from "../../../../../components";

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
export default function Email() {
    const navigate = useNavigate();
    const [emailSetting, setEmailSetting] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const Customization_Email = [
        {
            title: "Wishlist Items",
            description: "Email notification will be sent if the items have already been added to the wishlist.",
            path: "settings/email/wishlist-email",
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
            setIsLoading(false);
            const response = await apiService.emailSetting();
            if (response.status === 200) {
                setEmailSetting(response.data)
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        }
        EmailSetting()
    }, []);


    const saveEmailSetting = async (record) => {
        setIsLoading(true);
        const payload = {
            ...emailSetting,
            ...record
        }
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload))
        const response = await apiService.updateEmailSetting(formData, emailSetting.id);
        if (response.status === 200) {
            setIsLoading(false);
            setMessage(response.message)
            // EmailSetting();
        } else {
            setIsLoading(false);
            setMessage(response.message)
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setEmailSetting({
            ...emailSetting,
            [name]: value
        })
    }
    const handleSwitch = async (e) => {
        setEmailSetting({
            ...emailSetting,
            [e.target.name]: e.target.value
        })
        saveEmailSetting({[e.target.name]: e.target.value})
    }

    const onBack = () => {
        navigate(`${baseUrl}/settings`)
    }

    return (
        <Fragment>
            <Page title={"Wishlist Email"} backAction={{content: 'Settings', onAction: onBack}}>
                <ToastMessage message={message} setMessage={setMessage}/>
                <Layout>
                    <Layout.Section>
                        <Layout>
                            <Layout.AnnotatedSection title="From Email & Name"
                                                     description='Add the "Name" in From name and "Email id" in From email you want users to see while receiving the Wishlist alerts'>
                                <LegacyCard sectioned>
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
                                            />
                                        </FormLayout.Group>
                                        <LegacyStack distribution={"trailing"}>
                                            <Button primary onClick={() => saveEmailSetting({})}
                                                    loading={isLoading}>Save</Button>
                                        </LegacyStack>
                                    </FormLayout>
                                </LegacyCard>
                            </Layout.AnnotatedSection>
                            <Layout.AnnotatedSection
                                id="storeDetails"
                                title="Email Customization"
                                description={
                                    <LegacyStack vertical>
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
                                }>
                                <LegacyCard>
                                    {(Customization_Email || []).map((x, i) => {
                                        return (
                                            <LegacyCard.Section title={x.title} key={i} actions={[{
                                                content: 'Edit',
                                                onAction: () => navigate(`${baseUrl}/${x.path}`)
                                            },
                                                {
                                                    content: <div className='switch-button'>
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
                                                }]}>
                                                <Text color={"subdued"}>
                                                    {x.description}
                                                </Text>

                                            </LegacyCard.Section>
                                        )
                                    })
                                    }

                                </LegacyCard>
                            </Layout.AnnotatedSection>
                        </Layout>
                    </Layout.Section>
                </Layout>
            </Page>

        </Fragment>
    );
};

