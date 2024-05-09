import React, {Fragment, useEffect, useState} from 'react';
import {
    Page,
    Layout,
    Card,
    BlockStack, Box, Divider,
    FormLayout,
    Text,
    TextField,
    Select,
    PageActions, RadioButton, DropZone, Thumbnail, Tabs, Button
} from "@shopify/polaris";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
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
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {ProductGroup1242, ProductGroup1249} from "../../../utils/AppImages";

const initialSate = {
    subject: "Wishlist1 Club Products!!!",
    email_body: "aaYou have added few product on your wishlist, please check those here:",
    reply_to_mail: "",
    reminder_after_day: 1,
    offer_reminder: 0,
    stock_reminder: 0,
    weekly_reminder: 0,
    wishlist_branding_type: 1,
    wishlist_logo: "",
    stock_down_show_footer: 0,

    wishlist_style: {
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
        add_to_cart_btn_border_radius : 10,
        view_product_btn_border_radius : 10
    },
    wishlist_social: {
        facebook: "",
        instagram: "",
        linkedin: "",
        pinterest: "",
        telegram: "",
        title: "Follow us on",
        twitter: ""
    },
    wishlist_content: {
        add_to_cart_button_text: "",
        view_product_button_text: ""
    }

};

const initialSateError = {
    subject: "",
    email_body: "",
    reply_to_mail: "",
    add_to_cart_button_text: "",
    view_product_button_text: ""
}

