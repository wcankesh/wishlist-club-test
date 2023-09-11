import React, {Fragment, useState, useCallback, useEffect} from 'react';
import {
  Page,
  Layout,
  LegacyCard,
  Tabs,
  Pagination,
  Badge,
  Link,
  LegacyStack,
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
  const [email, setEmail] = useState({lists: []});
  const [importHistory, setImportHistory] = useState({lists: []});
  const [PageNo, setPageNo] = useState(1)
  const [EmailPageNo, setEmailPageNo] = useState(1)
  const [importHisPageNo, setImportHisPageNo] = useState(1)
  const [ProductPage, setProductPage] = useState(1)
  const [totalProduct, setTotalProduct] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [emailPage, setEmailPage] = useState(1);
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
  const totalPageCountEmail = Math.ceil(emailPage / limit)
  const totalPageCountImport = Math.ceil(importHisPage / limit)

  useEffect(() => {
    WishlistAnalytics();
  }, [PageNo, ProductPage])

  useEffect(() => {
    Email();
  }, [EmailPageNo])
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

  const Email = async () => {
    setIsLoading(true);
    const payload = {
      page_no: EmailPageNo,
      limit: limit,
    }
    const response = await apiService.Email(payload);
    if (response.status === 200) {
      setEmail(response.data)
      setEmailPage(response.data.total)
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
  const ImportWishlistHistory = async () => {
    setIsLoading(true);
    const payload = {
      page_no: importHisPageNo,
      limit: limit,
    }
    const response = await apiService.ImportWishlistHistory(payload);
    if (response.status === 200) {
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
    }

  }

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const handleChange = useCallback(() => setActive(!active), [active]);

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
    <LegacyStack alignment={"center"} vertical>
      <br/>
      <div>
        {file.name}{' '}
        <Text variant="bodySm" as="p">
          {file.size} bytes
        </Text>
      </div>
    </LegacyStack>
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

  const onChangePaginationEmail = (value) => {
    let pCount = EmailPageNo
    if (value === "plus") {
      pCount = pCount + 1;
    } else {
      pCount = pCount - 1;
    }
    setEmailPageNo(pCount)
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
      id: 'repeat-customers-1',
      content: 'Email History',
      panelID: 'repeat-customers-content-1',
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
  const resourceNameEmail = {
    singular: 'email history',
    plural: 'email historys',
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
          <CustomErrorBanner message={message} setMessage={setMessage} setIsError={setIsError} isError={isError}
                             link={""}/>
          <Layout.Section>
            <LegacyCard>
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
                    <IndexTable.Row key={i} id={i}>
                      <IndexTable.Cell>
                        <LegacyStack alignment="center" wrap={false}>
                          <Thumbnail size={"small"} source={x.product.image}/>
                          <LegacyStack.Item fill>
                            <Text as={"span"}>{x.product.title}</Text>
                          </LegacyStack.Item>
                        </LegacyStack>
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
                              activator={<Button textAlign={"end"} plain
                                                 disclosure={popoverActive === i ? 'up' : 'down'}
                                                 onClick={() => togglePopoverActive(i)}>{y.products.length} Products</Button>}
                              onClose={() => togglePopoverActive(i)}
                              ariaHaspopup={false}
                            >
                              <Popover.Pane>
                                <ResourceList items={y.products} renderItem={(item) => {
                                  const {title} = item
                                  return (
                                    <ResourceList.Item>
                                      <LegacyStack alignment="center" spacing={"extraTight"} wrap={false}>
                                        <Thumbnail size={"small"} source={item.image}/>
                                        <Text as={"span"}>{title}</Text>
                                      </LegacyStack>
                                    </ResourceList.Item>
                                  )
                                }}/>
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
                  resourceName={resourceNameEmail}
                  itemCount={isLoading ? 0 : email.lists.length}
                  emptyState={<EmptySearchResult title={'No email history found'}
                                                 withIllustration={(!isLoading) || !isLoading}/>}
                  loading={isLoading}
                  headings={[
                    {title: 'Email'},
                    {title: 'Email Type'},
                    {title: 'Date'},
                    {title: 'Email Status'},
                  ]}
                  selectable={false}
                >
                  {
                    email.lists.map((z, k) => {
                      return (
                        <IndexTable.Row key={k} id={k}>
                          <IndexTable.Cell>
                            <Text as={"span"}>{z.email}</Text>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <span
                              className={`custom-badge badge-type-${z.type}`}>{`${z.type == 1 ? "Wishlist reminder" : z.type == 2 ? "Price drop alert" : z.type == 3 ? "Restock alert" : z.type == 4 ? "Share wishlist" : z.type == 5 ? "Back In Stock thank you" : z.type == 6 ? "Back In Stock alert" : ""}`}</span>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <Text>{z.created_at}</Text>
                          </IndexTable.Cell>
                          <IndexTable.Cell>
                            <Text>{z.message_id ? <Badge status="success">Sent</Badge> : ""}</Text>
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
                          label={EmailPageNo}
                          hasPrevious={EmailPageNo > 1}
                          onPrevious={() => onChangePaginationEmail('minus')}
                          hasNext={EmailPageNo < totalPageCountEmail}
                          onNext={() => onChangePaginationEmail('plus')}
                        />
                      </div>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                </IndexTable>
              }
              {
                selected === 3 && <IndexTable
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
                            <Text as={"span"}>{z?.status == 0 ? <Badge status="critical">Fail</Badge> : z?.status == 1 ? <Badge status="success">Success</Badge> :z?.status == 2 ? <Badge status="attention">Fail</Badge> : null  }</Text>
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

            </LegacyCard>
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
            <LegacyStack vertical spacing={"baseTight"}>
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
            </LegacyStack>
          </Modal.Section>
        </Modal>
      </Page>
    </Fragment>
  );
};

export default WishlistItems;