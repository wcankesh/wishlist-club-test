import React from "react";
import {
    BlockStack,
    Box,
    Button,
    Card,
    InlineGrid,
    Text,
} from "@shopify/polaris";
import { BackInStock, GuestWishlist, Language, WishlistDesign } from "../../../utils/AppImages";
import { baseUrl } from "../../../utils/Constant";
import { useNavigate } from "react-router-dom";

const HelpDesk = () => {
    const navigate = useNavigate();

    const brandingList = [
        {
            icon: GuestWishlist,
            title: "Customise Wishlist",
            buttonText: "Customize Now",
            link: `${baseUrl}/settings/wishlist-design`,
        },
        {
            icon: BackInStock,
            title: "Customise Back In Stock",
            buttonText: "Configure Now",
            link: `${baseUrl}/back-in-stock/email`,
        },
        {
            icon: WishlistDesign,
            title: "Customise Email Templates",
            buttonText: "Customize Now",
            link: `${baseUrl}/settings/email?step=0`,
        },
        {
            icon: Language,
            title: "Translate",
            buttonText: "Translate Now",
            link: `${baseUrl}/settings/language`,
        },
    ];

    return (
        <Box paddingBlockStart="400">
            <BlockStack gap="300">
                <Text as={"span"} variant={"headingMd"} fontWeight={"bold"} >
                    {"Feature Spotlight"}
                </Text>
                <InlineGrid columns={{ xs: 2, sm: 2, md: 2, lg: 4 }} gap="400">
                    {brandingList.map((item, index) => (
                        <Card key={index} padding="400">
                            <BlockStack gap="300" inlineAlign="stretch" align="center"  >
                                <Box
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%"
                                    }}
                                >
                                    <img
                                        src={item.icon}
                                        alt={item.title}
                                        style={{ width: 50, height: 50, objectFit: "contain" }}
                                    />
                                </Box>


                                <Text as="span" variant="headingMd" fontWeight="bold" alignment="center"  >
                                    {item.title}
                                </Text>
                                <Button fullWidth onClick={() => navigate(item.link)}>
                                    {item.buttonText}
                                </Button>
                            </BlockStack>
                        </Card>
                    ))}
                </InlineGrid>
            </BlockStack>
        </Box>
    );
};

export default HelpDesk;
