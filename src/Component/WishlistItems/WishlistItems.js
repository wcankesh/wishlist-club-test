import React, {Fragment, useState, useCallback, useEffect} from 'react';
import {
  Page,
  Layout,
    BlockStack,
    InlineStack,
    Card,
  Tabs,
  Pagination,
  Badge,
  Link,
  Thumbnail,
  Text,
  Popover,
  Button,
  ResourceList,
  Modal,
  DropZone,
  IndexTable,
  EmptySearchResult
} from "@shopify/polaris"
import moment from "moment";
import {apiService, capitalizeMessage, currencySymbol} from "../../utils/Constant";
import {useSelector} from "react-redux";
import ToastMessage from "../Comman/ToastMessage";
import CustomErrorBanner from "../Comman/CustomErrorBanner";


const WishlistItems = () => {
  const limit = 10;
  const [selected, setSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isImportLoading, setIsImportLoading] = useState(false);
  const [wlProduct, setWlProduct] = useState([]);
  const [wlUser, setWlUser] = useState([]);
  const [importHistory, setImportHistory] = useState({lists: []});
  const [PageNo, setPageNo] = useState(1)
  const [importHisPageNo, setImportHisPageNo] = useState(1)
  const [ProductPage, setProductPage] = useState(1)
  const [totalProduct, setTotalProduct] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [importHisPage, setImportHisPage] = useState(1);
  const [popoverActive, setPopoverActive] = useState(null);
  const [active, setActive] = useState(false);
  const [file, setFile] = useState("")
  const [isError, setIsError] = useState(false)
  const [isErrorServer, setIsErrorServer] = useState(false)
  const [message, setMessage] = useState("")
  const shopDetails = useSelector((state) => state.shopDetails)

  const totalPageCountProduct = Math.ceil(totalProduct / limit)
  const totalPageCountUser = Math.ceil(userPage / limit)
  const totalPageCountImport = Math.ceil(importHisPage / limit)

  useEffect(() => {
    WishlistAnalytics();
  }, [PageNo, ProductPage])

  useEffect(() => {
    ImportWishlistHistory();
  }, [importHisPageNo])

  const WishlistAnalytics = async () => {
    setIsLoading(true);
    const payload = {
      page_no: PageNo,
      limit: limit,
      product_page: ProductPage
    }
    const response = await apiService.WishlistAnalytics(payload);
    if (response.status === 200) {
      setIsError(false)
      setWlProduct(response.data.products)
      setWlUser(response.data.user_wishlist)
      setTotalProduct(response.data.totalProduct)
      setUserPage(response.data.totalUser)
      setIsLoading(false)
    } else if (response.status === 500) {
      setMessage(capitalizeMessage(response.message))
      setIsErrorServer(true);
      setIsLoading(false)
    } else {
      setMessage(capitalizeMessage(response.message))
      setIsError(true)
      setIsLoading(false)
    }
  }

  const ImportWishlistHistory = async () => {
    setIsLoading(true);
    const payload = {
      page_no: importHisPageNo,
      limit: limit,
    }
    const response = await apiService.ImportWishlistHistory(payload);
    if (response.status === 200) {
      setIsError(false)
      setImportHistory(response.data)
      setImportHisPage(response.data.total)
      setIsLoading(false);
    } else if (response.status === 500) {
      setMessage(capitalizeMessage(response.message))
      setIsErrorServer(true);
      setIsLoading(false)
    } else {
      setMessage(capitalizeMessage(response.message))
      setIsError(true)
      setIsLoading(false)
    }
  }

  const Export = async () => {
    const payload = {
      shop: shopDetails.shop
    }
    const response = await apiService.getExport(payload);
  }

  const Import = async () => {
    setMessage("")
    setIsError(false)
    setIsImportLoading(true)
    const formData = new FormData();
    formData.append("file", file)
    const response = await apiService.Import(formData, true)
    if (response.status === 200) {
      setFile("")
      setIsImportLoading(false)
      setMessage(capitalizeMessage(response.message))
      setActive(false);
    } else if (response.status === 500) {
      setMessage(capitalizeMessage(response.message))
      setIsErrorServer(true);
      setIsImportLoading(false)
    } else {
      setMessage(capitalizeMessage(response.message))
      setIsError(true)
      setIsImportLoading(false)
      setActive(false);
    }

  }

  const handleTabChange = useCallback(
      (selectedTabIndex) => setSelected(selectedTabIndex),
      [],
  );
  const handleChange = () => {
    setActive(!active);
    setFile("");
  };

  const togglePopoverActive = (index) => {
    setPopoverActive((prevIndex) => (prevIndex === index ? null : index))
  };

  const handleDropZoneDrop = useCallback(
      (_dropFiles, acceptedFiles, _rejectedFiles) =>
          setFile(acceptedFiles[0]),
      [],
  );

  const fileUpload = !file && <DropZone.FileUpload/>;
  const uploadedFile = file && (
      <BlockStack align={"center"} inlineAlign={"center"} gap={"400" }>
        <br/>
        <div>
          {file.name}{' '}
          <Text variant="bodySm" as="p">
            {file.size} bytes
          </Text>
        </div>
      </BlockStack>
  );

  const onChangePaginationUser = (value) => {
    let pCount = PageNo
    if (value === "plus") {
      pCount = pCount + 1;
    } else {
      pCount = pCount - 1;
    }
    setPageNo(pCount)
  }

  const onChangePaginationProduct = (value) => {
    let pCount = ProductPage
    if (value === "plus") {
      pCount = pCount + 1;
    } else {
      pCount = pCount - 1;
    }
    setProductPage(pCount)
  }

  const onChangePaginationImportHistory = (value) => {
    let pCount = importHisPageNo
    if (value === "plus") {
      pCount = pCount + 1;
    } else {
      pCount = pCount - 1;
    }
    setImportHisPageNo(pCount)
  }

  const tabs = [
    {
      id: 'all-customers-1',
      content: 'Product Wishlist',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'accepts-marketing-1',
      content: 'User Wishlist',
      panelID: 'accepts-marketing-content-1',
    },
    {
      id: 'repeat-customers-2',
      content: 'Wishlist Import History',
      panelID: 'wishlist-import-history',
    },
  ];

  const resourceNameWishlistProduct = {
    singular: 'product wishlist',
    plural: 'product wishlists',
  };
  const resourceNameWishlistUser = {
    singular: 'user wishlist',
    plural: 'user wishlists',
  };
  const resourceNameImportHistory = {
    singular: 'wishlist import history',
    plural: 'wishlist import history',
  };
  return (
      <Fragment>
        <Page title={"Wishlist Items"}
              primaryAction={selected === 0 ? {content: 'Import', onAction: handleChange} : null}
              secondaryActions={selected === 0 ? [{content: 'Export', onAction: Export}] : []}>
          <Layout>
            {message !== "" && isError === false ?
                <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                              setIsErrorServer={setIsErrorServer}/> : ""}
            <CustomErrorBanner link={"https://webcontrive.helpscoutdocs.com/article/422-how-to-check-wishlist-product"} message={message} setMessage={setMessage} setIsError={setIsError} isError={isError}
                               />
            <Layout.Section>
              <Card padding={"0"}>
                <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
                {
                  selected === 0 && <IndexTable
                      resourceName={resourceNameWishlistProduct}
                      itemCount={isLoading ? 0 : wlProduct.length}
                      loading={isLoading}
                      emptyState={<EmptySearchResult title={'No product wishlist found'}
                                                     withIllustration={(!isLoading) || !isLoading}/>}
                      hasMoreItems={isLoading}
                      headings={[
                        {title: 'Product'},
                        {title: 'Price', alignment: 'end'},
                        {title: 'Item Count', alignment: 'end'},
                      ]}
                      selectable={false}

                  >{(wlProduct || []).map((x, i) => {
                    return (
                        <IndexTable.Row key={i} id={i} position={i}>
                          <IndexTable.Cell>
                            <InlineStack blockAlign={"center"} gap={"400"} wrap={false}>
                              <Thumbnail size={"small"} source={x.product.image}/>
                              <Text as={"span"}>{x.product.title}</Text>
                            </InlineStack>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <Text alignment={"end"}>{currencySymbol[shopDetails.currency]}{x.product.price}</Text>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <Text alignment={"end"}>{x.total}</Text>
                          </IndexTable.Cell>
                        </IndexTable.Row>
                    )

                  })}
                    <IndexTable.Row>
                      <IndexTable.Cell>
                        &nbsp;
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        &nbsp;
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <div className={"d-flex"} style={{justifyContent: "end"}}>
                          <Pagination
                              label={ProductPage}
                              hasPrevious={ProductPage > 1}
                              onPrevious={() => onChangePaginationProduct('minus')}
                              hasNext={ProductPage < totalPageCountProduct}
                              onNext={() => onChangePaginationProduct('plus')}
                          />
                        </div>

                      </IndexTable.Cell>
                    </IndexTable.Row>
                  </IndexTable>
                }
                {
                  selected === 1 && <IndexTable
                      resourceName={resourceNameWishlistUser}
                      itemCount={isLoading ? 0 : wlUser.length}
                      emptyState={<EmptySearchResult title={'No user wishlist found'}
                                                     withIllustration={(!isLoading) || !isLoading}/>}
                      loading={isLoading}
                      headings={[
                        {title: 'Name'},
                        {title: 'Email'},
                        {title: 'Item Count'},
                        {title: 'Last Update'},
                      ]}
                      selectable={false}
                  >
                    {
                      wlUser.map((y, i) => {
                        return (
                            <IndexTable.Row key={i} id={i}>
                              <IndexTable.Cell>
                                <Text>{(y.first_name || y.last_name) ? `${y.first_name} ${y.last_name}` : "Guest"}</Text>
                              </IndexTable.Cell>
                              <IndexTable.Cell>
                                <Text>{y.email ? y.email : " - "}</Text>
                              </IndexTable.Cell>
                              <IndexTable.Cell>
                                <Popover
                                    sectioned
                                    active={popoverActive === i}
                                    activator={<Button variant={"plain"} textAlign={"end"}
                                                       disclosure={popoverActive === i ? 'up' : 'down'}
                                                       onClick={() => togglePopoverActive(i)}>{y.products.length} Products</Button>}
                                    onClose={() => togglePopoverActive(i)}
                                    ariaHaspopup={false}
                                >
                                  <Popover.Pane>
                                    <div className={"remove-cursor"}>
                                      <ResourceList items={y.products} renderItem={(item) => {
                                        const {title} = item
                                        return (
                                            <ResourceList.Item>
                                              <InlineStack gap={"400"} blockAlign={"center"} wrap={false}>
                                                <Thumbnail size={"small"} source={item.image}/>
                                                <Text as={"span"}>{title}</Text>
                                              </InlineStack>
                                            </ResourceList.Item>
                                        )
                                      }}/>
                                    </div>
                                  </Popover.Pane>
                                </Popover>
                              </IndexTable.Cell>
                              <IndexTable.Cell>
                                <Text>{moment(y.updated_at).format("L")}</Text>
                              </IndexTable.Cell>
                            </IndexTable.Row>
                        )
                      })
                    }

                    <IndexTable.Row>
                      <IndexTable.Cell>
                        &nbsp;
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        &nbsp;
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        &nbsp;
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <div className={"d-flex"} style={{justifyContent: "end"}}>
                          <Pagination
                              label={PageNo}
                              hasPrevious={PageNo > 1}
                              onPrevious={() => onChangePaginationUser('minus')}
                              hasNext={PageNo < totalPageCountUser}
                              onNext={() => onChangePaginationUser('plus')}
                          />
                        </div>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  </IndexTable>
                }
                {
                  selected === 2 && <IndexTable
                      resourceName={resourceNameImportHistory}
                      itemCount={isLoading ? 0 : importHistory.lists.length}
                      emptyState={<EmptySearchResult title={'No wishlist import history found'}
                                                     withIllustration={(!isLoading) || !isLoading}/>}
                      loading={isLoading}
                      headings={[
                        {title: 'Status'},
                        {title: 'Created At'},
                        {title: 'Excute Time'},
                        {title: 'Total'},
                      ]}
                      selectable={false}
                  >
                    {
                      importHistory.lists.map((z, k) => {
                        return (
                            <IndexTable.Row key={k} id={k}>
                              <IndexTable.Cell>
                                <Text as={"span"}>{z?.status == 0 ? <Badge tone="critical">Fail</Badge> : z?.status == 1 ? <Badge tone="success">Success</Badge> :z?.status == 2 ? <Badge tone="attention">Fail</Badge> : null  }</Text>
                              </IndexTable.Cell>
                              <IndexTable.Cell>
                                <Text as={"span"}>{z?.created_at}</Text>
                              </IndexTable.Cell>
                              <IndexTable.Cell>
                                <Text as={"span"}>{z?.execute_time ? z?.execute_time : "-" }</Text>
                              </IndexTable.Cell>
                              <IndexTable.Cell>
                                <Text as={"span"}>{z?.total}</Text>
                              </IndexTable.Cell>
                            </IndexTable.Row>
                        )
                      })
                    }

                    <IndexTable.Row>
                      <IndexTable.Cell>
                        &nbsp;
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        &nbsp;
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        &nbsp;
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <div className={"d-flex"} style={{justifyContent: "end"}}>
                          <Pagination
                              label={importHisPageNo}
                              hasPrevious={importHisPageNo > 1}
                              onPrevious={() => onChangePaginationImportHistory('minus')}
                              hasNext={importHisPageNo < totalPageCountImport}
                              onNext={() => onChangePaginationImportHistory('plus')}
                          />
                        </div>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  </IndexTable>
                }

              </Card>
            </Layout.Section>
          </Layout>
          <Modal
              open={active}
              onClose={handleChange}
              title="Import your wishlist items"
              primaryAction={{
                content: 'Import',
                onAction: Import,
                loading: isImportLoading
              }}
              secondaryActions={[
                {
                  content: 'Cancel',
                  onAction: handleChange,
                },
              ]}
          >
            <Modal.Section>
              <BlockStack gap={"400"}>
                <Text>If you are not known to the CSV template, download a <Link
                    url="https://wishlist.thimatic-apps.com/assets/images/WishListClubData.csv"
                    removeUnderline download> Sample
                  CSV </Link> template to
                  get an idea about how to deal with CSV format to import wishlist products.</Text>
                <DropZone
                    accept=".csv"
                    type="file"
                    onDrop={handleDropZoneDrop}
                >
                  {uploadedFile}
                  {fileUpload}
                </DropZone>
              </BlockStack>
            </Modal.Section>
          </Modal>
        </Page>
      </Fragment>
  );
};

export default WishlistItems;