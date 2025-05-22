import React, { Fragment, useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { Tabs, Layout, Page, PageActions, Card } from "@shopify/polaris";
import { apiService, baseUrl, capitalizeMessage } from "../../../utils/Constant";
import ToastMessage from "../../Comman/ToastMessage";
import { AppDocsLinks } from "../../../utils/AppDocsLinks";
import { useNavigate } from "react-router-dom"
import qs from "qs";
import CollectionDesign from "./CollectionDesign";
import ProductDesign from "./ProductDesign";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import GeneralNew from "../GeneralNew/GeneralNew";
import LanguageNew from "../LanguageNew/LanguageNew";
import WishlistPage from "./WishlistPage";
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
    icon: "",
    grid_per_row: "4",
    show_variant: 0,
    variant_type: 'default'
}
const WishlistDesign = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlStep = urlParams.get("step") || '0';
    const [selected, setSelected] = useState(Number(urlStep));
    const [wishlistSetting, setWishlistSetting] = useState(initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [isSVGLoading, setIsSVGLoading] = useState(false);
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const [file, setFile] = useState("")
    const childRef = useRef();
    const handleButtonClick = () => {
        if (childRef.current) {
            childRef.current.triggerAlert();
        }
    };
    const navigate = useNavigate();
    useEffect(() => {
        getLauncher()
    }, []);

    const getLauncher = async () => {
        const response = await apiService.getLauncher();
        if (response.status === true) {
            setIsError(false)
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
        if (response.status === true) {
            setIsLoading(false)
            setIsError(false)
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
            setIsError(false)
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
            setIsError(false)
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
            link: "admin/wishlist-design?step=0"
        },
        {
            id: 'accepts-marketing-1',
            content: 'Collection Page',
            panelID: 'accepts-marketing-content-1',
            link: "admin/wishlist-design?step=1"
        },
        {
            id: 'accepts-marketing-2',
            content: 'Wishlist Page',
            panelID: 'accepts-marketing-content-2',
            link: "admin/wishlist-design?step=2"
        },
        {
            id: 'accepts-setting-1',
            content: 'General Settings',
            panelID: 'accepts-setting-content-1',
            link: "admin/wishlist-design?step=3"
        },
        {
            id: 'accepts-Language-1',
            content: 'Language',
            panelID: 'accepts-Language-content-1',
            link: "admin/wishlist-design?step=4"
        },
    ];

    const renderTabContent = () => {
        switch (selected) {
            case 0:
                return (
                    <ProductDesign
                        wishlistSetting={wishlistSetting}
                        setWishlistSetting={setWishlistSetting}
                        file={file}
                        setFile={setFile}
                        updateIcon={updateIcon}
                        deleteIcon={deleteIcon}
                        isSVGLoading={isSVGLoading}
                    />
                );
            case 1:
                return (
                    <CollectionDesign
                        wishlistSetting={wishlistSetting}
                        setWishlistSetting={setWishlistSetting}
                        file={file}
                        setFile={setFile}
                        updateIcon={updateIcon}
                        deleteIcon={deleteIcon}
                        isSVGLoading={isSVGLoading}
                    />
                );
            case 2:
                return (
                   <WishlistPage  wishlistSetting={wishlistSetting}
                                  setWishlistSetting={setWishlistSetting}/>
                );
            case 3:
                return (
                    <GeneralNew />
                );
            case 4:
                return (
                    <LanguageNew ref={childRef} isLoading={isLoading} setIsLoading={setIsLoading} />
                );
            default:
                return null;
        }
    };

    const handleTabChange = useCallback(
        (selectedTabIndex) => {
            setSelected(selectedTabIndex)
            const params = Object.fromEntries(urlParams);
            navigate({ pathname: `${baseUrl}/wishlist-design`, search: qs.stringify({ ...params, step: selectedTabIndex }) });
        },
        [],
    );
    const onSave = () => {
        if (Number(urlStep) === 4) {
            handleButtonClick()
        } else {
            updateLauncher();
        }
    };

    return (
        <Fragment>
            <Page
                title="Wishlist Design"
                primaryAction={
                    selected !== 3
                        ? { content: "Save", onAction: onSave, loading: isLoading }
                        : undefined
                }
            >
                <Layout>
                    {message !== "" && isError === false ? <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer} /> : ""}
                    <Suspense fallback={null}>
                        <CustomErrorBanner link={AppDocsLinks.article["424"]} message={message} setMessage={setMessage} setIsError={setIsError} isError={isError} />
                    </Suspense>
                    <Layout.Section fullWidth>
                        <Card padding={"0"}>
                            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
                        </Card>
                    </Layout.Section>
                    {renderTabContent()}
                </Layout>
                {selected !== 3 && <PageActions
                    primaryAction={{
                        content: 'Save',
                        onAction: onSave,
                        loading: isLoading
                    }}
                />}
            </Page>
        </Fragment>
    );
};
export default WishlistDesign