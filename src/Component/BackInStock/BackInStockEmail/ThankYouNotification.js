import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
    TextField,
    Layout,
    Box,
    Card,
    InlineStack,
    BlockStack,
    Divider,
    Text,
    PageActions,
    Page,
    Button,
    InlineGrid,
    List
} from "@shopify/polaris";
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux";
import {Icons} from "../../../utils/Icons";
import {
    apiService,
    baseUrl,
    capitalizeMessage,
    facebookImage,
    instagramImage, linkedInImage, pinterestImage, telegramImage, thankYouMessageTemplateJson,
    twitterImage, upgradePayload
} from "../../../utils/Constant";
import ToastMessage from "../../Comman/ToastMessage";
import ColorInput from "../../Comman/ColorInput";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import SwitchButton from "../../Comman/SwitchButton";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {formValidate} from "../../Comman/formValidate";
import EmailEditorComponent from "../../Comman/EmailEditorComponent";
import EmailTemplateMsg from "../../Comman/EmailTemplateMsg";
import ConformationModal from "../../Comman/ConformationModal";

const initialState = {
    thankyou_from_mail: "",
    thankyou_branding_type: 1,
    thankyou_logo: null,
    thankyou_style:
        {
            background_color: "#ffffff",
            theme: "1",
            font_family: "roboto",
            title_font_size: 24,
            description_font_size: 16,
            btn_border_radius: 10,
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

const initialStateError = {
    email_subject: "",
    email_title: "",
    email_description: "",
    button_text : "",
    thankyou_from_mail : "",
}

const ThankYouNotification = () => {
    const editorRef = useRef(null);
    const navigate = useNavigate()
    const [backInStockEmail, setbackInStockEmail] = useState(initialState);
    const [backInStockEmailError, setBackInStockEmailError] = useState(initialStateError);
    const [selectedTYLogo, setSelectedTYLogo] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const [mailTemplate,setMailTemplate] = useState({});
    const [active,setActive] = useState(false);
    const [isConfirmLoading,setIsConfirmLoading] = useState(false);
    const shopDetails = useSelector((state) => state.shopDetails)

    useEffect(() => {
        getBisEmail()
    }, []);

    const getBisEmail = async () => {
        const response = await apiService.bisSetting();
        if (response.status === 200) {
            setIsError(false)
            setbackInStockEmail(response.data);
            setMailTemplate(JSON.parse(response.data?.thankyou_json) || thankYouMessageTemplateJson);
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
        const tempObj = {...backInStockEmail.thankyou_content,...backInStockEmail.thankyou_style, thankyou_from_mail: backInStockEmail.thankyou_from_mail}
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

        ["thankyou_html","thankyou_json","bis_json","bis_html"].forEach((key) => {
            delete backInStockEmail[key];
        });

        let newBackInStockEmail = {...backInStockEmail, id: backInStockEmail.id ? backInStockEmail.id : ""}
        const payload = JSON.stringify(newBackInStockEmail)

        const formData = new FormData();
        formData.append("payload", payload)
        if(backInStockEmail?.new_thankyou_template == 1){
            editorRef.current.editor.exportHtml(async (data) => {
                const {design, html} = data;
                setMailTemplate(design);
                formData.append("thankyou_json", JSON.stringify(design));
                formData.append("thankyou_html", html);

                const response = await apiService.updateBisSetting(formData)
                handleApiResponse(response);
            })
        } else {
            const response = await apiService.updateBisSetting(formData)
            handleApiResponse(response);
        }
    }

    const handleApiResponse = (response) => {
        if (response.status === 200) {
            setIsError(false)
            setMessage(capitalizeMessage(response.message))
            setIsLoading(false);
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsLoading(false);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsLoading(false);
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
        if(backInStockEmailError[name]){
            setBackInStockEmailError({...backInStockEmailError, [name]: value.trim()  ? "" : backInStockEmailError[name]})
        }
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
        if(backInStockEmailError[name]){
            setBackInStockEmailError({...backInStockEmailError, [name]: value.trim()  ? "" : backInStockEmailError[name]})
        }
    }

    const onBlur = (e) => {
        const {name, value} = e.target
        setBackInStockEmailError({...backInStockEmailError, [name]: formValidate(name, value)})
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
            setMessage(capitalizeMessage(response.message))
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
        }

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
        const template = backInStockEmail?.new_thankyou_template;
        const variablesMap = {
            email_subject : {
                0 : 'Add this {{product_name}} {{shop_name}} variable',
                1 : 'Add this {product_name} {shop_name} variable'
            }
        };
        return variablesMap[fieldType]?.[template] || '';
    };

    const handleConfirmation  = async () => {
        setIsConfirmLoading(true);
        const payload ={...upgradePayload}
        const response = await apiService.templateConfirmation(payload);
        if (response.status === 200) {
            setIsConfirmLoading(false);
            setActive((active)=>!active);
            setbackInStockEmail({...backInStockEmail,new_thankyou_template:1});
            setMessage(response?.message)
        } else {
            setIsConfirmLoading(false);
            setActive((active)=>!active);
            setMessage(response?.message)
        }
    }

    const handleUpgrade = () => {
        setActive(!active)
    }

    const msgArray = [
        '{shop_name} : To show the shop name',
        '{product_name}: To show product title',
        '{product_html}: To show continue shopping button (required)',
        '{{unsubscribe}}: Use this tag to display the unsubscribe link',
    ];

    return (
        <Fragment>
            <Page title={"Thank You Message"} backAction={{content: 'Settings', onAction: onBack}}
                  secondaryActions={
                      <Fragment>
                          <SwitchButton
                              checked={backInStockEmail.is_thankyou_email_enable == 1}
                              onChange={handleSwitch} name={"is_thankyou_email_enable"}
                          />&nbsp;&nbsp;
                          <Button variant="primary" onClick={onSaveBISEmail} loading={isLoading}> Save</Button>
                      </Fragment>
                  }
            >
                {active ? (
                    <ConformationModal
                        active={active}
                        onClose={handleUpgrade}
                        isLoading={isConfirmLoading}
                        handleConfirmation={handleConfirmation}
                        isEditor={true}
                    />
                ) : ''}

                <Layout>
                    {message !== "" && isError === false ? <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner link={AppDocsLinks.article["525"]} message={message} setMessage={setMessage} setIsError={setIsError} isError={isError}/>
                    <Layout.Section variant={"fullWidth"}>
                        <Card padding={"0"}>
                            <Box padding={"400"}>
                                <BlockStack gap={"200"}>
                                    <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}> Email Settings</Text>
                                    <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 2, xl: 2}} gap={'150'}>
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
                                                   name={"thankyou_from_mail"}
                                                   onBlur={onBlur}
                                                   error={backInStockEmailError.thankyou_from_mail}
                                        />
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
                                                   name={"button_text"}
                                                   onBlur={onBlur}
                                                   error={backInStockEmailError.button_text}
                                        />
                                        <TextField label={"Email Subject"}
                                                   value={backInStockEmail.thankyou_content.email_subject}
                                                    multiline={2}
                                                   onChange={(value) => {
                                                       tyOnChangeContent({
                                                           target: {
                                                               name: "email_subject",
                                                               value
                                                           }
                                                       })
                                                   }}
                                                   name={"email_subject"}
                                                   onBlur={onBlur}
                                                   error={backInStockEmailError.email_subject}
                                                   helpText={getHelpText('email_subject')}
                                        />
                                    </InlineGrid>
                                </BlockStack>
                            </Box>
                            <Divider/>
                            <Box padding={"400"}>
                                <BlockStack gap={"200"}>
                                    <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Shopping button customization</Text>
                                    <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 2, xl: 3}} gap={'150'}>
                                        <ColorInput label={"Button Background color"} name="btn_bg_color"
                                            onChange={tyOnChangeStyle}
                                            value={backInStockEmail.thankyou_style.btn_bg_color}/>
                                        <ColorInput label={"Button Text color"} name="btn_text_color"
                                                    onChange={tyOnChangeStyle}
                                                    value={backInStockEmail.thankyou_style.btn_text_color}/>
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
                                                   max={10}
                                                   min={0}
                                                   name={"btn_border_size"}
                                        />
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
                                                   max={25}
                                                   min={0}
                                                   name={"btn_vertical_padding"}
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
                                                   max={25}
                                                   min={0}
                                                   name={"btn_horizontal_padding"}
                                        />
                                        <TextField label="Border radius"
                                                   type="number"
                                                   value={backInStockEmail.thankyou_style.btn_border_radius}
                                                   onChange={(value) => tyOnChangeStyle({
                                                       target: {
                                                           name: "btn_border_radius",
                                                           value
                                                       }
                                                   })}
                                                   suffix="PX"
                                                   max={100}
                                                   min={0}
                                                   name={"btn_border_radius"}
                                        />
                                    </InlineGrid>
                                </BlockStack>
                            </Box>
                            <Divider/>
                            <Box padding={"400"}>
                                <BlockStack gap={"200"}>
                                    <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Email Template</Text>
                                    {
                                        backInStockEmail?.new_thankyou_template == 1 ?
                                            <BlockStack gap={100}>
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
                                        : backInStockEmail?.new_thankyou_template == 0 ?
                                            <BlockStack gap={"400"}>
                                                <Card padding={"0"}>
                                                    <Box padding={"400"}>
                                                        <BlockStack gap={400}>
                                                            <InlineStack gap={400} wrap={false}>
                                                                <div className="email-logo-preview">{Icons.email}</div>
                                                                <BlockStack>
                                                                    <Text variant={"bodySm"} as={"span"}>
                                                                        {backInStockEmail.thankyou_content.email_subject}
                                                                    </Text>
                                                                    <BlockStack>
                                                                        <Text as={"span"}
                                                                              fontWeight={"bold"}>{shopDetails && shopDetails.store_name}</Text>
                                                                        <Text
                                                                            className="d-inline-block" as={"span"}>{backInStockEmail.thankyou_from_mail}</Text>
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
                                                                     style={{fontFamily: backInStockEmail.thankyou_style.font_family}}>
                                                                    <table width="100%" border={0} cellSpacing={0} cellPadding={0}
                                                                           style={{borderCollapse: 'collapse'}}>
                                                                        <tbody>
                                                                        <tr>
                                                                            <td align="center">
                                                                                <table className="template-table" border={0} cellSpacing={0} cellPadding={0} style={{margin: '0px auto', maxWidth: '470px', borderCollapse: 'collapse'}}>
                                                                                    <thead>
                                                                                    <tr className="shop-branding-wrapper" style={{backgroundColor: backInStockEmail.thankyou_style.background_color, borderRadius: '10px 10px 0px 0px',}}>
                                                                                        <th className="shop-branding" style={{display: "flex",alignItems: "center", justifyContent: "center", color: 'rgb(32, 34, 35)', fontSize: '24px', fontWeight: 'bold', lineHeight: '28px', height: '70px', textAlign: 'center', paddingTop: '20px',}}>
                                                                                            {
                                                                                                backInStockEmail.thankyou_branding_type == "2" ?
                                                                                                    <Fragment>
                                                                                                        {selectedTYLogo && selectedTYLogo?.name ?
                                                                                                            <img src={selectedTYLogo ? URL.createObjectURL(selectedTYLogo) : ""} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                                            backInStockEmail.thankyou_logo ?
                                                                                                                <img src={backInStockEmail.thankyou_logo} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                                                <img src={""} alt="logo" style={{maxHeight: '50px'}}/>}</Fragment>
                                                                                                    :
                                                                                                    backInStockEmail.thankyou_branding_type == "1" ? shopDetails && shopDetails.store_name :
                                                                                                        <Fragment>
                                                                                                            {selectedTYLogo?.name ?
                                                                                                                <img src={selectedTYLogo ? URL.createObjectURL(selectedTYLogo) : ""} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                                                backInStockEmail.thankyou_logo ?
                                                                                                                    <img src={backInStockEmail.thankyou_logo} alt="logo" style={{maxHeight: '50px'}}/> :
                                                                                                                    <img src={""} alt="logo" style={{maxHeight: '50px'}}/>}&nbsp; {shopDetails && shopDetails.store_name}
                                                                                                        </Fragment>
                                                                                            }
                                                                                        </th>
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody className="template-body" style={{backgroundColor: backInStockEmail.thankyou_style.background_color, border: '30px solid transparent'}}>
                                                                                    <tr className="title-wrapper">
                                                                                        <td className="title color-text-primary" style={{fontSize: `${backInStockEmail.thankyou_style.title_font_size}px`, lineHeight: '32px', color: backInStockEmail.thankyou_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)', fontWeight: 400, whiteSpace: 'pre-line'}}>
                                                                                            {backInStockEmail.thankyou_content.email_title}
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr className="description-wrapper">
                                                                                        <td className="description color-text-secondary" style={{fontSize: `${backInStockEmail.thankyou_style.description_font_size}px`, lineHeight: '28px', paddingTop: '10px', color: backInStockEmail.thankyou_style.theme == "1" ? 'rgb(93, 99, 102)' : 'rgb(186, 198, 204)', whiteSpace: 'pre-line'}}>
                                                                                            {backInStockEmail.thankyou_content.email_description}
                                                                                        </td>
                                                                                    </tr>

                                                                                    <tr>
                                                                                        <td style={{paddingTop: '20px'}}>
                                                                                            <a className="buy-action-url bg-primary" style={{backgroundColor: backInStockEmail.thankyou_style.btn_bg_color, color: backInStockEmail.thankyou_style.btn_text_color, boxSizing: 'border-box', borderRadius: `${backInStockEmail.thankyou_style.btn_border_radius}px`, display: 'block', fontSize: '18px', fontWeight: 600, lineHeight: '20px', padding: `${backInStockEmail.thankyou_style.btn_vertical_padding}px ${backInStockEmail.thankyou_style.btn_horizontal_padding}px`, textAlign: 'center', textDecoration: 'none', border: `${backInStockEmail.thankyou_style.btn_border_size}px solid ${backInStockEmail.thankyou_style.btn_border_color}`}}>{backInStockEmail.thankyou_content.button_text}</a>
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
                                                                                                    <td colSpan={3} className="social-text color-text-tertiary" style={{display: (backInStockEmail.thankyou_social.instagram !== null && backInStockEmail.thankyou_social.instagram !== "") || (backInStockEmail.thankyou_social.facebook !== null && backInStockEmail.thankyou_social.facebook !== "") || (backInStockEmail.thankyou_social.twitter !== null && backInStockEmail.thankyou_social.twitter !== "") || (backInStockEmail.thankyou_social.telegram !== null && backInStockEmail.thankyou_social.telegram !== "") || (backInStockEmail.thankyou_social.linkedin !== null && backInStockEmail.thankyou_social.linkedin !== "") || (backInStockEmail.thankyou_social.pinterest !== null && backInStockEmail.thankyou_social.pinterest !== "") ? "block" : 'none', fontWeight: 400, fontSize: '16px', textAlign: 'center', color: 'rgb(116, 124, 128)', paddingBottom: '10px', paddingTop: '30px'}}>{backInStockEmail.thankyou_social.title}</td>
                                                                                                </tr>
                                                                                                <tr className="social-networks-wrapper">
                                                                                                    <td className="social-networks"
                                                                                                        style={{textAlign: 'center'}}>
                                                                                                        <button className="instagram bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.thankyou_social.instagram !== null && backInStockEmail.thankyou_social.instagram.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.thankyou_style.btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{instagramImage}</button>
                                                                                                        <button className="facebook bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.thankyou_social.facebook !== null && backInStockEmail.thankyou_social.facebook.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.thankyou_style.btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{facebookImage}</button>
                                                                                                        <button className="twitter bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.thankyou_social.twitter !== null && backInStockEmail.thankyou_social.twitter.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.thankyou_style.btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{twitterImage}</button>
                                                                                                        <button className="telegram bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.thankyou_social.telegram !== null && backInStockEmail.thankyou_social.telegram.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.thankyou_style.btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{telegramImage}</button>
                                                                                                        <button className="linkedin bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.thankyou_social.linkedin !== null && backInStockEmail.thankyou_social.linkedin.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.thankyou_style.btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{linkedInImage}</button>
                                                                                                        <button className="pinterest bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.thankyou_social.pinterest !== null && backInStockEmail.thankyou_social.pinterest.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.thankyou_style.btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{pinterestImage}</button>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </React.Fragment> : null
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
                                                <span>
                                            <Button onClick={handleUpgrade} variant={"primary"}>Upgrade template</Button>
                                        </span>
                                            </BlockStack> : null

                                    }


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

export default ThankYouNotification;