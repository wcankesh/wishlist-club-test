import React from 'react';
import {Card, Layout} from "@shopify/polaris";
import {useNavigate} from "react-router-dom";

const Omnisend = () => {
    const navigate = useNavigate();
    return (

        <Layout>
            <Layout.Section variant="fullWidth">
                <Card>Omnisend</Card>
            </Layout.Section>
        </Layout>

    )
}

export default Omnisend