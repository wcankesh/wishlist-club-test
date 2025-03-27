import {
    KlaviyoIntegration,
    MailchimpIntegration,
    OmnisendIntegration,
    PostScriptIntegration
} from "../../../../utils/AppImages";

export const twoColumns = { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 };

export const threeColumns = { xs: 1, sm: 1, md: 2, lg: 3, xl: 3 };

export const initialKlaviyo = { id: '', public_key: '', secret_key: '', is_klaviyo_connect: 0 };

export const initialMailchimp = { id: '', public_key: '', secret_key: '', is_Mailchimp_connect: 0 };

export const initialConnected = { is_klaviyo_connect: 0, is_omnisend_connect: 0, is_mailchimp_connect: 0, is_postscript_connect: 0, }

export const integrationOptions = [
    {
        image: KlaviyoIntegration,
        name: 'Klaviyo',
        text: 'Use email automation flows based on subscription events.',
        link: 'settings/integration/klaviyo',
        buttonText: 'Manage',
        buttonDisable: false,
        isPlan: '8',
        tooltipPlan: `Enterprise`
    },
    {
        image: OmnisendIntegration,
        name: 'Omnisend',
        text: 'Use email automation flows based on subscription events.',
        link: 'settings/integration/omnisend',
        buttonText: 'Upcoming',
        buttonDisable: true,
        isPlan: '8',
        tooltipPlan: `Enterprise`
    },
    {
        image: MailchimpIntegration,
        name: 'Mailchimp',
        text: 'Use email automation flows based on subscription events.',
        link: 'settings/integration/mailchimp',
        buttonText: 'Manage',
        buttonDisable: !true,
        isPlan: '8',
        tooltipPlan: `Enterprise`
    },
    {
        image: PostScriptIntegration,
        name: 'PostScript',
        text: 'Use email automation flows based on subscription events..',
        link: 'settings/integration/postScript',
        buttonText: 'Upcoming',
        buttonDisable: true,
        isPlan: '8',
        tooltipPlan: `Enterprise`
    },
]

export const formValidate = (name, value, currentType) => {
    switch (name) {
        case "public_key":
            if (currentType.isEnabled) {
                if (!value || !value.trim()) {
                    return `${currentType.title} public API key is required.`;
                } else {
                    return "";
                }
            } else {
                return "";
            }
        case "secret_key":
            if (currentType.isEnabled) {
                if (!value || !value.trim()) {
                    return `${currentType.title} secret API key is required.`;
                } else {
                    return "";
                }
            } else {
                return "";
            }
        default: {
            return "";
        }
    }
};

export const validateForm = (formData, setFormError, currentType) => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
        const errorMessage = formValidate(key, formData[key], currentType);
        if (errorMessage) {
            errors[key] = errorMessage;
            console.log(`Error for ${key}: ${errorMessage}`);
        } else {
            console.log(`No error for ${key}`);
        }
    });
    setFormError(errors);
    const noErrors = Object.values(errors).every((error) => error === "");
    console.log('Form validation result:', noErrors);
    return noErrors;
};

