import React, {Fragment, useEffect, useState} from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import {Page, Layout, LegacyCard, Button, FormLayout, LegacyStack, PageActions, Text,} from "@shopify/polaris"
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl} from "../../../../../utils/Constant";
import {ToastMessage, CopyCode} from "../../../../../components";

export default function Headless() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [isTokenLoading, setIsTokenLoading] = useState(false)
    const [headLess, setHeadLess] = useState({domain: []})
    const [headLessToken, setHeadLessToken] = useState()
    const [message, setMessage] = useState("")

    useEffect(() => {
        const getHeadless = async () => {
            setIsLoading(false);
            const response = await apiService.getHeadless();
            if (response.status === 200) {
                setHeadLess(response.data)
                setIsLoading(false)
            } else {
                setIsLoading(false)
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
            setMessage(response.message)
        } else {
            setIsLoading(false)
            setMessage(response.message)
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
            setMessage(response.message)
        } else {
            setIsTokenLoading(false)
            setMessage(response.message)
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
            <ToastMessage message={message} setMessage={setMessage}/>
            <Page title={"Headless"} backAction={{content: 'Settings', onAction: onBack}}
                  primaryAction={{
                      content: "Save",
                      onAction: updateHeadless,
                      loading: isTokenLoading
                  }}>
                <Layout>
                    <Layout.AnnotatedSection
                        id="storeDetails"
                        title="Headless Settings"
                        description={
                            <LegacyStack>
                                <Text color={"subdued"}>Enhance your store's capabilities by integrating our API. By
                                    establishing a
                                    connection to our API, you gain the ability to fetch wishlist products and
                                    seamlessly
                                    integrate them into the frontend presentation of your store.
                                    This integration provides you with the flexibility to customize and personalize the
                                    design and layout to meet your exact requirements and create a unique shopping
                                    experience
                                    for your customers."</Text>
                                <Button
                                    onClick={() => window.open("https://documenter.getpostman.com/view/17366629/2s93eVVYTr","_blank")}>API
                                    Document</Button>
                            </LegacyStack>
                        }

                    >
                        <LegacyCard>
                            <LegacyCard.Header>
                                <Button onClick={getHeadlessToken} loading={isLoading}>Generate Token</Button>
                            </LegacyCard.Header>
                            <LegacyCard.Section>
                                <FormLayout>
                                    <LegacyStack vertical spacing={"tight"}>
                                        <label>Domain</label>
                                        <TagsInput
                                            className={`react-tagsinput`}
                                            value={headLess.domain || []}
                                            onChange={(value) => onChange({target: {name: "domain", value}})}
                                            pasteSplit={defaultPasteSplit}
                                            addOnPaste={true}
                                            onlyUnique={true}
                                            inputProps={{placeholder: 'Enter domain'}}/> vertical spacing={"tight"}
                                    </LegacyStack>

                                    <CopyCode label={"Access Token"} value={headLess.token}/>
                                    <Text color={"critical"}><Text as={"span"} fontWeight={"bold"}>Please Note</Text>:
                                        Reach out to our dedicated support team and provide them with the domain you
                                        want to use with the API. They will guide you through the whitelisting process
                                        and ensure that the API is enabled for your specified domain. Without
                                        whitelisting the domain API will not work.</Text>
                                </FormLayout>
                            </LegacyCard.Section>

                        </LegacyCard>
                    </Layout.AnnotatedSection>
                    <Layout.Section>
                        <PageActions
                            primaryAction={{
                                content: 'Save',
                                onAction: updateHeadless,
                                loading: isTokenLoading
                            }}
                        />
                    </Layout.Section>
                </Layout>

                {/*<Layout>*/}
                {/*    <Layout.Section>*/}
                {/*        <LegacyCard title={"Headless Settings"}*/}
                {/*                    actions={{*/}
                {/*                        content: <Button onClick={getHeadlessToken} loading={isLoading}>Generate*/}
                {/*                            Token</Button>*/}
                {/*                    }}*/}
                {/*                    sectioned>*/}
                {/*            <FormLayout>*/}
                {/*                <FormLayout.Group>*/}
                {/*                    <LegacyStack vertical spacing={"tight"}>*/}
                {/*                        <label>Domain</label>*/}
                {/*                        <TagsInput*/}
                {/*                            className={`react-tagsinput`}*/}
                {/*                            value={headLess.domain || []}*/}
                {/*                            onChange={(value) => onChange({target: {name: "domain", value}})}*/}
                {/*                            pasteSplit={defaultPasteSplit}*/}
                {/*                            addOnPaste={true}*/}
                {/*                            onlyUnique={true}*/}
                {/*                            inputProps={{placeholder: 'Enter domain'}}/> vertical spacing={"tight"}*/}
                {/*                    </LegacyStack>*/}
                {/*                    <CopyCode label={"Access Token"} value={headLess.token}/>*/}
                {/*                </FormLayout.Group>*/}
                {/*            </FormLayout>*/}
                {/*        </LegacyCard>*/}
                {/*    </Layout.Section>*/}
                {/*    <Layout.Section>*/}
                {/*        <PageActions*/}
                {/*            primaryAction={{*/}
                {/*                content: 'Save',*/}
                {/*                onAction: updateHeadless,*/}
                {/*                loading: isTokenLoading*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </Layout.Section>*/}
                {/*</Layout>*/}
            </Page>
        </Fragment>
    );
};


