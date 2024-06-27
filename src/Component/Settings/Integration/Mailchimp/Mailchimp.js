import React from 'react';
import {Card, Layout} from "@shopify/polaris";
import {useNavigate} from "react-router-dom";

const Mailchimp = () => {
    const navigate = useNavigate();
    return (
        <Layout>
            <Layout.Section variant="fullWidth">
                <Card>Mailchimp</Card>
            </Layout.Section>
        </Layout>
    )
}

export default Mailchimp