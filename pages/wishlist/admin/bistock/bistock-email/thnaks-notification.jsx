import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
    FormLayout,
    TextField,
    Layout,
    LegacyCard,
    LegacyStack,
    Divider,
    RadioButton,
    DropZone,
    Text,
    Select,
    PageActions,
    Page,
    Thumbnail
} from "@shopify/polaris";
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux";
import {Icons} from "../../../../../utils/Icons";
import {apiService, baseUrl} from "../../../../../utils/Constant";
import {ToastMessage, ColorInput} from "../../../../../components";


const initialState = {
    thankyou_from_mail: null,
    thankyou_branding_type: 1,
    thankyou_logo: null,
    thankyou_style:
        {
            background_color: "#ffffff",
            theme: "1",
            font_family: "roboto",
            title_font_size: 24,
            description_font_size: 16,
            btn_bg_color: "",
            btn_text_color: "",
            btn_border_color: "",
            btn_border_size: "",
            btn_horizontal_padding: "",
            btn_vertical_padding: "",
        }
    ,
    thankyou_social:
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
    thankyou_content:
        {
            email_subject: "Thanks for subscribing to {{product_name}}!",
            email_title: "You subscribed for {{product_name}} successfully!",
            email_description: "Dear customer, we will notify you whenever {{product_name}} becomes available.",
            button_text: "Continue shopping",
        },
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
            seconday_color: "#ffffff",
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

export default function ThankYouNotification() {
    const navigate = useNavigate()
    const [backInStockEmail, setbackInStockEmail] = useState(initialState);
    const [selectedTYLogo, setSelectedTYLogo] = useState("");
    const [selectedBISLogo, setSelectedBISLogo] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
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
        setIsLoading(false);
        const response = await apiService.bisSetting();
        if (response.status === 200) {
            setbackInStockEmail(response.data)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }


    const onSaveBISEmail = async () => {
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
                } else if (x === "thankyou_logo" && selectedTYLogo.name) {
                    formData.append("thankyou_logo", selectedTYLogo);
                } else if (x === "bis_logo" || x === "thankyou_logo") {

                } else {

                }
            }
        })
        const payload = JSON.stringify(newBackInStockEmail)
        formData.append("payload", payload)

        const response = await apiService.updateBisSetting(formData)
        if (response.status === 200) {
            setMessage(response.message)
            setIsLoading(false);
            getBisEmail();
            setSelectedTYLogo("")
            setSelectedBISLogo("")
        } else {
            setMessage(response.message)
            setIsLoading(false)
        }
    }
    const onBack = () => {
        navigate(`${baseUrl}/bistock/bistock-email`)
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setbackInStockEmail({
            ...backInStockEmail,
            [name]: value,
        })
    }
    const tyOnChangeStyle = (e) => {
        const {name, value} = e.target;
        setbackInStockEmail({
            ...backInStockEmail,
            thankyou_style: {...backInStockEmail.thankyou_style, [name]: value},

        })
    }
    const tyOnChangeContent = (e) => {
        const {name, value} = e.target;
        setbackInStockEmail({
            ...backInStockEmail,
            thankyou_content: {...backInStockEmail.thankyou_content, [name]: value},
        })
    }
    const tyOnChangeSocial = (e) => {
        const {name, value} = e.target;
        setbackInStockEmail({
            ...backInStockEmail,
            thankyou_social: {...backInStockEmail.thankyou_social, [name]: value},
        })
    }


    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setSelectedTYLogo(acceptedFiles[0]),
        [],
    );
    const fileUpload = (!selectedTYLogo && !backInStockEmail.thankyou_logo) ? <DropZone.FileUpload/> : "";
    const uploadedFiles = (
        <Fragment>
            {
                (selectedTYLogo || backInStockEmail.thankyou_logo) ?
                <LegacyStack alignment={"center"} vertical spacing={"tight"}>
                    <br/>
                    <br/>
                    {
                        selectedTYLogo ? <Thumbnail
                                size="small"
                                source={window.URL.createObjectURL(selectedTYLogo)}
                            />
                            :
                            backInStockEmail && backInStockEmail.thankyou_logo ?
                                <Thumbnail
                                    size="small"
                                    source={backInStockEmail.thankyou_logo}
                                /> : ""
                    }
                    <br/>
                    <br/>
                </LegacyStack>
                    :""
            }
        </Fragment>
    );
    return (
        <Fragment>
            <ToastMessage message={message} setMessage={setMessage}/>
            <Page title={"Thank You Message"} backAction={{content: 'Settings', onAction: onBack}}
                  primaryAction={{content: "Save", onAction: onSaveBISEmail, loading: isLoading}}>
                <Layout>
                    <Layout.Section oneHalf>
                        <LegacyCard sectioned>
                            <FormLayout>
                                <FormLayout.Group>
                                    <TextField label="Sender Email"
                                               value={backInStockEmail.thankyou_from_mail}
                                               onChange={(value) => {
                                                   handleChange({
                                                       target: {
                                                           name: "thankyou_from_mail",
                                                           value
                                                       }
                                                   })
                                               }}
                                    />
                                </FormLayout.Group>
                                <Divider/>
                                <Text> Store branding</Text>
                                <FormLayout.Group condensed>
                                    <RadioButton
                                        label="Logo"
                                        id="disabled"
                                        checked={backInStockEmail.thankyou_branding_type == '2'}
                                        value={backInStockEmail.thankyou_branding_type}
                                        onChange={() => handleChange({
                                            target: {
                                                name: "thankyou_branding_type",
                                                value: "2"
                                            }
                                        })}
                                    />
                                    <RadioButton
                                        label={"Store Name"}
                                        id="optional"
                                        checked={backInStockEmail.thankyou_branding_type == '1'}
                                        value={backInStockEmail.thankyou_branding_type}
                                        onChange={() => handleChange({
                                            target: {
                                                name: "thankyou_branding_type",
                                                value: "1"
                                            }
                                        })}
                                    />
                                    <RadioButton
                                        label={"Both"}
                                        id="both"
                                        checked={backInStockEmail.thankyou_branding_type == '3'}
                                        value={backInStockEmail.thankyou_branding_type}
                                        onChange={() => handleChange({
                                            target: {
                                                name: "thankyou_branding_type",
                                                value: "3"
                                            }
                                        })}
                                    />
                                </FormLayout.Group>
                                {(backInStockEmail.thankyou_branding_type == '2' || backInStockEmail.thankyou_branding_type == '3') &&
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
                                    <Select label={"Text color theme"} options={theme}
                                            value={backInStockEmail.thankyou_style.theme}
                                            onChange={(value) => {
                                                tyOnChangeStyle({
                                                    target: {
                                                        name: "theme",
                                                        value
                                                    }
                                                })
                                            }}
                                    />
                                    <Select label={"Font family"} options={fontFamily}
                                            value={backInStockEmail.thankyou_style.font_family}
                                            onChange={(value) => {
                                                tyOnChangeStyle({
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
                                                onChange={tyOnChangeStyle}
                                                value={backInStockEmail.thankyou_style.background_color}/>
                                    <div></div>
                                </FormLayout.Group>
                            </FormLayout>
                        </LegacyCard>
                        <LegacyCard sectioned title="Shopping Button">
                            <FormLayout>
                                <FormLayout.Group condensed>
                                    <ColorInput label={"Button Background color"} name="btn_bg_color"
                                                onChange={tyOnChangeStyle}
                                                value={backInStockEmail.thankyou_style.btn_bg_color}/>
                                    <ColorInput label={"Button Text color"} name="btn_text_color"
                                                onChange={tyOnChangeStyle}
                                                value={backInStockEmail.thankyou_style.btn_text_color}/>
                                </FormLayout.Group>
                                <FormLayout.Group condensed>
                                    <ColorInput label={"Button Border color"} name="btn_border_color"
                                                onChange={tyOnChangeStyle}
                                                value={backInStockEmail.thankyou_style.btn_border_color}/>
                                    <TextField label={"Border Width"}
                                               value={backInStockEmail.thankyou_style.btn_border_size}
                                               type="number"
                                               suffix="PX"
                                               onChange={(value) => {
                                                   tyOnChangeStyle({
                                                       target: {
                                                           name: "btn_border_size",
                                                           value
                                                       }
                                                   })
                                               }}

                                    />
                                </FormLayout.Group>
                                <FormLayout.Group condensed>
                                    <TextField label="Top & Bottom padding"
                                               type="number"
                                               value={backInStockEmail.thankyou_style.btn_vertical_padding}
                                               onChange={(value) => tyOnChangeStyle({
                                                   target: {
                                                       name: "btn_vertical_padding",
                                                       value
                                                   }
                                               })}
                                               suffix="PX"
                                    />
                                    <TextField label="Left & Right padding"
                                               type="number"
                                               value={backInStockEmail.thankyou_style.btn_horizontal_padding}
                                               onChange={(value) => tyOnChangeStyle({
                                                   target: {
                                                       name: "btn_horizontal_padding",
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

                                <FormLayout.Group>
                                    <TextField label={"Email Subject"}
                                               multiline={2}
                                               value={backInStockEmail.thankyou_content.email_subject}
                                               onChange={(value) => {
                                                   tyOnChangeContent({
                                                       target: {
                                                           name: "email_subject",
                                                           value
                                                       }
                                                   })
                                               }}
                                               helpText={"Add this {{product_name}} {{shop_name}} variable"}
                                    />
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <TextField label={"Email Title"}
                                               multiline={2}
                                               value={backInStockEmail.thankyou_content.email_title}
                                               onChange={(value) => {
                                                   tyOnChangeContent({
                                                       target: {
                                                           name: "email_title",
                                                           value
                                                       }
                                                   })
                                               }}
                                               helpText={"Add this {{product_name}} {{shop_name}} variable"}
                                    />
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <TextField label={"Email Description"}
                                               multiline={2}
                                               value={backInStockEmail.thankyou_content.email_description}
                                               onChange={(value) => {
                                                   tyOnChangeContent({
                                                       target: {
                                                           name: "email_description",
                                                           value
                                                       }
                                                   })
                                               }}
                                               helpText={"Add this {{shop_name}} {{product_name}} {{shop_url}} {{product_url}} variable"}/>
                                </FormLayout.Group>

                                <FormLayout.Group condensed>
                                    <TextField type={"number"} label={"Email title font size"} suffix={"Px"}
                                               value={backInStockEmail.thankyou_style.title_font_size}
                                               onChange={(value) => {
                                                   tyOnChangeStyle({
                                                       target: {
                                                           name: "title_font_size",
                                                           value
                                                       }
                                                   })
                                               }}
                                    />
                                    <TextField type={"number"} label={"Email description font size"} suffix={"Px"}
                                               value={backInStockEmail.thankyou_style.description_font_size}
                                               onChange={(value) => {
                                                   tyOnChangeStyle({
                                                       target: {
                                                           name: "description_font_size",
                                                           value
                                                       }
                                                   })
                                               }}
                                    />
                                </FormLayout.Group>
                                <Divider/>
                                <TextField label={'"Continue shopping" label'}
                                           value={backInStockEmail.thankyou_content.button_text}
                                           onChange={(value) => {
                                               tyOnChangeContent({
                                                   target: {
                                                       name: "button_text",
                                                       value
                                                   }
                                               })
                                           }}
                                />
                                <Divider/>
                                <TextField label={"Social networks title"}
                                           value={backInStockEmail.thankyou_social.title}
                                           onChange={(value) => {
                                               tyOnChangeSocial({
                                                   target: {
                                                       name: "title",
                                                       value
                                                   }
                                               })
                                           }}
                                />
                                <FormLayout.Group condensed>
                                    <TextField label={"Instagram"} prefix={"@"}
                                               value={backInStockEmail.thankyou_social.instagram}
                                               onChange={(value) => {
                                                   tyOnChangeSocial({
                                                       target: {
                                                           name: "instagram",
                                                           value
                                                       }
                                                   })
                                               }}
                                    />
                                    <TextField label={"Facebook"} prefix={"@"}
                                               value={backInStockEmail.thankyou_social.facebook}
                                               onChange={(value) => {
                                                   tyOnChangeSocial({
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
                                               value={backInStockEmail.thankyou_social.twitter}
                                               onChange={(value) => {
                                                   tyOnChangeSocial({
                                                       target: {
                                                           name: "twitter",
                                                           value
                                                       }
                                                   })
                                               }}
                                    />
                                    <TextField label={"Telegram"} prefix={"@"}
                                               value={backInStockEmail.thankyou_social.telegram}
                                               onChange={(value) => {
                                                   tyOnChangeSocial({
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
                                               value={backInStockEmail.thankyou_social.linkedin}
                                               onChange={(value) => {
                                                   tyOnChangeSocial({
                                                       target: {
                                                           name: "linkedin",
                                                           value
                                                       }
                                                   })
                                               }}
                                    />
                                    <TextField label={"Pinterest"}
                                               value={backInStockEmail.thankyou_social.pinterest}
                                               onChange={(value) => {
                                                   tyOnChangeSocial({
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
                        <LegacyCard>
                            <LegacyCard.Section>
                                <LegacyStack alignment={"leading"}>
                                    <div className="email-logo-preview">{Icons.email}</div>
                                    <LegacyStack vertical spacing={"tight"}>
                                        <Text variant={"bodyLg"}>
                                            {backInStockEmail.thankyou_content.email_subject}
                                        </Text>
                                        <LegacyStack spacing={"tight"}>
                                            <Text as={"h3"}
                                                  fontWeight={"bold"}>{shopDetails && shopDetails.store_name}</Text>
                                            <Text
                                                className="d-inline-block">{backInStockEmail.thankyou_from_mail}</Text>
                                        </LegacyStack>
                                    </LegacyStack>
                                </LegacyStack>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <div className="email-template-live-preview-wrapper">
                                    <div className="email-template-body"
                                         style={{fontFamily: backInStockEmail.thankyou_style.font_family}}>
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
                                                            <th className="shop-branding" style={{
                                                                backgroundColor: backInStockEmail.thankyou_style.background_color,
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
                                                                    backInStockEmail.thankyou_branding_type == "2" ?
                                                                        <Fragment>
                                                                            {selectedTYLogo && selectedTYLogo?.name ?
                                                                                <img
                                                                                    src={selectedTYLogo ? URL.createObjectURL(selectedTYLogo) : ""}
                                                                                    alt="logo"
                                                                                    style={{maxHeight: '50px'}}/>
                                                                                :
                                                                                backInStockEmail.thankyou_logo ?
                                                                                    <img
                                                                                        src={backInStockEmail.thankyou_logo}
                                                                                        alt="logo"
                                                                                        style={{maxHeight: '50px'}}/>
                                                                                    :
                                                                                    <img src={""} alt="logo"
                                                                                         style={{maxHeight: '50px'}}/>}</Fragment>
                                                                        :
                                                                        backInStockEmail.thankyou_branding_type == "1" ? shopDetails && shopDetails.store_name :
                                                                            <Fragment>
                                                                                {selectedTYLogo?.name ?
                                                                                    <img
                                                                                        src={selectedTYLogo ? URL.createObjectURL(selectedTYLogo) : ""}
                                                                                        alt="logo"
                                                                                        style={{maxHeight: '50px'}}/> :
                                                                                    backInStockEmail.thankyou_logo ?
                                                                                        <img
                                                                                            src={backInStockEmail.thankyou_logo}
                                                                                            alt="logo"
                                                                                            style={{maxHeight: '50px'}}/> :
                                                                                        <img src={""} alt="logo"
                                                                                             style={{maxHeight: '50px'}}/>}&nbsp; {shopDetails && shopDetails.store_name}
                                                                            </Fragment>
                                                                }
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="template-body" style={{
                                                            backgroundColor: backInStockEmail.thankyou_style.background_color,
                                                            border: '30px solid transparent'
                                                        }}>
                                                        <tr className="title-wrapper">
                                                            <td className="title color-text-primary" style={{
                                                                fontSize: `${backInStockEmail.thankyou_style.title_font_size}px`,
                                                                lineHeight: '32px',
                                                                color: backInStockEmail.thankyou_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)',
                                                                fontWeight: 400,
                                                                whiteSpace: 'pre-line'
                                                            }}>
                                                                {backInStockEmail.thankyou_content.email_title}
                                                            </td>
                                                        </tr>
                                                        <tr className="description-wrapper">
                                                            <td className="description color-text-secondary" style={{
                                                                fontSize: `${backInStockEmail.thankyou_style.description_font_size}px`,
                                                                lineHeight: '28px',
                                                                paddingTop: '40px',
                                                                color: backInStockEmail.thankyou_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)',
                                                                whiteSpace: 'pre-line'
                                                            }}>
                                                                {backInStockEmail.thankyou_content.email_description}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td style={{paddingTop: '20px'}}>
                                                                <a className="buy-action-url bg-primary"
                                                                   style={{
                                                                       backgroundColor: backInStockEmail.thankyou_style.btn_bg_color,
                                                                       color: backInStockEmail.thankyou_style.btn_text_color,
                                                                       boxSizing: 'border-box',
                                                                       borderRadius: '10px',
                                                                       display: 'block',
                                                                       fontSize: '18px',
                                                                       fontWeight: 600,
                                                                       lineHeight: '20px',
                                                                       padding: `${backInStockEmail.thankyou_style.btn_vertical_padding}px ${backInStockEmail.thankyou_style.btn_horizontal_padding}px`,
                                                                       textAlign: 'center',
                                                                       textDecoration: 'none',
                                                                       border: `${backInStockEmail.thankyou_style.btn_border_size}px solid ${backInStockEmail.thankyou_style.btn_border_color}`
                                                                   }}>{backInStockEmail.thankyou_content.button_text}</a>
                                                            </td>
                                                        </tr>
                                                        {
                                                            (backInStockEmail.thankyou_social.instagram !== null && backInStockEmail.thankyou_social.instagram !== "") ||
                                                            (backInStockEmail.thankyou_social.facebook !== null && backInStockEmail.thankyou_social.facebook !== "") ||
                                                            (backInStockEmail.thankyou_social.twitter !== null && backInStockEmail.thankyou_social.twitter !== "") ||
                                                            (backInStockEmail.thankyou_social.telegram !== null && backInStockEmail.thankyou_social.telegram !== "") ||
                                                            (backInStockEmail.thankyou_social.linkedin !== null && backInStockEmail.thankyou_social.linkedin !== "") ||
                                                            (backInStockEmail.thankyou_social.pinterest !== null && backInStockEmail.thankyou_social.pinterest !== "") ?
                                                                <React.Fragment>
                                                                    <tr className="social-text-wrapper">
                                                                        <td colSpan={3}
                                                                            className="social-text color-text-tertiary"
                                                                            style={{
                                                                                display: (backInStockEmail.thankyou_social.instagram !== null && backInStockEmail.thankyou_social.instagram !== "") ||
                                                                                (backInStockEmail.thankyou_social.facebook !== null && backInStockEmail.thankyou_social.facebook !== "") ||
                                                                                (backInStockEmail.thankyou_social.twitter !== null && backInStockEmail.thankyou_social.twitter !== "") ||
                                                                                (backInStockEmail.thankyou_social.telegram !== null && backInStockEmail.thankyou_social.telegram !== "") ||
                                                                                (backInStockEmail.thankyou_social.linkedin !== null && backInStockEmail.thankyou_social.linkedin !== "") ||
                                                                                (backInStockEmail.thankyou_social.pinterest !== null && backInStockEmail.thankyou_social.pinterest !== "")
                                                                                    ? "block" : 'none',
                                                                                fontWeight: 400,
                                                                                fontSize: '16px',
                                                                                textAlign: 'center',
                                                                                color: 'rgb(116, 124, 128)',
                                                                                paddingBottom: '10px',
                                                                                paddingTop: '30px'
                                                                            }}>{backInStockEmail.thankyou_social.title}</td>
                                                                    </tr>
                                                                    <tr className="social-networks-wrapper">
                                                                        <td className="social-networks"
                                                                            style={{textAlign: 'center'}}>
                                                                            <button className="instagram bg-secondary"
                                                                                    style={{
                                                                                        border: 'none',
                                                                                        boxSizing: 'border-box',
                                                                                        display: backInStockEmail.thankyou_social.instagram !== null && backInStockEmail.thankyou_social.instagram.trim() !== "" ? "inline-block" : 'none',
                                                                                        margin: '0px 12px',
                                                                                        backgroundColor: backInStockEmail.thankyou_style.btn_bg_color,
                                                                                        width: '24px',
                                                                                        height: '24px',
                                                                                        borderRadius: '50%'
                                                                                    }}><img
                                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/instagram.png"
                                                                                width={12} alt="instagram"/></button>
                                                                            <button className="facebook bg-secondary"
                                                                                    style={{
                                                                                        border: 'none',
                                                                                        boxSizing: 'border-box',
                                                                                        display: backInStockEmail.thankyou_social.facebook !== null && backInStockEmail.thankyou_social.facebook.trim() !== "" ? "inline-block" : 'none',
                                                                                        margin: '0px 12px',
                                                                                        backgroundColor: backInStockEmail.thankyou_style.btn_bg_color,
                                                                                        width: '24px',
                                                                                        height: '24px',
                                                                                        borderRadius: '50%'
                                                                                    }}><img
                                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/facebook.png"
                                                                                width={12} alt="facebook"/></button>
                                                                            <button className="twitter bg-secondary"
                                                                                    style={{
                                                                                        border: 'none',
                                                                                        boxSizing: 'border-box',
                                                                                        display: backInStockEmail.thankyou_social.twitter !== null && backInStockEmail.thankyou_social.twitter.trim() !== "" ? "inline-block" : 'none',
                                                                                        margin: '0px 12px',
                                                                                        backgroundColor: backInStockEmail.thankyou_style.btn_bg_color,
                                                                                        width: '24px',
                                                                                        height: '24px',
                                                                                        borderRadius: '50%'
                                                                                    }}><img
                                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/twitter.png"
                                                                                width={12} alt="twitter"/></button>
                                                                            <button className="telegram bg-secondary"
                                                                                    style={{
                                                                                        border: 'none',
                                                                                        boxSizing: 'border-box',
                                                                                        display: backInStockEmail.thankyou_social.telegram !== null && backInStockEmail.thankyou_social.telegram.trim() !== "" ? "inline-block" : 'none',
                                                                                        margin: '0px 12px',
                                                                                        backgroundColor: backInStockEmail.thankyou_style.btn_bg_color,
                                                                                        width: '24px',
                                                                                        height: '24px',
                                                                                        borderRadius: '50%'
                                                                                    }}><img
                                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/telegram.png"
                                                                                width={12} alt="telegram"/></button>
                                                                            <button className="linkedin bg-secondary"
                                                                                    style={{
                                                                                        border: 'none',
                                                                                        boxSizing: 'border-box',
                                                                                        display: backInStockEmail.thankyou_social.linkedin !== null && backInStockEmail.thankyou_social.linkedin.trim() !== "" ? "inline-block" : 'none',
                                                                                        margin: '0px 12px',
                                                                                        backgroundColor: backInStockEmail.thankyou_style.btn_bg_color,
                                                                                        width: '24px',
                                                                                        height: '24px',
                                                                                        borderRadius: '50%'
                                                                                    }}><img
                                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/linkedin.png"
                                                                                width={12} alt="linkedin"/></button>
                                                                            <button className="pinterest bg-secondary"
                                                                                    style={{
                                                                                        border: 'none',
                                                                                        boxSizing: 'border-box',
                                                                                        display: backInStockEmail.thankyou_social.pinterest !== null && backInStockEmail.thankyou_social.pinterest.trim() !== "" ? "inline-block" : 'none',
                                                                                        margin: '0px 12px',
                                                                                        backgroundColor: backInStockEmail.thankyou_style.btn_bg_color,
                                                                                        width: '24px',
                                                                                        height: '24px',
                                                                                        borderRadius: '50%'
                                                                                    }}><img
                                                                                src="https://storage.googleapis.com/static.shopgram.io/restock-icons/pinterest.png"
                                                                                width={12} alt="pinterest"/></button>
                                                                        </td>
                                                                    </tr>
                                                                </React.Fragment> : null
                                                        }


                                                        {/*<tr>*/}
                                                        {/*    <td className="footer color-text-tertiary" style={{*/}
                                                        {/*        borderTop: '1px solid rgb(201, 202, 204)',*/}
                                                        {/*        fontWeight: 400,*/}
                                                        {/*        color: backInStockEmail.thankyou_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)',*/}
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
                                        {/*    unsubscribe and stop receiving these emails from this shop click <a>here</a>.*/}
                                        {/*</p>*/}
                                    </div>
                                </div>
                            </LegacyCard.Section>
                        </LegacyCard>
                    </Layout.Section>
                    <Layout.Section>
                        <PageActions
                            primaryAction={{
                                content: 'Save',
                                onAction: onSaveBISEmail,
                                loading: isLoading
                            }}
                        />
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

