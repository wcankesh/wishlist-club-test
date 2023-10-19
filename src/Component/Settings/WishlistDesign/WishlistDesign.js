import React, {Fragment, useState, useCallback, useEffect} from 'react';
import {Tabs, Layout, Page, PageActions, Card} from "@shopify/polaris";
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl, capitalizeMessage} from "../../../utils/Constant";
import ToastMessage from "../../Comman/ToastMessage";
import CollectionDesign from "./CollectionDesign"
import ProductDesign from "./ProductDesign"
import CustomErrorBanner from "../../Comman/CustomErrorBanner";

const initialState = {
    button_type: "3",
    total_count: "1",
    button_border_width: "0",
    button_border_radius: "0",
    button_top_bottom_padding: "10",
    button_left_right_padding: "10",
    button_position: "1",
    button_color_after: "#ff000d",
    button_color_before: "#ff0000",
    button_text_before: "Add to Wishlist",
    button_bg_color_before: "#f0f0f0",
    button_border_color_before: "#ffffff",
    button_text_after: "Add to Wishlist",
    button_bg_color_after: "#f0f0f0",
    button_border_color_after: "#ffffff",
    layout_type: 0,

    product_collection_button_type: "1",
    product_collection_total_count: "1",
    product_collection_button_border_width: "0",
    product_collection_button_border_radius: "10",
    product_collection_button_top_bottom_padding: "5",
    product_collection_button_left_right_padding: "0",
    product_collection_button_position: "3",
    product_collection_button_color_before: "#00000",
    product_collection_button_color_after: "#00000",
    product_collection_button_text_before: "Add to Wishlist 1",
    product_collection_button_bg_color_before: "#e0b8c8",
    product_collection_button_border_color_before: "#ffffff",
    product_collection_button_text_after: "Add to Wishlist 2",
    product_collection_button_bg_color_after: "#e0b8c8",
    product_collection_button_border_color_after: "#ffffff",
    icon: ""
}
const  WishlistDesign = () => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(0);
    const [wishlistSetting, setWishlistSetting] = useState(initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [isSVGLoading, setIsSVGLoading] = useState(false);
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const [file, setFile] = useState("")

    useEffect(() => {
        getLauncher()
    }, []);

    const getLauncher = async () => {
        const response = await apiService.getLauncher();
        if (response.status === 200) {
            setWishlistSetting(response.data)
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
    }

    const updateLauncher = async () => {
        setIsLoading(true)
        let payload = {
            ...wishlistSetting
        }
        delete payload.icon
        const response = await apiService.updateLauncher(payload, wishlistSetting.id)
        if (response.status === 200) {
            setIsLoading(false)
            setMessage(capitalizeMessage(response.message))
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsLoading(false)
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsLoading(false)
        }
    }

    const updateIcon = async () => {
        setIsSVGLoading(true)
        const formData = new FormData();
        formData.append("icon", file)
        const response = await apiService.updateIcon(formData, true)
        if (response.status === 200) {
            setFile("")
            setIsSVGLoading(false)
            setMessage(capitalizeMessage(response.message))
            getLauncher();
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsSVGLoading(false)
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsSVGLoading(false)
        }
    }

    const deleteIcon = async () => {
        setIsSVGLoading(true)
        const response = await apiService.deleteIcon()
        if (response.status === 200) {
            setFile("")
            setIsSVGLoading(false)
            setMessage(capitalizeMessage(response.message))
            getLauncher()
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsSVGLoading(false)
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsSVGLoading(false)
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
            content: 'Collection Page',
            panelID: 'accepts-marketing-content-1',
        },
    ];

    const onBack = () => {
        navigate(`${baseUrl}/settings`)
    }

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    return (
        <Fragment>

            <Page title={"Wishlist Design"} backAction={{content: 'Settings', onAction: onBack}}
                  primaryAction={{content: "Save", onAction: updateLauncher, loading: isLoading}}>
                <Layout>
                    {message !== "" && isError === false ? <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner message={message} setMessage={setMessage} setIsError={setIsError} isError={isError} link={""}/>
                    <Layout.Section fullWidth>
                        <Card padding={"0"}>
                            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
                        </Card>
                    </Layout.Section>
                    {selected == 0 &&
                    <ProductDesign
                        wishlistSetting={wishlistSetting}
                        setWishlistSetting={setWishlistSetting}
                        file={file}
                        setFile={setFile}
                        updateIcon={updateIcon}
                        deleteIcon={deleteIcon}
                        isSVGLoading={isSVGLoading}

                    />
                    }
                    {selected == 1 &&
                    <CollectionDesign
                        wishlistSetting={wishlistSetting}
                        setWishlistSetting={setWishlistSetting}
                        file={file}
                        setFile={setFile}
                        updateIcon={updateIcon}
                        deleteIcon={deleteIcon}
                        isSVGLoading={isSVGLoading}
                    />
                    }
                    <Layout.Section fullWidth>
                        <PageActions
                            primaryAction={{
                                content: 'Save',
                                onAction: updateLauncher,
                                loading: isLoading
                            }}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};
export default WishlistDesign