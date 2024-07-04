export const formValidate = (name, value) => {
    const validEmailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    switch (name) {
        case "from_email":
            if (value && !value?.match(validEmailRegex)) {
                return "Enter a valid email address";
            } else {
                return "";
            }

        case "restock_email_subject":
            if (!value || value.trim() === "") {
                return "Email subject is required";
            } else {
                return "";
            }

        case "restock_email_body":
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

        case "restock_email_reply_to_email":
            if (value && !value?.match(validEmailRegex)) {
                return "Enter a valid reply to email address";
            } else {
                return "";
            }

        case "success_message":
            if (!value || value.trim() === "") {
                return "Message is required";
            } else {
                return "";
            }

        case "already_subscribed_message":
            if (!value || value.trim() === "") {
                return "Already subscribed message is required";
            } else {
                return "";
            }

        case "submit_button_text":
            if (!value || value.trim() === "") {
                return "Submit button text is required";
            } else {
                return "";
            }

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

        case "reply_to_mail":
            if (value && !value.match(validEmailRegex)) {
                return "Enter a valid reply to email address";
            } else {
                return "";
            }

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

        case "button_text":
            if (!value || value.trim() === "") {
                return "Continue shopping label is required";
            } else {
                return "";
            }

        case "thankyou_from_mail":
            if (value && !value?.match(validEmailRegex)) {
                return "Enter a valid email address";
            } else {
                return "";
            }


        case "bis_from_mail":
            if (value && !value?.match(validEmailRegex)) {
                return "Enter a valid email address";
            } else {
                return "";
            }

        case "price_drop_email_subject":
            if (!value || value.trim() === "") {
                return "Email subject is required";
            } else {
                return "";
            }

        case "price_drop_email_body":
            if (!value || value.trim() === "") {
                return "Email body is required";
            } else {
                return "";
            }

        case "price_drop_email_reply_to_email":
            if (value && !value?.match(validEmailRegex)) {
                return "Enter a valid reply to email address";
            } else {
                return "";
            }

        default: {
            return "";
        }
    }
};

