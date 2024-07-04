import React, {Fragment, useEffect, useState} from 'react';
import {
    Page,
    Layout,
    FormLayout,
    BlockStack, Box, Divider, Card, Text,
    TextField,
    PageActions,
    Select,
    RadioButton, DropZone, Thumbnail, Tabs, Button
} from "@shopify/polaris";
import {
    apiService,
    baseUrl,
    capitalizeMessage,
    facebookImage,
    instagramImage, linkedInImage, pinterestImage, telegramImage,
    twitterImage
} from "../../../utils/Constant";
import ColorInput from "../../Comman/ColorInput"
import ToastMessage from "../../Comman/ToastMessage"
import {useNavigate} from "react-router-dom";

import {useSelector} from "react-redux";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {ProductGroup1242} from "../../../utils/AppImages";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {formValidate} from "../../Comman/formValidate";

const initialSate = {
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
    view_product_button_text: ""
};

const RestockAlertEmail = () => {
    const navigate = useNavigate();
    const [emailSetting, setEmailSetting] = useState(initialSate);
    const [emailSettingError, setEmailSettingError] = useState(initialSateError);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const [selected, setSelected] = useState(0);
    const [selectedRestockLogo, setSelectedRestockLogo] = useState("");
    const shopDetails = useSelector((state) => state.shopDetails);
    const theme = [
        {label: "Dark", value: "1"},
        {label: "Light", value: "2"},
    ]
    const fontFamily = [
        {label: "Roboto", value: "roboto"},
        {label: "Times New Roman", value: "Times New Roman"},
        {label: "Arial", value: "Arial"},
        {label: "Georgia", value: "Georgia"},
        {label: "Helvetica", value: "Helvetica"},
        {label: "Lucida Sans", value: "Lucida Sans"},
        {label: "Tahoma", value: "Tahoma"},
    ]
    const onBack = () => {
        navigate(`${baseUrl}/settings/email`)
    }
    useEffect(() => {
        const EmailSetting = async () => {
            const response = await apiService.emailSetting();
            if (response.status === 200) {
                setEmailSetting(response.data)
            } else if (response.status === 500) {
                setMessage(capitalizeMessage(response.message))
                setIsErrorServer(true)
            } else {
                setMessage(capitalizeMessage(response.message))
                setIsError(true)
            }
        }
        EmailSetting()
    }, []);

    const saveEmailSetting = async (record, isLoad) => {
        if(isLoad){
            let validationErrors = {};
            let tempObj = {restock_email_subject: emailSetting.restock_email_subject,
                restock_email_body: emailSetting.restock_email_body,
                restock_email_reply_to_email: emailSetting.restock_email_reply_to_email,
                add_to_cart_button_text: emailSetting.restock_content.add_to_cart_button_text,
                view_product_button_text: emailSetting.restock_content.view_product_button_text,
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

        if (emailSetting.price_drop_branding_type == "1") {
            delete emailSetting.price_drop_logo;
        }
        if (emailSetting.wishlist_branding_type == "1") {
            delete emailSetting.wishlist_logo;
        }
        if (emailSetting.restock_branding_type == "1") {
            delete emailSetting.restock_logo;
        }
        let newEmailSetting = {...emailSetting, ...record}
        const formData = new FormData();
        Object.keys(newEmailSetting).forEach((x) => {
            if ((typeof (newEmailSetting[x]) === "object") && newEmailSetting[x] !== null) {

            } else {
                if (x === "restock_logo" && selectedRestockLogo && selectedRestockLogo.name) {
                    formData.append("restock_logo", selectedRestockLogo);
                } else if (x === "restock_logo") {

                } else {

                }
            }
        })
        formData.append("payload", JSON.stringify(newEmailSetting))

        const response = await apiService.updateEmailSetting(formData, emailSetting.id)
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
    const fileUpload = (!selectedRestockLogo && !emailSetting.restock_logo) ? <DropZone.FileUpload/> : "";
    const uploadedFiles = (
        <Fragment>
            {
                (selectedRestockLogo || emailSetting.restock_logo) ?
                    <Fragment>
                        {selectedRestockLogo?.name ? <Thumbnail source={window.URL.createObjectURL(selectedRestockLogo)}/> : emailSetting && emailSetting.restock_logo ? <Thumbnail source={emailSetting.restock_logo}/> : ""}
                    </Fragment>
                    : ""
            }
        </Fragment>
    );
    const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => {
        setSelectedRestockLogo(acceptedFiles[0])
    }
    const restockOnChangeStyle = (e) => {
        const {name, value} = e.target;
        setEmailSetting({
            ...emailSetting,
            restock_style: {...emailSetting.restock_style, [name]: value},
        })
    }

    const restockOnChangeSocial = (e) => {
        const {name, value} = e.target;
        setEmailSetting({
            ...emailSetting,
            restock_social: {...emailSetting.restock_social, [name]: value},
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

    const handleTabChange = (selectedTabIndex) => {
        let IsTabChange = true
        Object.keys(emailSettingError).map((x) => {
            if(emailSettingError[x] !== ""){
                IsTabChange = false
            }
        })
        if(IsTabChange){
            setSelected(selectedTabIndex)
        }
    }

    const tabs = [
        {
            id: 'email-body-content',
            content: 'Email content',
            panelID: 'email-body-content',
        },
        {
            id: 'email-body',
            content: 'Social content',
            panelID: 'email-body',
        },
        {
            id: 'store-branding-1',
            content: 'Email customization',
            accessibilityLabel: 'store-branding-1',
            panelID: 'store-branding-1',
        },

    ];

    const handleSwitch = async (e) => {
        setEmailSetting({
            ...emailSetting,
            [e.target.name]: e.target.value
        })
        saveEmailSetting({[e.target.name]: e.target.value}, false)
    }
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
                <Layout>
                    {message !== "" && isError === false ? <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner link={AppDocsLinks.article["425"]} message={message} setMessage={setMessage} setIsError={setIsError} isError={isError} />
                    <Layout.Section>
                        <Card padding={"0"}>
                            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
                            <Divider/>
                            {selected === 0 &&
                            <Box padding={"400"} paddingBlockStart={"200"}>
                                <FormLayout>
                                    <TextField label="Email subject"
                                               helpText="Add this {{product_name}} {{shop_name}} variable"
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
                                        label="Email body"
                                        multiline={3}
                                        value={emailSetting.restock_email_body}
                                        onChange={(value) => handleChange({
                                            target: {
                                                name: "restock_email_body",
                                                value
                                            }
                                        })}
                                        name={"restock_email_body"}
                                        onBlur={onBlur}
                                        error={emailSettingError.restock_email_body}
                                        helpText="Add this {{shop_name}} {{product_name}} {{shop_url}} {{product_url}} variable"
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
                                </FormLayout>
                            </Box>
                            }
                            {selected === 1 && <Box padding={"400"} paddingBlockStart={"200"}>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <TextField label={"Social networks title"}
                                                   value={emailSetting.restock_social.title}
                                                   onChange={(value) => {
                                                       restockOnChangeSocial({
                                                           target: {
                                                               name: "title",
                                                               value
                                                           }
                                                       })
                                                   }}
                                        />
                                    </FormLayout.Group>
                                    <FormLayout.Group condensed>
                                        <TextField label={"Instagram"} prefix={"@"}
                                                   value={emailSetting.restock_social.instagram}
                                                   onChange={(value) => {
                                                       restockOnChangeSocial({
                                                           target: {
                                                               name: "instagram",
                                                               value
                                                           }
                                                       })
                                                   }}/>
                                        <TextField label={"Facebook"} prefix={"@"}
                                                   value={emailSetting.restock_social.facebook}
                                                   onChange={(value) => {
                                                       restockOnChangeSocial({
                                                           target: {
                                                               name: "facebook",
                                                               value
                                                           }
                                                       })
                                                   }}
                                        />
                                    </FormLayout.Group>
                                    <FormLayout.Group condensed>
                                        <TextField label={"Twitter"} prefix={"@"}
                                                   value={emailSetting.restock_social.twitter}
                                                   onChange={(value) => {
                                                       restockOnChangeSocial({
                                                           target: {
                                                               name: "twitter",
                                                               value
                                                           }
                                                       })
                                                   }}
                                        />
                                        <TextField label={"Telegram"} prefix={"@"}
                                                   value={emailSetting.restock_social.telegram}
                                                   onChange={(value) => {
                                                       restockOnChangeSocial({
                                                           target: {
                                                               name: "telegram",
                                                               value
                                                           }
                                                       })
                                                   }}
                                        />
                                    </FormLayout.Group>
                                    <FormLayout.Group condensed>
                                        <TextField label={"Linkedin"}
                                                   value={emailSetting.restock_social.linkedin}
                                                   onChange={(value) => {
                                                       restockOnChangeSocial({
                                                           target: {
                                                               name: "linkedin",
                                                               value
                                                           }
                                                       })
                                                   }}
                                        />
                                        <TextField label={"Pinterest"}
                                                   value={emailSetting.restock_social.pinterest}
                                                   onChange={(value) => {
                                                       restockOnChangeSocial({
                                                           target: {
                                                               name: "pinterest",
                                                               value
                                                           }
                                                       })
                                                   }}
                                        />
                                    </FormLayout.Group>
                                </FormLayout>
                            </Box>}
                            {selected === 2 && <Fragment>
                                <Box padding={"400"} paddingBlockStart={"200"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Email logo</Text>
                                        <FormLayout>
                                            <FormLayout.Group condensed>
                                                <RadioButton
                                                    label={"Store Name"}
                                                    id="optional"
                                                    checked={emailSetting.restock_branding_type == '1'}
                                                    onChange={() => handleChange({
                                                        target: {
                                                            name: "restock_branding_type",
                                                            value: "1"
                                                        }
                                                    })}
                                                />
                                                <RadioButton
                                                    label="Logo"
                                                    id="disabled"
                                                    checked={emailSetting.restock_branding_type == '2'}
                                                    onChange={() => handleChange({
                                                        target: {
                                                            name: "restock_branding_type",
                                                            value: "2"
                                                        }
                                                    })}
                                                />

                                                <RadioButton
                                                    label={"Both"}
                                                    id="both"
                                                    checked={emailSetting.restock_branding_type == '3'}
                                                    onChange={() => handleChange({
                                                        target: {
                                                            name: "restock_branding_type",
                                                            value: "3"
                                                        }
                                                    })}
                                                />
                                            </FormLayout.Group>
                                            {(emailSetting.restock_branding_type == '2' || emailSetting.restock_branding_type == '3') &&
                                            <div style={{width: 58, height: 58}}>
                                                <DropZone
                                                    accept=".jpg,.png,.jpeg"
                                                    allowMultiple={false}
                                                    onDrop={handleDropZoneDrop}
                                                >
                                                    {uploadedFiles}
                                                    {fileUpload}
                                                </DropZone>
                                            </div>}
                                        </FormLayout>
                                    </BlockStack>
                                </Box>
                                <Divider />
                                <Box padding={"400"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Email body customization</Text>
                                        <FormLayout>
                                            <FormLayout.Group condensed>
                                                <ColorInput label="Background color" name="background_color"
                                                            value={emailSetting.restock_style.background_color}
                                                            onChange={restockOnChangeStyle}/>
                                                <TextField type="number" label="Email body font size" suffix="PX"
                                                           value={emailSetting.restock_style.description_font_size}
                                                           onChange={(value) => {
                                                               restockOnChangeStyle({
                                                                   target: {
                                                                       name: "description_font_size",
                                                                       value
                                                                   }
                                                               })
                                                           }}/>
                                            </FormLayout.Group>
                                            <FormLayout.Group condensed>
                                                <Select label={"Text color theme"} options={theme}
                                                        value={emailSetting.restock_style.theme}
                                                        onChange={(value) => {
                                                            restockOnChangeStyle({
                                                                target: {
                                                                    name: "theme",
                                                                    value
                                                                }
                                                            })
                                                        }}/>
                                                <Select label={"Font family"} options={fontFamily}
                                                        value={emailSetting.restock_style.font_family}
                                                        onChange={(value) => {
                                                            restockOnChangeStyle({
                                                                target: {
                                                                    name: "font_family",
                                                                    value
                                                                }
                                                            })
                                                        }}
                                                />
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </BlockStack>
                                </Box>
                                <Divider />
                                <Box padding={"400"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Add to Cart Button customization</Text>
                                        <FormLayout>
                                            <FormLayout.Group condensed>
                                                <ColorInput label={"Button Background color"} name="add_to_cart_btn_bg_color"
                                                            onChange={restockOnChangeStyle}
                                                            value={emailSetting.restock_style.add_to_cart_btn_bg_color}/>
                                                <ColorInput label={"Button Text color"} name="add_to_cart_btn_text_color"
                                                            onChange={restockOnChangeStyle}
                                                            value={emailSetting.restock_style.add_to_cart_btn_text_color}/>
                                            </FormLayout.Group>
                                            <FormLayout.Group condensed>
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

                                                />
                                            </FormLayout.Group>
                                            <FormLayout.Group condensed>
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
                                                />
                                            </FormLayout.Group>
                                            <FormLayout.Group condensed>
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
                                                />
                                                <div/>
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </BlockStack>
                                </Box>
                                <Divider />
                                <Box padding={"400"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>View Product Button customization</Text>
                                        <FormLayout>
                                            <FormLayout.Group condensed>
                                                <ColorInput label={"Button Background color"} name="view_product_btn_bg_color"
                                                            onChange={restockOnChangeStyle}
                                                            value={emailSetting.restock_style.view_product_btn_bg_color}/>
                                                <ColorInput label={"Button Text color"} name="view_product_btn_text_color"
                                                            onChange={restockOnChangeStyle}
                                                            value={emailSetting.restock_style.view_product_btn_text_color}/>
                                            </FormLayout.Group>
                                            <FormLayout.Group condensed>
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

                                                />
                                            </FormLayout.Group>
                                            <FormLayout.Group condensed>
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
                                                />
                                            </FormLayout.Group>
                                            <FormLayout.Group condensed>
                                                <TextField label="Border Radius"
                                                           type="number"
                                                           value={emailSetting.restock_style.view_product_btn_border_radius}
                                                           onChange={(value) => restockOnChangeStyle({
                                                               target: {
                                                                   name: "view_product_btn_border_radius",
                                                                   value
                                                               }
                                                           })}
                                                           min={0}
                                                           suffix="PX"
                                                />
                                                <div/>
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </BlockStack>
                                </Box>
                            </Fragment>}
                        </Card>
                    </Layout.Section>
                    <Layout.Section variant={"oneThird"}>
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