import React, {Fragment, useEffect, useState} from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import {Page, Layout, LegacyCard, Button, FormLayout, LegacyStack, PageActions} from "@shopify/polaris"
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl} from "../../../../utils/Constant";
import {ToastMessage,CopyCode} from "../../../../components";

export default function Headless(){
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
                    <Layout.Section>
                        <LegacyCard title={"Headless Settings"}
                                    actions={{
                                        content: <Button onClick={getHeadlessToken} loading={isLoading}>Generate
                                            Token</Button>
                                    }}
                                    sectioned>
                            <FormLayout>
                                <FormLayout.Group>
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
                                </FormLayout.Group>
                            </FormLayout>
                        </LegacyCard>
                    </Layout.Section>
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
            </Page>
        </Fragment>
    );
};


