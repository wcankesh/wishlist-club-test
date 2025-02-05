import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {BlockStack, Box, Button, FullscreenBar, InlineGrid, InlineStack, Text, TextField} from "@shopify/polaris";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {apiService, baseUrl, capitalizeMessage, isChecked, templateJson} from "../../../utils/Constant";
import ToastMessage from "../../Comman/ToastMessage"
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import EmailTemplateMsg from "../../Comman/EmailTemplateMsg";
import SwitchButton from "../../Comman/SwitchButton";
import EmailEditorComponent from "../../Comman/EmailEditorComponent";

const initialState = {
    days: '0',
    is_enable: 0,
    subject: "",
};

const AbandonmentReminderEmail = () => {
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const [emailSetting, setEmailSetting] = useState(initialState);
    const [allEmailSetting, setAllEmailSetting] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const [mailTemplateJson, setMailTemplateJson] = useState({});
    const shopDetails = useSelector((state) => state.shopDetails);

    useEffect(() => {
        EmailSetting();
    }, []);

    const EmailSetting = async () => {
        const response = await apiService.emailSetting();
        if (response.status === 200) {
            setAllEmailSetting(response.data);
            const result = response.data && response.data.abandonment_reminder_setting;
            const updateState = {
                id: response.data?.id,
                days: result?.days || '0',
                is_enable: result?.is_enable,
                subject: result?.abandonment_reminder_mail_subject,
            }
            setEmailSetting((state) => ({...state, ...updateState}))
            setMailTemplateJson(JSON.parse(response.data && response.data.abandonment_reminder_mail_json) || templateJson);

        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
    }

    const saveEmailSetting = async (field, value, isLoad) => {
        setIsLoading(isLoad);
        const payload =
            {
                ...allEmailSetting,
                abandonment_reminder_setting: {
                    is_enable: field === 'is_enable' ? value : emailSetting?.is_enable,
                    days: emailSetting?.days,
                    abandonment_reminder_mail_subject: emailSetting?.subject,
                },
            }
        let formData = new FormData();
        formData.append("payload", JSON.stringify(payload));
        editorRef.current.editor.exportHtml(async (data) => {
            const {design, html} = data;
            setMailTemplateJson(design);
            formData.append("abandonment_reminder_mail_json", JSON.stringify(design));
            formData.append("abandonment_reminder_mail_html", html);

            const response = await apiService.updateEmailSetting(formData, emailSetting.id);
            if (response.status === 200) {
                setMessage(capitalizeMessage(response.message));
                setIsLoading(false);
            } else if (response.status === 500) {
                setMessage(capitalizeMessage(response.message));
                setIsErrorServer(true);
                setIsLoading(false);
            } else {
                setMessage(capitalizeMessage(response.message));
                setIsError(true);
                setIsLoading(false);
            }
        });
        setIsLoading(false);
    }

    const handleChange = useCallback((name, value) => {
        const update = {...emailSetting, [name]: value}
        setEmailSetting(update);
    }, [emailSetting]);

    const onBack = () => {
        navigate(`${baseUrl}/settings/email`)
    }

    const handleSwitch = async (e) => {
        const {name, value, checked} = e.target;
        setEmailSetting({...emailSetting, [name]: value})
        saveEmailSetting('is_enable', value, false)
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
        '{{unsubscribe}}: Use this tag to display the unsubscribe link',
    ];

    return (
        <Fragment>
            {message !== "" && isError === false ?
                <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                              setIsErrorServer={setIsErrorServer}/>
                : ""}
            <CustomErrorBanner link={AppDocsLinks.article["425"]} message={message} setMessage={setMessage}
                               setIsError={setIsError} isError={isError}/>

            <div className="fullContainerPage">
                <div className="fullContainerPage-header">
                    <FullscreenBar onAction={onBack}>
                        <div className={'FullscreenBar-main-div'}>
                            <div className={'FullscreenBar-main-title-div'}>
                                <Text variant="headingLg" as="span">{"Abandonment Reminder Email"}</Text>
                            </div>
                            <InlineStack gap={'150'}>
                                <SwitchButton
                                    checked={isChecked(emailSetting?.is_enable == 1)}
                                    onChange={handleSwitch} name={"is_enable"}/>

                                <Button variant="primary"
                                        onClick={() => saveEmailSetting("", "", true)}
                                        loading={isLoading}
                                >
                                    Save
                                </Button>
                            </InlineStack>
                        </div>
                    </FullscreenBar>
                </div>

                <div className="fullContainerPage-inner">
                    <div className="fullContainerPage-inner-left">
                        <BlockStack gap={"200"}>
                            <div className={'fullContainerPage-inner-left-title'}>
                                <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Email Settings</Text>
                            </div>
                            <Box padding={'400'}>
                                <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 1, xl: 1}} gap={'150'}>
                                    <TextField label="Email subject"
                                               value={emailSetting?.subject}
                                               helpText={"Add this {shop_name} {customer_name} variable"}
                                               onChange={(value) => handleChange("subject", value)}
                                    />
                                    <TextField
                                        label="Days"
                                        value={emailSetting?.days}
                                        onChange={(value) => handleChange('time', value)}
                                        type={'number'}
                                        min={0}
                                    />
                                </InlineGrid>
                            </Box>
                        </BlockStack>
                    </div>

                    <div className="fullContainerPage-inner-right">
                        <BlockStack gap={"200"}>
                            <div className={'fullContainerPage-inner-right-title'}>
                                <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}> Email Template</Text>
                            </div>
                            <Box padding={'400'}>
                                <BlockStack gap={"100"}>
                                    <EmailTemplateMsg msgArray={msgArray}/>
                                    <EmailEditorComponent
                                        ref={editorRef}
                                        exportHtml={exportHtml}
                                        onLoad={onLoad}
                                        style={{height: 600}}
                                        mailTemplate={mailTemplateJson}
                                        onChange={onChange}
                                    />
                                </BlockStack>
                            </Box>
                        </BlockStack>
                    </div>
                </div>
            </div>

        </Fragment>
    );
};

export default AbandonmentReminderEmail;