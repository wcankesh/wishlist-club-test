import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
    FormLayout,
    TextField,
    Layout,
    BlockStack,
    Card,
    InlineStack,
    Divider,
    RadioButton,
    DropZone,
    Text,
    Checkbox,
    Select,
    Page,
    Thumbnail,
    PageActions,
    Tabs, Box,  Button
} from "@shopify/polaris";
import {Icons} from "../../../utils/Icons";
import {apiService, baseUrl, capitalizeMessage} from "../../../utils/Constant";
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux";
import ToastMessage from "../../Comman/ToastMessage";
import ColorInput from "../../Comman/ColorInput";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import SwitchButton from "../../Comman/SwitchButton";

const initialState = {
    bis_from_mail: "",
    bis_branding_type: 1,
    bis_logo: "",
    bis_style:
        {
            background_color: "#ffffff",
            theme: 1,
            font_family: "roboto",
            title_font_size: 24,
            description_font_size: 16,
            discount_font_size: 16,
            add_to_cart_btn_border_radius: 10,
            view_product_btn_border_radius: 10,
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


        },

    bis_content:
        {
            email_subject: "{{product_name}} is available now!",
            email_title: "{{product_name}} is available now!",
            email_description: "Get it now before it goes out of stock again!",
            add_to_cart_button_text: "Add to Cart",
            view_product_button_text: "View Item",
            discount_code: "get discount",
        }
    ,
    bis_social:
        {
            title: "Follow us on",
            instagram: "",
            facebook: "",
            twitter: "",
            telegram: "",
            linkedin: "",
            pinterest: "",
        }
    ,
}

