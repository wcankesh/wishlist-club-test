import {
  Card,
  Page,
  Layout,

} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";


export default function HomePage() {
  console.log("==========asdasdasd====")
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            asd
          </Card>
        </Layout.Section>
        <Layout.Section>

        </Layout.Section>
      </Layout>
    </Page>
  );
}
