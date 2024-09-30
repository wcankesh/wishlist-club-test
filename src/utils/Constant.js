import {ApiService} from "./ApiService"
import {Facebook, Instagram, LinkedIn, Pinterest, Telegram, Twitter} from "./AppImages";
import React from "react";

export const baseUrl = "/wishlist/admin"

export const apiService = new ApiService();

export const secondaryButton = "Polaris-ActionMenu-SecondaryAction";

export const openUrlInNewWindow = (url, target = "_blank") => {
    return url ? window.open(url, target) : console.error("URL is missing.");
};

export const facebookImage = (<img src={Facebook} width={12} alt={"facebook"}/>);
export const instagramImage = (<img src={Instagram} width={12} alt={"instagram"}/>);
export const twitterImage = (<img src={Twitter} width={12} alt={"twitter"}/>);
export const telegramImage = (<img src={Telegram} width={12} alt={"telegram"}/>);
export const linkedInImage = (<img src={LinkedIn} width={12} alt={"linkedIn"}/>);
export const pinterestImage = (<img src={Pinterest} width={12} alt={"pinterest"}/>);

export const validateForm = (formState, setError, formValidate) => {
    let validationErrors = {};
    Object.keys(formState).forEach((name) => {
        const error = formValidate(name, formState[name]);
        if (error && error.length > 0) {
            validationErrors[name] = error;
        }
    });
    if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
        return true;
    }
    return false;
};

export const isChecked = (value) => {
    if (typeof value === "string") {
        return value === "1" || value === "true";
    } else if (typeof value === "number") {
        return value === 1;
    } else if (typeof value === "boolean") {
        return value;
    }
    return false;
};

export const toggleFlag = (value, negate = false) => {
    const normalizedValue = value === 'true' || value === '1' || value === 1 || value === true;
    // Negate value
    if (negate) {
        if (typeof value === 'string') {
            if (value === '0' || value === '1') return '0';
            if (value === 'false' || value === 'true') return 'false';
        } else if (typeof value === 'number') {
            if (value === 0 || value === 1) return 0;
        } else if (typeof value === 'boolean') {
            return false;
        }
    }
    // Toggle value
    if (typeof value === 'string') {
        if (value === '0' || value === '1') {
            return value === '0' ? '1' : '0';
        } else if (value === 'false' || value === 'true') {
            return value === 'false' ? 'true' : 'false';
        }
    } else if (typeof value === 'number') {
        return value === 0 ? 1 : 0;
    } else if (typeof value === 'boolean') {
        return !value;
    }
    // Default toggle for unexpected input types
    return normalizedValue ? '0' : '1';
};

export const LabelWrapper = ({label}) => {
    return (
        <div className="Polaris-Labelled__LabelWrapper">
            <div className="Polaris-Label">
                <label id=":Rq6:Label" htmlFor=":Rq6:" className="Polaris-Label__Text">
                    <span className="Polaris-Text--root Polaris-Text--bodyMd">{label}</span>
                </label>
            </div>
        </div>
    )
};

export const checkRecordUpdate = (newRecord, oldRecord) => {
    if (JSON.stringify(newRecord) !== JSON.stringify(oldRecord)) {
        return true
    } else {
        return false
    }
}

