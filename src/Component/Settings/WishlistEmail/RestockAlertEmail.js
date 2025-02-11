import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
    Page,
    Layout,
    BlockStack, Box, Divider, Card, Text,
    TextField,
    PageActions,
    Button, InlineGrid
} from "@shopify/polaris";
import {
    apiService,
    baseUrl,
    capitalizeMessage,
    facebookImage,
    instagramImage, linkedInImage, pinterestImage, telegramImage, templateJson,
    twitterImage, upgradePayload
} from "../../../utils/Constant";
import ColorInput from "../../Comman/ColorInput"
import ToastMessage from "../../Comman/ToastMessage"
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {ProductGroup1242} from "../../../utils/AppImages";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {formValidate} from "../../Comman/formValidate";
import EmailEditorComponent from "../../Comman/EmailEditorComponent";
import EmailTemplateMsg from "../../Comman/EmailTemplateMsg";
import ConformationModal from "../../Comman/ConformationModal";

const initialState = {
    restock_email_subject: "Restock Alert!!!",
    restock_email_body: "Your wishlist item in stock  is dropped so hurry up to buy your favorite product now!!!",
    restock_email_reply_to_email: "",
    restock_branding_type: 1,
    restock_logo: "",
    restock_footer_text: "wishlist_footer",
    restock_button_text: "View Product",
    restock_social: {
        facebook: "",
        instagram: "",
        linkedin: "",
        pinterest: "",
        telegram: "",
        title: "Follow us on",
        twitter: ""
    },
    restock_style: {
        background_color: "#f2f2f3",
        font_family: "roboto",
        description_font_size: "16",
        theme: "1",
        add_to_cart_btn_bg_color: "",
        add_to_cart_btn_text_color: "",
        add_to_cart_btn_border_color: "",
        add_to_cart_btn_border_size: "",
        add_to_cart_btn_horizontal_padding: "",
        add_to_cart_btn_vertical_padding: "",
        view_product_btn_bg_color: "",
        view_product_btn_text_color: "",
        view_product_btn_border_color: "",
        view_product_btn_border_size: "",
        view_product_btn_horizontal_padding: "",
        view_product_btn_vertical_padding: "",
        add_to_cart_btn_border_radius: 10,
        view_product_btn_border_radius: 10
    },
    restock_content: {
        add_to_cart_button_text: "",
        view_product_button_text: ""
    }
};

const initialSateError = {
    restock_email_subject: "",
    restock_email_body: "",
    restock_email_reply_to_email: "",
    add_to_cart_button_text: "",
    view_product_button_text: "",
    add_to_cart_btn_border_size:"",
};

