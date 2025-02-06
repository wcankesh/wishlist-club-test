import React from 'react';
import {useLocation} from "react-router-dom";
import {initialKeys} from "./Common";
import WishlistItemsEmail from "./WishlistItemsEmail";
import PriceDropAlertEmail from "./PriceDropAlertEmail";
import RestockAlertEmail from "./RestockAlertEmail";
import AddedWishlistEmail from "./AddedWishlistEmail";
import RemoveWishlistEmail from "./RemoveWishlistEmail";
import LowStockAlertEmail from "./LowStockAlertEmail";
import AbandonmentReminderEmail from "./AbandonmentReminderEmail";

const WishlistEmailCustomization = () => {
    let location = useLocation();

    const UrlParams = new URLSearchParams(location.search);
    const activeEmailTab = UrlParams.get('active_email_tab');

    const renderPage = (type) => {
        switch (type) {
            case initialKeys?.wishlistItems:
                return <WishlistItemsEmail/>;
            case initialKeys?.priceDropAlert:
                return <PriceDropAlertEmail/>;
            case initialKeys?.restockAlert:
                return <RestockAlertEmail/>;
            case initialKeys?.addedWishlist:
                return <AddedWishlistEmail/>;
            case initialKeys?.removeWishlist:
                return <RemoveWishlistEmail/>;
            case initialKeys?.lowStockAlert:
                return <LowStockAlertEmail/>;
            case initialKeys?.abandonmentReminder:
                return <AbandonmentReminderEmail/>;
            default:
                return null;
        }
    };


    console.log("activeEmailTab",activeEmailTab)

    return (
        <React.Fragment>
            {renderPage(activeEmailTab ?? initialKeys?.wishlistItems)}
        </React.Fragment>
    );
};

export default WishlistEmailCustomization;