const WishlistItemsEmail = () => {
    const navigate = useNavigate()
    const [emailSetting, setEmailSetting] = useState(initialSate);
    const [emailSettingError, setEmailSettingError] = useState(initialSateError);
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const [selectedWlLogo, setSelectedWlLogo] = useState("");
    const [selected, setSelected] = useState(0);
    const shopDetails = useSelector((state) => state.shopDetails);
    const options = [
        {label: '1 Day', value: '1'},
        {label: '2 Day', value: '2'},
        {label: '3 Day', value: '3'},
        {label: '4 Day', value: '4'},
        {label: '5 Day', value: '5'},
        {label: '6 Day', value: '6'},
        {label: '7 Day', value: '7'},
    ];
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

    useEffect(() => {
        const EmailSetting = async () => {
            const response = await apiService.emailSetting();
            if (response.status === 200) {
                setEmailSetting(response.data)
            } else if (response.status === 500) {
                setMessage(capitalizeMessage(response.message))
                setIsErrorServer(true);
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
            let tempObj = { subject: emailSetting.subject,
                email_body: emailSetting.email_body,
                reply_to_mail: emailSetting.reply_to_mail,
                add_to_cart_button_text: emailSetting.wishlist_content.add_to_cart_button_text,
                view_product_button_text: emailSetting.wishlist_content.view_product_button_text,
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
        if (emailSetting.wishlist_branding_type == "1") {
            delete emailSetting.wishlist_logo;
        }
        if (emailSetting.price_drop_branding_type == "1") {
            delete emailSetting.price_drop_logo;
        }
        if (emailSetting.restock_branding_type == "1") {
            delete emailSetting.restock_logo;
        }
        let newEmailSetting = {...emailSetting, ...record}
        const formData = new FormData();
        Object.keys(newEmailSetting).forEach((x) => {
            if ((typeof (newEmailSetting[x]) === "object") && newEmailSetting[x] !== null) {
            } else {
                if (x === "wishlist_logo" && selectedWlLogo && selectedWlLogo.name) {
                    formData.append("wishlist_logo", selectedWlLogo);
                } else if (x === "wishlist_logo") {

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
            setIsErrorServer(true);
            setIsLoading(false);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true);
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
            setEmailSettingError({...emailSettingError, [name]: value.trim()  ? "" : emailSettingError[name]})
        }

    }

    const wlItemOnChangeStyle = (e) => {
        const {name, value} = e.target;
        setEmailSetting({
            ...emailSetting,
            wishlist_style: {...emailSetting.wishlist_style, [name]: value},

        })
    }

    const wlItemOnChangeSocial = (e) => {
        const {name, value} = e.target;
        setEmailSetting({
            ...emailSetting,
            wishlist_social: {...emailSetting.wishlist_social, [name]: value},

        })
    }

    const wlItemOnChangeContent = (e) => {
        const {name, value} = e.target;
        setEmailSetting({
            ...emailSetting,
            wishlist_content: {...emailSetting.wishlist_content, [name]: value},

        })
        if(emailSettingError[name]){
            setEmailSettingError({...emailSettingError, [name]: value.trim()  ? "" : emailSettingError[name]})
        }
    }

    const fileUpload = (!selectedWlLogo && !emailSetting.wishlist_logo) ? <DropZone.FileUpload/> : "";

    const uploadedFiles = (
        <Fragment>
            {
                (selectedWlLogo || emailSetting.wishlist_logo) ?
                    <Fragment>
                        {selectedWlLogo?.name ? <Thumbnail source={window.URL.createObjectURL(selectedWlLogo)}/> : emailSetting && emailSetting.wishlist_logo ? <Thumbnail source={emailSetting.wishlist_logo}/> : ""}
                    </Fragment>
                    : ""
            }
        </Fragment>
    );

    const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => {
        setSelectedWlLogo(acceptedFiles[0])
    }

    const onBack = () => {
        navigate(`${baseUrl}/settings/email`)
    }

    const onBlur = (e) => {
        const {name, value} = e.target
        setEmailSettingError({...emailSettingError, [name]: formValidate(name, value)})
    }

    const formValidate = (name, value) => {
        const validRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        switch (name) {
            case "subject":
                if (!value || value.trim() === "") {
                    return "Email subject is required";
                } else {
                    return "";
                }
            case "email_body":
                if (!value || value.trim() === "") {
                    return "Email body is required";
                } else {
                    return "";
                }
            case "add_to_cart_button_text":
                if (!value || value.trim() === "") {
                    return "Add to cart label is required";
                } else {
                    return "";
                }
            case "view_product_button_text":
                if (!value || value.trim() === "") {
                    return "Visit product label is required";
                } else {
                    return "";
                }
            case "reply_to_mail":
                if (value && !value.match(validRegex)) {
                    return "Enter a valid reply to email address";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

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
            <Page title={"Wishlist Items"} backAction={{content: 'Settings', onAction: onBack}}
                  secondaryActions={
                      <Fragment>
                          <div className='switch-button'>
                              <input type="checkbox"
                                     className="switch-btn-input"
                                     id={"is_email_reminder_on_off"}
                                     name={"is_email_reminder_on_off"}
                                     onChange={(e) => handleSwitch({
                                         target: {
                                             name: "is_email_reminder_on_off",
                                             value: e.target.checked ? 0 : 1
                                         }
                                     })}
                                     checked={emailSetting.is_email_reminder_on_off == 0}
                              />
                              <label className="witch-button-label" htmlFor={"is_email_reminder_on_off"}/>
                          </div>&nbsp;&nbsp;
                          <Button variant="primary" onClick={() => saveEmailSetting("", true)} loading={isLoading}> Save</Button>
                      </Fragment>
                  }
                  >
                <Layout>
                    {message !== "" && isError === false ? <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner link={AppDocsLinks.article["425"]} message={message} setMessage={setMessage} setIsError={setIsError} isError={isError}/>

                    <Layout.Section>
                        <Card padding={"0"}>
                            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
                            <Divider/>
                            {
                                selected === 0 &&
                                <Box padding={"400"} paddingBlockStart={"200"}>
                                    <FormLayout>
                                        <TextField label="Email subject" value={emailSetting.subject}
                                                   helpText="Add this {{shop_name}} variable"
                                                   onChange={(value) => handleChange({
                                                       target: {
                                                           name: "subject",
                                                           value
                                                       }
                                                   })}
                                                   name={"subject"}
                                                   onBlur={onBlur}
                                                   error={emailSettingError.subject}
                                        />
                                        <TextField
                                            label="Email body"
                                            helpText="Add this {{shop_name}} {{shop_url}}  variable"
                                            multiline={3}
                                            value={emailSetting.email_body}
                                            onChange={(value) => handleChange({
                                                target: {
                                                    name: "email_body",
                                                    value
                                                }
                                            })}
                                            name={"email_body"}
                                            onBlur={onBlur}
                                            error={emailSettingError.email_body}
                                        />
                                        <TextField
                                            label="Reply to email"
                                            value={emailSetting.reply_to_mail}
                                            onChange={(value) => handleChange({
                                                target: {
                                                    name: "reply_to_mail",
                                                    value
                                                }
                                            })}
                                            name={"reply_to_mail"}
                                            onBlur={onBlur}
                                            error={emailSettingError.reply_to_mail}
                                        />
                                        <Select
                                            label="Email send after create wishlist"
                                            options={options}
                                            value={emailSetting.reminder_after_day.toString()}
                                            onChange={(value) => {
                                                handleChange({
                                                    target: {
                                                        name: "reminder_after_day",
                                                        value
                                                    }
                                                })
                                            }}
                                        />
                                        <TextField label='"Add to cart" label'
                                                   value={emailSetting.wishlist_content.add_to_cart_button_text}
                                                   onChange={(value) => {
                                                       wlItemOnChangeContent({
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
                                                   value={emailSetting.wishlist_content.view_product_button_text}
                                                   onChange={(value) => {
                                                       wlItemOnChangeContent({
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
                            {
                                selected === 1 &&
                                <Box padding={"400"} paddingBlockStart={"200"}>
                                    <FormLayout>
                                        <FormLayout.Group>
                                            <TextField label={"Social networks title"}
                                                       value={emailSetting.wishlist_social.title}
                                                       onChange={(value) => {
                                                           wlItemOnChangeSocial({
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
                                                       value={emailSetting.wishlist_social.instagram}
                                                       onChange={(value) => {
                                                           wlItemOnChangeSocial({
                                                               target: {
                                                                   name: "instagram",
                                                                   value
                                                               }
                                                           })
                                                       }}/>
                                            <TextField label={"Facebook"} prefix={"@"}
                                                       value={emailSetting.wishlist_social.facebook}
                                                       onChange={(value) => {
                                                           wlItemOnChangeSocial({
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
                                                       value={emailSetting.wishlist_social.twitter}
                                                       onChange={(value) => {
                                                           wlItemOnChangeSocial({
                                                               target: {
                                                                   name: "twitter",
                                                                   value
                                                               }
                                                           })
                                                       }}
                                            />
                                            <TextField label={"Telegram"} prefix={"@"}
                                                       value={emailSetting.wishlist_social.telegram}
                                                       onChange={(value) => {
                                                           wlItemOnChangeSocial({
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
                                                       value={emailSetting.wishlist_social.linkedin}
                                                       onChange={(value) => {
                                                           wlItemOnChangeSocial({
                                                               target: {
                                                                   name: "linkedin",
                                                                   value
                                                               }
                                                           })
                                                       }}
                                            />
                                            <TextField label={"Pinterest"}
                                                       value={emailSetting.wishlist_social.pinterest}
                                                       onChange={(value) => {
                                                           wlItemOnChangeSocial({
                                                               target: {
                                                                   name: "pinterest",
                                                                   value
                                                               }
                                                           })
                                                       }}
                                            />
                                        </FormLayout.Group>
                                    </FormLayout>
                                </Box>
                            }
                            {
                                selected === 2 && <Fragment>
                                    <Box padding={"400"} paddingBlockStart={"200"}>
                                        <BlockStack gap={"200"}>
                                            <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Email logo</Text>
                                            <FormLayout>
                                                <FormLayout.Group condensed>
                                                    <RadioButton
                                                        label={"Store Name"}
                                                        id="optional"
                                                        checked={emailSetting.wishlist_branding_type == '1'}
                                                        onChange={() => handleChange({
                                                            target: {
                                                                name: "wishlist_branding_type",
                                                                value: "1"
                                                            }
                                                        })}
                                                    />
                                                    <RadioButton
                                                        label="Logo"
                                                        id="disabled"
                                                        checked={emailSetting.wishlist_branding_type == '2'}
                                                        onChange={() => handleChange({
                                                            target: {
                                                                name: "wishlist_branding_type",
                                                                value: "2"
                                                            }
                                                        })}
                                                    />
                                                    <RadioButton
                                                        label={"Both"}
                                                        id="both"
                                                        checked={emailSetting.wishlist_branding_type == '3'}
                                                        onChange={() => handleChange({
                                                            target: {
                                                                name: "wishlist_branding_type",
                                                                value: "3"
                                                            }
                                                        })}
                                                    />
                                                </FormLayout.Group>
                                                {(emailSetting.wishlist_branding_type == '2' || emailSetting.wishlist_branding_type == '3') &&
                                                <div style={{width: 58, height: 58}}>
                                                    <DropZone
                                                        accept=".jpg,.png,.jpeg"
                                                        allowMultiple={false}
                                                        onDrop={handleDropZoneDrop}
                                                    >
                                                        {uploadedFiles}
                                                        {fileUpload}
                                                    </DropZone></div>}
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
                                                                value={emailSetting.wishlist_style.background_color}
                                                                onChange={wlItemOnChangeStyle}/>
                                                    <TextField type="number" label="Email body font size" suffix="PX"
                                                               value={emailSetting.wishlist_style.description_font_size}
                                                               onChange={(value) => {
                                                                   wlItemOnChangeStyle({
                                                                       target: {
                                                                           name: "description_font_size",
                                                                           value
                                                                       }
                                                                   })
                                                               }}/>
                                                </FormLayout.Group>
                                                <FormLayout.Group condensed>
                                                    <Select label={"Text color theme"} options={theme}
                                                            value={emailSetting.wishlist_style.theme}
                                                            onChange={(value) => {
                                                                wlItemOnChangeStyle({
                                                                    target: {
                                                                        name: "theme",
                                                                        value
                                                                    }
                                                                })
                                                            }}/>
                                                    <Select label={"Font family"} options={fontFamily}
                                                            value={emailSetting.wishlist_style.font_family}
                                                            onChange={(value) => {
                                                                wlItemOnChangeStyle({
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
                                                                onChange={wlItemOnChangeStyle}
                                                                value={emailSetting.wishlist_style.add_to_cart_btn_bg_color}/>
                                                    <ColorInput label={"Button Text color"} name="add_to_cart_btn_text_color"
                                                                onChange={wlItemOnChangeStyle}
                                                                value={emailSetting.wishlist_style.add_to_cart_btn_text_color}/>
                                                </FormLayout.Group>
                                                <FormLayout.Group condensed>
                                                    <ColorInput label={"Button Border color"} name="add_to_cart_btn_border_color"
                                                                onChange={wlItemOnChangeStyle}
                                                                value={emailSetting.wishlist_style.add_to_cart_btn_border_color}/>
                                                    <TextField label={"Border Width"}
                                                               value={emailSetting.wishlist_style.add_to_cart_btn_border_size}
                                                               type="number"
                                                               suffix="PX"
                                                               onChange={(value) => {
                                                                   wlItemOnChangeStyle({
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
                                                               value={emailSetting.wishlist_style.add_to_cart_btn_vertical_padding}
                                                               onChange={(value) => wlItemOnChangeStyle({
                                                                   target: {
                                                                       name: "add_to_cart_btn_vertical_padding",
                                                                       value
                                                                   }
                                                               })}
                                                               suffix="PX"
                                                    />
                                                    <TextField label="Left & Right padding"
                                                               type="number"
                                                               value={emailSetting.wishlist_style.add_to_cart_btn_horizontal_padding}
                                                               onChange={(value) => wlItemOnChangeStyle({
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
                                                               value={emailSetting.wishlist_style.add_to_cart_btn_border_radius}
                                                               onChange={(value) => wlItemOnChangeStyle({
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
                                                                onChange={wlItemOnChangeStyle}
                                                                value={emailSetting.wishlist_style.view_product_btn_bg_color}/>
                                                    <ColorInput label={"Button Text color"} name="view_product_btn_text_color"
                                                                onChange={wlItemOnChangeStyle}
                                                                value={emailSetting.wishlist_style.view_product_btn_text_color}/>
                                                </FormLayout.Group>
                                                <FormLayout.Group condensed>
                                                    <ColorInput label={"Button Border color"} name="view_product_btn_border_color"
                                                                onChange={wlItemOnChangeStyle}
                                                                value={emailSetting.wishlist_style.view_product_btn_border_color}/>
                                                    <TextField label={"Border Width"}
                                                               value={emailSetting.wishlist_style.view_product_btn_border_size}
                                                               type="number"
                                                               suffix="PX"
                                                               onChange={(value) => {
                                                                   wlItemOnChangeStyle({
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
                                                               value={emailSetting.wishlist_style.view_product_btn_vertical_padding}
                                                               onChange={(value) => wlItemOnChangeStyle({
                                                                   target: {
                                                                       name: "view_product_btn_vertical_padding",
                                                                       value
                                                                   }
                                                               })}
                                                               suffix="PX"
                                                    />
                                                    <TextField label="Left & Right padding"
                                                               type="number"
                                                               value={emailSetting.wishlist_style.view_product_btn_horizontal_padding}
                                                               onChange={(value) => wlItemOnChangeStyle({
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
                                                               value={emailSetting.wishlist_style.view_product_btn_border_radius}
                                                               onChange={(value) => wlItemOnChangeStyle({
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
                                </Fragment>
                            }
                        </Card>
                    </Layout.Section>
                    <Layout.Section variant={"oneThird"}>
                        <Card padding={"0"}>
                            <Box padding={"400"}>
                                <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>{emailSetting.subject}</Text>
                            </Box>
                            <Box>
                                <div className="email-template-live-preview-wrapper">
                                    <div className="email-template-body"
                                         style={{fontFamily: emailSetting.wishlist_style.font_family}}>
                                        <table width="100%" border={0} cellSpacing={0} cellPadding={0} style={{borderCollapse: 'collapse'}}>
                                            <tbody>
                                            <tr>
                                                <td align="center">
                                                    <table className="template-table" border={0} cellSpacing={0} cellPadding={0} style={{margin: '0px auto', maxWidth: '470px', borderCollapse: 'collapse'}}>
                                                        <thead>
                                                        <tr className="shop-branding-wrapper" style={{backgroundColor: emailSetting.wishlist_style.background_color, borderRadius: '10px 10px 0px 0px',}}>
                                                            <th className="shop-branding" style={{color: 'rgb(32, 34, 35)', fontSize: '24px', fontWeight: 'bold', lineHeight: '28px', height: '70px', textAlign: 'center', paddingTop: '20px', display: "flex", alignItems:"center",justifyContent:"center"}}>
                                                                {
                                                                    emailSetting.wishlist_branding_type == "2" ? <Fragment>{selectedWlLogo && selectedWlLogo.name ? <img src={selectedWlLogo ? URL.createObjectURL(selectedWlLogo) : ""} alt="logo" style={{maxHeight: '50px'}}/> : emailSetting.wishlist_logo ? <img src={emailSetting.wishlist_logo} alt="logo" style={{maxHeight: '50px'}}/> : <img src={""} alt="logo" style={{maxHeight: '50px'}}/>}</Fragment> : emailSetting.wishlist_branding_type == "1" ? shopDetails && shopDetails.store_name : <Fragment>{selectedWlLogo?.name ? <img src={selectedWlLogo ? URL.createObjectURL(selectedWlLogo) : ""} alt="logo" style={{maxHeight: '50px'}}/> : emailSetting.wishlist_logo ? <img src={emailSetting.wishlist_logo} alt="logo" style={{maxHeight: '50px'}}/> : <img src={""} alt="logo" style={{maxHeight: '50px'}}/>}&nbsp; {shopDetails && shopDetails.store_name}</Fragment>
                                                                }
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="template-body" style={{backgroundColor: emailSetting.wishlist_style.background_color, border: '30px solid transparent'}}>
                                                        <tr className="description-wrapper">
                                                            <td className="description color-text-secondary" style={{fontSize: `${emailSetting.wishlist_style.description_font_size}px`, lineHeight: '28px', color: emailSetting.wishlist_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)', whiteSpace: 'pre-line'}}>
                                                                {emailSetting.email_body}
                                                            </td>
                                                        </tr>
                                                        <tr style={{paddingTop: '10px'}}>
                                                            <table>
                                                                <tr>
                                                                    {[ProductGroup1242,ProductGroup1249].map((x) => {
                                                                        return(
                                                                            <td>
                                                                                <table>
                                                                                    <tr >
                                                                                        <td className="product-image">
                                                                                            <div style={{width: '100%', display: "block", height: '100%', borderRadius: '10px', border: '1px solid rgb(201, 202, 204)',}}>
                                                                                                <img src={x} alt="Dacia blouse" width={470} style={{display: 'block', margin: 'auto', maxWidth: '100%', borderRadius: '10px'}}/>
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
                                                                                            <a className="buy-action-url bg-primary" style={{backgroundColor: emailSetting.wishlist_style.add_to_cart_btn_bg_color, color: emailSetting.wishlist_style.add_to_cart_btn_text_color, boxSizing: 'border-box', borderRadius: `${emailSetting.wishlist_style.add_to_cart_btn_border_radius}px`, display: 'block', fontSize: '16px', fontWeight: 600, lineHeight: '20px', padding: `${emailSetting.wishlist_style.add_to_cart_btn_vertical_padding}px ${emailSetting.wishlist_style.add_to_cart_btn_horizontal_padding}px`, textAlign: 'center', textDecoration: 'none', border: `${emailSetting.wishlist_style.add_to_cart_btn_border_size}px solid ${emailSetting.wishlist_style.add_to_cart_btn_border_color}`}}>
                                                                                                {emailSetting.wishlist_content.add_to_cart_button_text}
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style={{paddingTop: '10px'}}>
                                                                                            <a className="visit-action-url color-primary border-primary" style={{backgroundColor: emailSetting.wishlist_style.view_product_btn_bg_color, color: emailSetting.wishlist_style.view_product_btn_text_color, border: `${emailSetting.wishlist_style.view_product_btn_border_size}px solid ${emailSetting.wishlist_style.view_product_btn_border_color}`, boxSizing: 'border-box', borderRadius: `${emailSetting.wishlist_style.view_product_btn_border_radius}px`, display: 'block', fontSize: '16px', fontWeight: 600, lineHeight: '20px', padding: `${emailSetting.wishlist_style.view_product_btn_vertical_padding}px ${emailSetting.wishlist_style.view_product_btn_horizontal_padding}px`, textAlign: 'center', textDecoration: 'none'}}>
                                                                                                {emailSetting.wishlist_content.view_product_button_text}
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        )
                                                                    })}
                                                                </tr>
                                                            </table>
                                                        </tr>
                                                        <tr className="social-text-wrapper">
                                                            <td colSpan={3} className="social-text color-text-tertiary" style={{display: (emailSetting.wishlist_social.instagram !== null && emailSetting.wishlist_social.instagram !== "") || (emailSetting.wishlist_social.facebook !== null && emailSetting.wishlist_social.facebook !== "") || (emailSetting.wishlist_social.twitter !== null && emailSetting.wishlist_social.twitter !== "") || (emailSetting.wishlist_social.telegram !== null && emailSetting.wishlist_social.telegram !== "") || (emailSetting.wishlist_social.linkedin !== null && emailSetting.wishlist_social.linkedin !== "") || (emailSetting.wishlist_social.pinterest !== null && emailSetting.wishlist_social.pinterest !== "") ? "block" : 'none', fontWeight: 400, fontSize: '16px', textAlign: 'center', color: 'rgb(116, 124, 128)', paddingBottom: '10px', paddingTop: '30px'}}>{emailSetting.wishlist_social.title}</td>
                                                        </tr>
                                                        <tr className="social-networks-wrapper">
                                                            <td className="social-networks" style={{textAlign: 'center', paddingBottom: '20px'}}>
                                                                <button className="instagram bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.wishlist_social.instagram !== null && emailSetting.wishlist_social.instagram.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.wishlist_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{instagramImage}</button>
                                                                <button className="facebook bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.wishlist_social.facebook !== null && emailSetting.wishlist_social.facebook.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.wishlist_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{facebookImage}</button>
                                                                <button className="twitter bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.wishlist_social.twitter !== null && emailSetting.wishlist_social.twitter.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.wishlist_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{twitterImage}</button>
                                                                <button className="telegram bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.wishlist_social.telegram !== null && emailSetting.wishlist_social.telegram.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.wishlist_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{telegramImage}</button>
                                                                <button className="linkedin bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.wishlist_social.linkedin !== null && emailSetting.wishlist_social.linkedin.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.wishlist_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{linkedInImage}</button>
                                                                <button className="pinterest bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: emailSetting.wishlist_social.pinterest !== null && emailSetting.wishlist_social.pinterest.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: emailSetting.wishlist_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{pinterestImage}</button>
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

export default WishlistItemsEmail;