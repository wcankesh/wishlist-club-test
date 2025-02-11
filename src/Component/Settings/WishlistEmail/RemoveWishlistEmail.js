import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {BlockStack, Box, Button, Card, Checkbox, InlineGrid, Text, TextField} from "@shopify/polaris";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {apiService, baseUrl, capitalizeMessage, isChecked, templateJson, toggleFlag} from "../../../utils/Constant";
import ToastMessage from "../../Comman/ToastMessage"
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import EmailTemplateMsg from "../../Comman/EmailTemplateMsg";
import EmailEditorComponent from "../../Comman/EmailEditorComponent";
import {Modal, TitleBar, useAppBridge} from "@shopify/app-bridge-react";
import {Icons} from "../../../utils/Icons";

const initialState = {
    time: '0',
    is_enable: 0,
    subject: "",
};

const RemoveWishlistEmail = () => {
    const shopify = useAppBridge();
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const [emailSetting, setEmailSetting] = useState(initialState);
    const [allEmailSetting, setAllEmailSetting] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
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
        const response = await apiService.emailSetting();
        if (response.status === 200) {
            setAllEmailSetting(response.data);
            const result = response.data && response.data.remove_wishlist_setting;
            const updateState = {
                id: response.data?.id,
                time: result?.time || '0',
                is_enable: result?.is_enable,
                subject: result?.remove_wishlist_mail_subject,
            }
            setEmailSetting((state) => ({...state, ...updateState}))
            setMailTemplateJson(JSON.parse(response.data && response.data.remove_wishlist_mail_json) || templateJson);

        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            shopify.toast.show(capitalizeMessage(response.message), {isError: true})
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            shopify.toast.show(capitalizeMessage(response.message), {isError: true})
        }
    }

    const saveEmailSetting = async () => {
        setIsLoading(true);

        editorRef.current.editor.exportHtml(async (data) => {
            const {design, html} = data;
            setMailTemplateJson(design);
            const payload = {
                type: 2,
                "wishlist_report_setting": {
                    "is_enable": allEmailSetting?.wishlist_report_setting?.is_enable,
                    "type": allEmailSetting?.wishlist_report_setting?.type,
                },
                "remove_wishlist_setting": {
                    "is_enable": emailSetting?.is_enable,
                    "time": emailSetting?.time,
                    "remove_wishlist_mail_subject": emailSetting?.subject,
                },
                "remove_wishlist_mail_json": JSON.stringify(design),
                "remove_wishlist_mail_html": html,
            };

            const response = await apiService.onUpdateV2EmailSetting(payload, emailSetting.id);
            if (response.status === 200) {
                setMessage(capitalizeMessage(response.message));
                setIsLoading(false);
                shopify.toast.show(capitalizeMessage(response.message))
            } else if (response.status === 500) {
                setMessage(capitalizeMessage(response.message));
                setIsErrorServer(true);
                setIsLoading(false);
                shopify.toast.show(capitalizeMessage(response.message), {isError: true})
            } else {
                setMessage(capitalizeMessage(response.message));
                setIsError(true);
                setIsLoading(false);
                shopify.toast.show(capitalizeMessage(response.message), {isError: true})
            }
        });
    }

    const handleChange = useCallback((name, value) => {
        const update = {...emailSetting, [name]: value}
        setEmailSetting(update);
    }, [emailSetting]);

    const onBack = () => {
        navigate(`${baseUrl}/settings/email`)
    }

    const exportHtml = () => {
        editorRef.current.editor.exportHtml((data) => {
            const {design, html} = data;
        });
    };

    const onChange = () => {
        editorRef.current.editor.exportHtml((data) => {
            const {design} = data;
        });
    };

    const onLoad = () => {
        const tryInitializeEditor = () => {
            if (editorRef.current && editorRef.current.editor) {
                editorRef.current.editor.loadDesign(mailTemplateJson);
                editorRef.current.editor.addEventListener('design:updated', onChange);
            } else {
                console.error("Email editor reference is not available yet.");
            }
        };

        if (editorRef.current !== null) {
            tryInitializeEditor();
        } else {
            const retryInterval = setInterval(() => {
                if (editorRef.current !== null) {
                    tryInitializeEditor();
                    clearInterval(retryInterval);
                }
            }, 100);
        }
    };

    const msgArray = [
        "{shop_name} : To show the shop name",
        "{customer_name} : To show customer name ",
        "{product_html} : To show wishlist product (required)",
        '{unsubscribe}: Use this tag to display the unsubscribe link',
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
                <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 1, xl: 1}} gap={'300'}>
                    <Checkbox
                        label={<Text variant="headingSm" as="h6">Enable Email</Text>}
                        checked={isChecked(emailSetting?.is_enable)}
                        onChange={(value) => handleChange("is_enable", toggleFlag(emailSetting?.is_enable))}
                        helpText={"Notify customers when they remove an item from their wishlist."}
                        name={"is_enable"}
                    />

                    <TextField
                        label={<Text variant="headingSm" as="h6">Email Subject</Text>}
                        value={emailSetting?.subject}
                        helpText={
                            <>
                                {"{customer_name}, you removed an item from your wishlist."}
                                <br />
                                {"You can include these variables in your subject: {shop_name}, {customer_name}."}
                            </>
                        }
                        onChange={(value) => handleChange("subject", value)}
                    />

                    <TextField
                        label={<Text variant="headingSm" as="h6">Time (in mins.)</Text>}
                        value={emailSetting?.time}
                        onChange={(value) => handleChange('time', value)}
                        type={'number'}
                        min={0}
                        helpText={'Set the delay in minutes for sending the email after the item is removed.'}
                    />
                </InlineGrid>
            </Box>
        </>
    );

    return (
        <Fragment>
            <Modal open={true} onHide={onBack} variant={'max'}>
                <TitleBar title={"Remove Wishlist Email"}>
                    <button variant="primary" loading={isLoading && ''}
                            onClick={() => saveEmailSetting()}>{'Save'}</button>
                </TitleBar>
                <div className="fullContainerPage">
                    <div className="fullContainerPage-inner">
                        <div className="fullContainerPage-inner-left">
                            {onDisplaySettings}
                        </div>

                        <div className="fullContainerPage-inner-right">
                            <div className={`fullContainerPage-inner-left-settings ${showSettings ? 'show' : 'hide'}`}>{onDisplaySettings}</div>
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
                                <BlockStack gap={"300"}>
                                    {message !== "" && isError === false ?
                                        <CustomErrorBanner link={AppDocsLinks.article["425"]} message={message}
                                                           setMessage={setMessage}
                                                           setIsError={setIsError} isError={true} isCardBanner={true}/>
                                        : ""}
                                    <EmailTemplateMsg msgArray={msgArray}/>
                                    <Card padding={'0'}>
                                        <EmailEditorComponent
                                            ref={editorRef}
                                            exportHtml={exportHtml}
                                            onLoad={onLoad}
                                            style={{height: 600}}
                                            mailTemplate={mailTemplateJson}
                                            onChange={onChange}
                                        />
                                    </Card>
                                </BlockStack>
                            </Box>
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
};

export default RemoveWishlistEmail;