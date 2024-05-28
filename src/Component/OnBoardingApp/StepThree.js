import React, {useState, Fragment, useEffect} from 'react';
import {
    BlockStack, Box, Card, InlineStack, Button, Text, InlineGrid, ButtonGroup
} from "@shopify/polaris";
import {apiService, baseUrl} from "../../utils/Constant";
import qs from "qs";
import {useNavigate} from "react-router-dom";
import {StepThreeImage, StepTwoImage} from "../../utils/AppImages";
import SwitchButton from "../Comman/SwitchButton";
import LazyLoadImage from "../Comman/LazyLoadImage";

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
        setIsLoading(true)
        if (isBack === false) {
            const response = await apiService.onBoarding({shop: shopDetails.shop, onboarding: "1"});
            if (response.status === 200) {
                const isSkip = urlParams.get("skip") || "1";
                setIsLoading(false)
            }
        }
        setStep(Number(steps))
        const params = Object.fromEntries(urlParams);
        navigate({pathname: `${baseUrl}/onboarding`, search: qs.stringify({...params, step: steps})});
        setIsLoading(false)
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
                        <InlineGrid columns={{xs: 1, sm: 1, md: 2, lg: 2, xl: 2}} gap={"800"}>
                            <BlockStack gap={"1600"}>
                                <BlockStack gap={"100"}>
                                    <Text variant="bodyLg" as="span">Step: 3</Text>
                                    <Text variant="headingLg" as="span">{`Enable Additional Features`}</Text>
                                </BlockStack>

                                <BlockStack gap={"500"}>
                                    <InlineStack gap={"200"} blockAlign={"center"} wrap={false}>
                                        <SwitchButton
                                            checked={setting.is_bis_email_enable == "1"}
                                            onChange={handleBackInStockEmail} name={"is_bis_email_enable"}
                                        />
                                        <Text as={"span"}>{`Activate Back-In-stock Feature`}</Text>
                                    </InlineStack>
                                    {(data || []).map((x, i) => {
                                        return (
                                            <InlineStack gap={"200"} blockAlign={"center"} key={i} wrap={false}>
                                                <SwitchButton checked={x.checked} name={x.name}
                                                              onChange={handleChange}/>
                                                <Text as={"span"}>{x.label}</Text>
                                            </InlineStack>
                                        )
                                    })}
                                </BlockStack>
                            </BlockStack>
                            <div className={"onBoardingIcon"}>
                                <LazyLoadImage src={StepThreeImage} alt="Image"/>
                            </div>
                        </InlineGrid>
                        <InlineStack align={"space-between"}>
                            <ButtonGroup gap={"tight"}>
                                <Button onClick={() => onStepChange(step - 1, true)}>Back</Button>
                                {/*<Button variant={"plain"} onClick={() => onStepChange(step + 1, false)}>Skip</Button>*/}
                            </ButtonGroup>
                            <Button onClick={() => onStepChange(step + 1, false)} variant={"primary"}
                                    loading={isLoading}> Next </Button>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Card>
        </Fragment>
    );
};

export default StepThree;