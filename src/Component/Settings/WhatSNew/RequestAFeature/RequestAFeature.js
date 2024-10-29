import React from 'react';
import {useNavigate} from "react-router-dom";
import {Card, Layout, Page} from '@shopify/polaris';
import {baseUrl} from "../../../../utils/Constant";

const RequestAFeature = () => {
    const navigate = useNavigate();

    return (
        <Page title="Request a feature" backAction={{content: 'back', onAction: () => navigate(`${baseUrl}/settings/feedback`)}}>
            <Layout>
                <Layout.Section variant={'fullWidth'}>
                    <Card>
                        <iframe src="https://wishlist.quickhunt.app/widget/ideas?widget=189" style={{border: '0px', outline: '0px', width: '100%', height: '100vh'}}/>
                    </Card>
                </Layout.Section>
            </Layout>

        </Page>
    );
};

export default RequestAFeature;