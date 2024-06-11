import React, {useState, useEffect} from 'react';
import {BlockStack, Box, Card, Button, Text, InlineGrid, InlineStack} from "@shopify/polaris";
import {baseUrl, openUrlInNewWindow, secondaryButton} from "../../utils/Constant";
import qs from "qs";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Confetti, StepFourImage, StepThreeImage} from "../../utils/AppImages";
import {Shop_details} from "../../redux/action/action";
import {ExternalMinor} from "@shopify/polaris-icons";
import {AppDocsLinks} from "../../utils/AppDocsLinks";
import LazyLoadImage from "../Comman/LazyLoadImage";

const StepFour = ({urlParams, shopDetails}) => {
    const [isConfetti, setIsConfetti] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            setIsConfetti(false);
        }, 5000)
    }, []);
    const navigate = useNavigate()
    const onStepChange = async (url) => {
        let params = Object.fromEntries(urlParams);
        delete params["step"]
        delete params["theme"]
        delete params["extension"]
        delete params["skip"]
        delete params["isBlockCapable"]
        dispatch(Shop_details({...shopDetails, onboarding: "1"}));
        if(shopDetails.plan_type == "0" || shopDetails.is_older_shop == 1){
            navigate(`${baseUrl}/settings/plan`)
        } else {
            navigate({pathname: `${baseUrl}/${url}`, search: qs.stringify({...params})});
        }
    }
    return (
        <div className="confetti-main">
            {isConfetti && <img src={Confetti} className="confetti" style={{transform: `scale(1.3)`}} alt={""}/>}
            <Card padding={"0"}>
                <Box paddingBlockStart={"800"} paddingBlockEnd={"800"} paddingInlineEnd={"1000"}
                     paddingInlineStart={"1000"}>
                    <BlockStack gap={"800"}>
                        <InlineGrid columns={2} gap={"800"}>
                            <BlockStack gap={"600"}>
                                <BlockStack gap={"400"}>
                                    <Text variant="headingLg" as="span">{` Share the Wishlist Experience`}</Text>
                                    <Text as="span">
                                        {`Thank You for Choosing Wishlist Club!`}
                                    </Text>
                                    <Text as="span">
                                        We’re excited to see how the Wishlist app will help you engage with your
                                        customers and grow your business. For any questions or further customization,
                                        feel free to <Button variant={"plain"} onClick={() => window.Beacon("toggle")}>reach
                                        out</Button> to our support team.
                                    </Text>
                                </BlockStack>
                                <BlockStack gap={"400"} inlineAlign={"start"}>
                                    <div className={secondaryButton}>
                                        <Button icon={ExternalMinor}
                                                onClick={() => openUrlInNewWindow(AppDocsLinks.writeReviewModal)}>Share
                                            Feedback</Button>
                                    </div>
                                    <Text as={"span"} variant={"headingMd"}>{`Next Step?`}</Text>
                                    <div className={secondaryButton}>
                                        <Button icon={ExternalMinor}
                                                onClick={() => onStepChange("settings/wishlist-design")}>
                                            Customize Wishlist Icon</Button>
                                    </div>
                                </BlockStack>
                            </BlockStack>
                            <div className={"onBoardingIcon"}>
                                <LazyLoadImage src={StepFourImage} alt="Image"/>
                            </div>
                        </InlineGrid>
                        <InlineStack align={"end"}>
                            <Button variant={"primary"} onClick={() => onStepChange("")}> Finish </Button>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Card>
        </div>
    );
};

export default StepFour;