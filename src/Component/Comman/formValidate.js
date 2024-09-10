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
        case "add_to_cart_btn_border_size":
            if (value < 0 || value > 10) {
                return value < 0 ? "Border Width cannot be in negative" : "Border Width cannot exceed 10px";
            } else {
                return "";
            }
        case "add_to_cart_btn_vertical_padding":
            if (value < 0 || value > 25) {
                return value < 0 ? "Top & Bottom padding cannot be negative" : "Top & Bottom padding cannot exceed 25px";
            } else {
                return "";
            }
        case "add_to_cart_btn_horizontal_padding":
            if (value < 0 || value > 25) {
                return value < 0 ? "Left & Right padding cannot be negative" : "Left & Right padding cannot exceed 25px";
            } else {
                return "";
            }
        case "add_to_cart_btn_border_radius":
            if (value < 0 || value > 100) {
                return value < 0 ? "Border radius cannot be negative" : "Border radius cannot exceed 100px";
            }  else {
                return "";
            }
        case "view_product_btn_border_size":
            if (value < 0 || value > 10) {
                return value < 0 ? "Border Width cannot be in negative" : "Border Width cannot exceed 10px";
            } else {
                return "";
            }
        case "view_product_btn_vertical_padding":
            if (value < 0 || value > 25) {
                return value < 0 ? "Top & Bottom padding cannot be negative" : "Top & Bottom padding cannot exceed 25px";
            } else {
                return "";
            }
        case "view_product_btn_horizontal_padding":
            if (value < 0 || value > 25) {
                return value < 0 ? "Left & Right padding cannot be negative" : "Left & Right padding cannot exceed 25px";
            } else {
                return "";
            }
        case "view_product_btn_border_radius":
            if (value < 0 || value > 100) {
                return value < 0 ? "Border radius cannot be negative" : "Border radius cannot exceed 100px";
            }  else {
                return "";
            }
        case "btn_border_size":
            if (value < 0 || value > 10) {
                return value < 0 ? "Border Width cannot be in negative" : "Border Width cannot exceed 10px";
            } else {
                return "";
            }
        case "btn_vertical_padding":
            if (value < 0 || value > 50) {
                return value < 0 ? "Top & Bottom padding cannot be in negative" : "Top & Bottom padding cannot exceed 10px";
            } else {
                return "";
            }
        case "btn_horizontal_padding":
            if (value < 0 || value > 50) {
                return value < 0 ? "Left & Right padding cannot be in negative" : "Left & Right padding cannot exceed 50px";
            } else {
                return "";
            }
        case "btn_border_radius":
            if (value < 0 || value > 100) {
                return value < 0 ? "Button radius cannot be in negative" : "Button radius cannot exceed 100px";
            } else {
                return "";
            }


        default: {
            return "";
        }
    }
};

