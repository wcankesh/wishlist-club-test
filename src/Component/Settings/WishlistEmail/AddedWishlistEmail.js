import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {BlockStack, Box, Button, Checkbox, InlineGrid, Select, Text, TextField} from "@shopify/polaris";
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl, capitalizeMessage, isChecked, templateJson, toggleFlag} from "../../../utils/Constant";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import EmailTemplateMsg from "../../Comman/EmailTemplateMsg";
import {Modal, TitleBar, useAppBridge} from "@shopify/app-bridge-react";
import {Icons} from "../../../utils/Icons";
import {RenderLoading} from "../../../utils/RenderLoading";
import EmailEditor from "react-email-editor";

const initialState = {
    time: '1',
    is_enable: 0,
    subject: "",
};

const AddedWishlistEmail = () => {
    const shopify = useAppBridge();
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const [emailSetting, setEmailSetting] = useState(initialState);
    const [allEmailSetting, setAllEmailSetting] = useState({});
    const [isLoading, setIsLoading] = useState('')
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const [mailTemplateJson, setMailTemplateJson] = useState({});
    const [showSettings, setShowSettings] = useState(false);

    const onHandleShowSettings = () => {
        setShowSettings(!showSettings);
    }

    useEffect(() => {
        EmailSetting();
    }, []);

    const EmailSetting = async () => {
        setIsLoading('details');
        const response = await apiService.emailSetting();
        if (response.status === 200) {
            setAllEmailSetting(response.data);
            const result = response.data && response.data.add_wishlist_setting;
            const updateState = {
                id: response.data?.id,
                time: result?.time || '0',
                is_enable: result?.is_enable,
                subject: result?.add_wishlist_mail_subject,
            }
            setEmailSetting((state) => ({...state, ...updateState}))
            setMailTemplateJson(JSON.parse(response.data && response.data.add_wishlist_mail_json) || templateJson);
            setIsLoading('');
        } else if (response.status === 500) {
            shopify.toast.show(capitalizeMessage(response.message), {isError: true})
            setIsLoading('');
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            shopify.toast.show(capitalizeMessage(response.message), {isError: true})
            setIsLoading('');
        }
    }

    const saveEmailSetting = async () => {
        setIsLoading('save');

        editorRef.current.editor.exportHtml(async (data) => {
            const {design, html} = data;
            setMailTemplateJson(design);
            const payload = {
                type: 1,
                "wishlist_report_setting": {
                    "is_enable": allEmailSetting?.wishlist_report_setting?.is_enable,
                    "type": allEmailSetting?.wishlist_report_setting?.type,
                },
                "add_wishlist_setting": {
                    "is_enable": emailSetting?.is_enable,
                    "time": emailSetting?.time,
                    "add_wishlist_mail_subject": emailSetting?.subject,
                },
                "add_wishlist_mail_json": JSON.stringify(design),
                "add_wishlist_mail_html": html,
            };

            const response = await apiService.onUpdateV2EmailSetting(payload, emailSetting.id);
            if (response.status === 200) {
                setIsError(false);
                shopify.toast.show(capitalizeMessage(response.message))
                setIsLoading('');
            } else if (response.status === 500) {
                shopify.toast.show(capitalizeMessage(response.message), {isError: true})
                setIsLoading('');
            } else {
                setMessage(capitalizeMessage(response.message));
                setIsError(true);
                shopify.toast.show(capitalizeMessage(response.message), {isError: true})
                setIsLoading('');
            }
        });
    }

    const handleChange = useCallback((name, value) => {
        const update = {...emailSetting, [name]: value}
        setEmailSetting(update);
    }, [emailSetting]);

    const onBack = () => {
        navigate(`${baseUrl}/settings/email?step=1`)
    }

    useEffect(() => {
        if (editorRef.current && editorRef.current.editor) {
            editorRef.current.editor.exportHtml((data) => {
                const {design: currentDesign} = data;
                if (JSON.stringify(currentDesign) !== JSON.stringify(mailTemplateJson)) {
                    editorRef.current.editor.loadDesign(mailTemplateJson);
                }
            });
        }
        return () => {
            if (editorRef.current && editorRef.current.editor) {
                editorRef.current.editor.removeEventListener('design:updated', onMailDesignChange);
            }
        };
    }, [mailTemplateJson]);

    const onMailDesignChange = () => {
        editorRef.current.editor.exportHtml((data) => {
            const {design} = data;
        });
    };

    const exportHtml = () => {
        editorRef.current.editor.exportHtml((data) => {
            const {design, html} = data;
        });
    };

    const onLoad = () => {
        if (editorRef.current && editorRef.current.editor) {
            editorRef.current.editor.exportHtml((data) => {
                const {design: currentDesign} = data;
                if (JSON.stringify(currentDesign) !== JSON.stringify(mailTemplateJson)) {
                    editorRef.current.editor.loadDesign(mailTemplateJson);
                }
                editorRef.current.editor.addEventListener('design:updated', onMailDesignChange);
            });
        } else {
            const retryLoadDesign = setInterval(() => {
                if (editorRef.current && editorRef.current.editor) {
                    editorRef.current.editor.exportHtml((data) => {
                        const {design: currentDesign} = data;

                        if (JSON.stringify(currentDesign) !== JSON.stringify(mailTemplateJson)) {
                            editorRef.current.editor.loadDesign(mailTemplateJson);
                        }
                        editorRef.current.editor.addEventListener('design:updated', onMailDesignChange);
                        clearInterval(retryLoadDesign);
                    });
                }
            }, 1000);
        }
    };

    const msgArray = [
        "{shop_name} : To show the shop name",
        "{customer_name} : To show customer name ",
        "{product_html} : To show wishlist product (required)",
        "{product_name} : To show product name ",
        '{unsubscribe}: Use this tag to display the unsubscribe link',
    ];

    const TimeOptions = [
        {label: "1 min", value: "1"},
        {label: "5 min", value: "5"},
        {label: "10 min", value: "10"},
        {label: "20 min", value: "20"},
        {label: "30 min", value: "30"},
        {label: "45 min", value: "45"},
        ...Array.from({length: 12}, (_, i) => ({
            label: `${i + 1} Hour`,
            value: `${(i + 1) * 60}`
        }))
    ];

    const onDisplaySettings = (
        <>
            <div className={'fullContainerPage-inner-left-title'}>
                <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Email Settings</Text>
                {showSettings ? (
                    <span className={'left-settings'}>
                    <Button variant={'secondary'} icon={Icons.XSmallIcon} onClick={onHandleShowSettings}/>
                </span>
                ) : ''}
            </div>
            <Box padding={'400'}>
                {isLoading === 'details' ? RenderLoading.commonParagraph :
                    <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 1, xl: 1}} gap={'300'}>
                        <Checkbox
                            label={<Text variant="headingSm" as="h6">Enable Email</Text>}
                            checked={isChecked(emailSetting?.is_enable)}
                            onChange={(value) => handleChange("is_enable", toggleFlag(emailSetting?.is_enable))}
                            helpText={"Turn this on to notify customers when they add an item to their wishlist."}
                            name={"is_enable"}
                        />

                        <TextField
                            label={<Text variant="headingSm" as="h6">Email Subject</Text>}
                            value={emailSetting?.subject}
                            helpText={
                                <>
                                    {"{customer_name}, thank you for adding to your wishlist!"}
                                    <br/>
                                    {"You can include these variables in your subject: {shop_name}, {customer_name}, {product_name}."}
                                </>
                            }
                            onChange={(value) => handleChange("subject", value)}
                        />

                        <Select
                            label={<Text variant="headingSm" as="h6">Time</Text>}
                            options={TimeOptions}
                            onChange={(value) => handleChange('time', value)}
                            value={emailSetting?.time}
                            helpText={'Set the delay in minutes to send the email after the item is added to wishlist.'}
                        />
                    </InlineGrid>
                }
            </Box>
        </>
    );

    return (
        <Fragment>
            <Modal open={true} onHide={onBack} variant={'max'}>
                <TitleBar title={"Added to Wishlist"}>
                    <button onClick={onBack}>{'Cancel'}</button>
                    <button variant="primary" loading={isLoading === 'save' && ''}
                            onClick={() => saveEmailSetting()}>{'Save'}</button>
                </TitleBar>
                <div className="fullContainerPage">
                    <div className="fullContainerPage-inner">
                        <div className="fullContainerPage-inner-left">
                            {onDisplaySettings}
                        </div>

                        <div className="fullContainerPage-inner-right">
                            <div
                                className={`fullContainerPage-inner-left-settings ${showSettings ? 'show' : 'hide'}`}>{onDisplaySettings}</div>
                            <div className={'fullContainerPage-inner-right-title'}>
                                <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}> Email Template</Text>
                                {showSettings ? '' : (
                                    <span className={'left-settings'}>
                                        <Button variant={'secondary'} icon={Icons.EditIcon}
                                                onClick={onHandleShowSettings}>Edit</Button>
                                    </span>
                                )}
                            </div>
                            <Box padding={'400'}>
                                <BlockStack gap={"200"}>
                                    {message !== "" && isError === false ?
                                        <CustomErrorBanner link={AppDocsLinks.article["425"]} message={message}
                                                           setMessage={setMessage}
                                                           setIsError={setIsError} isError={true} isCardBanner={true}/>
                                        : ""}
                                    <EmailTemplateMsg msgArray={msgArray}/>
                                    <div className="email-editor-wrap">
                                        <EmailEditor
                                            ref={editorRef}
                                            exportHtml={exportHtml}
                                            onLoad={onLoad}
                                            style={{height: 600}}
                                        />
                                    </div>
                                </BlockStack>
                            </Box>
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
};

export default AddedWishlistEmail;