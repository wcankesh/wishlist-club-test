import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
    TextField, Layout, BlockStack, Card, Divider, InlineStack,
    Text, Checkbox, Page,PageActions, Box, Button,InlineGrid
} from "@shopify/polaris";
import {
    apiService,
    baseUrl,
    capitalizeMessage,
    facebookImage,
    instagramImage,
    linkedInImage, pinterestImage,
    telegramImage,
    templateJson,
    twitterImage, upgradePayload,
} from "../../../utils/Constant";
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux";
import ToastMessage from "../../Comman/ToastMessage";
import ColorInput from "../../Comman/ColorInput";
import CustomErrorBanner from "../../Comman/CustomErrorBanner";
import SwitchButton from "../../Comman/SwitchButton";
import {AppDocsLinks} from "../../../utils/AppDocsLinks";
import {formValidate} from "../../Comman/formValidate";
import {Icons} from "../../../utils/Icons";
import {Product3} from "../../../utils/AppImages";
import EmailEditorComponent from "../../Comman/EmailEditorComponent";
import EmailTemplateMsg from "../../Comman/EmailTemplateMsg";
import ConformationModal from "../../Comman/ConformationModal";

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
    const editorRef = useRef(null);
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
            setbackInStockEmail(response.data);
            setCheckDiscount(response.data.bis_content.discount_code ? true : false);
            setMailTemplate(JSON.parse(response.data.bis_json) || templateJson);
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
        const tempObj = {...backInStockEmail.bis_content,...backInStockEmail.bis_style, bis_from_mail: backInStockEmail.bis_from_mail}
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
        ["bis_html","bis_json","thankyou_html","thankyou_json"].forEach((key) => {
            delete backInStockEmail[key];
        });
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
        formData.append("payload", JSON.stringify(newBackInStockEmail));

        if(backInStockEmail?.new_bis_template == 1){
            editorRef.current.editor.exportHtml(async (data) => {
                const {design, html} = data;
                setMailTemplate(design);
                formData.append("bis_json", JSON.stringify(design));
                formData.append("bis_html", html);

                const response = await apiService.updateBisSetting(formData)
                handleApiResponse(response);
            })
        } else {
            const response = await apiService.updateBisSetting(formData)
            handleApiResponse(response);
        };
    }

    const handleApiResponse = (response) => {
        if (response.status === 200) {
            setIsError(false)
            setMessage(capitalizeMessage(response.message))
            setIsLoading(false);
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

    const onBlur = (e) => {
        const {name, value} = e.target
        setBackInStockEmailError({...backInStockEmailError, [name]: formValidate(name, value)})
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
        const template = backInStockEmail?.new_bis_template;
        const variablesMap = {
            email_title: {
                0: "Add this {{product_name}} {{shop_name}} variable",
                1: "Add this {product_name} {shop_name} variable"
            },
            email_description: {
                0: "Add this {{shop_name}} {{product_name}} {{shop_url}} {{product_url}} variable",
                1: "Add this {shop_name} {product_name} {shop_url} {product_url} variable"
            },
            email_subject : {
                0 : 'Add this {{product_name}} {{shop_name}} variable',
                1 : 'Add this {product_name} {shop_name} variable'
            }
        };
        return variablesMap[fieldType]?.[template] || '';
    };

    const handleConfirmation = async () => {
        setIsConfirmLoading(true);
        const payload ={...upgradePayload}
        const response = await apiService.templateConfirmation(payload);
        if (response.status === 200) {
            setIsConfirmLoading(false);
            setActive((active)=>!active);
            setbackInStockEmail({...backInStockEmail,new_bis_template:1});
            setMessage(response?.message)
        } else {
            setIsConfirmLoading(false);
            setActive((active)=>!active);
            setMessage(response?.message)
        }
    }

    const handleUpgrade = () => {
        setActive(!active);
    }

    const msgArray = [
        "{shop_name}: To show the shop name",
        "{product_name}: To show product title",
        "{product_html}: To show product (required)",
        "{{unsubscribe}}: Use this tag to display the unsubscribe link",
    ];

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
                <ConformationModal
                    active={active}
                    onClose={handleUpgrade}
                    isLoading={isConfirmLoading}
                    isEditor={false}
                    handleConfirmation={handleConfirmation}
                    isEditor={true}
                />
                <Layout>
                    {message !== "" && isError === false ?
                        <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                        <CustomErrorBanner link={AppDocsLinks.article["525"]} message={message} setMessage={setMessage} setIsError={setIsError} isError={isError} />
                        <Layout.Section variant={"fullWidth"}>
                            <Card padding={"0"}>
                                <Box padding={"400"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Email Setting</Text>
                                        <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 2, xl: 2}} gap={'150'}>
                                                <TextField label="Sender Email"
                                                           value={backInStockEmail.bis_from_mail}
                                                           onChange={(value) => {handleChange({target: {name: "bis_from_mail", value}})}}
                                                           name={"bis_from_mail"}
                                                           onBlur={onBlur}
                                                           error={backInStockEmailError.bis_from_mail}
                                                           placeholder={"Sender Email"}
                                                />
                                                <TextField label={"Email Subject"}
                                                           value={backInStockEmail.bis_content.email_subject}
                                                           onChange={(value) => {bisOnChangeContent({target: {name: "email_subject", value}})}}
                                                           name={"email_subject"}
                                                           onBlur={onBlur}
                                                           error={backInStockEmailError.email_subject}
                                                           helpText={getHelpText("email_subject")}
                                                />
                                                {/*<TextField label={"Email Title"}
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
                                                           helpText={getHelpText("email_title")}
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
                                                           helpText={getHelpText("email_description")}
                                                />*/}
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
                                                />}
                                        </InlineGrid>
                                    </BlockStack>

                                </Box>
                                <Divider/>
                                <Box padding={"400"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Add to cart button customization</Text>
                                        <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 2, xl: 3}} gap={'150'}>
                                            <ColorInput label={"Button Background color"}
                                                        name="add_to_cart_btn_bg_color"
                                                        onChange={bisOnChangeStyle}
                                                        value={backInStockEmail.bis_style.add_to_cart_btn_bg_color}/>
                                            <ColorInput label={"Button Text color"}
                                                        name="add_to_cart_btn_text_color"
                                                        onChange={bisOnChangeStyle}
                                                        value={backInStockEmail.bis_style.add_to_cart_btn_text_color}/>
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
                                                       min={0}
                                                       name={"add_to_cart_btn_border_size"}
                                            />
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
                                                       max={25}
                                                       min={0}
                                                       name={"add_to_cart_btn_vertical_padding"}
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
                                                       max={25}
                                                       min={0}
                                                       name={"add_to_cart_btn_horizontal_padding"}
                                            />
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
                                                       min={0}
                                                       name={"add_to_cart_btn_border_radius"}
                                            />
                                        </InlineGrid>
                                    </BlockStack>
                                </Box>
                                <Divider/>
                                <Box padding={"400"}>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>View product button customization</Text>
                                        <InlineGrid columns={{xs: 1, sm: 1, md: 1, lg: 2, xl: 3}} gap={'150'}>
                                            <ColorInput label={"Button Background color"}
                                                        name="view_product_btn_bg_color"
                                                        onChange={bisOnChangeStyle}
                                                        value={backInStockEmail.bis_style.view_product_btn_bg_color}/>
                                            <ColorInput label={"Button Text color"}
                                                        name="view_product_btn_text_color"
                                                        onChange={bisOnChangeStyle}
                                                        value={backInStockEmail.bis_style.view_product_btn_text_color}/>
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
                                                       max={10}
                                                       min={0}
                                                       name={"view_product_btn_border_size"}
                                            />
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
                                                       max={25}
                                                       min={0}
                                                       name={"view_product_btn_vertical_padding"}
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
                                                       max={25}
                                                       min={0}
                                                       name={"view_product_btn_horizontal_padding"}
                                            />
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
                                                       max={100}
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
                                            backInStockEmail?.new_bis_template == 1 ?
                                                <div className={"email-editor-wrap"}>
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
                                                </div>
                                                : backInStockEmail?.new_bis_template == 0 ?
                                                <BlockStack gap={"400"}>
                                                        <Card padding={"0"}>
                                                            <Box padding={"400"}>
                                                                <BlockStack gap={400}>
                                                                    <InlineStack gap={400} wrap={false}>
                                                                        <div className="email-logo-preview">{Icons.email}</div>
                                                                        <BlockStack>
                                                                            <Text as={"span"} variant={"bodySm"}>
                                                                                {backInStockEmail.bis_content.email_subject}
                                                                            </Text>
                                                                            <BlockStack>
                                                                                <Text as={"span"} fontWeight={"bold"}>{shopDetails && shopDetails.store_name}</Text>
                                                                                <Text as={"span"}>{backInStockEmail.bis_from_mail}</Text>
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
                                                                                                        <img src={Product3} alt="Dacia blouse" width={470} style={{display: 'block', margin: 'auto', maxWidth: '50%', borderRadius: '10px', border: '1px solid rgb(201, 202, 204)'}}/>
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
                                                                                                                <button className="instagram bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.instagram !== null && backInStockEmail?.bis_social?.instagram.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{instagramImage}</button>
                                                                                                                <button className="facebook bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.facebook !== null && backInStockEmail.bis_social.facebook.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{facebookImage}</button>
                                                                                                                <button className="twitter bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.twitter !== null && backInStockEmail.bis_social.twitter.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{twitterImage}</button>
                                                                                                                <button className="telegram bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.telegram !== null && backInStockEmail.bis_social.telegram.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{telegramImage}</button>
                                                                                                                <button className="linkedin bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.linkedin !== null && backInStockEmail.bis_social.linkedin.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{linkedInImage}</button>
                                                                                                                <button className="pinterest bg-secondary" style={{border: 'none', boxSizing: 'border-box', display: backInStockEmail.bis_social.pinterest !== null && backInStockEmail.bis_social.pinterest.trim() !== "" ? "inline-block" : 'none', margin: '0px 12px', backgroundColor: backInStockEmail.bis_style.add_to_cart_btn_bg_color, width: '24px', height: '24px', borderRadius: '50%'}}>{pinterestImage}</button>
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
                                                        <span>
                                                            <Button onClick={handleUpgrade} variant={"primary"}>Upgrade template</Button>
                                                        </span>
                                                </BlockStack>
                                                : null
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

export default StockNotification;