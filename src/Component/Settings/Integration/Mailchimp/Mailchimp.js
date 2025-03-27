import React from 'react';
import { BlockStack, Card, Checkbox, Divider, InlineStack, Link, List, Text, TextField } from "@shopify/polaris";
import { isChecked, LabelWrapper, toggleFlag } from "../../../../utils/Constant";
import { MailchimpPin } from "../../../../utils/AppImages";
import { AppDocsLinks } from "../../../../utils/AppDocsLinks";
import { formValidate } from "../CommonUse/CommonUse";

const keyFeature = [
    {
        text: 'Manage subscription actions like starts, pauses, reactivations, and cancellations seamlessly in Mailchimp.'
    },
    {
        text: 'Segment subscribers based on events for precise, timely campaigns, boosting engagement and conversions.'
    },
    {
        text: 'Trigger SMS and email campaigns from subscription events, like upcoming charges or payment failures, to win back customers.'
    },
    {
        text: 'Gain valuable campaign and subscriber insights for informed marketing decisions.'
    },
    { text: 'Below are the subscriptions triggers that are supported.' },
];
const keyTriggers = [
    { text: 'Subscriptions Start' },
    { text: 'Subscriptions Paused' },
    { text: 'Subscriptions Re-active' },
    { text: 'Subscriptions Cancelled' },
    { text: 'Subscriptions Payment Skipped' },
    { text: 'Subscriptions Payment Success' },
    { text: 'Subscriptions Payment Failed' },
    { text: 'Subscriptions Upcoming Charge' }
];

const upcomingList = [
    { text: 'Item Added to Wishlist' },
    { text: 'Item Removed from Wishlist' },
    { text: 'Wishlist Item Low in Stock' },
    { text: 'Wishlist Reminder' },
    { text: 'Abandoned Wishlist' },
]

const Mailchimp = ({ MailchimpProps, currentType }) => {
    const { selectedOption, mailchimp, setMailchimp, MailchimpError, setMailchimpError } = MailchimpProps;
    console.log("Mailchimp", mailchimp);

    const onChangeMailchimp = (name, value) => {
        let updatedState;
        if (name === 'is_Mailchimp_connect' && !isChecked(value)) {
            updatedState = { ...mailchimp, public_key: '', secret_key: '', [name]: value }
            setMailchimpError({ public_key: '', secret_key: '' })
        } else {
            updatedState = { ...mailchimp, [name]: value }
            const errorMessage = formValidate(name, value, currentType);
            setMailchimpError({ ...MailchimpError, [name]: errorMessage });
        }
        console.log("updatedState", updatedState);
        setMailchimp(updatedState);
    }

    const displayIntroduction = () => {
        return (
            <BlockStack gap={'400'}>
                <BlockStack gap={'150'}>
                    <Text as={'span'} variant={'headingMd'}>{`About`}</Text>
                    <Text
                        as={'span'}>{`The email and SMS marketing automations platform that helps you boost opens, clicks, and sales.`}</Text>
                </BlockStack>
                <BlockStack gap={'150'}>
                    <Text as={'span'} variant={'headingMd'}>{`Integration Key Features`}</Text>

                    <List>
                        {(keyFeature || []).map((x, i) => {
                            return (
                                <List.Item key={i}>
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
                {/* <BlockStack gap={'150'}>
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
                </BlockStack> */}
            </BlockStack>
        )
    }

    const displaySetup = () => {
        return (
            <BlockStack gap={'400'}>
                <BlockStack gap={'150'}>
                    <Text as={'span'} variant={'headingMd'}>{`Setup Guide`}</Text>
                    <Text as={'span'}>
                        {`If you’ve already set up your Mailchimp account, fantastic! If not, you can do so easily from`}<Link
                            url="https://www.Mailchimp.com/" external removeUnderline>{' '}this{' '} </Link>page.</Text>
                </BlockStack>

                <BlockStack>
                    <LabelWrapper label={`Step 1: Activate the Wishlist Club events in Mailchimp`} />
                    <Checkbox
                        label="Connect"
                        name={'is_Mailchimp_connect'}
                        checked={isChecked(mailchimp?.is_Mailchimp_connect)}
                        onChange={() => onChangeMailchimp('is_Mailchimp_connect', toggleFlag(mailchimp?.is_Mailchimp_connect))}

                    />
                </BlockStack>
                <TextField
                    label={`Step 2: Enter Mailchimp public API key`}
                    name={'public_key'}
                    value={mailchimp?.public_key}
                    onChange={(value) => onChangeMailchimp('public_key', value)}
                    placeholder={`Aq6Kwa`}
                    disabled={!isChecked(mailchimp?.is_Mailchimp_connect)}
                    error={MailchimpError?.public_key}
                    helpText={
                        <Text>{`The Public API key can be found in Mailchimp -> Account -> Settings -> API Keys > Public API Key / site ID.`}{' '}
                            <Link url={AppDocsLinks.MailchimpSettings} external removeUnderline>
                                {`Click here`}
                            </Link></Text>
                    }
                />

                <TextField
                    label={`Step 3: Enter Mailchimp private API key`}
                    name={'secret_key'}
                    value={mailchimp?.secret_key}
                    onChange={(value) => onChangeMailchimp('secret_key', value)}
                    placeholder={`pk_abc123def456ghi789jkl0mno123pqrst4`}
                    disabled={!isChecked(mailchimp?.is_Mailchimp_connect)}
                    error={MailchimpError?.secret_key}
                    helpText={
                        <Text>{`The Private API key can be found in Mailchimp -> Account -> Settings -> API Keys > Private API Keys.`}{' '}
                            <Link url={AppDocsLinks.MailchimpApiKey} external removeUnderline>
                                {`Click here`}
                            </Link></Text>
                    }
                />
                <Text as={'span'} variant={'bodyMd'} tone={'caution'}>
                    <b>{`Note: `}</b>
                    {`If you activate the Mailchimp integration, the price drop and back-in-stock email notifications will be turned off in the Wishlist Club app to avoid sending duplicate emails.`}
                </Text>
            </BlockStack>
        )
    }

    return (
        <Card>
            <BlockStack gap={'200'}>
                <InlineStack>
                    <img src={MailchimpPin} alt={'Mailchimp'} width={'150px'} height={'58px'} />
                </InlineStack>
                <Divider />
                {selectedOption === "1" && displayIntroduction()}
                {selectedOption === "2" && displaySetup()}
            </BlockStack>
        </Card>

    )
}

export default Mailchimp
