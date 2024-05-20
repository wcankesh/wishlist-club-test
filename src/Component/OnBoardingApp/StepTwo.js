import React, {useEffect, useState, Fragment} from 'react';
import {
    BlockStack, Box, Card, InlineStack, Button, Text, InlineGrid, ButtonGroup, Select,
    Icon, Modal, List
} from "@shopify/polaris";
import {apiService, baseUrl, openUrlInNewWindow} from "../../utils/Constant";
import qs from "qs";
import {useNavigate} from "react-router-dom";
import {RefreshMajor, ExternalMinor} from '@shopify/polaris-icons';
import {StepTwoImage} from "../../utils/AppImages";

const StepTwo = ({step, setStep, urlParams, shopDetails, extensionId, setExtensionId}) => {
    const navigate = useNavigate();
    const theme = urlParams.get("theme") || "";
    const [themeList, setThemeList] = useState([{label: "Select Theme", value: ""}]);
    const [selectedTheme, setSelectedTheme] = useState(theme);
    const [extensionEnabled, setExtensionEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isActivate, setIsActivate] = useState(false);
    const [isBlockCapable, setBlockCapable] = useState(false);
    const [getThemeLoading, setGetThemeLoading] = useState(false);
    const [isExtensionUrl, setIsExtensionUrl] = useState("");
    const [isWishlistUrl, setIsWishlistUrl] = useState("");

    useEffect(() => {
        getTheme();
        // eslint-disable-next-line
    }, [])

    const getTheme = async () => {
        setGetThemeLoading(true);
        const response = await apiService.getThemes({shop: shopDetails.shop});
        if (response.status === 200) {
            setExtensionId(response.data.extension_id)
            const themes = [];
            (response.data || []).map((x) => {
                let obj = {
                    label: x.role === 'main' ? `${x.name} (current theme)` : x.name,
                    value: x && x.id && x.id.toString()
                }
                themes.push(obj)
            })
            if (selectedTheme) {
                onChangeTheme(selectedTheme)
            }
            setThemeList(themes);
            setGetThemeLoading(false);
        } else {
            setGetThemeLoading(false);
        }
    }

    useEffect(() => {
        if (isActivate) {
            const intervalId = setInterval(() => {
                onChangeTheme(selectedTheme)
            }, 5000);
            return () => clearInterval(intervalId);
        }
        // eslint-disable-next-line
    }, [isActivate])

    const onChangeTheme = async (value) => {
        setIsLoading(!isActivate);
        setSelectedTheme(value);
        let isBlockCapables = true;
        const response = await apiService.checkTheme({shop: shopDetails.shop, theme_id: value});
        if (response.status === 200) {
            setExtensionEnabled(response.extension_status);
            if (response && response.on_boardig) {
                setIsExtensionUrl(response.on_boardig?.extension);
                setIsWishlistUrl(response.on_boardig?.wishlist);
                console.log('Extension URL set to:', response.on_boardig.extension);
            } else {
                console.error('on_boardig or extension URL is missing in response.');
            }
            setBlockCapable(response.is_theme_2_0);
            isBlockCapables = response.is_theme_2_0;
            setIsLoading(false);
            if (response.extension_status) {
                setIsActivate(false);
            }
        } else {
            setIsLoading(false);
            setIsActivate(false);
        }
        const params = Object.fromEntries(urlParams);
        navigate({
            pathname: `${baseUrl}/onboarding`,
            search: qs.stringify({...params, theme: value, extension: extensionId, isBlockCapable: isBlockCapables})
        });
    }

    const onStepChange = (steps) => {
        setStep(Number(steps))
        const params = Object.fromEntries(urlParams);
        delete params["skip"]
        navigate({
            pathname: `${baseUrl}/onboarding`,
            search: qs.stringify({
                ...params,
                step: steps,
                theme: selectedTheme,
                extension: extensionId,
                isBlockCapable: isBlockCapable
            })
        });
    }

    const onSkip = (steps) => {
        setStep(Number(steps))
        const params = Object.fromEntries(urlParams);
        delete params["theme"]
        delete params["extension"]
        navigate({pathname: `${baseUrl}/onboarding`, search: qs.stringify({...params, step: steps})});
    }

    const onActiveStep = () => {
        setIsActivate(true);
        window.open(isExtensionUrl, "_blank");
    };

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
                                        <Text variant="bodyLg" as="p">Step: 2</Text>
                                        <Text variant="headingLg" as="h5">Activate Wishlist Club features</Text>
                                    </BlockStack>
                                    <BlockStack gap={"200"}>
                                        <Text as={"span"}>
                                            {`Activate the Wishlist Club embed from Shopify theme customization to integrate the Wishlist widget into your store and make it visible to customers.`}
                                        </Text>
                                    </BlockStack>
                                    <InlineStack gap={"200"} blockAlign={"end"} wrap={false}>
                                        <div className={"w-100"}>
                                            <Select label={"Where would you like to install it?"}
                                                    placeholder={"Select Theme"} disabled={getThemeLoading}
                                                    options={themeList} value={selectedTheme}
                                                    onChange={(value) => onChangeTheme(value)}/>
                                        </div>
                                        <Button size={"large"} icon={RefreshMajor} onClick={getTheme}
                                                loading={getThemeLoading}/>
                                    </InlineStack>
                                </BlockStack>
                                {
                                    selectedTheme !== "" ? <div>
                                        <Button onClick={() => onActiveStep()} loading={isLoading} icon={ExternalMinor}
                                                variant={"primary"} disabled={extensionEnabled || selectedTheme === ""}>
                                            {extensionEnabled ? "Activated" : "Activate"}
                                        </Button></div> : ""
                                }
                                {isBlockCapable &&
                                <BlockStack inlineAlign={"start"} gap={"400"}>
                                    <Text as={"span"}>{`Add wishlist icon to product page`}</Text>
                                    <Button variant={"primary"} icon={ExternalMinor} onClick={()=>openUrlInNewWindow(isWishlistUrl)}>
                                        {`Activate`}</Button>
                                </BlockStack>
                                }

                            </BlockStack>
                            <div className={"onBoardingIcon"}>
                                <img src={StepTwoImage} alt={""}/>
                            </div>
                        </InlineGrid>
                        <InlineStack align={"space-between"}>
                            <ButtonGroup gap={"tight"}>
                                <Button onClick={() => onStepChange(step - 1)}>Back</Button>
                                <Button variant={"plain"} onClick={() => onSkip(step + 1)}>Skip</Button>
                            </ButtonGroup>
                            <Button disabled={!extensionEnabled || selectedTheme === ""} variant={"primary"}
                                    onClick={() => onStepChange(step + 1)}>Next</Button>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Card>
        </Fragment>
    );
};

export default StepTwo;