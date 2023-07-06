import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {apiService, baseUrl} from "../../../../utils/Constant";
import {useNavigate} from "react-router-dom";
import {Tabs, Layout, Page, PageActions} from "@shopify/polaris";
import {CollectionPage, ProductPage, HomePage, SubscriberForm, SubscriberMsg} from "../../../../components"


const initialState = {
    product_page_widget: {
        bg_color: "#000000",
        border_color: "#000000",
        border_radius: "0",
        border_size: "0",
        button_left_right_padding: 15,
        button_top_bottom_padding: 10,
        button_type: "1",
        css: "",
        icon_color: "#ffffff",
        is_active: 1,
        is_icon: "1",
        text: "Notify me",
        text_color: "#ffffff",
    },
    home_page_widget: {
        bg_color: "#000000",
        border_color: "#000000",
        border_radius: "0",
        border_size: "0",
        button_left_right_padding: 10,
        button_top_bottom_padding: 10,
        button_type: "1",
        css: "",
        icon_color: "#ffffff",
        is_active: "1",
        is_icon: "1",
        text: "Notify me",
        text_color: "#ffffff",
    },
    collection_page_widget: {
        bg_color: "#000000",
        border_color: "#000000",
        border_radius: "0",
        border_size: "0",
        button_left_right_padding: 10,
        button_top_bottom_padding: 10,
        button_type: "1",
        css: "",
        icon_color: "#ffffff",
        is_active: "1",
        is_icon: "1",
        text: "Notify me",
        text_color: "#ffffff",
    },
    subscription_form: {
        title: "Notify me via",
        email_lable: "Email",
        email_placeholder: "Email Address...",
        email_validation_message: "Your email address is not valid.",
        submit_button_text: "Notify Me When Available",
        text_color: "#ffffff",
        background_color: "#000000",
        border_radius: "0",
        border_color: "#000000",
        border_size: "0",
        button_top_bottom_padding: 10,
        button_left_right_padding: 15,
        css: "",

    },
    subscription_message: {
        already_subscribed_message: "You already have subscribed for this item",
        background_color: "#000000",
        css: "",
        success_message: "We will notify you when the item is available",
        text_color: "#ffffff",
    }
}
export default function BisDesign() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(0);
    const [backInStockDesign, setBackInStockDesign] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        bisSetting()
    }, []);
    const bisSetting = async () => {
        setIsLoading(false);
        const response = await apiService.bisSetting();
        if (response.status === 200) {
            setBackInStockDesign(response.data)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    const updateBisSetting = async () => {
        setIsLoading(true)
        delete backInStockDesign.bis_logo
        delete backInStockDesign.thankyou_logo

        const formData = new FormData();
        const updatedObject = {...backInStockDesign, id: backInStockDesign.id ? backInStockDesign.id : ""};
        const updatedInnerObject = {...updatedObject.product_page_widget};
        updatedInnerObject.button_type = "1";
        updatedObject.product_page_widget = updatedInnerObject;

        formData.append("payload", JSON.stringify(backInStockDesign))
        const response = await apiService.updateBisSetting(formData)
        if (response.status === 200) {
            setIsLoading(false)
            setMessage(response.message)
            bisSetting();
        } else {
            setIsLoading(false)
            setMessage(response.message)
        }

    }

    const onBack = () => {
        navigate(`${baseUrl}/bistock`)
    }

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    const tabs = [
        {
            id: 'all-customers-1',
            content: 'Product Page',
            accessibilityLabel: 'All customers',
            panelID: 'all-customers-content-1',
        },
        {
            id: 'accepts-marketing-1',
            content: 'Home Page',
            panelID: 'accepts-marketing-content-1',
        },
        {
            id: 'repeat-customers-1',
            content: 'Collection Page',
            panelID: 'repeat-customers-content-1',
        },
        {
            id: 'prospects-1',
            content: 'Subscriber Form',
            panelID: 'prospects-content-1',
        },
        {
            id: 'subscriber-1',
            content: 'Subscriber Message',
            panelID: 'prospects-content-1',
        },
    ];

    return (
        <Fragment>
            <Page title={"Back In Stock Design"} backAction={{content: 'BackInStock', onAction: onBack}}
                  primaryAction={{content: "Save", onAction: updateBisSetting, loading: isLoading}}>

                <Layout>
                    <Layout.Section fullWidth>
                        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
                    </Layout.Section>
                    {selected == 0 &&
                    <ProductPage
                        backInStockDesign={backInStockDesign}
                        setBackInStockDesign={setBackInStockDesign}
                        message={message}
                        setMessage={setMessage}
                    />
                    }
                    {selected == 1 &&
                    <HomePage
                        backInStockDesign={backInStockDesign}
                        setBackInStockDesign={setBackInStockDesign}
                        message={message}
                        setMessage={setMessage}
                    />
                    }
                    {selected == 2 &&
                    <CollectionPage
                        backInStockDesign={backInStockDesign}
                        setBackInStockDesign={setBackInStockDesign}
                        message={message}
                        setMessage={setMessage}
                    />}
                    {selected == 3 && <SubscriberForm
                        backInStockDesign={backInStockDesign}
                        setBackInStockDesign={setBackInStockDesign}
                        message={message}
                        setMessage={setMessage}
                    />}
                    {selected == 4 &&
                    <SubscriberMsg
                        backInStockDesign={backInStockDesign}
                        setBackInStockDesign={setBackInStockDesign}
                        message={message}
                        setMessage={setMessage}
                    />}
                    <Layout.Section fullWidth>
                        <PageActions
                            primaryAction={{
                                content: 'Save',
                                onAction: updateBisSetting,
                                loading: isLoading
                            }}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};
