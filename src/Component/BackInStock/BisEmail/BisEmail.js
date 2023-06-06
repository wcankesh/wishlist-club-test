import React, {Fragment, useEffect, useState} from 'react';
import {Page, Layout, LegacyCard, FormLayout, TextField, Text, LegacyStack, Button, Divider} from '@shopify/polaris';
import {apiService, baseUrl} from "../../../Utills/Constant";
import {useNavigate} from "react-router-dom"
import ToastMessage from "../../Common/ToastMessage";

const initialState = {
    is_bis_email_enable: 1,
    is_thankyou_email_enable: 1,
    bis_from_mail: null,
    is_branding_type: 1,
    bis_logo: null,
    bis_style: [
        {
            primary_color: "#000000",
            background_color: "#ffffff",
            theme: 1,
            font_family: "roboto",
            title_font_size: 24,
            description_font_size: 16,
            discount_font_size: 16,
            seconday_color: "#ffffff",
        }
    ],
    bis_content: [
        {
            email_subject: "{{product_name}} is available now!",
            email_title: "{{product_name}} is available now!",
            email_description: "Get it now before it goes out of stock again!",
            add_to_cart_button_text: "Add to Cart",
            view_product_button_text: "View Item",
            discount_code: "get discount",
        }
    ],
    bis_social: [
        {
            title: "Follow us on",
            instagram: "",
            facebook: "",
            twitter: "",
            telegram: "",
            linkedin: "",
            pinterest: "",
        }
    ],
}

const BisEmail = () => {
    const navigate = useNavigate();
    const [bisEmail, setBisEmail] = useState(initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")

    const BisEmail = [
        {
            title: "Back In Stock Notification",
            description: `If customers have subscribed to "Notify me" for sold-out products and if the "Back in stock notification" option is enabled, they will receive a mail notification when the product is available again.`,
            name: "is_bis_email_enable",
            value: bisEmail.is_bis_email_enable,
            checked: bisEmail.is_bis_email_enable == 1,
            path: "bistock-email/stock-notificattion"

        },
        {
            title: "Thank You Notification",
            description: `Customers will get Thank You Notification after subscribing to the "Notify me" alerts for the sold-out products and if this "Thank You Notification " option is enabled.`,
            name: "is_thankyou_email_enable",
            value: bisEmail.is_thankyou_email_enable,
            checked: bisEmail.is_thankyou_email_enable == 1,
            path: "bistock-email/thnaks-notification"

        },
    ]

    useEffect(() => {
        getBisEmail()
    }, []);
    const getBisEmail = async () => {
        setIsLoading(false);
        const response = await apiService.bisSetting();
        if (response.status === 200) {
            setBisEmail(response.data)
            setIsLoading(false)

        } else {
            setIsLoading(false)

        }
    };

    const handleSwitch = async (e) => {
        let obj = {...bisEmail, [e.target.name]: e.target.value}
        setBisEmail(obj)
        if (obj.bis_branding_type == "1") {
            delete obj.bis_logo;
        }

        if (obj.thankyou_branding_type == "1") {
            delete obj.thankyou_logo;
        }

        let newBackInStockEmail = {...obj, id: obj.id ? obj.id : ""}

        const formData = new FormData();

        const payload = JSON.stringify(newBackInStockEmail)
        formData.append("payload", payload)

        const response = await apiService.updateBisSetting(formData)
        if (response.status === 200) {
            setMessage(response.message)
            setIsLoading(false);
        } else {
            setMessage(response.message)
        }

    }
    const onBack = () => {
        navigate(`${baseUrl}/bistock`)
    }
    return (
        <Fragment>
            <ToastMessage message={message} setMessage={setMessage}/>
            <Page title={"Back In Stock Email"} backAction={{content: 'BAckInStock', onAction: onBack}}>
                <Layout>
                    <Layout.AnnotatedSection
                        id="storeDetails"
                        title="Email Customization"
                        description='By enabling the "Back in Stock Notification," you can send alerts to customers who have subscribed using the "Notify me" button for sold-out products. Also, activating the "Thank you Notification" will display a Thank you message to customers after they click the "Notify me" button.'
                    >
                        <LegacyCard>

                            {(BisEmail || []).map((x, i) => {
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
                                                               value: e.target.checked ? 1 : 0
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
            </Page>
        </Fragment>
    );
};

export default BisEmail;