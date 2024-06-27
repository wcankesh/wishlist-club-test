import React from 'react';
import {BlockStack, Card, Checkbox, Divider, InlineStack, Link, List, Text, TextField} from "@shopify/polaris";
import {isChecked, LabelWrapper, toggleFlag} from "../../../../utils/CommonJS";
import {KlaviyoPin} from "../../../../utils/AppImages";
import {AppDocsLinks} from "../../../../utils/AppDocsLinks";
import {formValidate} from "../CommonUse/CommonUse";

const keyFeature = [
    {
        title: 'Automated Back-in-Stock Notifications',
        text: 'Notify customers when wishlist items are back in stock using Klaviyo’s email and SMS automation.'
    },
    {
        title: 'Wishlist-Based Customer Segmentation',
        text: 'Segment customers based on wishlist activity for targeted marketing campaigns.'
    },
    {
        title: 'Personalized Wishlist Reminders',
        text: 'Send personalized reminders to customers about their wishlist items to encourage purchases.'
    },
    {
        title: 'Seamless Data Synchronization',
        text: 'Sync wishlist data from Wishlist Club with Klaviyo for enhanced customer insights.'
    },
    {title: 'Tailored Product Recommendations', text: 'Recommend products based on individual customer wishlist data.'},
    {
        title: 'Wishlist Campaign Analytics',
        text: 'Track and analyze the performance of wishlist-related marketing campaigns for optimization.'
    },
];
const keyTriggers = [
    {text: 'Wishlist Item Back in Stock'},
    {text: 'Price Drop on Wishlist Item'},
];
const upcomingList = [
    {text: 'Item Added to Wishlist'},
    {text: 'Item Removed from Wishlist'},
    {text: 'Wishlist Item Low in Stock'},
    {text: 'Wishlist Reminder'},
    {text: 'Abandoned Wishlist'},
]

const Klaviyo = ({klaviyoProps,currentType}) => {
    const { selectedOption, klaviyo, setKlaviyo, klaviyoError, setKlaviyoError} = klaviyoProps;

    const onChangeKlaviyo = (name, value) => {
        let updatedState;
        if (name === 'is_klaviyo_connect' && !isChecked(value)) {
            updatedState = {...klaviyo, public_key: '', secret_key: '', [name]: value}
            setKlaviyoError({public_key: '', secret_key: ''})
        } else {
            updatedState = {...klaviyo, [name]: value}
            const errorMessage = formValidate(name, value,currentType);
            setKlaviyoError({...klaviyoError, [name]: errorMessage});
        }
        setKlaviyo(updatedState);
    }

    const displayIntroduction = () => {
        return (
            <BlockStack gap={'400'}>
                <BlockStack gap={'150'}>
                    <Text as={'span'} variant={'headingMd'}>{`About`}</Text>
                    <Text
                        as={'span'}>{`Klaviyo is a marketing automation shopify app that automates eCommerce SMS and email marketing to help businesses acquire, retain and grow customers by sending marketing emails.`}</Text>
                </BlockStack>
                <BlockStack gap={'150'}>
                    <Text as={'span'} variant={'headingMd'}>{`Integration Key Features`}</Text>

                    <List>
                        {(keyFeature || []).map((x, i) => {
                            return (
                                <List.Item key={i}>
                                    <Text as={'span'} breakWord fontWeight={'medium'}
                                          variant={'headingSm'}>{x.title}: </Text>
                                    <Text as={'span'} breakWord variant={'bodySm'}>{x.text}</Text>
                                </List.Item>
                            )
                        })}
                    </List>
                </BlockStack>
                <BlockStack gap={'150'}>
                    <Text as={'span'} variant={'headingMd'}>{`Triggers`}</Text>
                    <List type="number">
                        {(keyTriggers || []).map((x, i) => {
                            return (
                                <List.Item key={i}>
                                    <Text as={'span'} breakWord variant={'bodySm'}>{x.text}</Text>
                                </List.Item>
                            )
                        })}
                    </List>
                </BlockStack>
                <BlockStack gap={'150'}>
                    <Text as={'span'} variant={'headingMd'}>{`Will be Release soon`}</Text>
                    <List type="number">
                        {(upcomingList || []).map((x, i) => {
                            return (
                                <List.Item key={i}>
                                    <Text as={'span'} breakWord variant={'bodySm'}>{x.text}</Text>
                                </List.Item>
                            )
                        })}
                    </List>
                </BlockStack>
            </BlockStack>
        )
    }

    const displaySetup = () => {
        return (
            <BlockStack gap={'400'}>
                <BlockStack gap={'150'}>
                    <Text as={'span'} variant={'headingMd'}>{`Setup Guide`}</Text>
                    <Text as={'span'}>
                        {`If you’ve already set up your Klaviyo account, fantastic! If not, you can do so easily from`}<Link
                        url="https://www.klaviyo.com/" external removeUnderline>{' '}this{' '} </Link>page.</Text>
                </BlockStack>

                <BlockStack>
                    <LabelWrapper label={`Step 1: Activate the Wishlist Club events in Klaviyo`}/>
                    <Checkbox
                        label="Connect"
                        name={'is_klaviyo_connect'}
                        checked={isChecked(klaviyo?.is_klaviyo_connect)}
                        onChange={() => onChangeKlaviyo('is_klaviyo_connect', toggleFlag(klaviyo?.is_klaviyo_connect))}/>
                </BlockStack>
                <TextField
                    label={`Step 2: Enter Klaviyo public API key`}
                    name={'public_key'}
                    value={klaviyo?.public_key}
                    onChange={(value) => onChangeKlaviyo('public_key', value)}
                    placeholder={`Aq6Kwa`}
                    disabled={!isChecked(klaviyo?.is_klaviyo_connect)}
                    error={klaviyoError?.public_key}
                    helpText={
                        <Text>{`The Public API key can be found in Klaviyo -> Account -> Settings -> API Keys > Public API Key / site ID.`}{' '}
                            <Link url={AppDocsLinks.klaviyoApiKey} external removeUnderline>
                                {`Click here`}
                            </Link></Text>
                    }
                />

                <TextField
                    label={`Step 3: Enter Klaviyo private API key`}
                    name={'secret_key'}
                    value={klaviyo?.secret_key}
                    onChange={(value) => onChangeKlaviyo('secret_key', value)}
                    placeholder={`pk_abc123def456ghi789jkl0mno123pqrst4`}
                    disabled={!isChecked(klaviyo?.is_klaviyo_connect)}
                    error={klaviyoError?.secret_key}
                    helpText={
                        <Text>{`The Private API key can be found in Klaviyo -> Account -> Settings -> API Keys > Private API Keys.`}{' '}
                            <Link url={AppDocsLinks.klaviyoApiKey} external removeUnderline>
                                {`Click here`}
                            </Link></Text>
                    }
                />
                <Text as={'span'} variant={'bodyMd'} tone={'caution'}>
                    <b>{`Note: `}</b>
                    {`If you activate the Klaviyo integration, the price drop and back-in-stock email notifications will be turned off in the Wishlist Club app to avoid sending duplicate emails.`}
                </Text>
            </BlockStack>
        )
    }

    return (
        <Card>
            <BlockStack gap={'200'}>
                <InlineStack>
                    <img src={KlaviyoPin} alt={'klaviyo'} width={'150px'} height={'58px'}/>
                </InlineStack>
                <Divider/>
                {selectedOption === "1" && displayIntroduction()}
                {selectedOption === "2" && displaySetup()}
            </BlockStack>
        </Card>

    )
}

export default Klaviyo
