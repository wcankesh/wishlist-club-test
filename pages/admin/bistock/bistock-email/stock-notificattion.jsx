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
    Checkbox,
    Select,
    Page,
    Thumbnail,
    PageActions
} from "@shopify/polaris";
import {Icons} from "../../../../utils/Icons";
import {apiService, baseUrl} from "../../../../utils/Constant";
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux";
import {ToastMessage, ColorInput} from "../../../../components";


const initialState = {
    bis_from_mail: "",
    bis_branding_type: 1,
    bis_logo: "",
    bis_style:
        {
            primary_color: "#000000",
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

export default function StockNotification() {
    const navigate = useNavigate()
    const [backInStockEmail, setbackInStockEmail] = useState(initialState);
    const [checkDiscount, setCheckDiscount] = useState(false)
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
            setbackInStockEmail(response.data);
            setCheckDiscount(response.data.bis_content.discount_code ? true : false)
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
                if (x === "bis_logo" && selectedBISLogo && selectedBISLogo[0]) {
                    formData.append("bis_logo", selectedBISLogo[0]);
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
    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setSelectedBISLogo([acceptedFiles[0]]),
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
                (selectedBISLogo && !backInStockEmail.bis_logo) &&
                <LegacyStack alignment={"center"} vertical spacing={"tight"}>
                    <br/>
                    <br/>
                    {
                        selectedBISLogo ? <Thumbnail
                                size="small"
                                source={window.URL.createObjectURL(selectedBISLogo[0])}
                            />
                            :
                            backInStockEmail && backInStockEmail.bis_logo ?
                                <Thumbnail
                                    size="small"
                                    source={backInStockEmail.bis_logo}
                                /> : ""
                    }
                    <br/>
                    <br/>
                </LegacyStack>
            }
        </Fragment>
    );

    return (
        <Fragment>
            <ToastMessage message={message} setMessage={setMessage}/>
            <Page title={"Back-in-stock notification Email"} backAction={{content: 'Settings', onAction: onBack}}
                  primaryAction={{content: "Save", onAction: onSaveBISEmail, loading: isLoading}}>
                <Layout>
                    <Layout.Section oneHalf>
                        <LegacyCard sectioned>
                            <FormLayout>
                                <FormLayout.Group>
                                    <TextField label="Sender Email"
                                               value={backInStockEmail.bis_from_mail}
                                               onChange={(value) => {
                                                   handleChange({
                                                       target: {
                                                           name: "bis_from_mail",
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
                                <DropZone
                                    accept=".jpg,.png,.jpeg"
                                    allowMultiple={false}
                                    onDrop={handleDropZoneDrop}
                                >
                                    {uploadedFiles}
                                    {fileUpload}
                                </DropZone>}
                                <Divider/>
                                <FormLayout.Group condensed>
                                    <ColorInput label={"Primary color"} name="primary_color"
                                                onChange={bisOnChangeStyle}
                                                value={backInStockEmail.bis_style.primary_color}/>
                                    <ColorInput label={"Background color"} name="background_color"
                                                onChange={bisOnChangeStyle}
                                                value={backInStockEmail.bis_style.background_color}/>
                                </FormLayout.Group>
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
                                <Divider/>
                                <FormLayout.Group>
                                    <TextField label={"Email Subject"}
                                               multiline={2}
                                               value={backInStockEmail.bis_content.email_subject}
                                               onChange={(value) => {
                                                   bisOnChangeContent({
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
                                    />
                                </FormLayout.Group>
                                <FormLayout.Group>
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
                                               helpText={"Add this {{shop_name}} {{product_name}} {{shop_url}} {{product_url}} variable"}/>
                                </FormLayout.Group>

                                <FormLayout.Group condensed>
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
                                    <TextField type={"number"} label={"Email description font size"} suffix={"Px"}
                                               value={backInStockEmail.bis_style.description_font_size}
                                               onChange={(value) => {
                                                   bisOnChangeStyle({
                                                       target: {
                                                           name: "description_font_size",
                                                           value
                                                       }
                                                   })
                                               }}
                                    />
                                </FormLayout.Group>
                                <FormLayout.Group condensed>
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
                                    />
                                </FormLayout.Group>
                                <Divider/>
                                <Checkbox
                                    label="Discount code"
                                    checked={checkDiscount}
                                    onChange={() => setCheckDiscount(!checkDiscount)}
                                />
                                {checkDiscount &&
                                <FormLayout.Group condensed>
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
                                    <TextField label={"Discount font size"} suffix={"Px"}
                                               type="number"
                                               value={backInStockEmail.bis_style.discount_font_size}
                                               onChange={(value) => {
                                                   bisOnChangeStyle({
                                                       target: {
                                                           name: "discount_font_size",
                                                           value
                                                       }
                                                   })
                                               }}
                                    />
                                </FormLayout.Group>}
                                <Divider/>
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

                        </LegacyCard>
                    </Layout.Section>
                    <Layout.Section oneHalf>
                        <LegacyCard>
                            <LegacyCard.Section>
                                <LegacyStack alignment={"leading"}>
                                    <div className="email-logo-preview">{Icons.email}</div>
                                    <LegacyStack vertical spacing={"tight"}>
                                        <Text variant={"bodyLg"}>
                                            {backInStockEmail.bis_content.email_subject}
                                        </Text>
                                        <LegacyStack spacing={"tight"}>
                                            <Text as={"h3"}
                                                  fontWeight={"bold"}>{shopDetails && shopDetails.store_name}</Text>
                                            <Text>{backInStockEmail.bis_from_mail}</Text>
                                        </LegacyStack>
                                    </LegacyStack>
                                </LegacyStack>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <div className="email-template-live-preview-wrapper">
                                    <div className="email-template-body"
                                         style={{fontFamily: backInStockEmail.bis_style.font_family}}>
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
                                                                backgroundColor: backInStockEmail.bis_style.background_color,
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
                                                                    backInStockEmail.bis_branding_type == "2" ?
                                                                        <Fragment>{selectedBISLogo  ?
                                                                            <img
                                                                                src={selectedBISLogo ? URL.createObjectURL(selectedBISLogo[0]) : ""}
                                                                                alt="logo"
                                                                                style={{maxHeight: '50px'}}/> :
                                                                            backInStockEmail.bis_logo ?
                                                                                <img src={backInStockEmail.bis_logo}
                                                                                     alt="logo"
                                                                                     style={{maxHeight: '50px'}}/> :
                                                                                <img src={""} alt="logo"
                                                                                     style={{maxHeight: '50px'}}/>}</Fragment> :
                                                                        backInStockEmail.bis_branding_type == "1" ? shopDetails && shopDetails.store_name :
                                                                            <Fragment>{selectedBISLogo ?
                                                                                <img
                                                                                    src={selectedBISLogo ? URL.createObjectURL(selectedBISLogo[0]) : ""}
                                                                                    alt="logo"
                                                                                    style={{maxHeight: '50px'}}/> :
                                                                                backInStockEmail.bis_logo ?
                                                                                    <img src={backInStockEmail.bis_logo}
                                                                                         alt="logo"
                                                                                         style={{maxHeight: '50px'}}/>
                                                                                    : ""}&nbsp; {shopDetails && shopDetails.store_name}
                                                                            </Fragment>
                                                                }
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="template-body" style={{
                                                            backgroundColor: backInStockEmail.bis_style.background_color,
                                                            border: '30px solid transparent'
                                                        }}>
                                                        <tr className="title-wrapper">
                                                            <td className="title color-text-primary" style={{
                                                                fontSize: `${backInStockEmail.bis_style.title_font_size}px`,
                                                                lineHeight: '32px',
                                                                color: backInStockEmail.bis_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)',
                                                                fontWeight: 400,
                                                                whiteSpace: 'pre-line'
                                                            }}>
                                                                {backInStockEmail.bis_content.email_title}
                                                            </td>
                                                        </tr>
                                                        <tr className="description-wrapper">
                                                            <td className="description color-text-secondary" style={{
                                                                fontSize: `${backInStockEmail.bis_style.description_font_size}px`,
                                                                lineHeight: '28px',
                                                                paddingTop: '40px',
                                                                color: backInStockEmail.bis_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)',
                                                                whiteSpace: 'pre-line'
                                                            }}>
                                                                {backInStockEmail.bis_content.email_description}
                                                            </td>
                                                        </tr>
                                                        <tr className="discount-wrapper">
                                                            <td className="discount color-text-secondary" colSpan={3}
                                                                style={{
                                                                    whiteSpace: 'pre-line',
                                                                    fontSize: `${backInStockEmail.bis_style.discount_font_size}px`,
                                                                    paddingTop: '20px',
                                                                    lineHeight: '20px',
                                                                    color: backInStockEmail.bis_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)',
                                                                    display: checkDiscount === true ? "block" : 'none'
                                                                }}>{backInStockEmail.bis_content.discount_code}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="product-image" style={{paddingTop: '20px'}}>
                                                                <div style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    borderRadius: '10px',
                                                                    border: '1px solid rgb(201, 202, 204)'
                                                                }}>
                                                                    <img
                                                                        src="https://wishlist.thimatic-apps.com/assets/images/product3.jpg"
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
                                                                       backgroundColor: backInStockEmail.bis_style.primary_color,
                                                                       color: 'rgb(255, 255, 255)',
                                                                       boxSizing: 'border-box',
                                                                       borderRadius: '10px',
                                                                       display: 'block',
                                                                       fontSize: '18px',
                                                                       fontWeight: 600,
                                                                       lineHeight: '20px',
                                                                       padding: '20px 24px',
                                                                       textAlign: 'center',
                                                                       textDecoration: 'none'
                                                                   }}>{backInStockEmail.bis_content.add_to_cart_button_text}</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{paddingTop: '20px'}}>
                                                                <a className="visit-action-url color-primary border-primary"
                                                                   style={{
                                                                       color: backInStockEmail.bis_style.primary_color,
                                                                       border: `1px solid ${backInStockEmail.bis_style.primary_color}`,
                                                                       boxSizing: 'border-box',
                                                                       borderRadius: '10px',
                                                                       display: 'block',
                                                                       fontSize: '18px',
                                                                       fontWeight: 600,
                                                                       lineHeight: '20px',
                                                                       padding: '18px 24px',
                                                                       textAlign: 'center',
                                                                       textDecoration: 'none'
                                                                   }}>{backInStockEmail.bis_content.view_product_button_text}</a>
                                                            </td>
                                                        </tr>
                                                        <tr className="social-text-wrapper">
                                                            <td colSpan={3} className="social-text color-text-tertiary"
                                                                style={{
                                                                    display: (backInStockEmail.bis_social.instagram !== null && backInStockEmail.bis_social.instagram !== "") ||
                                                                    (backInStockEmail.bis_social.facebook !== null && backInStockEmail.bis_social.facebook !== "") ||
                                                                    (backInStockEmail.bis_social.twitter !== null && backInStockEmail.bis_social.twitter !== "") ||
                                                                    (backInStockEmail.bis_social.telegram !== null && backInStockEmail.bis_social.telegram !== "") ||
                                                                    (backInStockEmail.bis_social.linkedin !== null && backInStockEmail.bis_social.linkedin !== "") ||
                                                                    (backInStockEmail.bis_social.pinterest !== null && backInStockEmail.bis_social.pinterest !== "")
                                                                        ? "block" : 'none',
                                                                    fontWeight: 400,
                                                                    fontSize: '16px',
                                                                    textAlign: 'center',
                                                                    color: 'rgb(116, 124, 128)',
                                                                    paddingBottom: '10px',
                                                                    paddingTop: '30px'
                                                                }}>{backInStockEmail.bis_social.title}</td>
                                                        </tr>
                                                        <tr className="social-networks-wrapper">
                                                            <td className="social-networks"
                                                                style={{textAlign: 'center', paddingBottom: '20px'}}>
                                                                <button className="instagram bg-secondary" style={{
                                                                    border: 'none',
                                                                    boxSizing: 'border-box',
                                                                    display: backInStockEmail.bis_social.instagram !== null && backInStockEmail?.bis_social?.instagram.trim() !== "" ? "inline-block" : 'none',
                                                                    margin: '0px 12px',
                                                                    backgroundColor: backInStockEmail.bis_style.primary_color,
                                                                    width: '24px',
                                                                    height: '24px',
                                                                    borderRadius: '50%'
                                                                }}><img
                                                                    src="https://storage.googleapis.com/static.shopgram.io/restock-icons/instagram.png"
                                                                    width={12} alt="instagram"/></button>
                                                                <button className="facebook bg-secondary" style={{
                                                                    border: 'none',
                                                                    boxSizing: 'border-box',
                                                                    display: backInStockEmail.bis_social.facebook !== null && backInStockEmail.bis_social.facebook.trim() !== "" ? "inline-block" : 'none',
                                                                    margin: '0px 12px',
                                                                    backgroundColor: backInStockEmail.bis_style.primary_color,
                                                                    width: '24px',
                                                                    height: '24px',
                                                                    borderRadius: '50%'
                                                                }}><img
                                                                    src="https://storage.googleapis.com/static.shopgram.io/restock-icons/facebook.png"
                                                                    width={12} alt="facebook"/></button>
                                                                <button className="twitter bg-secondary" style={{
                                                                    border: 'none',
                                                                    boxSizing: 'border-box',
                                                                    display: backInStockEmail.bis_social.twitter !== null && backInStockEmail.bis_social.twitter.trim() !== "" ? "inline-block" : 'none',
                                                                    margin: '0px 12px',
                                                                    backgroundColor: backInStockEmail.bis_style.primary_color,
                                                                    width: '24px',
                                                                    height: '24px',
                                                                    borderRadius: '50%'
                                                                }}><img
                                                                    src="https://storage.googleapis.com/static.shopgram.io/restock-icons/twitter.png"
                                                                    width={12} alt="twitter"/></button>
                                                                <button className="telegram bg-secondary" style={{
                                                                    border: 'none',
                                                                    boxSizing: 'border-box',
                                                                    display: backInStockEmail.bis_social.telegram !== null && backInStockEmail.bis_social.telegram.trim() !== "" ? "inline-block" : 'none',
                                                                    margin: '0px 12px',
                                                                    backgroundColor: backInStockEmail.bis_style.primary_color,
                                                                    width: '24px',
                                                                    height: '24px',
                                                                    borderRadius: '50%'
                                                                }}><img
                                                                    src="https://storage.googleapis.com/static.shopgram.io/restock-icons/telegram.png"
                                                                    width={12} alt="telegram"/></button>
                                                                <button className="linkedin bg-secondary" style={{
                                                                    border: 'none',
                                                                    boxSizing: 'border-box',
                                                                    display: backInStockEmail.bis_social.linkedin !== null && backInStockEmail.bis_social.linkedin.trim() !== "" ? "inline-block" : 'none',
                                                                    margin: '0px 12px',
                                                                    backgroundColor: backInStockEmail.bis_style.primary_color,
                                                                    width: '24px',
                                                                    height: '24px',
                                                                    borderRadius: '50%'
                                                                }}><img
                                                                    src="https://storage.googleapis.com/static.shopgram.io/restock-icons/linkedin.png"
                                                                    width={12} alt="linkedin"/></button>
                                                                <button className="pinterest bg-secondary" style={{
                                                                    border: 'none',
                                                                    boxSizing: 'border-box',
                                                                    display: backInStockEmail.bis_social.pinterest !== null && backInStockEmail.bis_social.pinterest.trim() !== "" ? "inline-block" : 'none',
                                                                    margin: '0px 12px',
                                                                    backgroundColor: backInStockEmail.bis_style.primary_color,
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
                                                        {/*        color: backInStockEmail.bis_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)',*/}
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