const RestockAlertEmail = () => {
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const [emailSetting, setEmailSetting] = useState(initialState);
    const [emailSettingError, setEmailSettingError] = useState(initialSateError);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const [selectedRestockLogo, setSelectedRestockLogo] = useState("");
    const shopDetails = useSelector((state) => state.shopDetails);
    const [mailTemplate,setMailTemplate] = useState({});
    const [active,setActive] = useState(false);
    const [isConfirmLoading,setIsConfirmLoading] = useState(false);

    const onBack = () => {
        navigate(`${baseUrl}/settings/email?step=2`)
    }

    useEffect(() => {
        EmailSetting()
    }, []);

    const EmailSetting = async () => {
        const response = await apiService.emailSetting();
        if (response.status === 200) {
            setEmailSetting(response.data);
            setMailTemplate(JSON.parse(response.data?.restock_json) || templateJson);
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true)
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
    }

    const saveEmailSetting = async (record, isLoad) => {
        if(isLoad){
            let validationErrors = {};
            let tempObj = {restock_email_subject: emailSetting.restock_email_subject,
                restock_email_body: emailSetting.restock_email_body,
                restock_email_reply_to_email: emailSetting.restock_email_reply_to_email,
                add_to_cart_button_text: emailSetting.restock_content.add_to_cart_button_text,
                view_product_button_text: emailSetting.restock_content.view_product_button_text,
                add_to_cart_btn_border_size:emailSetting.restock_style.add_to_cart_btn_border_size,
                add_to_cart_btn_vertical_padding:emailSetting.restock_style.add_to_cart_btn_vertical_padding,
                add_to_cart_btn_horizontal_padding:emailSetting.restock_style.add_to_cart_btn_horizontal_padding,
                add_to_cart_btn_border_radius:emailSetting.restock_style.add_to_cart_btn_border_radius,
                view_product_btn_border_size:emailSetting.restock_style.view_product_btn_border_size,
                view_product_btn_horizontal_padding:emailSetting.restock_style.view_product_btn_horizontal_padding,
                view_product_btn_border_radius:emailSetting.restock_style.view_product_btn_border_radius,
                view_product_btn_vertical_padding:emailSetting.restock_style.view_product_btn_vertical_padding
            };
            Object.keys(tempObj).forEach((name) => {
                const error = formValidate(name, tempObj[name]);
                if (error && error.length > 0) {
                    validationErrors[name] = error;
                }
            });

            if (Object.keys(validationErrors).length > 0) {
                setEmailSettingError(validationErrors);
                return;
            }
        }

        setIsLoading(isLoad);
        ["new_wishlist_template", "new_price_drop_template", "price_drop_html", "price_drop_json","wishlist_html","wishlist_json","restock_html","restock_json"].forEach((key) => {
            delete emailSetting[key];
        });

        let newEmailSetting = {...emailSetting, ...record}
        const formData = new FormData();
        formData.append("payload", JSON.stringify(newEmailSetting))

        if(emailSetting?.new_restock_template == 1){
            editorRef.current.editor.exportHtml(async (data) => {
                const {design, html} = data;
                formData.append("restock_json", JSON.stringify(design));
                formData.append("restock_html", html);
                setMailTemplate(design);

                const response = await apiService.updateEmailSetting(formData, emailSetting.id);
                handleApiResponse(response);
            })
        }
        else{
            const  response = await apiService.updateEmailSetting(formData, emailSetting.id);
            handleApiResponse(response);
        }
    }

    const handleApiResponse = (response) => {
        if (response.status === 200) {
            setMessage(capitalizeMessage(response.message))
            setIsLoading(false);
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true)
            setIsLoading(false);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setEmailSetting({
            ...emailSetting,
            [name]: value
        })
        if(emailSettingError[name]){
            setEmailSettingError({...emailSettingError, [name]: value.trim() ? "" : emailSettingError[name]})
        }
    }

    const restockOnChangeStyle = (e) => {
        const {name, value} = e.target;
        setEmailSetting({
            ...emailSetting,
            restock_style: {...emailSetting.restock_style, [name]: value},
        })
    }

    const restockOnChangeContent = (e) => {
        const {name, value} = e.target;
        setEmailSetting({
            ...emailSetting,
            restock_content: {...emailSetting.restock_content, [name]: value},
        })
        if(emailSettingError[name]){
            setEmailSettingError({...emailSettingError, [name]: value.trim() ? "" : emailSettingError[name]})
        }
    }

    const onBlur = (e) => {
        const {name, value} = e.target
        setEmailSettingError({...emailSettingError, [name]: formValidate(name, value)})
    }

    const handleSwitch = async (e) => {
        setEmailSetting({
            ...emailSetting,
            [e.target.name]: e.target.value
        })
        saveEmailSetting({[e.target.name]: e.target.value}, false)
    }

    const onUpgradeTemplate = () => {
        setEmailSetting({...emailSetting,new_restock_template:1});
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
                editorRef.current.editor.loadDesign(mailTemplate);
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

    const getHelpText = (fieldType) => {
        const template = emailSetting.new_restock_template;
        const variablesMap = {
            restock_email_subject: {
                0: "Add this {{product_name}} {{shop_name}} variable",
                1: "Add this {product_name} {shop_name} {customer_name} variable"
            },
        };
        return variablesMap[fieldType]?.[template] || '';
    };

    const handleUpgradeNow = () => {
        setActive(!active);
    }

    const handleConfirmation = async () => {
        setIsConfirmLoading(true);
        const payload ={...upgradePayload}
        const response = await apiService.templateConfirmation(payload);
        if (response.status === 200) {
            setIsConfirmLoading(false);
            setActive((active)=>!active);
            setEmailSetting({...emailSetting,new_restock_template:1});
            setMessage(response?.message)
        } else {
            setIsConfirmLoading(false);
            setActive((active)=>!active);
            setMessage(response?.message)
        }
    }

    const msgArray = [
        "{product_name} : To show product title",
        "{shop_name} : To show the shop name",
        "{customer_name} : To show customer name",
        "{product_html} : To show restock alert product (required)",
        '{{unsubscribe}}: Use this tag to display the unsubscribe link',
    ];

    return (
        <Fragment>
            <Page title={"Restock Alerts"} backAction={{content: 'Settings', onAction: onBack}}
                  secondaryActions={
                      <Fragment>
                          <div className='switch-button'>
                              <input type="checkbox"
                                     className="switch-btn-input"
                                     id={"is_email_reminder_on_off_restock"}
                                     name={"is_email_reminder_on_off_restock"}
                                     onChange={(e) => handleSwitch({
                                         target: {
                                             name: "is_email_reminder_on_off_restock",
                                             value: e.target.checked ? 0 : 1
                                         }
                                     })}
                                     checked={emailSetting.is_email_reminder_on_off_restock == 0}
                              />
                              <label className="witch-button-label" htmlFor={"is_email_reminder_on_off_restock"}/>
                          </div>&nbsp;&nbsp;
                          <Button variant="primary" onClick={() => saveEmailSetting("", true)} loading={isLoading}> Save</Button>
                      </Fragment>
                  }
            >
                {active ? (
                    <ConformationModal
                        active={active}
                        onClose={handleUpgradeNow}
                        isLoading={isConfirmLoading}
                        handleConfirmation={handleConfirmation}
                        isEditor={true}
                    />
                ) : ""}
                <Layout>
                    {message !== "" && isError === false ? <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner link={AppDocsLinks.article["425"]} message={message} setMessage={setMessage} setIsError={setIsError} isError={isError} />

                    <Layout.Section variant={"fullWidth"}>
                        <Card padding={"0"}>
                            <BlockStack gap={"0"}>
                                <Box padding={"400"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Email Setting</Text>
                                        <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 2, xl: 2}} gap={'150'}>
                                            <TextField label="Email subject"
                                                       helpText={getHelpText('restock_email_subject')}
                                                       value={emailSetting.restock_email_subject}
                                                       onChange={(value) => handleChange({
                                                           target: {
                                                               name: "restock_email_subject",
                                                               value
                                                           }
                                                       })}
                                                       name={"restock_email_subject"}
                                                       onBlur={onBlur}
                                                       error={emailSettingError.restock_email_subject}
                                            />
                                            <TextField
                                                label="Reply to email"
                                                value={emailSetting.restock_email_reply_to_email}
                                                onChange={(value) => handleChange({
                                                    target: {
                                                        name: "restock_email_reply_to_email",
                                                        value
                                                    }
                                                })}
                                                name={"restock_email_reply_to_email"}
                                                onBlur={onBlur}
                                                error={emailSettingError.restock_email_reply_to_email}
                                            />
                                            <TextField label='"Add to cart" label'
                                                       value={emailSetting.restock_content.add_to_cart_button_text}
                                                       onChange={(value) => {
                                                           restockOnChangeContent({
                                                               target: {
                                                                   name: "add_to_cart_button_text",
                                                                   value
                                                               }
                                                           })
                                                       }}
                                                       name={"add_to_cart_button_text"}
                                                       onBlur={onBlur}
                                                       error={emailSettingError.add_to_cart_button_text}
                                            />
                                            <TextField label='"Visit product" label'
                                                       value={emailSetting.restock_content.view_product_button_text}
                                                       onChange={(value) => {
                                                           restockOnChangeContent({
                                                               target: {
                                                                   name: "view_product_button_text",
                                                                   value
                                                               }
                                                           })
                                                       }}
                                                       name={"view_product_button_text"}
                                                       onBlur={onBlur}
                                                       error={emailSettingError.view_product_button_text}
                                            />
                                        </InlineGrid>
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"400"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Add to Cart Button customization</Text>
                                        <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 2, xl: 3}} gap={'150'}>
                                            <ColorInput label={"Button Background color"} name="add_to_cart_btn_bg_color"
                                                        onChange={restockOnChangeStyle}
                                                        value={emailSetting.restock_style.add_to_cart_btn_bg_color}/>
                                            <ColorInput label={"Button Text color"} name="add_to_cart_btn_text_color"
                                                        onChange={restockOnChangeStyle}
                                                        value={emailSetting.restock_style.add_to_cart_btn_text_color}/>
                                            <ColorInput label={"Button Border color"} name="add_to_cart_btn_border_color"
                                                        onChange={restockOnChangeStyle}
                                                        value={emailSetting.restock_style.add_to_cart_btn_border_color}/>
                                            <TextField label={"Border Width"}
                                                       value={emailSetting.restock_style.add_to_cart_btn_border_size}
                                                       type="number"
                                                       suffix="PX"
                                                       onChange={(value) => {
                                                           restockOnChangeStyle({
                                                               target: {
                                                                   name: "add_to_cart_btn_border_size",
                                                                   value
                                                               }
                                                           })
                                                       }}
                                                       max={10}
                                                       min={0}
                                                       name={"add_to_cart_btn_border_size"}

                                            />
                                            <TextField label="Top & Bottom padding"
                                                       type="number"
                                                       value={emailSetting.restock_style.add_to_cart_btn_vertical_padding}
                                                       onChange={(value) => restockOnChangeStyle({
                                                           target: {
                                                               name: "add_to_cart_btn_vertical_padding",
                                                               value
                                                           }
                                                       })}
                                                       suffix="PX"
                                                       max={25}
                                                       min={0}
                                                       name={"add_to_cart_btn_vertical_padding"}
                                            />
                                            <TextField label="Left & Right padding"
                                                       type="number"
                                                       value={emailSetting.restock_style.add_to_cart_btn_horizontal_padding}
                                                       onChange={(value) => restockOnChangeStyle({
                                                           target: {
                                                               name: "add_to_cart_btn_horizontal_padding",
                                                               value
                                                           }
                                                       })}
                                                       suffix="PX"
                                                       max={25}
                                                       min={0}
                                                       name={"add_to_cart_btn_horizontal_padding"}
                                            />
                                            <TextField label="Border Radius"
                                                       type="number"
                                                       value={emailSetting.restock_style.add_to_cart_btn_border_radius}
                                                       onChange={(value) => restockOnChangeStyle({
                                                           target: {
                                                               name: "add_to_cart_btn_border_radius",
                                                               value
                                                           }
                                                       })}
                                                       min={0}
                                                       suffix="PX"
                                                       name={"add_to_cart_btn_border_radius"}
                                            />
                                        </InlineGrid>
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"400"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>View Product Button customization</Text>
                                        <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 2, xl: 3}} gap={'150'}>
                                            <ColorInput label={"Button Background color"} name="view_product_btn_bg_color"
                                                        onChange={restockOnChangeStyle}
                                                        value={emailSetting.restock_style.view_product_btn_bg_color}/>
                                            <ColorInput label={"Button Text color"} name="view_product_btn_text_color"
                                                        onChange={restockOnChangeStyle}
                                                        value={emailSetting.restock_style.view_product_btn_text_color}/>
                                            <ColorInput label={"Button Border color"} name="view_product_btn_border_color"
                                                        onChange={restockOnChangeStyle}
                                                        value={emailSetting.restock_style.view_product_btn_border_color}/>
                                            <TextField label={"Border Width"}
                                                       value={emailSetting.restock_style.view_product_btn_border_size}
                                                       type="number"
                                                       suffix="PX"
                                                       onChange={(value) => {
                                                           restockOnChangeStyle({
                                                               target: {
                                                                   name: "view_product_btn_border_size",
                                                                   value
                                                               }
                                                           })
                                                       }}
                                                       min={0}
                                                       name={"view_product_btn_border_size"}
                                            />
                                            <TextField label="Top & Bottom padding"
                                                       type="number"
                                                       value={emailSetting.restock_style.view_product_btn_vertical_padding}
                                                       onChange={(value) => restockOnChangeStyle({
                                                           target: {
                                                               name: "view_product_btn_vertical_padding",
                                                               value
                                                           }
                                                       })}
                                                       suffix="PX"
                                                       min={0}
                                                       name={"view_product_btn_vertical_padding"}
                                            />
                                            <TextField label="Left & Right padding"
                                                       type="number"
                                                       value={emailSetting.restock_style.view_product_btn_horizontal_padding}
                                                       onChange={(value) => restockOnChangeStyle({
                                                           target: {
                                                               name: "view_product_btn_horizontal_padding",
                                                               value
                                                           }
                                                       })}
                                                       suffix="PX"
                                                       min={0}
                                                       name={"view_product_btn_horizontal_padding"}
                                            />
                                            <TextField label="Border Radius"
                                                       type="number"
                                                       value={emailSetting.restock_style.view_product_btn_border_radius}
                                                       onChange={(value) => restockOnChangeStyle({
                                                           target: {
                                                               name: "view_product_btn_border_radius",
                                                               value
                                                           }
                                                       })}
                                                       suffix="PX"
                                                       min={0}
                                                       name={"view_product_btn_border_radius"}
                                            />
                                        </InlineGrid>
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"400"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Email Template</Text>
                                        {
                                            emailSetting.new_restock_template == 1 ?
                                                <BlockStack gap={"100"}>
                                                    <EmailTemplateMsg msgArray={msgArray}/>
                                                    <EmailEditorComponent
                                                        ref={editorRef}
                                                        exportHtml={exportHtml}
                                                        onLoad={onLoad}
                                                        style={{ height: 600 }}
                                                        mailTemplate={mailTemplate}
                                                        onChange={onChange}
                                                    />
                                                </BlockStack>
                                                :
                                                emailSetting.new_restock_template == 0 ?
                                                    <BlockStack gap={"400"}>
                                                        <Card padding={"0"}>
                                                            <Box padding={"400"}>
                                                                <Text as={"h2"} variant={"headingMd"} fontWeight={"medium"}>{emailSetting.restock_email_subject}</Text>
                                                            </Box>
                                                            <Box>
                                                                <div className="email-template-live-preview-wrapper">
                                                                    <div className="email-template-body" style={{fontFamily: emailSetting.restock_style.font_family}}>
                                                                        <table width="100%" border={0} cellSpacing={0} cellPadding={0} style={{borderCollapse: 'collapse'}}>
                                                                            <tbody>
                                                                            <tr>
                                                                                <td align="center">
                                                                                    <table className="template-table" border={0} cellSpacing={0} cellPadding={0} style={{margin: '0px auto', maxWidth: '470px', borderCollapse: 'collapse'}}>
                                                                                        <thead>
                                                                                        <tr className="shop-branding-wrapper"  style={{backgroundColor: emailSetting.restock_style.background_color, borderRadius: '10px 10px 0px 0px',}}>
                                                                                            <th className="shop-branding"
                                                                                                style={{display: "flex", alignItems: "center", justifyContent: "center", color: 'rgb(32, 34, 35)', fontSize: '24px', fontWeight: 'bold', lineHeight: '28px', height: '70px', textAlign: 'center', paddingTop: '20px',}}>
                                                                                                {
                                                                                                    emailSetting.restock_branding_type == "2" ?
                                                                                                        <Fragment>
                                                                                                            {selectedRestockLogo && selectedRestockLogo.name ?
                                                                                                                <img src={selectedRestockLogo ? URL.createObjectURL(selectedRestockLogo) : ""} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                                                emailSetting.restock_logo ?
                                                                                                                    <img src={emailSetting.restock_logo} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                                                    <img src={""} alt="logo" style={{maxHeight: '50px'}}/>
                                                                                                            }
                                                                                                        </Fragment> :
                                                                                                        emailSetting.restock_branding_type == "1" ? shopDetails && shopDetails.store_name :
                                                                                                            <Fragment>
                                                                                                                {selectedRestockLogo?.name ?
                                                                                                                    <img src={selectedRestockLogo ? URL.createObjectURL(selectedRestockLogo) : ""} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                                                    emailSetting.restock_logo ?
                                                                                                                        <img src={emailSetting.restock_logo} alt="logo" style={{maxHeight: '50px'}}/>
                                                                                                                        : <img src={""} alt="logo" style={{maxHeight: '50px'}}/>}&nbsp; {shopDetails && shopDetails.store_name
                                                                                                            }
                                                                                                            </Fragment>
                                                                                                }
                                                                                            </th>
                                                                                        </tr>
                                                                                        </thead>
                                                                                        <tbody className="template-body" style={{backgroundColor: emailSetting.restock_style.background_color, border: '30px solid transparent',borderTop: '10px solid transparent'}}>
                                                                                        <tr className="description-wrapper">
                                                                                            <td className="description color-text-secondary" style={{fontSize: `${emailSetting.restock_style.description_font_size}px`, lineHeight: '28px', color: emailSetting.restock_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)', whiteSpace: 'pre-line'}}>
                                                                                                {emailSetting.restock_email_body}
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td className="product-image" style={{paddingTop: '20px'}}>
                                                                                                <div style={{width: '100%', height: '100%', marginRight: "3px"}}>
                                                                                                    <img src={ProductGroup1242} alt="Dacia blouse" width={470} style={{display: 'block', margin: 'auto', maxWidth: '50%', borderRadius: '10px', border: '1px solid rgb(201, 202, 204)',}}/>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr className="product-price-wrapper">
                                                                                            <td className="product-price" style={{paddingTop: '8px', fontWeight: 500, fontSize: '18px', lineHeight: '24px', color: 'rgb(32, 34, 35)', display: 'revert'}}>
                                                                                                ₹179.00
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style={{paddingTop: '10px'}}>
                                                                                                <a className="buy-action-url bg-primary"
                                                                                                   style={{backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color, color: emailSetting.restock_style.add_to_cart_btn_text_color, boxSizing: 'border-box', borderRadius: `${emailSetting.restock_style.add_to_cart_btn_border_radius}px`, display: 'block', fontSize: '18px', fontWeight: 600, lineHeight: '20px', padding: `${emailSetting.restock_style.add_to_cart_btn_vertical_padding}px ${emailSetting.restock_style.add_to_cart_btn_horizontal_padding}px`, textAlign: 'center', textDecoration: 'none', border: `${emailSetting.restock_style.add_to_cart_btn_border_size}px solid ${emailSetting.restock_style.add_to_cart_btn_border_color}`}}>
                                                                                                    {emailSetting.restock_content.add_to_cart_button_text}
                                                                                                </a>
                                                                                            </td>

                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style={{paddingTop: '10px'}}>
                                                                                                <a className="visit-action-url color-primary border-primary"
                                                                                                   style={{backgroundColor: emailSetting.restock_style.view_product_btn_bg_color, color: emailSetting.restock_style.view_product_btn_text_color, border: `${emailSetting.restock_style.view_product_btn_border_size}px solid ${emailSetting.restock_style.view_product_btn_border_color}`, boxSizing: 'border-box', borderRadius: `${emailSetting.restock_style.view_product_btn_border_radius}px`, display: 'block', fontSize: '18px', fontWeight: 600, lineHeight: '20px', padding: `${emailSetting.restock_style.view_product_btn_vertical_padding}px ${emailSetting.restock_style.view_product_btn_horizontal_padding}px`, textAlign: 'center', textDecoration: 'none'}}>
                                                                                                    {emailSetting.restock_content.view_product_button_text}
                                                                                                </a>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr className="social-text-wrapper">
                                                                                            <td colSpan={3} className="social-text color-text-tertiary" style={{display: (emailSetting.restock_social.instagram !== null && emailSetting.restock_social.instagram !== "") || (emailSetting.restock_social.facebook !== null && emailSetting.restock_social.facebook !== "") || (emailSetting.restock_social.twitter !== null && emailSetting.restock_social.twitter !== "") || (emailSetting.restock_social.telegram !== null && emailSetting.restock_social.telegram !== "") || (emailSetting.restock_social.linkedin !== null && emailSetting.restock_social.linkedin !== "") || (emailSetting.restock_social.pinterest !== null && emailSetting.restock_social.pinterest !== "") ? "block" : 'none', fontWeight: 400, fontSize: '16px', textAlign: 'center', color: 'rgb(116, 124, 128)', paddingBottom: '10px', paddingTop: '30px'}}>{emailSetting.restock_social.title}</td>
                                                                                        </tr>
                                                                                        <tr className="social-networks-wrapper">
                                                                                            <td className="social-networks" style={{textAlign: 'center', paddingBottom: '20px'}}>
                                                                                                <button className="instagram bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.restock_social.instagram !== null && emailSetting.restock_social.instagram.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{instagramImage}</button>
                                                                                                <button className="facebook bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.restock_social.facebook !== null && emailSetting.restock_social.facebook.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{facebookImage}</button>
                                                                                                <button className="twitter bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.restock_social.twitter !== null && emailSetting.restock_social.twitter.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{twitterImage}</button>
                                                                                                <button className="telegram bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.restock_social.telegram !== null && emailSetting.restock_social.telegram.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{telegramImage}</button>
                                                                                                <button className="linkedin bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.restock_social.linkedin !== null && emailSetting.restock_social.linkedin.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{linkedInImage}</button>
                                                                                                <button className="pinterest bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting?.restock_social?.pinterest !== null && emailSetting?.restock_social?.pinterest?.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{pinterestImage}</button>
                                                                                            </td>
                                                                                        </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </Box>
                                                        </Card>
                                                        <span>
                                                            <Button variant={"primary"} onClick={handleUpgradeNow}>Upgrade template</Button>
                                                        </span>
                                                    </BlockStack> : null
                                        }

                                    </BlockStack>


                                </Box>

                            </BlockStack>

                        </Card>
                    </Layout.Section>
                </Layout>
                <PageActions
                    primaryAction={{
                        content: 'Save',
                        onAction: () => saveEmailSetting("", true),
                        loading: isLoading
                    }}
                />
            </Page>
        </Fragment>
    );
};

export default RestockAlertEmail;