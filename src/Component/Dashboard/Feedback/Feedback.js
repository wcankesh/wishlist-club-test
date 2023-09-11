import React from 'react';
import {
  LegacyCard, Button, LegacyStack, Text, ButtonGroup
} from '@shopify/polaris';
import {
  SmileyHappyMajor, SmileySadMajor
} from '@shopify/polaris-icons';

const Feedback = () => {
  return (
    <React.Fragment>
      <LegacyCard title={"Share your feedback"}>
        <LegacyCard.Section>
          <LegacyStack wrap={false} alignment="center" spacing="none">
            <LegacyStack.Item fill>
              <LegacyStack vertical>
                <Text>How would you describe your experience using the Wishlist Club app?</Text>
                <ButtonGroup>
                  <Button size="slim" outline icon={SmileyHappyMajor}
                          onClick={() => window.open("https://apps.shopify.com/wishlist-club#modal-show=WriteReviewModal", "_blank")}>Good</Button>
                  <Button size="slim" outline icon={SmileySadMajor} onClick={() => window.Beacon("toggle")}>Bad</Button>
                </ButtonGroup>
              </LegacyStack>
            </LegacyStack.Item>
            <img width="100px"
                 src={"https://cdn.shopify.com/shopifycloud/discovery_app/bundles/cf65cfedfd71f577120a557e3b5f3baad816c9476e76a2fefdcf67d94efe4e34.svg"}/>
          </LegacyStack>
        </LegacyCard.Section>
      </LegacyCard>
    </React.Fragment>
  );
};

export default Feedback;