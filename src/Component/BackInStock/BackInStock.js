import React, {Fragment} from 'react';
import {Page, Layout} from "@shopify/polaris";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/Constant";
import WishlistCardMenu from "../Comman/WishlistCardMenu";
import {Icons} from "../../utils/Icons";

const BackInStock = () => {
    const navigate = useNavigate()
    const BackInStock = [
        {
            icon: Icons.EmailIcon,
            name: "Back In Stock Email",
            text: "Manage your preferences for back-in-stock notifications and thank-you notifications using this section.",
            link: "back-in-stock/email"
        },
        {
            icon: Icons.ThemeIcon,
            name: "Back In Stock Design",
            text: "Customize the design of your back-in-stock notifications for the home & collection page, subscriber form, and subscriber message.",
            link: "back-in-stock/design"
        },
    ];

    const onRedirect = (link) => {
        navigate(`${baseUrl}/${link}`);
    };

    return (
        <Fragment>
            <Page title={"Back In Stock"}>
                <Layout>
                    <Layout.Section>
                        <WishlistCardMenu data={BackInStock} onRedirect={(link) => onRedirect(link)} column="two"/>
                    </Layout.Section>
                </Layout>
            </Page>
        </Fragment>
    );
};

export default BackInStock;