const initialStateError = {
    email_subject: "",
    email_title: "",
    email_description: "",
    add_to_cart_button_text: "",
    view_product_button_text: "",
    bis_from_mail: "",
}
const StockNotification = () => {
    const navigate = useNavigate()
    const [backInStockEmail, setbackInStockEmail] = useState(initialState);
    const [backInStockEmailError, setBackInStockEmailError] = useState(initialStateError);
    const [checkDiscount, setCheckDiscount] = useState(false)
    const [selectedTYLogo, setSelectedTYLogo] = useState("");
    const [selectedBISLogo, setSelectedBISLogo] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const [selected, setSelected] = useState(0);
    const shopDetails = useSelector((state) => state.shopDetails)
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
        getBisEmail()
    }, []);

    const getBisEmail = async () => {
        const response = await apiService.bisSetting();
        if (response.status === 200) {
            setbackInStockEmail(response.data);
            setCheckDiscount(response.data.bis_content.discount_code ? true : false)
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
    }
    const handleSwitch = async (e) => {
        let obj = {...backInStockEmail, [e.target.name]: e.target.value}
        setbackInStockEmail(obj)
        if (obj.bis_branding_type == "1") {
            delete obj.bis_logo;
        }

        if (obj.thankyou_branding_type == "1") {
            delete obj.thankyou_logo;
        }

        let newBackInStockEmail = {...obj, id: obj.id ? obj.id : ""}
        const formData = new FormData();
        const payload = JSON.stringify(newBackInStockEmail)
        formData.append("payload", payload)
        const response = await apiService.updateBisSetting(formData)
        if (response.status === 200) {
            setIsError(false)
            setMessage(capitalizeMessage(response.message))
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }

    }
    const onSaveBISEmail = async () => {
        let validationErrors = {};
        const tempObj = {...backInStockEmail.bis_content, bis_from_mail: backInStockEmail.bis_from_mail}
        Object.keys(tempObj).forEach((name) => {
            const error = formValidate(name, tempObj[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setBackInStockEmailError(validationErrors);
            return;
        }
        setIsLoading(true);
        if (backInStockEmail.bis_branding_type == "1") {
            delete backInStockEmail.bis_logo;
        }
        if (backInStockEmail.thankyou_branding_type == "1") {
            delete backInStockEmail.thankyou_logo;
        }
        let newBackInStockEmail = {...backInStockEmail, id: backInStockEmail.id ? backInStockEmail.id : ""}
        const formData = new FormData();
        Object.keys(newBackInStockEmail).forEach((x) => {
            if ((typeof (newBackInStockEmail[x]) === "object") && newBackInStockEmail[x] !== null) {

            } else {
                if (x === "bis_logo" && selectedBISLogo && selectedBISLogo.name) {
                    formData.append("bis_logo", selectedBISLogo);
                } else if (x === "thankyou_logo" && selectedTYLogo?.name) {
                    formData.append("thankyou_logo", selectedTYLogo);
                } else if (x === "bis_logo" || x === "thankyou_logo") {

                } else {

                }
            }
        })
        formData.append("payload", JSON.stringify(newBackInStockEmail))

        const response = await apiService.updateBisSetting(formData)
        if (response.status === 200) {
            setIsError(false)
            setMessage(capitalizeMessage(response.message))
            setIsLoading(false);
            getBisEmail();
            setSelectedTYLogo("")
            setSelectedBISLogo("")
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsLoading(false)
        } else {
            setIsLoading(false)
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }
    }

    const onBack = () => {
        navigate(`${baseUrl}/back-in-stock/email`)
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setbackInStockEmail({
            ...backInStockEmail,
            [name]: value,
        })
        if (backInStockEmailError[name]) {
            setBackInStockEmailError({
                ...backInStockEmailError,
                [name]: value.trim() ? "" : backInStockEmailError[name]
            })
        }
    }

    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setSelectedBISLogo(acceptedFiles[0]),
        [],
    );

    const bisOnChangeStyle = (e) => {
        const {name, value} = e.target;
        setbackInStockEmail({
            ...backInStockEmail,
            bis_style: {...backInStockEmail.bis_style, [name]: value},

        })
    }

    const bisOnChangeContent = (e) => {
        const {name, value} = e.target;
        setbackInStockEmail({
            ...backInStockEmail,
            bis_content: {...backInStockEmail.bis_content, [name]: value},
        })
        if (backInStockEmailError[name]) {
            setBackInStockEmailError({
                ...backInStockEmailError,
                [name]: value.trim() ? "" : backInStockEmailError[name]
            })
        }
    }

    const bisOnChangeSocial = (e) => {
        const {name, value} = e.target;
        setbackInStockEmail({
            ...backInStockEmail,
            bis_social: {...backInStockEmail.bis_social, [name]: value},
        })
    }

    const fileUpload = (!selectedBISLogo && !backInStockEmail.bis_logo) ? <DropZone.FileUpload/> : "";
    const uploadedFiles = (
        <Fragment>
            {
                (selectedBISLogo || backInStockEmail.bis_logo) ?
                    <Fragment>
                        {
                            selectedBISLogo?.name ? <Thumbnail source={window.URL.createObjectURL(selectedBISLogo)}/> : backInStockEmail && backInStockEmail.bis_logo ? <Thumbnail source={backInStockEmail.bis_logo}/> : ""
                        }
                    </Fragment>
                    : ""
            }
        </Fragment>
    );

    const onBlur = (e) => {
        const {name, value} = e.target
        setBackInStockEmailError({...backInStockEmailError, [name]: formValidate(name, value)})
    }

    const handleTabChange = (selectedTabIndex) => {
        let IsTabChange = true
        Object.keys(backInStockEmailError).map((x) => {
            if (backInStockEmailError[x] !== "") {
                IsTabChange = false
            }
        })
        if (IsTabChange) {
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

    const formValidate = (name, value) => {
        const validRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        switch (name) {
            case "email_subject":
                if (!value || value.trim() === "") {
                    return "Email subject is required";
                } else {
                    return "";
                }
            case "email_title":
                if (!value || value.trim() === "") {
                    return "Email title is required";
                } else {
                    return "";
                }
            case "email_description":
                if (!value || value.trim() === "") {
                    return "Email description is required";
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
            case "bis_from_mail":
                if (value && !value?.match(validRegex)) {
                    return "Enter a valid email address";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    return (
        <Fragment>

            <Page title={"Back In Stock Notification"} backAction={{content: 'Settings', onAction: onBack}}
                  secondaryActions={
                      <Fragment>
                          <SwitchButton
                              checked={backInStockEmail.is_bis_email_enable == 1}
                              onChange={handleSwitch} name={"is_bis_email_enable"}
                          />&nbsp;&nbsp;
                          <Button variant="primary" onClick={onSaveBISEmail} loading={isLoading}> Save</Button>
                      </Fragment>

                  }>
                <Layout>
                    {message !== "" && isError === false ?
                        <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                        <CustomErrorBanner link={"https://webcontrive.helpscoutdocs.com/article/525-how-to-set-back-in-stock-button-and-email"} message={message} setMessage={setMessage} setIsError={setIsError} isError={isError} />
                    <Layout.Section>
                        <Card padding={"0"}>
                            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
                            <Divider/>
                            {
                                selected === 0 &&
                                <Box padding={"400"} paddingBlockStart={"200"}>
                                    <FormLayout>
                                        <TextField label="Sender Email"
                                                   value={backInStockEmail.bis_from_mail}
                                                   onChange={(value) => {handleChange({target: {name: "bis_from_mail", value}})}}
                                                   name={"bis_from_mail"}
                                                   onBlur={onBlur}
                                                   error={backInStockEmailError.bis_from_mail}
                                        />
                                        <TextField label={"Email Subject"}
                                                   multiline={2}
                                                   value={backInStockEmail.bis_content.email_subject}
                                                   onChange={(value) => {bisOnChangeContent({target: {name: "email_subject", value}})}}
                                                   name={"email_subject"}
                                                   onBlur={onBlur}
                                                   error={backInStockEmailError.email_subject}
                                                   helpText={"Add this {{product_name}} {{shop_name}} variable"}
                                        />
                                        <TextField label={"Email Title"}
                                                   multiline={2}
                                                   value={backInStockEmail.bis_content.email_title}
                                                   onChange={(value) => {
                                                       bisOnChangeContent({
                                                           target: {
                                                               name: "email_title",
                                                               value
                                                           }
                                                       })
                                                   }}
                                                   helpText={"Add this {{product_name}} {{shop_name}} variable"}
                                                   name={"email_title"}
                                                   onBlur={onBlur}
                                                   error={backInStockEmailError.email_title}
                                        />
                                        <TextField label={"Email Description"}
                                                   multiline={2}
                                                   value={backInStockEmail.bis_content.email_description}
                                                   onChange={(value) => {
                                                       bisOnChangeContent({
                                                           target: {
                                                               name: "email_description",
                                                               value
                                                           }
                                                       })
                                                   }}
                                                   name={"email_description"}
                                                   onBlur={onBlur}
                                                   error={backInStockEmailError.email_description}
                                                   helpText={"Add this {{shop_name}} {{product_name}} {{shop_url}} {{product_url}} variable"}/>
                                        <TextField label={'"Add to cart" label'}
                                                   value={backInStockEmail.bis_content.add_to_cart_button_text}
                                                   onChange={(value) => {
                                                       bisOnChangeContent({
                                                           target: {
                                                               name: "add_to_cart_button_text",
                                                               value
                                                           }
                                                       })
                                                   }}
                                                   name={"add_to_cart_button_text"}
                                                   onBlur={onBlur}
                                                   error={backInStockEmailError.add_to_cart_button_text}
                                        />
                                        <TextField label={'"Visit product" label'}
                                                   value={backInStockEmail.bis_content.view_product_button_text}
                                                   onChange={(value) => {
                                                       bisOnChangeContent({
                                                           target: {
                                                               name: "view_product_button_text",
                                                               value
                                                           }
                                                       })
                                                   }}
                                                   name={"view_product_button_text"}
                                                   onBlur={onBlur}
                                                   error={backInStockEmailError.view_product_button_text}
                                        />
                                        <Checkbox
                                            label="Discount code"
                                            checked={checkDiscount}
                                            onChange={() => setCheckDiscount(!checkDiscount)}
                                        />
                                        {checkDiscount &&

                                        <TextField label={"Discount description"}
                                                   value={backInStockEmail.bis_content.discount_code}
                                                   onChange={(value) => {
                                                       bisOnChangeContent({
                                                           target: {
                                                               name: "discount_code",
                                                               value
                                                           }
                                                       })
                                                   }}
                                        />
                                        }
                                    </FormLayout>
                                </Box>
                            }
                            {
                                selected === 1 &&
                                <Box padding={"400"} paddingBlockStart={"200"}>
                                    <FormLayout>
                                        <FormLayout.Group>
                                            <TextField label={"Social networks title"}
                                                       value={backInStockEmail.bis_social.title}
                                                       onChange={(value) => {
                                                           bisOnChangeSocial({
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
                                                       value={backInStockEmail.bis_social.instagram}
                                                       onChange={(value) => {
                                                           bisOnChangeSocial({
                                                               target: {
                                                                   name: "instagram",
                                                                   value
                                                               }
                                                           })
                                                       }}
                                            />
                                            <TextField label={"Facebook"} prefix={"@"}
                                                       value={backInStockEmail.bis_social.facebook}
                                                       onChange={(value) => {
                                                           bisOnChangeSocial({
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
                                                       value={backInStockEmail.bis_social.twitter}
                                                       onChange={(value) => {
                                                           bisOnChangeSocial({
                                                               target: {
                                                                   name: "twitter",
                                                                   value
                                                               }
                                                           })
                                                       }}
                                            />
                                            <TextField label={"Telegram"} prefix={"@"}
                                                       value={backInStockEmail.bis_social.telegram}
                                                       onChange={(value) => {
                                                           bisOnChangeSocial({
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
                                                       value={backInStockEmail.bis_social.linkedin}
                                                       onChange={(value) => {
                                                           bisOnChangeSocial({
                                                               target: {
                                                                   name: "linkedin",
                                                                   value
                                                               }
                                                           })
                                                       }}
                                            />
                                            <TextField label={"Pinterest"}
                                                       value={backInStockEmail.bis_social.pinterest}
                                                       onChange={(value) => {
                                                           bisOnChangeSocial({
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
                                selected === 2 &&
                                <Fragment>
                                    <Box padding={"400"} paddingBlockStart={"200"}>
                                        <BlockStack gap={"200"}>
                                            <Text as={"h3"} fontWeight={"medium"}>Email logo</Text>
                                            <FormLayout>
                                                <FormLayout.Group condensed>
                                                    <RadioButton
                                                        label="Logo"
                                                        id="disabled"
                                                        checked={backInStockEmail.bis_branding_type == '2'}
                                                        onChange={() => handleChange({
                                                            target: {
                                                                name: "bis_branding_type",
                                                                value: "2"
                                                            }
                                                        })}
                                                    />
                                                    <RadioButton
                                                        label={"Store Name"}
                                                        id="optional"
                                                        checked={backInStockEmail.bis_branding_type == '1'}
                                                        onChange={() => handleChange({
                                                            target: {
                                                                name: "bis_branding_type",
                                                                value: "1"
                                                            }
                                                        })}
                                                    />
                                                    <RadioButton
                                                        label={"Both"}
                                                        id="both"
                                                        checked={backInStockEmail.bis_branding_type == '3'}
                                                        onChange={() => handleChange({
                                                            target: {
                                                                name: "bis_branding_type",
                                                                value: "3"
                                                            }
                                                        })}
                                                    />
                                                </FormLayout.Group>
                                                {(backInStockEmail.bis_branding_type == '2' || backInStockEmail.bis_branding_type == '3') &&
                                                <div style={{width: 58, height: 58}}>
                                                    <DropZone
                                                        accept=".jpg,.png,.jpeg"
                                                        allowMultiple={false}
                                                        onDrop={handleDropZoneDrop}
                                                    >
                                                        {uploadedFiles}
                                                        {fileUpload}
                                                    </DropZone>
                                                </div>
                                                }
                                            </FormLayout>
                                        </BlockStack>
                                    </Box>
                                    <Divider />
                                    <Box padding={"400"}>
                                        <BlockStack gap={"200"}>
                                            <Text as={"h3"} fontWeight={"medium"}>Email body customization</Text>
                                            <FormLayout>
                                                <FormLayout.Group condensed>
                                                    <Select label={"Text color theme"} options={theme}
                                                            value={backInStockEmail.bis_style.theme}
                                                            onChange={(value) => {
                                                                bisOnChangeStyle({
                                                                    target: {
                                                                        name: "theme",
                                                                        value
                                                                    }
                                                                })
                                                            }}
                                                    />
                                                    <Select label={"Font family"}
                                                            options={fontFamily}
                                                            value={backInStockEmail.bis_style.font_family}
                                                            onChange={(value) => {
                                                                bisOnChangeStyle({
                                                                    target: {
                                                                        name: "font_family",
                                                                        value
                                                                    }
                                                                })
                                                            }}
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group condensed>
                                                    <ColorInput label={"Background color"} name="background_color"
                                                                onChange={bisOnChangeStyle}
                                                                value={backInStockEmail.bis_style.background_color}/>
                                                    <TextField type={"number"} label={"Email title font size"} suffix={"Px"}
                                                               value={backInStockEmail.bis_style.title_font_size}
                                                               onChange={(value) => {
                                                                   bisOnChangeStyle({
                                                                       target: {
                                                                           name: "title_font_size",
                                                                           value
                                                                       }
                                                                   })
                                                               }}
                                                    />
                                                </FormLayout.Group>
                                                <FormLayout.Group condensed>
                                                    <TextField type={"number"} label={"Email description font size"} suffix={"Px"} value={backInStockEmail.bis_style.description_font_size} onChange={(value) => {
                                                        bisOnChangeStyle({
                                                            target: {
                                                                name: "description_font_size",
                                                                value
                                                            }
                                                        })
                                                    }}/>
                                                    {checkDiscount ? <TextField label={"Discount font size"} suffix={"Px"} type="number" value={backInStockEmail.bis_style.discount_font_size} onChange={(value) => {
                                                        bisOnChangeStyle({
                                                            target: {
                                                                name: "discount_font_size",
                                                                value
                                                            }
                                                        })
                                                    }}/> : <div/>}
                                                </FormLayout.Group>
                                            </FormLayout>
                                        </BlockStack>
                                    </Box>
                                    <Divider  />
                                    <Box padding={"400"}>
                                        <BlockStack gap={"200"}>
                                            <Text as={"h3"} fontWeight={"medium"}>Add to Cart Button customization</Text>
                                            <FormLayout>
                                                <FormLayout.Group condensed>
                                                    <ColorInput label={"Button Background color"}
                                                                name="add_to_cart_btn_bg_color"
                                                                onChange={bisOnChangeStyle}
                                                                value={backInStockEmail.bis_style.add_to_cart_btn_bg_color}/>
                                                    <ColorInput label={"Button Text color"}
                                                                name="add_to_cart_btn_text_color"
                                                                onChange={bisOnChangeStyle}
                                                                value={backInStockEmail.bis_style.add_to_cart_btn_text_color}/>
                                                </FormLayout.Group>
                                                <FormLayout.Group condensed>
                                                    <ColorInput label={"Button Border color"}
                                                                name="add_to_cart_btn_border_color"
                                                                onChange={bisOnChangeStyle}
                                                                value={backInStockEmail.bis_style.add_to_cart_btn_border_color}/>
                                                    <TextField label={"Border Width"}
                                                               value={backInStockEmail.bis_style.add_to_cart_btn_border_size}
                                                               type="number"
                                                               suffix="PX"
                                                               onChange={(value) => {
                                                                   bisOnChangeStyle({
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
                                                               value={backInStockEmail.bis_style.add_to_cart_btn_vertical_padding}
                                                               onChange={(value) => bisOnChangeStyle({
                                                                   target: {
                                                                       name: "add_to_cart_btn_vertical_padding",
                                                                       value
                                                                   }
                                                               })}
                                                               suffix="PX"
                                                    />
                                                    <TextField label="Left & Right padding"
                                                               type="number"
                                                               value={backInStockEmail.bis_style.add_to_cart_btn_horizontal_padding}
                                                               onChange={(value) => bisOnChangeStyle({
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
                                                               value={backInStockEmail.bis_style.add_to_cart_btn_border_radius}
                                                               onChange={(value) => bisOnChangeStyle({
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
                                            <Text as={"h3"} fontWeight={"medium"}>View Product Button customization</Text>
                                            <FormLayout>
                                                <FormLayout.Group condensed>
                                                    <ColorInput label={"Button Background color"}
                                                                name="view_product_btn_bg_color"
                                                                onChange={bisOnChangeStyle}
                                                                value={backInStockEmail.bis_style.view_product_btn_bg_color}/>
                                                    <ColorInput label={"Button Text color"}
                                                                name="view_product_btn_text_color"
                                                                onChange={bisOnChangeStyle}
                                                                value={backInStockEmail.bis_style.view_product_btn_text_color}/>
                                                </FormLayout.Group>
                                                <FormLayout.Group condensed>
                                                    <ColorInput label={"Button Border color"}
                                                                name="view_product_btn_border_color"
                                                                onChange={bisOnChangeStyle}
                                                                value={backInStockEmail.bis_style.view_product_btn_border_color}/>
                                                    <TextField label={"Border Width"}
                                                               value={backInStockEmail.bis_style.view_product_btn_border_size}
                                                               type="number"
                                                               suffix="PX"
                                                               onChange={(value) => {
                                                                   bisOnChangeStyle({
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
                                                               value={backInStockEmail.bis_style.view_product_btn_vertical_padding}
                                                               onChange={(value) => bisOnChangeStyle({
                                                                   target: {
                                                                       name: "view_product_btn_vertical_padding",
                                                                       value
                                                                   }
                                                               })}
                                                               suffix="PX"
                                                    />
                                                    <TextField label="Left & Right padding"
                                                               type="number"
                                                               value={backInStockEmail.bis_style.view_product_btn_horizontal_padding}
                                                               onChange={(value) => bisOnChangeStyle({
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
                                                               min={0}
                                                               value={backInStockEmail.bis_style.view_product_btn_border_radius}
                                                               onChange={(value) => bisOnChangeStyle({
                                                                   target: {
                                                                       name: "view_product_btn_border_radius",
                                                                       value
                                                                   }
                                                               })}
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
                                <BlockStack gap={400}>
                                    <InlineStack gap={400} wrap={false}>
                                        <div className="email-logo-preview">{Icons.email}</div>
                                        <BlockStack>
                                            <Text variant={"bodySm"}>
                                                {backInStockEmail.bis_content.email_subject}
                                            </Text>
                                            <BlockStack>
                                                <Text as={"h3"} fontWeight={"bold"}>{shopDetails && shopDetails.store_name}</Text>
                                                <Text>{backInStockEmail.bis_from_mail}</Text>
                                            </BlockStack>
                                        </BlockStack>
                                    </InlineStack>
                                </BlockStack>
                            </Box>
                            <Divider />
                            <Box  paddingBlockStart={"400"} >
                                <BlockStack>
                                    <div className="email-template-live-preview-wrapper">
                                        <div className="email-template-body"
                                             style={{fontFamily: backInStockEmail.bis_style.font_family}}>
                                            <table width="100%" border={0} cellSpacing={0} cellPadding={0} style={{borderCollapse: 'collapse'}}>
                                                <tbody>
                                                <tr>
                                                    <td align="center">
                                                        <table className="template-table" border={0} cellSpacing={0} cellPadding={0} style={{margin: '0px auto', maxWidth: '470px', borderCollapse: 'collapse'}}>
                                                            <thead>
                                                            <tr className="shop-branding-wrapper" style={{backgroundColor: backInStockEmail.bis_style.background_color, borderRadius: '10px 10px 0px 0px',}}>
                                                                <th className="shop-branding" style={{display: "flex",alignItems: "center", justifyContent: "center", color: 'rgb(32, 34, 35)', fontSize: '24px', fontWeight: 'bold', lineHeight: '28px', height: '70px', textAlign: 'center', paddingTop: '20px',}}>
                                                                    {
                                                                        backInStockEmail.bis_branding_type == "2" ?
                                                                            <Fragment>{selectedBISLogo && selectedBISLogo.name ?
                                                                                <img src={selectedBISLogo ? URL.createObjectURL(selectedBISLogo) : ""} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                backInStockEmail.bis_logo ?
                                                                                    <img src={backInStockEmail.bis_logo} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                    <img src={""} alt="logo" style={{maxHeight: '50px'}}/>}</Fragment> :
                                                                            backInStockEmail.bis_branding_type == "1" ? shopDetails && shopDetails.store_name :
                                                                                <Fragment>{selectedBISLogo?.name ?
                                                                                    <img src={selectedBISLogo ? URL.createObjectURL(selectedBISLogo) : ""} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                    backInStockEmail.bis_logo ?
                                                                                        <img src={backInStockEmail.bis_logo} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                        <img src={""} alt="logo" style={{maxHeight: '50px'}}/>}&nbsp; {shopDetails && shopDetails.store_name}
                                                                                </Fragment>
                                                                    }
                                                                </th>
                                                            </tr>
                                                            </thead>
                                                            <tbody className="template-body" style={{backgroundColor: backInStockEmail.bis_style.background_color, border: '30px solid transparent', borderTop: '10px solid transparent'}}>
                                                            <tr className="title-wrapper">
                                                                <td className="title color-text-primary" style={{fontSize: `${backInStockEmail.bis_style.title_font_size}px`, lineHeight: '32px', color: backInStockEmail.bis_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)', fontWeight: 400, whiteSpace: 'pre-line'}}>
                                                                    {backInStockEmail.bis_content.email_title}
                                                                </td>
                                                            </tr>
                                                            <tr className="description-wrapper">
                                                                <td className="description color-text-secondary" style={{fontSize: `${backInStockEmail.bis_style.description_font_size}px`, lineHeight: '28px', paddingTop: '10px', color: backInStockEmail.bis_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)', whiteSpace: 'pre-line'}}>
                                                                    {backInStockEmail.bis_content.email_description}
                                                                </td>
                                                            </tr>
                                                            <tr className="discount-wrapper">
                                                                <td className="discount color-text-secondary" colSpan={3} style={{whiteSpace: 'pre-line', fontSize: `${backInStockEmail.bis_style.discount_font_size}px`, paddingTop: '20px', lineHeight: '20px', color: backInStockEmail.bis_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)', display: checkDiscount === true ? "block" : 'none'}}>{backInStockEmail.bis_content.discount_code}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="product-image" style={{paddingTop: '20px'}}>
                                                                    <div style={{width: '100%', height: '100%',}}>
                                                                        <img src="https://wishlist.thimatic-apps.com/assets/images/product3.jpg" alt="Dacia blouse" width={470} style={{display: 'block', margin: 'auto', maxWidth: '50%', borderRadius: '10px', border: '1px solid rgb(201, 202, 204)'}}/>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr className="product-price-wrapper">
                                                                <td className="product-price" style={{paddingTop: '8px', fontWeight: 500, fontSize: '18px', lineHeight: '24px', color: 'rgb(32, 34, 35)', display: 'revert'}}>₹179.00</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{paddingTop: '20px'}}>
                                                                    <a className="buy-action-url bg-primary" style={{backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, color: backInStockEmail.bis_style.add_to_cart_btn_text_color, boxSizing: 'border-box', borderRadius: `${backInStockEmail.bis_style.add_to_cart_btn_border_radius}px`, display: 'block', fontSize: '18px', fontWeight: 600, lineHeight: '20px', padding: `${backInStockEmail.bis_style.add_to_cart_btn_vertical_padding}px ${backInStockEmail.bis_style.add_to_cart_btn_horizontal_padding}px`, textAlign: 'center', textDecoration: 'none', border: `${backInStockEmail.bis_style.add_to_cart_btn_border_size}px solid ${backInStockEmail.bis_style.add_to_cart_btn_border_color}`}}>{backInStockEmail.bis_content.add_to_cart_button_text}</a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{paddingTop: '20px'}}>
                                                                    <a className="visit-action-url color-primary border-primary"
                                                                       style={{backgroundColor: backInStockEmail.bis_style.view_product_btn_bg_color, color: backInStockEmail.bis_style.view_product_btn_text_color, border: `${backInStockEmail.bis_style.view_product_btn_border_size}px solid ${backInStockEmail.bis_style.view_product_btn_border_color}`, boxSizing: 'border-box', borderRadius: `${backInStockEmail.bis_style.view_product_btn_border_radius}px`, display: 'block', fontSize: '18px', fontWeight: 600, lineHeight: '20px', padding: `${backInStockEmail.bis_style.view_product_btn_vertical_padding}px ${backInStockEmail.bis_style.view_product_btn_horizontal_padding}px`, textAlign: 'center', textDecoration: 'none'}}>{backInStockEmail.bis_content.view_product_button_text}</a>
                                                                </td>
                                                            </tr>
                                                            {
                                                                (backInStockEmail.bis_social.instagram !== null && backInStockEmail.bis_social.instagram !== "") ||
                                                                (backInStockEmail.bis_social.facebook !== null && backInStockEmail.bis_social.facebook !== "") ||
                                                                (backInStockEmail.bis_social.twitter !== null && backInStockEmail.bis_social.twitter !== "") ||
                                                                (backInStockEmail.bis_social.telegram !== null && backInStockEmail.bis_social.telegram !== "") ||
                                                                (backInStockEmail.bis_social.linkedin !== null && backInStockEmail.bis_social.linkedin !== "") ||
                                                                (backInStockEmail.bis_social.pinterest !== null && backInStockEmail.bis_social.pinterest !== "") ?
                                                                    <React.Fragment>
                                                                        <tr className="social-text-wrapper">
                                                                            <td colSpan={3} className="social-text color-text-tertiary" style={{display: (backInStockEmail.bis_social.instagram !== null && backInStockEmail.bis_social.instagram !== "") || (backInStockEmail.bis_social.facebook !== null && backInStockEmail.bis_social.facebook !== "") || (backInStockEmail.bis_social.twitter !== null && backInStockEmail.bis_social.twitter !== "") || (backInStockEmail.bis_social.telegram !== null && backInStockEmail.bis_social.telegram !== "") || (backInStockEmail.bis_social.linkedin !== null && backInStockEmail.bis_social.linkedin !== "") || (backInStockEmail.bis_social.pinterest !== null && backInStockEmail.bis_social.pinterest !== "") ? "block" : 'none', fontWeight: 400, fontSize: '16px', textAlign: 'center', color: 'rgb(116, 124, 128)', paddingBottom: '10px', paddingTop: '30px'}}>{backInStockEmail.bis_social.title}</td>
                                                                        </tr>
                                                                        <tr className="social-networks-wrapper">
                                                                            <td className="social-networks"
                                                                                style={{textAlign: 'center'}}>
                                                                                <button className="instagram bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.instagram !== null && backInStockEmail?.bis_social?.instagram.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}><img src="https://storage.googleapis.com/static.shopgram.io/restock-icons/instagram.png" width={12} alt="instagram"/></button>
                                                                                <button className="facebook bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.facebook !== null && backInStockEmail.bis_social.facebook.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}><img src="https://storage.googleapis.com/static.shopgram.io/restock-icons/facebook.png" width={12} alt="facebook"/></button>
                                                                                <button className="twitter bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.twitter !== null && backInStockEmail.bis_social.twitter.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}><img src="https://storage.googleapis.com/static.shopgram.io/restock-icons/twitter.png" width={12} alt="twitter"/></button>
                                                                                <button className="telegram bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.telegram !== null && backInStockEmail.bis_social.telegram.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}><img src="https://storage.googleapis.com/static.shopgram.io/restock-icons/telegram.png" width={12} alt="telegram"/></button>
                                                                                <button className="linkedin bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.linkedin !== null && backInStockEmail.bis_social.linkedin.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}><img src="https://storage.googleapis.com/static.shopgram.io/restock-icons/linkedin.png" width={12} alt="linkedin"/></button>
                                                                                <button className="pinterest bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.pinterest !== null && backInStockEmail.bis_social.pinterest.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}><img src="https://storage.googleapis.com/static.shopgram.io/restock-icons/pinterest.png" width={12} alt="pinterest"/></button>
                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                    :
                                                                    null
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </BlockStack>
                            </Box>
                        </Card>
                    </Layout.Section>
                </Layout>
                <PageActions
                    primaryAction={{
                        content: 'Save',
                        onAction: onSaveBISEmail,
                        loading: isLoading
                    }}
                />
            </Page>
        </Fragment>
    );
};

export default StockNotification;