import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Klaviyo from "../Klaviyo/Klaviyo";
// import Omnisend from "../Omnisend/Omnisend";
// import Mailchimp from "../Mailchimp/Mailchimp";
// import PostScript from "../PostScript/PostScript";
import {badgeSkeleton, isChecked} from "../../../../utils/CommonJS";
import {apiService, baseUrl, capitalizeMessage} from "../../../../utils/Constant";
import {initialConnected, initialKlaviyo, validateForm} from "../CommonUse/CommonUse";
import {Badge, Card, Layout, OptionList, Page, PageActions,} from "@shopify/polaris";
import ToastMessage from "../../../Comman/ToastMessage";
import {RenderLoading} from "../../../../utils/RenderLoading";

const IntegrationDetails = () => {
    const {type} = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isErrorServer, setIsErrorServer] = useState(false);

    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState('');
    const [selectedOption, setSelectedOption] = useState("1");
    const [isUpdated, setIsUpdated] = useState(true);
    const [isConnected, setIsConnected] = useState(initialConnected);

    const [klaviyo, setKlaviyo] = useState(initialKlaviyo);
    const [klaviyoError, setKlaviyoError] = useState({public_key: '', secret_key: ''});

    const currentType = {
        klaviyo: {
            type: 1,
            title: 'Klaviyo',
            isConnected: isChecked(isConnected?.is_klaviyo_connect),
            isEnabled: isChecked(klaviyo?.is_klaviyo_connect)
        },
        omnisend: {
            type: 2,
            title: 'Omnisend',
            isConnected: isChecked(isConnected?.is_omnisend_connect),
            isEnabled: false
        },
        mailchimp: {
            type: 3,
            title: 'Mailchimp',
            isConnected: isChecked(isConnected?.is_mailchimp_connect),
            isEnabled: false
        },
        postscript: {
            type: 4,
            title: 'PostScript',
            isConnected: isChecked(isConnected?.is_postscript_connect),
            isEnabled: false
        },
    }

    const getIntegration = async (type) => {
        const payload = {type: currentType[type].type}
        const response = await apiService.getIntegration(payload);
        if (response.status === 200) {
            if (response.data !== null) {
                const connectedObj = {
                    is_klaviyo_connect: response?.data?.klaviyo?.is_klaviyo_connect,
                    is_omnisend_connect: 0,
                    is_mailchimp_connect: 0,
                    is_postscript_connect: 0,
                }
                setIsConnected(connectedObj);
                if (response?.data?.klaviyo) {
                    const klaviyoData = response?.data?.klaviyo;
                    const klaviyoObj = {
                        id: response?.data?.id,
                        public_key: klaviyoData?.public_key,
                        secret_key: klaviyoData?.secret_key,
                        is_klaviyo_connect: klaviyoData?.is_klaviyo_connect,
                    }
                    setKlaviyo(klaviyoObj);
                }
            } else {
                setIsUpdated(false)
            }
            setIsError(false);
            setIsPageLoading(false)
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
            setIsPageLoading(false)
        }
    }

    useEffect(() => {
        setIsPageLoading(true)
        getIntegration(type);
        // eslint-disable-next-line
    }, [type]);

    const createIntegration = async () => {
        setIsActionLoading('save')
        let payload;
        if (type === "klaviyo") {
            const basePayload = {
                type: 1,
                is_klaviyo_connect: klaviyo?.is_klaviyo_connect,
                public_key: klaviyo?.public_key,
                secret_key: klaviyo?.secret_key,
            }
            payload = isUpdated ? {...basePayload, id: klaviyo?.id} : basePayload;
        }

        const response = await apiService.createIntegration(payload);
        if (response.status === 200) {
            setMessage(capitalizeMessage(response.message));
            setIsError(false);
            setIsUpdated(true);
            setIsActionLoading('');
            getIntegration(type);
        } else {
            setMessage(capitalizeMessage(response.message));
            setIsErrorServer(true);
            setIsActionLoading('');
        }
    }

    const handlePrimaryAction = (value) => {
        if (value === 'next') {
            setSelectedOption('2')
        }
        if (value === 'save') {
            if (!validateForm(klaviyo, setKlaviyoError, currentType[type])) {
                setMessage("Please fix the errors in the form");
                setIsErrorServer(true);
                return;
            }
            createIntegration();
        }
    }

    const klaviyoProps = {selectedOption, klaviyo, setKlaviyo, klaviyoError, setKlaviyoError}

    return (
        <Page backAction={{content: 'Settings', onAction: () => navigate(`${baseUrl}/settings/integration`)}}
              title={`${currentType[type].title}`}
              primaryAction={
                  isPageLoading ? RenderLoading?.badge :
                      <Badge size={'small'} tone={currentType[type].isConnected ? 'success' : 'critical'}>
                          {currentType[type].isConnected ? 'Connected' : 'Not connected'}
                      </Badge>
              }>
            <Layout>
                {message !== "" && isError === false ?
                    <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                                  setIsErrorServer={setIsErrorServer}/> : ""}
                <Layout.Section variant="oneThird">
                    <Card padding={"100"}>
                        <OptionList
                            onChange={(event) => setSelectedOption(event[0])}
                            options={[
                                {value: "1", label: "Introduction"},
                                {value: "2", label: "Setup"},
                            ]}
                            selected={selectedOption}/>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    {type === "klaviyo" && <Klaviyo klaviyoProps={klaviyoProps} currentType={currentType[type]}/>}
                    {/*{type === "omnisend" && <Omnisend/>}*/}
                    {/*{type === "mailchimp" && <Mailchimp/>}*/}
                    {/*{type === "postscript" && <PostScript/>}*/}
                    <PageActions
                        primaryAction={{
                            content: selectedOption === "1" ? 'Next' : 'Save',
                            onAction: () => handlePrimaryAction(selectedOption === "1" ? 'next' : 'save'),
                            loading: isActionLoading === 'save'
                        }}
                    />
                </Layout.Section>
            </Layout>
        </Page>
    )
}

export default IntegrationDetails;