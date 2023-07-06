import React, {Fragment, useEffect, useState} from 'react';
import {
    Page,
    Layout,
    LegacyCard,
    FormLayout,
    TextField,
    PageActions,
    Select,
    Divider,
    Text,
    RadioButton, DropZone, LegacyStack, Thumbnail
} from "@shopify/polaris";
import {apiService, baseUrl} from "../../../../../utils/Constant";
import {useNavigate} from "react-router-dom";
import {ColorInput, ToastMessage} from "../../../../../components";
import {useSelector} from "react-redux";

const initialSate = {
    restock_email_subject: "Restock Alert!!!",
    restock_email_body: "Your wishlist item in stock  is dropped so hurry up to buy your favorite product now!!!",
    restock_email_reply_to_email: "wc.himani1@gmail.com",
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
    },
    restock_content: {
        add_to_cart_button_text: "",
        view_product_button_text: ""
    }
};
export default function RestockAlert() {
    const navigate = useNavigate()
    const [emailSetting, setEmailSetting] = useState(initialSate);
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
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
            setIsLoading(false);
            const response = await apiService.emailSetting();
            if (response.status === 200) {
                setEmailSetting(response.data)
                setIsLoading(false)
            } else {
                setIsLoading(false)

            }
        }
        EmailSetting()
    }, []);

    const saveEmailSetting = async () => {
        setIsLoading(true);

        if (emailSetting.price_drop_branding_type == "1") {
            delete emailSetting.price_drop_logo;
        }
        if (emailSetting.wishlist_branding_type == "1") {
            delete emailSetting.wishlist_logo;
        }
        if (emailSetting.restock_branding_type == "1") {
            delete emailSetting.restock_logo;
        }
        let newEmailSetting = {...emailSetting}
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
            setMessage(response.message)
            setIsLoading(false);
        } else {
            setMessage(response.message)
            setIsLoading(false)
        }

    }
    const handleChange = (e) => {
        const {name, value} = e.target
        setEmailSetting({
            ...emailSetting,
            [name]: value
        })
    }
    const fileUpload = (!selectedRestockLogo && !emailSetting.restock_logo) ? <DropZone.FileUpload/> : "";
    const uploadedFiles = (
        <Fragment>
            {
                (selectedRestockLogo || emailSetting.restock_logo) ?
                    <LegacyStack alignment="center" vertical spacing={"tight"}>
                        <br/>
                        <br/>
                        {selectedRestockLogo?.name ?
                            <Thumbnail
                                size="small"
                                source={window.URL.createObjectURL(selectedRestockLogo)}
                            />
                            : emailSetting && emailSetting.restock_logo ?
                                <Thumbnail
                                    size="small"
                                    source={emailSetting.restock_logo}
                                />
                                :
                                ""}
                        <br/>
                        <br/>
                    </LegacyStack>
                    :""
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
    }

    return (
        <Fragment>
            <Page title={"Restock Alerts"} backAction={{content: 'Settings', onAction: onBack}}
                  primaryAction={{content: "Save", onAction: saveEmailSetting, loading: isLoading}}>
                <ToastMessage message={message} setMessage={setMessage}/>
                <Layout>
                    <Layout.Section oneHalf>
                        <LegacyCard sectioned>
                            <FormLayout>
                                <Text> Store branding</Text>
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
                                <DropZone
                                    accept=".jpg,.png,.jpeg"
                                    allowMultiple={false}
                                    onDrop={handleDropZoneDrop}
                                >
                                    {uploadedFiles}
                                    {fileUpload}
                                </DropZone>}
                            </FormLayout>
                        </LegacyCard>
                        <LegacyCard sectioned>
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
                                <FormLayout.Group condensed>

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
                                    />
                                </FormLayout.Group>
                            </FormLayout>
                        </LegacyCard>
                        <LegacyCard sectioned title="Add to Cart Button">
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
                            </FormLayout>
                        </LegacyCard>
                        <LegacyCard sectioned title="View Product Button">
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
                            </FormLayout>
                        </LegacyCard>
                        <LegacyCard sectioned>
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
                                />
                                <Divider/>
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
                        </LegacyCard>
                    </Layout.Section>
                    <Layout.Section oneHalf>
                        <LegacyCard sectioned title={emailSetting.restock_email_subject}>
                            <div className="email-template-live-preview-wrapper">
                                <div className="email-template-body"
                                     style={{fontFamily: emailSetting.restock_style.font_family}}>
                                    <table width="100%" border={0} cellSpacing={0} cellPadding={0}
                                           style={{borderCollapse: 'collapse'}}>
                                        <tbody>
                                        <tr>
                                            <td align="center">
                                                <table className="template-table" border={0} cellSpacing={0}
                                                       cellPadding={0} style={{
                                                    margin: '0px auto',
                                                    maxWidth: '470px',
                                                    borderCollapse: 'collapse'
                                                }}>
                                                    <thead>
                                                    <tr className="shop-branding-wrapper">
                                                        <th className="shop-branding"
                                                            style={{
                                                                backgroundColor: emailSetting.restock_style.background_color,
                                                                borderRadius: '10px 10px 0px 0px',
                                                                color: 'rgb(32, 34, 35)',
                                                                fontSize: '24px',
                                                                fontWeight: 'bold',
                                                                lineHeight: '28px',
                                                                height: '70px',
                                                                textAlign: 'center',
                                                                paddingTop: '20px',
                                                            }}>
                                                            {
                                                                emailSetting.restock_branding_type == "2" ?
                                                                    <Fragment>
                                                                        {selectedRestockLogo && selectedRestockLogo.name ?
                                                                            <img
                                                                                src={selectedRestockLogo ? URL.createObjectURL(selectedRestockLogo) : ""}
                                                                                alt="logo"
                                                                                style={{maxHeight: '50px'}}/> :
                                                                            emailSetting.restock_logo ?
                                                                                <img src={emailSetting.restock_logo}
                                                                                     alt="logo"
                                                                                     style={{maxHeight: '50px'}}/> :
                                                                                <img src={""} alt="logo"
                                                                                     style={{maxHeight: '50px'}}/>
                                                                        }
                                                                    </Fragment> :
                                                                    emailSetting.restock_branding_type == "1" ? shopDetails && shopDetails.store_name :
                                                                        <Fragment>
                                                                            {selectedRestockLogo?.name ?
                                                                                <img
                                                                                    src={selectedRestockLogo ? URL.createObjectURL(selectedRestockLogo) : ""}
                                                                                    alt="logo"
                                                                                    style={{maxHeight: '50px'}}/>
                                                                                :
                                                                                emailSetting.restock_logo ?
                                                                                    <img
                                                                                        src={emailSetting.restock_logo}
                                                                                        alt="logo"
                                                                                        style={{maxHeight: '50px'}}/>
                                                                                    : ""
                                                                            }
                                                                            &nbsp; {shopDetails && shopDetails.store_name}
                                                                        </Fragment>
                                                            }
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="template-body" style={{
                                                        backgroundColor: emailSetting.restock_style.background_color,
                                                        border: '30px solid transparent'
                                                    }}>
                                                    <tr className="description-wrapper">
                                                        <td className="description color-text-secondary" style={{
                                                            fontSize: `${emailSetting.restock_style.description_font_size}px`,
                                                            lineHeight: '28px',
                                                            color: emailSetting.restock_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)',
                                                            whiteSpace: 'pre-line'
                                                        }}>
                                                            {emailSetting.restock_email_body}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="product-image" style={{paddingTop: '20px'}}>
                                                            <div style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                borderRadius: '10px',
                                                                border: '1px solid rgb(201, 202, 204)',
                                                                marginRight: "3px"
                                                            }}>
                                                                <img
                                                                    src="https://cdn.shopify.com/s/files/1/0629/5207/9596/products/Group1242.png?v=1672138033"
                                                                    alt="Dacia blouse" width={470} style={{
                                                                    display: 'block',
                                                                    margin: 'auto',
                                                                    maxWidth: '100%',
                                                                    borderRadius: '10px'
                                                                }}/>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="product-price-wrapper">
                                                        <td className="product-price" style={{
                                                            paddingTop: '8px',
                                                            fontWeight: 500,
                                                            fontSize: '18px',
                                                            lineHeight: '24px',
                                                            color: 'rgb(32, 34, 35)',
                                                            display: 'revert'
                                                        }}>
                                                            ₹179.00
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{paddingTop: '20px'}}>
                                                            <a className="buy-action-url bg-primary"
                                                               style={{
                                                                   backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color,
                                                                   color: emailSetting.restock_style.add_to_cart_btn_text_color,
                                                                   boxSizing: 'border-box',
                                                                   borderRadius: '10px',
                                                                   display: 'block',
                                                                   fontSize: '18px',
                                                                   fontWeight: 600,
                                                                   lineHeight: '20px',
                                                                   padding: `${emailSetting.restock_style.add_to_cart_btn_vertical_padding}px ${emailSetting.restock_style.add_to_cart_btn_horizontal_padding}px`,
                                                                   textAlign: 'center',
                                                                   textDecoration: 'none',
                                                                   border:`${emailSetting.restock_style.add_to_cart_btn_border_size}px solid ${emailSetting.restock_style.add_to_cart_btn_border_color}`
                                                               }}>
                                                                {emailSetting.restock_content.add_to_cart_button_text}
                                                            </a>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td style={{paddingTop: '20px'}}>
                                                            <a className="visit-action-url color-primary border-primary"
                                                               style={{
                                                                   backgroundColor:emailSetting.restock_style.view_product_btn_bg_color,
                                                                   color: emailSetting.restock_style.view_product_btn_text_color,
                                                                   border: `${emailSetting.restock_style.view_product_btn_border_size}px solid ${emailSetting.restock_style.view_product_btn_border_color}`,
                                                                   boxSizing: 'border-box',
                                                                   borderRadius: '10px',
                                                                   display: 'block',
                                                                   fontSize: '18px',
                                                                   fontWeight: 600,
                                                                   lineHeight: '20px',
                                                                   padding: `${emailSetting.restock_style.view_product_btn_vertical_padding}px ${emailSetting.restock_style.view_product_btn_horizontal_padding}px`,
                                                                   textAlign: 'center',
                                                                   textDecoration: 'none'
                                                               }}>
                                                                {emailSetting.restock_content.view_product_button_text}
                                                            </a>
                                                        </td>
                                                    </tr>


                                                    <tr className="social-text-wrapper">
                                                        <td colSpan={3} className="social-text color-text-tertiary"
                                                            style={{
                                                                display: (emailSetting.restock_social.instagram !== null && emailSetting.restock_social.instagram !== "") ||
                                                                (emailSetting.restock_social.facebook !== null && emailSetting.restock_social.facebook !== "") ||
                                                                (emailSetting.restock_social.twitter !== null && emailSetting.restock_social.twitter !== "") ||
                                                                (emailSetting.restock_social.telegram !== null && emailSetting.restock_social.telegram !== "") ||
                                                                (emailSetting.restock_social.linkedin !== null && emailSetting.restock_social.linkedin !== "") ||
                                                                (emailSetting.restock_social.pinterest !== null && emailSetting.restock_social.pinterest !== "")
                                                                    ? "block" : 'none',
                                                                fontWeight: 400,
                                                                fontSize: '16px',
                                                                textAlign: 'center',
                                                                color: 'rgb(116, 124, 128)',
                                                                paddingBottom: '10px',
                                                                paddingTop: '30px'
                                                            }}>{emailSetting.restock_social.title}</td>
                                                    </tr>
                                                    <tr className="social-networks-wrapper">
                                                        <td className="social-networks"
                                                            style={{textAlign: 'center', paddingBottom: '20px'}}>
                                                            <button className="instagram bg-secondary" style={{
                                                                border: 'none',
                                                                boxSizing: 'border-box',
                                                                display: emailSetting.restock_social.instagram !== null && emailSetting.restock_social.instagram.trim() !== "" ? "inline-block" : 'none',
                                                                margin: '0px 12px',
                                                                backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color,
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%'
                                                            }}><img
                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/instagram.png"
                                                                width={12} alt="instagram"/></button>
                                                            <button className="facebook bg-secondary" style={{
                                                                border: 'none',
                                                                boxSizing: 'border-box',
                                                                display: emailSetting.restock_social.facebook !== null && emailSetting.restock_social.facebook.trim() !== "" ? "inline-block" : 'none',
                                                                margin: '0px 12px',
                                                                backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color,
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%'
                                                            }}><img
                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/facebook.png"
                                                                width={12} alt="facebook"/></button>
                                                            <button className="twitter bg-secondary" style={{
                                                                border: 'none',
                                                                boxSizing: 'border-box',
                                                                display: emailSetting.restock_social.twitter !== null && emailSetting.restock_social.twitter.trim() !== "" ? "inline-block" : 'none',
                                                                margin: '0px 12px',
                                                                backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color,
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%'
                                                            }}><img
                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/twitter.png"
                                                                width={12} alt="twitter"/></button>
                                                            <button className="telegram bg-secondary" style={{
                                                                border: 'none',
                                                                boxSizing: 'border-box',
                                                                display: emailSetting.restock_social.telegram !== null && emailSetting.restock_social.telegram.trim() !== "" ? "inline-block" : 'none',
                                                                margin: '0px 12px',
                                                                backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color,
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%'
                                                            }}><img
                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/telegram.png"
                                                                width={12} alt="telegram"/></button>
                                                            <button className="linkedin bg-secondary" style={{
                                                                border: 'none',
                                                                boxSizing: 'border-box',
                                                                display: emailSetting.restock_social.linkedin !== null && emailSetting.restock_social.linkedin.trim() !== "" ? "inline-block" : 'none',
                                                                margin: '0px 12px',
                                                                backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color,
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%'
                                                            }}><img
                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/linkedin.png"
                                                                width={12} alt="linkedin"/></button>
                                                            <button className="pinterest bg-secondary" style={{
                                                                border: 'none',
                                                                boxSizing: 'border-box',
                                                                display: emailSetting?.restock_social?.pinterest !== null && emailSetting?.restock_social?.pinterest?.trim() !== "" ? "inline-block" : 'none',
                                                                margin: '0px 12px',
                                                                backgroundColor: emailSetting.restock_style.add_to_cart_btn_bg_color,
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%'
                                                            }}><img
                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/pinterest.png"
                                                                width={12} alt="pinterest"/></button>
                                                        </td>
                                                    </tr>
                                                    {/*<tr>*/}
                                                    {/*    <td className="footer color-text-tertiary" style={{*/}
                                                    {/*        borderTop: '1px solid rgb(201, 202, 204)',*/}
                                                    {/*        fontWeight: 400,*/}
                                                    {/*        color: emailSetting.restock_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)',*/}
                                                    {/*        fontSize: '12px',*/}
                                                    {/*        lineHeight: '16px',*/}
                                                    {/*        height: '45px',*/}
                                                    {/*        textAlign: 'center',*/}
                                                    {/*        paddingTop: '8px',*/}
                                                    {/*        borderBottomRightRadius: '10px',*/}
                                                    {/*        borderBottomLeftRadius: '10px'*/}
                                                    {/*    }}>*/}
                                                    {/*        You are receiving this email because you requested a*/}
                                                    {/*        back in*/}
                                                    {/*        stock notification*/}
                                                    {/*        on {shopDetails && shopDetails.store_name}.*/}
                                                    {/*    </td>*/}
                                                    {/*</tr>*/}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    {/*<p className="unsubscribe-link" style={{textAlign: 'center'}}>If you'd like to*/}
                                    {/*    unsubscribe and stop receiving these emails from this shop click <a*/}
                                    {/*       >here</a>.*/}
                                    {/*</p>*/}
                                </div>
                            </div>
                        </LegacyCard>
                    </Layout.Section>
                    <Layout.Section>
                        <PageActions
                            primaryAction={{
                                content: 'Save',
                                onAction: saveEmailSetting,
                                loading: isLoading
                            }}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};
