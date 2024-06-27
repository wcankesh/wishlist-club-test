import React from 'react';
import {Card, Layout} from "@shopify/polaris";
import {useNavigate} from "react-router-dom";

const PostScript = () => {
    const navigate = useNavigate();
    return (
        <Layout>
            <Layout.Section variant="fullWidth">
                <Card>PostScript</Card>
            </Layout.Section>
        </Layout>
    )
}

export default PostScript