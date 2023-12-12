import React, {useEffect, useState, Fragment} from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import {Page, Layout, Button, FormLayout, PageActions, Text, Card, BlockStack, Box, InlineStack} from "@shopify/polaris"
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl, capitalizeMessage} from "../../../utils/Constant";
import ToastMessage from "../../Comman/ToastMessage"
import CopyCode from "../../Comman/CopyCode"
import CustomErrorBanner from "../../Comman/CustomErrorBanner";

const Headless = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [isTokenLoading, setIsTokenLoading] = useState(false)
    const [headLess, setHeadLess] = useState({domain: []})
    const [headLessToken, setHeadLessToken] = useState()
    const [message, setMessage] = useState("")
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)

    useEffect(() => {
        const getHeadless = async () => {
            const response = await apiService.getHeadless();
            if (response.status === 200) {
                setHeadLess(response.data)
            } else if (response.status === 500) {
                setMessage(capitalizeMessage(response.message))
                setIsErrorServer(true);
            } else {
                setMessage(capitalizeMessage(response.message))
                setIsError(true)
            }
        }
        getHeadless();
    }, []);

    const getHeadlessToken = async () => {
        setIsLoading(false);
        const response = await apiService.getHeadlessToken();
        if (response.status === 200) {
            setHeadLessToken(response.data)
            setIsLoading(false)
            setMessage(capitalizeMessage(response.message))
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsLoading(false)
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsLoading(false)
        }
    }

    const updateHeadless = async () => {
        setIsTokenLoading(true)
        let payload = {
            id: headLess.id ? headLess.id : "",
            domain: headLess.domain
        }
        const response = await apiService.updateHeadless(payload)
        if (response.status === 200) {
            setIsTokenLoading(false)
            setMessage(capitalizeMessage(response.message))
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsTokenLoading(false)
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsTokenLoading(false)
        }
    }

    const defaultPasteSplit = (data) => {
        return data.split(',').map(d => d.trim())
    }

    const onChange = (e) => {
        const {value, name} = e.target;
        let clone = value.filter((v, i, a) => a.indexOf(v) === i)
        setHeadLess({...headLess, [name]: clone})
    };

    const onBack = () => {
        navigate(`${baseUrl}/settings`)
    }
    return (
        <Fragment>
            <Page title={"Headless"} backAction={{content: 'Settings', onAction: onBack}}
                  primaryAction={{
                      content: "Save",
                      onAction: updateHeadless,
                      loading: isTokenLoading
                  }}>
                <Layout>
                    {message !== "" && isError === false ? <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer} setIsErrorServer={setIsErrorServer}/> : ""}
                    <CustomErrorBanner link={"https://webcontrive.helpscoutdocs.com/collection/416-wishlist-club"} message={message} setMessage={setMessage} setIsError={setIsError} isError={isError} />
                    <Layout.AnnotatedSection
                        id="storeDetails"
                        title="Headless Settings"
                        description={
                            <BlockStack gap={"400"}>
                                <Text tone={"subdued"}>Enhance your store's capabilities by integrating our API. By
                                    establishing a
                                    connection to our API, you gain the ability to fetch wishlist products and
                                    seamlessly
                                    integrate them into the frontend presentation of your store.
                                    This integration provides you with the flexibility to customize and personalize the
                                    design and layout to meet your exact requirements and create a unique shopping
                                    experience
                                    for your customers."</Text>
                                <InlineStack>
                                <Button
                                    onClick={() => window.open("https://documenter.getpostman.com/view/17366629/2s93eVVYTr","_blank")}>API
                                    Document</Button>
                                </InlineStack>
                            </BlockStack>
                        }

                    >
                        <Card padding={"0"}>
                            <Box padding={"500"}>
                            <BlockStack gap={"500"}>
                            <InlineStack align={"end"}>
                                <Button onClick={getHeadlessToken} loading={isLoading}>Generate Token</Button>
                            </InlineStack>
                                <FormLayout>
                                    <BlockStack gap={"100"}>
                                        <label>Domain</label>
                                        <TagsInput
                                            className={`react-tagsinput`}
                                            value={headLess.domain || []}
                                            onChange={(value) => onChange({target: {name: "domain", value}})}
                                            pasteSplit={defaultPasteSplit}
                                            addOnPaste={true}
                                            onlyUnique={true}
                                            inputProps={{placeholder: 'Enter domain'}}/> vertical spacing={"tight"}
                                    </BlockStack>

                                    <CopyCode label={"Access Token"} value={headLess.token}/>
                                    <Text tone={"caution"}><Text as={"span"} fontWeight={"bold"}>Please Note</Text>:
                                        Reach out to our dedicated support team and provide them with the domain you
                                        want to use with the API. They will guide you through the whitelisting process
                                        and ensure that the API is enabled for your specified domain. Without
                                        whitelisting the domain API will not work.</Text>
                                </FormLayout>
                            </BlockStack>
                            </Box>
                        </Card>
                    </Layout.AnnotatedSection>

                </Layout>
                <PageActions
                    primaryAction={{
                        content: 'Save',
                        onAction: updateHeadless,
                        loading: isTokenLoading
                    }}
                />
            </Page>
        </Fragment>
    );
};

export default Headless;