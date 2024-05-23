import React from 'react';
import {BlockStack, Box, Card, InlineStack, Button, Text, InlineGrid, ButtonGroup, Icon} from "@shopify/polaris";
import {baseUrl, openUrlInNewWindow} from "../../utils/Constant";
import qs from "qs";
import {useNavigate} from "react-router-dom";
import {StepOneImage} from "../../utils/AppImages";
import {CircleTickOutlineMinor} from "@shopify/polaris-icons";
import {AppDocsLinks} from "../../utils/AppDocsLinks";
import LazyLoadImage from "../Comman/LazyLoadImage";

const benefitsList = [
    {text: "Increase customer engagement"},
    {text: "Enable social sharing"},
    {text: "Increase conversion rates"},
    {text: "Boost sales"},
    {text: "Improve shopping experience"},
    {text: "Reduce cart abandonment"},
    {text: "Email alerts for low-stock, restock, and price drops"},
];

const StepOne = ({step, setStep, urlParams, shopDetails}) => {
    const navigate = useNavigate()
    const onStepChange = () => {
        setStep(Number(step) + 1)
        const params = Object.fromEntries(urlParams);
        navigate({pathname: `${baseUrl}/onboarding`, search: qs.stringify({...params, step: 2})});
    }
    return (
        <Card padding={"0"}>
            <Box paddingBlockStart={"800"} paddingBlockEnd={"800"} paddingInlineEnd={"1000"}
                 paddingInlineStart={"1000"}>
                <BlockStack gap={"500"}>
                    <InlineGrid columns={2} gap={"800"}>
                        <BlockStack gap={"800"}>
                            <BlockStack gap={"200"}>
                                <Text variant="headingLg" as="h5">{`Welcome to Wishlist Club`}</Text>
                                <Text
                                    as="p">{`We’re thrilled to have you onboard. Our Wishlist app is designed to enhance your customers’ shopping experience and boost your sales by providing them with a convenient way to save their favorite products.`}</Text>
                            </BlockStack>
                            <BlockStack gap={"300"}>
                                <Text as={"span"}
                                      fontWeight={"semibold"}>{`Wishlist Club can benefit your store.`}</Text>
                                <BlockStack gap={"100"}>
                                    {(benefitsList || []).map((x, i) => {
                                        return (
                                            <InlineStack key={i} align={"start"} gap={"200"}>
                                                <div>
                                                    <Icon source={CircleTickOutlineMinor} tone={"success"}/>
                                                </div>
                                                <Text as={"span"}>{x.text}</Text>
                                            </InlineStack>
                                        )
                                    })}
                                </BlockStack>
                            </BlockStack>
                        </BlockStack>
                        <div className={"onBoardingIcon"}>
                           <LazyLoadImage src={StepOneImage} alt="Image" />
                        </div>
                    </InlineGrid>

                    <InlineStack align={"start"} gap={"200"} blockAlign={"center"}>
                        <Button variant={"primary"} onClick={onStepChange}> Get Started </Button>
                        {/*<Button variant={"plain"} onClick={() => openUrlInNewWindow(AppDocsLinks.calendly30Min)}>*/}
                        {/*    Book onboarding call*/}
                        {/*</Button>*/}
                    </InlineStack>
                </BlockStack>
            </Box>
        </Card>
    );
};

export default StepOne;