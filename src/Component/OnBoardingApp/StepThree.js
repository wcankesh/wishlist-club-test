import React, {useState, Fragment, useEffect} from 'react';
import {
    BlockStack, Box, Card, InlineStack, Button, Text, InlineGrid, ButtonGroup, Checkbox
} from "@shopify/polaris";
import {apiService, baseUrl, capitalizeMessage} from "../../utils/Constant";
import qs from "qs";
import {useNavigate} from "react-router-dom";
import {StepThreeImage} from "../../utils/AppImages";
import ToastMessage from "../Comman/ToastMessage";

const StepThree = ({step, setStep, urlParams, shopDetails}) => {
    const navigate = useNavigate();
    const theme = urlParams.get("theme") || "";
    const isBlockCapable = urlParams.get("isBlockCapable") || "true";
    const extension = urlParams.get("extension") || "";
    const [isLoading, setIsLoading] = useState(false);
    const [setting, setSetting] = useState({
        guest_wishlist: "0",
        multiple_wishlist: "0",
        share_wishlist: "0",
        bis_id: 0,
        is_bis_email_enable: "0"
    });

    const Setting = async () => {
        const response = await apiService.getSetting();
        if (response.status === 200) {
            setSetting(response.data);
        } else if (response.status === 500) {
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        Setting();
    }, []);

    const handleChange = async (e) => {
        const {name, value} = e.target;
        setSetting({...setting, [name]: value})
        let payload = {
            guest_wishlist: setting.guest_wishlist,
            multiple_wishlist: setting.multiple_wishlist,
            share_wishlist: setting.share_wishlist,
            [name]: value
        };
        const response = await apiService.updateSetting(payload, setting.id);
    }

    const onStepChange = async (steps, isBack) => {
        if (isBack === false) {
            const response = await apiService.onBoarding({shop: shopDetails.shop, onboarding: "1"});
            if (response.status === 200) {
                const isSkip = urlParams.get("skip") || "1";

            }
        }
        setStep(Number(steps))
        const params = Object.fromEntries(urlParams);
        navigate({pathname: `${baseUrl}/onboarding`, search: qs.stringify({...params, step: steps})});
    };

    const handleBackInStockEmail = async (e) => {
        const {name, value} = e.target;
        setSetting({...setting, [name]: value});
        let payload = {id: setting.bis_id, is_bis_email_enable: value};
        const response = await apiService.enableBackInStock(payload);
    }

    const data = [
        {
            label: "Allow guests to create wishlists without needing an account.",
            checked: setting.guest_wishlist == "1", name: "guest_wishlist"
        },
        {
            label: "Enable customers to share their wishlists via social media or email.",
            checked: setting.share_wishlist == "1", name: "share_wishlist"
        },
        {
            label: "Allow customers to create and manage multiple wishlists for different occasions or needs.",
            checked: setting.multiple_wishlist == "1", name: "multiple_wishlist"
        },
    ];

    return (
        <Fragment>
            <Card padding={"0"}>
                <Box paddingBlockStart={"800"} paddingBlockEnd={"800"} paddingInlineEnd={"1000"}
                     paddingInlineStart={"1000"}>
                    <BlockStack gap={"800"}>
                        <InlineGrid columns={2} gap={"800"}>
                            <BlockStack gap={"600"}>
                                <BlockStack gap={"400"}>
                                    <BlockStack gap={"100"}>
                                        <Text variant="bodyLg" as="span">Step: 3</Text>
                                        <Text variant="headingLg" as="span">{`Enable Additional Features`}</Text>
                                    </BlockStack>

                                    <BlockStack gap={"400"}>
                                        <Checkbox label={`Activate Back-In-stock Feature`}
                                                  checked={setting.is_bis_email_enable == "1"} disabled={isLoading}
                                                  onChange={(checked) => handleBackInStockEmail({
                                                      target: {
                                                          name: "is_bis_email_enable",
                                                          value: setting.is_bis_email_enable ? "0" : "1"
                                                      }
                                                  })}/>

                                        {(data || []).map((x, i) => {
                                            return (
                                                <Checkbox label={x.label} checked={x.checked} disabled={isLoading}
                                                          onChange={(checked) => handleChange({
                                                              target: {name: x.name, value: x.checked ? "0" : "1"}
                                                          })}/>
                                            )
                                        })}
                                    </BlockStack>
                                </BlockStack>
                            </BlockStack>
                            <div className={"onBoardingIcon"}><img src={StepThreeImage} alt={""}/></div>
                        </InlineGrid>
                        <InlineStack align={"space-between"}>
                            <ButtonGroup gap={"tight"}>
                                <Button onClick={() => onStepChange(step - 1, true)}>Back</Button>
                                {/*<Button variant={"plain"} onClick={() => onStepChange(step + 1, false)}>Skip</Button>*/}
                            </ButtonGroup>
                            <Button onClick={() => onStepChange(step + 1, false)} variant={"primary"}>
                                Next </Button>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Card>
        </Fragment>
    );
};

export default StepThree;