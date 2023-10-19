import React, {Fragment, useEffect, useState} from 'react';
import {apiService, baseUrl, capitalizeMessage} from "../../../utils/Constant";
import {useNavigate} from "react-router-dom";
import {Tabs, Layout, Page, PageActions, Card,} from "@shopify/polaris";
import CollectionPage from "./CollectionPage";
import ProductPage from "./ProductPage";
import HomePage from "./HomePage";
import SubscriberForm from "./SubscriberForm";
import SubscriberMsg from "./SubscriberMsg";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import ToastMessage from "../../Comman/ToastMessage";


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

const initialStateError = {
    submit_button_text: "",
    success_message: "",
    already_subscribed_message: ""
}

const BackInStockDesign = () => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(0);
    const [backInStockDesign, setBackInStockDesign] = useState(initialState);
    const [backInStockDesignError, setBackInStockDesignError] = useState(initialStateError);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        bisSetting()
    }, []);
    const bisSetting = async () => {
        const response = await apiService.bisSetting();
        if (response.status === 200) {
            setBackInStockDesign(response.data)
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "success_message":
                if (!value || value.trim() === "") {
                    return "Message is required";
                } else {
                    return "";
                }
            case "already_subscribed_message":
                if (!value || value.trim() === "") {
                    return "Already subscribed message is required";
                } else {
                    return "";
                }
            case "submit_button_text":
                if (!value || value.trim() === "") {
                    return "Submit button text is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const updateBisSetting = async () => {

        let validationErrors = {};
        let tempObj = {submit_button_text: backInStockDesign.subscription_form.submit_button_text,
            success_message: backInStockDesign.subscription_message.success_message,
            already_subscribed_message: backInStockDesign.subscription_message.already_subscribed_message}
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
        const updatedObject = {...backInStockDesign, id: backInStockDesign.id ? backInStockDesign.id : ""};
        const updatedInnerObject = {...updatedObject.product_page_widget};
        updatedInnerObject.button_type = "1";
        updatedObject.product_page_widget = updatedInnerObject;

        formData.append("payload", JSON.stringify(backInStockDesign))
        const response = await apiService.updateBisSetting(formData)
        if (response.status === 200) {
            setIsLoading(false)
            setMessage(capitalizeMessage(response.message))
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

    const onBack = () => {
        navigate(`${baseUrl}/back-in-stock`)
    }


    const handleTabChange = (selectedTabIndex) => {
        let IsTabChange = true
        Object.keys(backInStockDesignError).map((x) => {
            if(backInStockDesignError[x] !== ""){
                IsTabChange = false
            }
        })
        if(IsTabChange){
            setSelected(selectedTabIndex)
        }
    }

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
                    {message !== "" && isError === false ? <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner message={message} setMessage={setMessage} setIsError={setIsError} isError={isError} link={""}/>
                    <Layout.Section fullWidth>
                        <Card padding={0} roundedAbove={"md"}>
                            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
                        </Card>
                    </Layout.Section>
                    {selected == 0 &&
                    <ProductPage
                        backInStockDesign={backInStockDesign}
                        setBackInStockDesign={setBackInStockDesign}

                    />
                    }
                    {selected == 1 &&
                    <HomePage
                        backInStockDesign={backInStockDesign}
                        setBackInStockDesign={setBackInStockDesign}

                    />
                    }
                    {selected == 2 &&
                    <CollectionPage
                        backInStockDesign={backInStockDesign}
                        setBackInStockDesign={setBackInStockDesign}

                    />}
                    {selected == 3 && <SubscriberForm
                        backInStockDesign={backInStockDesign}
                        setBackInStockDesign={setBackInStockDesign}
                        setBackInStockDesignError={setBackInStockDesignError}
                        backInStockDesignError={backInStockDesignError}
                        formValidate={formValidate}
                    />}
                    {selected == 4 &&
                    <SubscriberMsg
                        backInStockDesign={backInStockDesign}
                        setBackInStockDesign={setBackInStockDesign}
                        setBackInStockDesignError={setBackInStockDesignError}
                        backInStockDesignError={backInStockDesignError}
                        formValidate={formValidate}
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

export default BackInStockDesign;