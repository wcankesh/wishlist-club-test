import {useNavigate} from "@shopify/app-bridge-react";

export const useHandleRedirection = () => {
    const navigate = useNavigate();

    const handleRedirection = (url,type) => {
        switch (type) {
            case "navigate":
                navigate(url);
                break;
            case "newPage":
                window.open(url, "_blank");
                break;
            case "toggle":
                window.Beacon("toggle");
                break;
            default:
                break;
        }
    };

    return handleRedirection;
};
