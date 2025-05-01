import React, { Fragment } from 'react';
import { Banner } from "@shopify/polaris";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Shop_details } from "../../redux/action/action";
import { baseUrl } from "../../utils/Constant";

const PaidPlanBanner = ({ planTitle, type }) => {
    let location = useLocation();
    let navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const shopDetails = useSelector((state) => state.shopDetails);
    const dispatch = useDispatch();

    const onRedirect = () => {
        navigate(`${baseUrl}/settings/plan?${UrlParams}`);
    }
    const onRemoveBanner = async () => {
        dispatch(Shop_details({
            ...shopDetails,
            shop_display_banner: { ...shopDetails.shop_display_banner, [type]: "false" }
        }));
    }

    const currentPlan = {
        "0": "Free",
        "1": "Free",
        "5": "Basic",
        "6": "Pro",
        "7": "Advance",
        "8": "Enterprise"
    }

    return (
        <Fragment>
            <Banner onDismiss={onRemoveBanner}
                title={`You're currently on the ${currentPlan[shopDetails.plan_type]?.replace("Current Plan: ", "")} Plan. To make use of this service, upgrading to the ${planTitle ?? ""} Plan is recommended.`}
                tone={"warning"} action={{ content: 'Upgrade Plan', onAction: onRedirect }}
            />
        </Fragment>
    );
};

export default PaidPlanBanner;
