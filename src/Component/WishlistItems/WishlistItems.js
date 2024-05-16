import React, {Fragment, useState, useCallback, useEffect} from 'react';
import {
    Page, Layout, BlockStack, InlineStack, Card, Pagination, Badge, Link, Thumbnail, Text,
    Popover, Button, ResourceList, Modal, DropZone, IndexTable, EmptySearchResult, OptionList,
    Box,
} from "@shopify/polaris"
import moment from "moment";
import {apiService, capitalizeMessage, currencySymbol} from "../../utils/Constant";
import {useSelector} from "react-redux";
import ToastMessage from "../Comman/ToastMessage";
import CustomErrorBanner from "../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../utils/AppDocsLinks";


const WishlistItems = () => {
    const limit = 10;
    const [selected, setSelected] = useState(["1"]);
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
        const payload = {page_no: PageNo, limit: limit, product_page: ProductPage}
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
        const payload = {page_no: importHisPageNo, limit: limit,}
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
        const payload = {shop: shopDetails.shop}
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
        <BlockStack align={"center"} inlineAlign={"center"} gap={"400"}>
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
        {value: "1", label: 'Product Wishlist'},
        {value: "2", label: 'User Wishlist'},
        {value: "3", label: 'Wishlist Import History'},
    ];

    const resourceNameWishlistProduct = {singular: 'product wishlist', plural: 'product wishlists'};
    const resourceNameWishlistUser = {singular: 'user wishlist', plural: 'user wishlists'};
    const resourceNameImportHistory = {singular: 'wishlist import history', plural: 'wishlist import history'};

    const renderPopoverContent = (products) => {
        return (
            <div className={"remove-cursor"}>
                <ResourceList items={products} renderItem={(item) => {
                    const {title, quantity, created_at, variant_title} = item;
                    return (
                        <ResourceList.Item>
                            <InlineStack gap={"400"} wrap={false}>
                                <Thumbnail size={"small"} source={item.image}/>
                                <BlockStack gap={"100"}>
                                    <Text as={"span"}>{title}</Text>
                                    <InlineStack gap={"100"}>
                                        <Text as={"span"} fontWeight={"semibold"}>Variant :</Text>
                                        <Text as={"span"}>{variant_title}</Text>
                                    </InlineStack>
                                    <InlineStack gap={"100"}>
                                        <Text as={"span"} fontWeight={"semibold"}>Quantity :</Text>
                                        <Text as={"span"}>{quantity}</Text>
                                    </InlineStack>
                                    <InlineStack gap={"100"}>
                                        <Text as={"span"} fontWeight={"semibold"}>Created Date :</Text>
                                        <Text as={"span"}>{moment(created_at).format("DD-MM-YYYY")}</Text>
                                    </InlineStack>
                                </BlockStack>
                            </InlineStack>
                        </ResourceList.Item>
                    );
                }}/>
            </div>
        );
    };

    return (
        <Page title={"Wishlist Items"}
              primaryAction={selected === 0 ? {content: 'Import', onAction: handleChange} : null}
              secondaryActions={selected === 0 ? [{content: 'Export', onAction: Export}] : []}>
            <Layout>
                {message !== "" && isError === false ?
                    <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                                  setIsErrorServer={setIsErrorServer}/> : ""}
                <CustomErrorBanner link={AppDocsLinks.article["422"]} message={message} setMessage={setMessage}
                                   setIsError={setIsError} isError={isError}/>
                <Layout.Section variant="oneThird">
                    <Card padding={"100"}>
                        <OptionList selected={selected} onChange={setSelected} options={tabs}/>
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    {
                        selected.includes("1") &&
                        <Card padding={"025"}>
                            <Box padding={"300"}>
                                <Text as={"span"} variant={"headingMd"}>{`Product Wishlist`}</Text>
                            </Box>
                            <IndexTable
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
                                            <Text
                                                alignment={"end"}>{currencySymbol[shopDetails.currency]}{x.product.price}</Text>
                                        </IndexTable.Cell>
                                        <IndexTable.Cell>
                                            <Text alignment={"end"}>{x.total}</Text>
                                        </IndexTable.Cell>
                                    </IndexTable.Row>
                                )
                            })}
                                <IndexTable.Row>
                                    <IndexTable.Cell>
                                        <Text as={"span"}
                                              fontWeight={"semibold"}> Total: {totalProduct || 0} item(s) </Text>
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        &nbsp;
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        <div className={"d-flex"} style={{justifyContent: "end"}}>
                                            <Pagination
                                                label={`${ProductPage} / ${totalPageCountProduct}`}
                                                hasPrevious={ProductPage > 1}
                                                onPrevious={() => onChangePaginationProduct('minus')}
                                                hasNext={ProductPage < totalPageCountProduct}
                                                onNext={() => onChangePaginationProduct('plus')}
                                            />
                                        </div>
                                    </IndexTable.Cell>
                                </IndexTable.Row>
                            </IndexTable>
                        </Card>
                    }
                    {
                        selected.includes("2") &&
                        <Card padding={"025"}>
                            <Box padding={"300"}>
                                <Text as={"span"} variant={"headingMd"}>{`User Wishlist`}</Text>
                            </Box>
                            <IndexTable
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
                                selectable={false}>
                                {wlUser.map((y, i) => {
                                    return (
                                        <IndexTable.Row key={i} id={i}>
                                            <IndexTable.Cell>
                                                <Text
                                                    as={"span"}>{(y.first_name || y.last_name) ? `${y.first_name} ${y.last_name}` : "Guest"}</Text>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Text as={"span"}>{y.email ? y.email : " - "}</Text>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Popover sectioned active={popoverActive === i}
                                                         activator={<Button variant={"plain"} textAlign={"end"}
                                                                            disclosure={popoverActive === i ? 'up' : 'down'}
                                                                            onClick={() => togglePopoverActive(i)}>{y.products.length} Products</Button>}
                                                         onClose={() => togglePopoverActive(i)}
                                                         ariaHaspopup={false}>
                                                    <Popover.Pane>
                                                        {renderPopoverContent(y.products)}
                                                    </Popover.Pane>
                                                </Popover>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Text as={"span"}>{moment(y.updated_at).format("L")}</Text>
                                            </IndexTable.Cell>
                                        </IndexTable.Row>
                                    )
                                })}
                                <IndexTable.Row>
                                    <IndexTable.Cell>
                                        <Text as={"span"} fontWeight={"semibold"}> Total
                                            : {userPage || 0} item(s) </Text>
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
                                                label={`${PageNo} / ${totalPageCountUser}`}
                                                hasPrevious={PageNo > 1}
                                                onPrevious={() => onChangePaginationUser('minus')}
                                                hasNext={PageNo < totalPageCountUser}
                                                onNext={() => onChangePaginationUser('plus')}
                                            />
                                        </div>
                                    </IndexTable.Cell>
                                </IndexTable.Row>
                            </IndexTable>
                        </Card>
                    }
                    {
                        selected.includes("3") &&
                        <Card padding={"025"}>
                            <Box padding={"300"}>
                                <Text as={"span"} variant={"headingMd"}>{`Wishlist Import History`}</Text>
                            </Box>
                            <IndexTable
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
                                selectable={false}>
                                {importHistory.lists.map((z, k) => {
                                    return (
                                        <IndexTable.Row key={k} id={k}>
                                            <IndexTable.Cell>
                                                <Text as={"span"}>{z?.status == 0 ?
                                                    <Badge tone="critical">Fail</Badge> : z?.status == 1 ?
                                                        <Badge tone="success">Success</Badge> : z?.status == 2 ?
                                                            <Badge tone="attention">Fail</Badge> : null}</Text>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Text as={"span"}>{z?.created_at}</Text>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Text
                                                    as={"span"}>{z?.execute_time ? z?.execute_time : "-"}</Text>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Text as={"span"}>{z?.total}</Text>
                                            </IndexTable.Cell>
                                        </IndexTable.Row>
                                    )
                                })}
                                <IndexTable.Row>
                                    <IndexTable.Cell>
                                        <Text as={"span"} fontWeight={"semibold"}> Total
                                            : {importHisPage || 0} item(s) </Text>
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
                                                label={`${importHisPageNo} / ${totalPageCountImport}`}
                                                hasPrevious={importHisPageNo > 1}
                                                onPrevious={() => onChangePaginationImportHistory('minus')}
                                                hasNext={importHisPageNo < totalPageCountImport}
                                                onNext={() => onChangePaginationImportHistory('plus')}
                                            />
                                        </div>
                                    </IndexTable.Cell>
                                </IndexTable.Row>
                            </IndexTable>
                        </Card>
                    }
                </Layout.Section>
            </Layout>
            <Modal open={active} onClose={handleChange} title="Import your wishlist items"
                   primaryAction={{content: 'Import', onAction: Import, loading: isImportLoading}}
                   secondaryActions={[{content: 'Cancel', onAction: handleChange,},]}>
                <Modal.Section>
                    <BlockStack gap={"400"}>
                        <Text as={"span"}>If you are not known to the CSV template, download a <Link
                            url={AppDocsLinks.wishListClubData}
                            removeUnderline download> Sample
                            CSV </Link> template to
                            get an idea about how to deal with CSV format to import wishlist products.</Text>
                        <DropZone accept=".csv" type="file" onDrop={handleDropZoneDrop}>
                            {uploadedFile}
                            {fileUpload}
                        </DropZone>
                    </BlockStack>
                </Modal.Section>
            </Modal>
        </Page>
    );
};

export default WishlistItems;