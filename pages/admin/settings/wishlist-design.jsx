import React, {Fragment, useState, useCallback, useEffect} from 'react';
import {LegacyTabs, Layout, Page, PageActions} from "@shopify/polaris";
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl} from "../../../utils/Constant";
import {CollectionDesign, ProductDesign} from "../../../components";
import {ToastMessage} from "../../../components";

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
export default function WishlistDesign() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(0);
    const [wishlistSetting, setWishlistSetting] = useState(initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [isSVGLoading, setIsSVGLoading] = useState(false);
    const [message, setMessage] = useState("")
    const [file, setFile] = useState("")

    useEffect(() => {
        getLauncher()
    }, []);

    const getLauncher = async () => {
        setIsLoading(false);
        const response = await apiService.getLauncher();
        if (response.status === 200) {
            setWishlistSetting(response.data)
            setIsLoading(false)
        } else {
            setIsLoading(false)

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
            setMessage(response.message)
        } else {
            setIsLoading(false)
            setMessage(response.message)
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
            setMessage(response.message)
            getLauncher();
        } else {
            setFile("")
            setIsSVGLoading(false)
            setMessage(response.message)
        }
    }

    const deleteIcon = async () => {
        setIsSVGLoading(true)
        const response = await apiService.deleteIcon()
        if (response.status === 200) {
            setFile("")
            setIsSVGLoading(false)
            setMessage(response.message)
            getLauncher()
        } else {
            setFile("")
            setIsSVGLoading(false)
            setMessage(response.message)
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
            <ToastMessage message={message} setMessage={setMessage}/>
            <Page title={"Wishlist Design"} backAction={{content: 'Settings', onAction: onBack}}
                  primaryAction={{content: "Save", onAction: updateLauncher, loading: isLoading}}>
                <LegacyTabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                    {selected == 0 &&
                    <Layout>
                        <ProductDesign
                            wishlistSetting={wishlistSetting}
                            setWishlistSetting={setWishlistSetting}
                            file={file}
                            setFile={setFile}
                            updateIcon={updateIcon}
                            deleteIcon={deleteIcon}
                            isSVGLoading={isSVGLoading}

                        />
                    </Layout>}
                    {selected == 1 &&
                    <Layout>
                        <CollectionDesign
                            wishlistSetting={wishlistSetting}
                            setWishlistSetting={setWishlistSetting}
                            file={file}
                            setFile={setFile}
                            updateIcon={updateIcon}
                            deleteIcon={deleteIcon}
                            isSVGLoading={isSVGLoading}
                        />
                    </Layout>
                    }
                </LegacyTabs>
                <Layout.Section>
                    <PageActions
                        primaryAction={{
                            content: 'Save',
                            onAction: updateLauncher,
                            loading: isLoading
                        }}
                    />
                </Layout.Section>
            </Page>
        </Fragment>
    );
};