export const capitalizeMessage = (message) => {
    return (message || "").split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export const currencySymbol = {
    AED: 'د.إ',
    AFN: '؋',
    ALL: 'L',
    AMD: '֏',
    ANG: 'ƒ',
    AOA: 'Kz',
    ARS: '$',
    AUD: '$',
    AWG: 'ƒ',
    AZN: '₼',
    BAM: 'KM',
    BBD: '$',
    BDT: '৳',
    BGN: 'лв',
    BHD: '.د.ب',
    BIF: 'FBu',
    BMD: '$',
    BND: '$',
    BOB: '$b',
    BOV: 'BOV',
    BRL: 'R$',
    BSD: '$',
    BTC: '₿',
    BTN: 'Nu.',
    BWP: 'P',
    BYN: 'Br',
    BYR: 'Br',
    BZD: 'BZ$',
    CAD: '$',
    CDF: 'FC',
    CHE: 'CHE',
    CHF: 'CHF',
    CHW: 'CHW',
    CLF: 'CLF',
    CLP: '$',
    CNY: '¥',
    COP: '$',
    COU: 'COU',
    CRC: '₡',
    CUC: '$',
    CUP: '₱',
    CVE: '$',
    CZK: 'Kč',
    DJF: 'Fdj',
    DKK: 'kr',
    DOP: 'RD$',
    DZD: 'دج',
    EEK: 'kr',
    EGP: '£',
    ERN: 'Nfk',
    ETB: 'Br',
    ETH: 'Ξ',
    EUR: '€',
    FJD: '$',
    FKP: '£',
    GBP: '£',
    GEL: '₾',
    GGP: '£',
    GHC: '₵',
    GHS: 'GH₵',
    GIP: '£',
    GMD: 'D',
    GNF: 'FG',
    GTQ: 'Q',
    GYD: '$',
    HKD: '$',
    HNL: 'L',
    HRK: 'kn',
    HTG: 'G',
    HUF: 'Ft',
    IDR: 'Rp',
    ILS: '₪',
    IMP: '£',
    INR: '₹',
    IQD: 'ع.د',
    IRR: '﷼',
    ISK: 'kr',
    JEP: '£',
    JMD: 'J$',
    JOD: 'JD',
    JPY: '¥',
    KES: 'KSh',
    KGS: 'лв',
    KHR: '៛',
    KMF: 'CF',
    KPW: '₩',
    KRW: '₩',
    KWD: 'KD',
    KYD: '$',
    KZT: '₸',
    LAK: '₭',
    LBP: '£',
    LKR: '₨',
    LRD: '$',
    LSL: 'M',
    LTC: 'Ł',
    LTL: 'Lt',
    LVL: 'Ls',
    LYD: 'LD',
    MAD: 'MAD',
    MDL: 'lei',
    MGA: 'Ar',
    MKD: 'ден',
    MMK: 'K',
    MNT: '₮',
    MOP: 'MOP$',
    MRO: 'UM',
    MRU: 'UM',
    MUR: '₨',
    MVR: 'Rf',
    MWK: 'MK',
    MXN: '$',
    MXV: 'MXV',
    MYR: 'RM',
    MZN: 'MT',
    NAD: '$',
    NGN: '₦',
    NIO: 'C$',
    NOK: 'kr',
    NPR: '₨',
    NZD: '$',
    OMR: '﷼',
    PAB: 'B/.',
    PEN: 'S/.',
    PGK: 'K',
    PHP: '₱',
    PKR: '₨',
    PLN: 'zł',
    PYG: 'Gs',
    QAR: '﷼',
    RMB: '￥',
    RON: 'lei',
    RSD: 'Дин.',
    RUB: '₽',
    RWF: 'R₣',
    SAR: '﷼',
    SBD: '$',
    SCR: '₨',
    SDG: 'ج.س.',
    SEK: 'kr',
    SGD: 'S$',
    SHP: '£',
    SLL: 'Le',
    SOS: 'S',
    SRD: '$',
    SSP: '£',
    STD: 'Db',
    STN: 'Db',
    SVC: '$',
    SYP: '£',
    SZL: 'E',
    THB: '฿',
    TJS: 'SM',
    TMT: 'T',
    TND: 'د.ت',
    TOP: 'T$',
    TRL: '₤',
    TRY: '₺',
    TTD: 'TT$',
    TVD: '$',
    TWD: 'NT$',
    TZS: 'TSh',
    UAH: '₴',
    UGX: 'USh',
    USD: '$',
    UYI: 'UYI',
    UYU: '$U',
    UYW: 'UYW',
    UZS: 'лв',
    VEF: 'Bs',
    VES: 'Bs.S',
    VND: '₫',
    VUV: 'VT',
    WST: 'WS$',
    XAF: 'FCFA',
    XBT: 'Ƀ',
    XCD: '$',
    XOF: 'CFA',
    XPF: '₣',
    XSU: 'Sucre',
    XUA: 'XUA',
    YER: '﷼',
    ZAR: 'R',
    ZMW: 'ZK',
    ZWD: 'Z$',
    ZWL: '$'
}

export const templateJson = {
    "body": {
        "id": "tvzACkHHrb",
        "rows": [
            {
                "id": "DQ-nz8OiK4",
                "cells": [1],
                "columns": [
                    {
                        "id": "8Ml9DnjW8t",
                        "contents": [
                            {
                                "id": "hp1Mb9VXWY",
                                "type": "image",
                                "values": {
                                    "containerPadding": "10px",
                                    "anchor": "",
                                    "src": {
                                        "url": "https://images.unlayer.com/projects%2F0%2F1615899240499-3479669.jpg",
                                        "width": 1500,
                                        "height": 1000,
                                        "autoWidth": false,
                                        "maxWidth": "100%"
                                    },
                                    "textAlign": "center",
                                    "altText": "Image",
                                    "action": {
                                        "name": "web",
                                        "values": {
                                            "href": "",
                                            "target": "_blank"
                                        }
                                    },
                                    "hideDesktop": false,
                                    "displayCondition": null,
                                    "_meta": {
                                        "htmlID": "u_content_image_1",
                                        "htmlClassNames": "u_content_image"
                                    },
                                    "selectable": true,
                                    "draggable": true,
                                    "duplicatable": true,
                                    "deletable": true,
                                    "hideable": true,
                                    "hideMobile": false
                                }
                            },
                            {
                                "id": "43LZmbRuGs",
                                "type": "text",
                                "values": {
                                    "containerPadding": "10px",
                                    "anchor": "",
                                    "fontSize": "14px",
                                    "textAlign": "left",
                                    "lineHeight": "140%",
                                    "linkStyle": {
                                        "inherit": true,
                                        "linkColor": "#0000ee",
                                        "linkHoverColor": "#0000ee",
                                        "linkUnderline": true,
                                        "linkHoverUnderline": true,
                                        "body": false
                                    },
                                    "hideDesktop": false,
                                    "displayCondition": null,
                                    "_meta": {
                                        "htmlID": "u_content_text_12",
                                        "htmlClassNames": "u_content_text"
                                    },
                                    "selectable": true,
                                    "draggable": true,
                                    "duplicatable": true,
                                    "deletable": true,
                                    "hideable": true,
                                    "hideMobile": false,
                                    "text": "<p style=\"font-size: 14px; line-height: 140%;\">{shop_name},</p>\n<p style=\"font-size: 14px; line-height: 140%;\"> </p>\n<p style=\"font-size: 14px; line-height: 140%;\"> </p>\n<p style=\"font-size: 14px; line-height: 140%;\">Thank you for ordering our product it was a pleasure serving you. We appreciate your purchase with us, and we'd like to know more about your online shopping experience. With your help, we can make our products even better! So left the rating and your personal experience.</p>\n<p style=\"font-size: 14px; line-height: 140%;\"> </p>\n<p style=\"font-size: 14px; line-height: 140%;\">{product_html}</p>"
                                },
                                "hasDeprecatedFontControls": true
                            }
                        ],
                        "values": {
                            "backgroundColor": "",
                            "padding": "0px",
                            "border": {
                                "borderTopWidth": "1px",
                                "borderTopStyle": "solid",
                                "borderTopColor": "#cccccc",
                                "borderLeftWidth": "1px",
                                "borderLeftStyle": "solid",
                                "borderLeftColor": "#cccccc",
                                "borderRightWidth": "1px",
                                "borderRightStyle": "solid",
                                "borderRightColor": "#cccccc",
                                "borderBottomWidth": "1px",
                                "borderBottomStyle": "solid",
                                "borderBottomColor": "#cccccc"
                            },
                            "_meta": {
                                "htmlID": "u_column_3",
                                "htmlClassNames": "u_column"
                            }
                        }
                    }
                ],
                "values": {
                    "displayCondition": null,
                    "columns": false,
                    "backgroundColor": "#ffffff",
                    "columnsBackgroundColor": "#ffffff",
                    "backgroundImage": {
                        "url": "",
                        "fullWidth": true,
                        "repeat": "no-repeat",
                        "size": "custom",
                        "position": "top-center",
                        "customPosition": ["50%", "0%"]
                    },
                    "padding": "0px",
                    "anchor": "",
                    "hideDesktop": false,
                    "_meta": {
                        "htmlID": "u_row_3",
                        "htmlClassNames": "u_row"
                    },
                    "selectable": true,
                    "draggable": true,
                    "duplicatable": true,
                    "deletable": true,
                    "hideable": true,
                    "hideMobile": false,
                    "noStackMobile": false
                }
            }
        ],
        "headers": [],
        "footers": [],
        "values": {
            "popupPosition": "center",
            "popupWidth": "600px",
            "popupHeight": "auto",
            "borderRadius": "10px",
            "contentAlign": "center",
            "contentVerticalAlign": "center",
            "contentWidth": "700px",
            "fontFamily": {
                "label": "Arial",
                "value": "arial,helvetica,sans-serif"
            },
            "textColor": "#000000",
            "popupBackgroundColor": "#FFFFFF",
            "popupBackgroundImage": {
                "url": "",
                "fullWidth": true,
                "repeat": "no-repeat",
                "size": "cover",
                "position": "center"
            },
            "popupOverlay_backgroundColor": "rgba(0, 0, 0, 0.1)",
            "popupCloseButton_position": "top-right",
            "popupCloseButton_backgroundColor": "#DDDDDD",
            "popupCloseButton_iconColor": "#000000",
            "popupCloseButton_borderRadius": "0px",
            "popupCloseButton_margin": "0px",
            "popupCloseButton_action": {
                "name": "close_popup",
                "attrs": {
                    "onClick": "document.querySelector('.u-popup-container').style.display = 'none';"
                }
            },
            "backgroundColor": "#ffffff",
            "preheaderText": "",
            "linkStyle": {
                "body": true,
                "linkColor": "#0000ee",
                "linkHoverColor": "#0000ee",
                "linkUnderline": true,
                "linkHoverUnderline": true
            },
            "backgroundImage": {
                "url": "",
                "fullWidth": true,
                "repeat": "no-repeat",
                "size": "custom",
                "position": "top-center",
                "customPosition": ["50%", "0%"]
            },
            "_meta": {
                "htmlID": "u_body",
                "htmlClassNames": "u_body"
            }
        }
    },
    "counters": {
        "u_column": 5,
        "u_row": 5,
        "u_content_html": 1,
        "u_content_image": 2,
        "u_content_text": 12
    },
    "schemaVersion": 16
};

export const thankYouMessageTemplateJson = {
    "body": {
        "id": "tvzACkHHrb",
        "rows": [
            {
                "id": "DQ-nz8OiK4",
                "cells": [1],
                "columns": [
                    {
                        "id": "8Ml9DnjW8t",
                        "contents": [
                            {
                                "id": "hp1Mb9VXWY",
                                "type": "image",
                                "values": {
                                    "containerPadding": "10px",
                                    "anchor": "",
                                    "src": {
                                        "url": "https://images.unlayer.com/projects%2F0%2F1615899240499-3479669.jpg",
                                        "width": 1500,
                                        "height": 1000,
                                        "autoWidth": false,
                                        "maxWidth": "100%"
                                    },
                                    "textAlign": "center",
                                    "altText": "Image",
                                    "action": {
                                        "name": "web",
                                        "values": {
                                            "href": "",
                                            "target": "_blank"
                                        }
                                    },
                                    "hideDesktop": false,
                                    "displayCondition": null,
                                    "_meta": {
                                        "htmlID": "u_content_image_1",
                                        "htmlClassNames": "u_content_image"
                                    },
                                    "selectable": true,
                                    "draggable": true,
                                    "duplicatable": true,
                                    "deletable": true,
                                    "hideable": true,
                                    "hideMobile": false
                                }
                            },
                            {
                                "id": "43LZmbRuGs",
                                "type": "text",
                                "values": {
                                    "containerPadding": "10px",
                                    "anchor": "",
                                    "fontSize": "14px",
                                    "textAlign": "left",
                                    "lineHeight": "140%",
                                    "linkStyle": {
                                        "inherit": true,
                                        "linkColor": "#0000ee",
                                        "linkHoverColor": "#0000ee",
                                        "linkUnderline": true,
                                        "linkHoverUnderline": true,
                                        "body": false
                                    },
                                    "hideDesktop": false,
                                    "displayCondition": null,
                                    "_meta": {
                                        "htmlID": "u_content_text_12",
                                        "htmlClassNames": "u_content_text"
                                    },
                                    "selectable": true,
                                    "draggable": true,
                                    "duplicatable": true,
                                    "deletable": true,
                                    "hideable": true,
                                    "hideMobile": false,
                                    "text": "<p style=\"font-size: 14px; line-height: 140%;\">{shop_name},</p>\n<br>\n<p style=\"font-size: 14px; line-height: 140%;\"> </p>\n<p style=\"font-size: 14px; line-height: 140%;\">You subscribed for {product_name} successfully! </p>\n<br>\n<p style=\"font-size: 14px; line-height: 140%;\">Dear customer, we will notify you whenever {product_name} becomes available.</p>\n<p style=\"font-size: 14px; line-height: 140%;\"> </p>\n<br>\n<p style=\"font-size: 14px; line-height: 140%; text-align: center;\">{product_html}</p>"
                                },
                                "hasDeprecatedFontControls": true
                            }
                        ],
                        "values": {
                            "backgroundColor": "",
                            "padding": "0px",
                            "border": {
                                "borderTopWidth": "1px",
                                "borderTopStyle": "solid",
                                "borderTopColor": "#cccccc",
                                "borderLeftWidth": "1px",
                                "borderLeftStyle": "solid",
                                "borderLeftColor": "#cccccc",
                                "borderRightWidth": "1px",
                                "borderRightStyle": "solid",
                                "borderRightColor": "#cccccc",
                                "borderBottomWidth": "1px",
                                "borderBottomStyle": "solid",
                                "borderBottomColor": "#cccccc"
                            },
                            "_meta": {
                                "htmlID": "u_column_3",
                                "htmlClassNames": "u_column"
                            }
                        }
                    }
                ],
                "values": {
                    "displayCondition": null,
                    "columns": false,
                    "backgroundColor": "#ffffff",
                    "columnsBackgroundColor": "#ffffff",
                    "backgroundImage": {
                        "url": "",
                        "fullWidth": true,
                        "repeat": "no-repeat",
                        "size": "custom",
                        "position": "top-center",
                        "customPosition": ["50%", "0%"]
                    },
                    "padding": "0px",
                    "anchor": "",
                    "hideDesktop": false,
                    "_meta": {
                        "htmlID": "u_row_3",
                        "htmlClassNames": "u_row"
                    },
                    "selectable": true,
                    "draggable": true,
                    "duplicatable": true,
                    "deletable": true,
                    "hideable": true,
                    "hideMobile": false,
                    "noStackMobile": false
                }
            }
        ],
        "headers": [],
        "footers": [],
        "values": {
            "popupPosition": "center",
            "popupWidth": "600px",
            "popupHeight": "auto",
            "borderRadius": "10px",
            "contentAlign": "center",
            "contentVerticalAlign": "center",
            "contentWidth": "700px",
            "fontFamily": {
                "label": "Arial",
                "value": "arial,helvetica,sans-serif"
            },
            "textColor": "#000000",
            "popupBackgroundColor": "#FFFFFF",
            "popupBackgroundImage": {
                "url": "",
                "fullWidth": true,
                "repeat": "no-repeat",
                "size": "cover",
                "position": "center"
            },
            "popupOverlay_backgroundColor": "rgba(0, 0, 0, 0.1)",
            "popupCloseButton_position": "top-right",
            "popupCloseButton_backgroundColor": "#DDDDDD",
            "popupCloseButton_iconColor": "#000000",
            "popupCloseButton_borderRadius": "0px",
            "popupCloseButton_margin": "0px",
            "popupCloseButton_action": {
                "name": "close_popup",
                "attrs": {
                    "onClick": "document.querySelector('.u-popup-container').style.display = 'none';"
                }
            },
            "backgroundColor": "#ffffff",
            "preheaderText": "",
            "linkStyle": {
                "body": true,
                "linkColor": "#0000ee",
                "linkHoverColor": "#0000ee",
                "linkUnderline": true,
                "linkHoverUnderline": true
            },
            "backgroundImage": {
                "url": "",
                "fullWidth": true,
                "repeat": "no-repeat",
                "size": "custom",
                "position": "top-center",
                "customPosition": ["50%", "0%"]
            },
            "_meta": {
                "htmlID": "u_body",
                "htmlClassNames": "u_body"
            }
        }
    },
    "counters": {
        "u_column": 5,
        "u_row": 5,
        "u_content_html": 1,
        "u_content_image": 2,
        "u_content_text": 12
    },
    "schemaVersion": 16
};

export const upgradePayload = {
    new_wishlist_template : 1,
    new_price_drop_template : 1,
    new_restock_template : 1,
    new_bis_template : 1,
    new_thankyou_template : 1,
}