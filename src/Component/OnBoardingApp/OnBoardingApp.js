import React, { useState, useEffect } from 'react';
import { Page, Layout } from "@shopify/polaris";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import { baseUrl } from "../../utils/Constant";

const OnBoardingApp = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const urlStep = urlParams.get("step") || 1;
    const [step, setStep] = useState(Number(urlStep));
    const [extensionId, setExtensionId] = useState("");
    const shopDetails = useSelector(state => state.shopDetails);

    useEffect(() => {
        if (shopDetails && shopDetails.onboarding == 1) {
            navigate(`${baseUrl}/dashboard`);
        }
    }, []);

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    {
                        step === 1 && <StepOne step={step} setStep={setStep} urlParams={urlParams} shopDetails={shopDetails} />
                    }
                    {
                        step === 2 && <StepTwo step={step} setStep={setStep} urlParams={urlParams} shopDetails={shopDetails} setExtensionId={setExtensionId} extensionId={extensionId} />
                    }
                    {
                        step === 3 && <StepThree step={step} setStep={setStep} urlParams={urlParams} shopDetails={shopDetails} />
                    }
                    {
                        step === 4 && <StepFour step={step} setStep={setStep} urlParams={urlParams} shopDetails={shopDetails} />
                    }
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default OnBoardingApp;