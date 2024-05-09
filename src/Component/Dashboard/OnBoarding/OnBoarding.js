import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
  Text,
  Button,
  BlockStack,
  Card,
  InlineStack,
  Collapsible,
  Icon,
  Link,
  Divider, Box, ButtonGroup
} from "@shopify/polaris"
import {CaretUpMinor, CaretDownMinor,TickMinor} from "@shopify/polaris-icons"
import ToastMessage from "../../Comman/ToastMessage";
import {apiService, baseUrl} from "../../../utils/Constant";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom"

const OnBoarding = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true);
  const [selectedBoarding, setSelectedBoarding] = useState(0)
  const [themeList, setThemeList] = useState([])
  const [message, setMessage] = useState("")
  const shopDetails = useSelector((state) => state.shopDetails)

  useEffect(() => {
    const getThemes = async () => {
      const response = await apiService.getThemes();
      if (response.status === 200) {
        let newArray = [];
        response.data.map((x, i) => {
          let Obj = {
            label: x.name,
            value: x.id.toString()
          }
          newArray.push(Obj)
        })
        setThemeList(newArray);
      }
    }
    getThemes();
  }, [])

  const handleToggle = () => {
    setOpen(!open)
  };

  const boardingOptions = [
    {
      selected: 0,
      title: "Activate Wishlist Club Embed"
    },
    {
      selected: 1,
      title: "Add Wishlist Block to Collection and Product Pages"
    },
    {
      selected: 2,
      title: "Add Wishlist Icon or Menu in Header"
    },
    {
      selected: 3,
      title: "Add Back in Stock Block to Collection and Product Pages"
    },
    {
      selected: 4,
      title: "Customize Wishlist & Back in Stock Layout"
    },
  ]
  const onBoardingStepChange = (url)=>{
    window.open(url,"_blank");
  }

  return (
    <Fragment>
      <ToastMessage message={message} setMessage={setMessage} isErrorServer={false}/>

      <Card padding={"0"}>
        <Box padding={"400"}>
          <div className={"reb-card-heading-boding"} onClick={handleToggle}>
            <BlockStack>
              <InlineStack wrap={false} align={"space-between"}>
                <Text variant="headingSm" as="span" fontWeight={"medium"}
                      breakWord={true}>{"Wishlist app setting is easy just follow 1 to 5 steps to set up and display wishlist icon on your store."}</Text>
                <div onClick={handleToggle}><Icon source={open ? CaretUpMinor : CaretDownMinor}/>
                </div>
              </InlineStack>
            </BlockStack>
          </div>
        </Box>

        <Collapsible
          open={open} id="basic-collapsible" expandOnPrint
          transition={{duration: "500ms", timingFunction: "ease-in-out"}}>

          <Divider/>

          <Box padding={"200"}>
            {
              (boardingOptions || []).map((x, i) => {
                return (
                  <Fragment key={i}>
                    <div onClick={() => setSelectedBoarding(x.selected)}>
                      <div className={"reb-card-analytics"}
                           style={{background: selectedBoarding === x.selected ? 'var(--p-color-bg-surface-secondary)' : ""}}>
                        <BlockStack gap={"0"}>
                          <InlineStack gap="300" wrap={false}>
                            <div
                              className={`boding-count ${selectedBoarding === x.selected ? "boding-count-active" : ""}`}>
                              {/*{i + 1}*/}
                              {selectedBoarding === x.selected ? <Icon source={TickMinor} />:""}

                            </div>
                            {selectedBoarding === x.selected ?
                              <Text variant="headingSm" as="span"
                                    fontWeight={"medium"}>{x.title}</Text> :
                              <Text variant="headingSm" as="span"
                                    fontWeight={"regular"}>{x.title}</Text>}
                          </InlineStack>

                          <InlineStack>
                            {selectedBoarding === x.selected && x.selected === 0 && (
                              <div style={{paddingLeft: 32}}>
                                <Box paddingBlockStart={"200"} paddingInlineEnd={"200"}>
                                  <BlockStack gap="300">
                                    <Text as="span">Click on the Activate button to enable the Wishlist Club embed. Make
                                      sure to save your adjustments to make them active.</Text>
                                    <InlineStack>
                                      <Button variant="primary"
                                              onClick={() => window.open(shopDetails?.on_boardig?.extension, '_blank')}>Activate</Button>
                                    </InlineStack>
                                  </BlockStack>
                                </Box>
                              </div>
                            )}
                            {selectedBoarding === x.selected && x.selected === 1 && (
                              <div style={{paddingLeft: 32}}>
                                <Box paddingBlockStart={"200"} paddingInlineEnd={"200"}>
                                  <BlockStack gap={"300"}>
                                    <Text as="span">Elevate your customers' shopping journey by incorporating the Wishlist
                                      Block on your Collection and Product Pages. To add the wishlist block to your
                                      collection page, simply click the "Add Collection Block" button, and for the
                                      product page, click the "Add Product Block" button. Remember to save your changes
                                      to activate the Wishlist Block.</Text>
                                    <ButtonGroup>
                                      <Button variant="primary"
                                               onClick={() => window.open(shopDetails?.on_boardig?.collection, '_blank')}>Add Collection Block</Button>
                                      <Button variant="primary"
                                              onClick={() => window.open(shopDetails?.on_boardig?.wishlist, '_blank')}>Add
                                        Product Block</Button>
                                    </ButtonGroup>
                                  </BlockStack>
                                </Box>
                              </div>
                            )}
                            {selectedBoarding === x.selected && x.selected === 2 && (
                              <div style={{paddingLeft: 32}}>
                                <Box paddingBlockStart={"200"} paddingInlineEnd={"200"}>
                                  <BlockStack gap={"400"}>
                                    <BlockStack gap={"200"}>
                                      <Text as="span" variant="headingSm" fontWeight={"medium"}>Add Wishlist Icon in
                                        Header</Text>
                                      <Text as="span">Add the wishlist icon to your header by clicking on the "Add Wishlist
                                        Icon" button.</Text>
                                      <InlineStack>
                                        <Button variant="primary"
                                                onClick={() => window.open(shopDetails?.on_boardig?.head, '_blank')}>Add
                                          Wishlist Icon</Button>
                                      </InlineStack>
                                    </BlockStack>
                                    <BlockStack gap={"200"}>
                                      <Text variant="headingSm" as="span" fontWeight={"medium"}>Add Wishlist Menu in
                                        Header</Text>
                                      <Text variant="headingSm" as="span" fontWeight={"medium"}>Follow the steps below to
                                        include the Wishlist Menu in the header.</Text>
                                      <Text as={"span"}>1. Open your Shopify store main navigation<Link
                                        url={`https://${shopDetails.shop}/admin/themes`}
                                        removeUnderline external> open</Link></Text>
                                      <Text as={"span"}>2. Add the wishlist icon to your header by clicking on the "Add Wishlist
                                        Icon" button.</Text>
                                      <Text as={"span"}>3. Choose menu name.</Text>
                                      <Text as={"span"}>4. Paste the following link into the Link
                                        text box: <Text as={"span"}
                                                        fontWeight={"bold"}>/apps/wishlist/</Text></Text>
                                      <Text as={"span"}>5. Click on Save Menu</Text>
                                    </BlockStack>
                                  </BlockStack>
                                </Box>
                              </div>
                            )}
                            {selectedBoarding === x.selected && x.selected === 3 && (
                              <div style={{paddingLeft: 32}}>
                                <Box paddingBlockStart={"200"} paddingInlineEnd={"200"}>
                                  <BlockStack gap="300">
                                    <Text as="span">Keep your customers in the loop and boost their shopping experience by
                                      seamlessly integrating the Back in Stock Block into your Collection and Product
                                      Pages. Click "Add Back in Stock to Collection Page" to integrate the block on the
                                      collection page, and for the product page, click "Add Back in Stock to Product
                                      Page" Don't forget to save your changes to activate the Back in Stock
                                      Block.</Text>
                                    <ButtonGroup>
                                      <Button variant="primary"
                                              onClick={() => window.open(shopDetails?.on_boardig?.bis_collection, '_blank')}>Add
                                        Back in Stock to Collection Page</Button>
                                      <Button variant="primary"
                                              onClick={() => window.open(shopDetails?.on_boardig?.bis, '_blank')}>Add
                                        Back in Stock to Product Page</Button>
                                    </ButtonGroup>
                                  </BlockStack>
                                </Box>
                              </div>
                            )}
                            {selectedBoarding === x.selected && x.selected === 4 && (
                              <div style={{paddingLeft: 32}}>
                                <Box paddingBlockStart={"200"} paddingInlineEnd={"200"}>
                                  <BlockStack gap="300">
                                    <Text as="span">Customize the layout of Wishlist and Back in Stock effortlessly. Click
                                      on "Customize Wishlist" to modify the Wishlist layout, and click on "Customize
                                      Back in Stock" to customize the Back in Stock appearance.
                                    </Text>
                                    <ButtonGroup>
                                      <Button variant="primary"
                                              onClick={() =>navigate(`${baseUrl}/settings/wishlist-design`)}>Customize
                                        Wishlist</Button>
                                      <Button variant="primary" onClick={() =>navigate(`${baseUrl}/back-in-stock/design`)}>Customize
                                        Back in Stock</Button>
                                    </ButtonGroup>
                                  </BlockStack>
                                </Box>
                              </div>
                            )}

                          </InlineStack>
                        </BlockStack>
                      </div>
                    </div>
                  </Fragment>
                )
              })
            }
          </Box>
        </Collapsible>
      </Card>
    </Fragment>
  );
};

export default OnBoarding;