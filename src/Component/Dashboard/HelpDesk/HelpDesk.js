import React, {Fragment} from 'react';
import {Card, Button, Text, InlineStack, BlockStack, InlineGrid} from "@shopify/polaris";
import {BackInStock, GuestWishlist, Language, WishlistDesign} from "../../../utils/AppImages";
import {baseUrl} from "../../../utils/Constant";
import {useHandleRedirection} from "../../Comman/useHandleRedirection";

const HelpDesk = () => {
    const handleRedirection = useHandleRedirection();

    const brandingList = [
        {
            icon: GuestWishlist,
            title: "Guest Wishlist",
            description: "Allow users to add items to their wishlist hassle-free, no account needed, with our guest wishlist feature.",
            buttonText: 'Activate Now',
            link: `${baseUrl}/settings/general`,
            type: "navigate"
        },
        {
            icon: WishlistDesign,
            title: "Customize Wishlist Icon",
            description: "Easily personalize your wishlist icon to reflect your brand, ensuring a seamless shopping experience.",
            buttonText: 'Customize Now',
            link: `${baseUrl}/settings/wishlist-design`,
            type: "navigate"
        },
        {
            icon: Language,
            title: "Language",
            description: "Customize wishlist labels and colors, empowering users to personalize their experience",
            buttonText: 'Configure Now',
            link: `${baseUrl}/settings/language`,
            type: "navigate"
        },
        {
            icon: BackInStock,
            title: "Personalize Email template",
            description: "Tailor your email templates for wishlist items, price-drop alerts, and restock notifications to enhance customer engagement.",
            buttonText: 'Customize Now',
            link: `${baseUrl}/settings/email`,
            type: "navigate"
        }
    ];

    return (
        <Fragment>
            <BlockStack gap={"400"}>
                <Text as={"span"} variant={"headingMd"} fontWeight={"bold"}>
                    {"Feature Spotlight"}
                </Text>

                <InlineGrid columns={2} gap={"300"}>
                    {(brandingList || []).map((x, i) => {
                        return (
                            <Card key={i}>
                                <InlineStack gap={"400"} wrap={false} blockAlign={"start"}>
                                    {/*<div><img src={x.icon} alt={x.title} width={"50px"} height={"50px"}/></div>*/}
                                    <BlockStack gap={"300"} inlineAlign={"start"}>
                                        <Text as={"span"} variant={"headingMd"} fontWeight={"bold"}>
                                            {x.title}
                                        </Text>
                                        <Text as={"span"}>{x.description}</Text>
                                        <Button onClick={() => handleRedirection(x.link, x.type)}>
                                            {x.buttonText}</Button>
                                    </BlockStack>
                                </InlineStack>
                            </Card>
                        );
                    })}
                </InlineGrid>
            </BlockStack>
        </Fragment>
    );
};

export default HelpDesk;