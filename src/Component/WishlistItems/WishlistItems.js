import React, { useCallback, useEffect, useState } from 'react';
import {
    Badge, BlockStack, Box, Button, Card, Divider, DropZone, EmptySearchResult, IndexTable, InlineStack, Layout,
    Link, OptionList, Page, Pagination, Popover, Text, TextField, Thumbnail
} from "@shopify/polaris"
import moment from "moment";
import { apiService, capitalizeMessage } from "../../utils/Constant";
import { useSelector } from "react-redux";
import ToastMessage from "../Comman/ToastMessage";
import CustomErrorBanner from "../Comman/CustomErrorBanner";
import { AppDocsLinks } from "../../utils/AppDocsLinks";
import { tableLoading } from "../../utils/RenderLoading";
import EmailHistory from "../../Component/EmailHistory/EmailHistory";
import { Icons } from "../../utils/Icons";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import SearchOnlyIndexTable from './index';

const WishlistItems = () => {
    const limit = 10;
    const [selected, setSelected] = useState(["1"]);
    const [isLoading, setIsLoading] = useState(false);
    const [isImportLoading, setIsImportLoading] = useState(false);
    const [wlProduct, setWlProduct] = useState([]);
    const [wlUser, setWlUser] = useState([]);
    const [importHistory, setImportHistory] = useState({ lists: [] });
    const [PageNo, setPageNo] = useState(1)
    const [importHisPageNo, setImportHisPageNo] = useState(1)
    const [ProductPage, setProductPage] = useState(1)
    const [totalProduct, setTotalProduct] = useState(null);
    const [userPage, setUserPage] = useState(null);
    const [importHisPage, setImportHisPage] = useState(null);
    const [popoverActive, setPopoverActive] = useState(null);
    const [active, setActive] = useState(false);
    const [file, setFile] = useState("")
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")
    const [searchUserValue, setSearchUserValue] = useState("");
    const [searchProductValue, setsearchProductValue] = useState("");
    const shopDetails = useSelector((state) => state.shopDetails)
    const totalPageCountProduct = Math.ceil(totalProduct / limit)
    const totalPageCountUser = Math.ceil(userPage / limit)
    const totalPageCountImport = Math.ceil(importHisPage / limit)
    useEffect(() => {
        if (selected.includes("1")) {
            WishlistAnalytics();
        }
        if (selected.includes("2")) {
            UserWishliastAnalytics();
        }
        if (selected.includes("3")) {
            ImportWishlistHistory();
        }
    }, [PageNo, ProductPage, searchUserValue, searchProductValue, selected])
    const WishlistAnalytics = async () => {
        if (searchProductValue !== '') {
            setProductPage(1)
        }
        setIsLoading(true);
        const payload = { page_no: ProductPage, limit: limit, search: searchProductValue }
        const response = await apiService.ProductWishlist(payload);
        if (response.status === true) {
            setIsError(false)
            setWlProduct(response.data)
            setTotalProduct(response.total_records)
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
    const UserWishliastAnalytics = async () => {
        setIsLoading(true);
        if (searchUserValue !== '') {
            setPageNo(1)
        }
        const payload = { page_no: PageNo, limit: limit, search: searchUserValue }
        const response = await apiService.UserWishlist(payload);
        if (response.status === true) {
            setIsError(false)
            setWlUser(response.data)
            setUserPage(response.total_records)
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
        const payload = { page_no: importHisPageNo, limit: limit, }
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
        const payload = { shop: shopDetails.shop }
        await apiService.getExport(payload);
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
            setActive(false)
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true)
            setIsImportLoading(false)
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setIsImportLoading(false)
            setActive(false)
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
    const fileUpload = !file && <DropZone.FileUpload />;
    const uploadedFile = file && (
        <BlockStack align={"center"} inlineAlign={"center"} gap={"400"}>
            <br />
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
        { value: "1", label: 'Product Wishlist' },
        { value: "2", label: 'User Wishlist' },
        { value: "3", label: 'Wishlist Import History' },
        { value: "4", label: 'Email History' },
    ];
    const resourceNameWishlistProduct = { singular: 'product wishlist', plural: 'product wishlists' };
    const resourceNameWishlistUser = { singular: 'user wishlist', plural: 'user wishlists' };
    const resourceNameImportHistory = { singular: 'wishlist import history', plural: 'wishlist import history' };
    const renderPopoverContent = (products) => {
        return (
            <div className={"remove-cursor"}>
                {(products || []).map((item, i) => {
                    const { title, quantity, created_at, variant_title, is_active, image } = item;
                    return (
                        <React.Fragment key={i}>
                            <Box padding={"200"} background={is_active === 0 ? "bg-surface-active" : ''} >
                                <InlineStack gap={"400"} wrap={false} blockAlign={"start"}>
                                    <Thumbnail size={"small"} source={image} />
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
                                            <Text as={"span"}>{moment(created_at).format('ll')}</Text>
                                        </InlineStack>
                                    </BlockStack>
                                </InlineStack>
                            </Box>
                            {i !== (products.length - 1) && <Divider />}
                        </React.Fragment>
                    )
                })}
            </div>
        )
    };
    const rowMarkupWishlistProduct = (wlProduct || []).map((x, i) => {
        return (
            <IndexTable.Row key={i} id={i} position={i}>
                <IndexTable.Cell>
                    <InlineStack blockAlign={"center"} gap={"400"} wrap={false}>
                        <Thumbnail size={"small"} source={x.image} />
                        <Text as={"span"}>{x.title}</Text>
                    </InlineStack>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text alignment={"end"}>{x.total}</Text>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    })
    const truncateName = (name) => (name && name.length > 10 ? name.substring(0, 10) + "..." : name);
    const rowMarkupWishlistUser = (wlUser || []).map((y, i) => {
        return (
            <IndexTable.Row key={i} id={i}>
                <IndexTable.Cell>
                    <Text as={"span"}>
                        {y.first_name && y.last_name
                            ? truncateName(`${y.first_name} ${y.last_name}`)
                            : y.first_name
                                ? truncateName(y.first_name)
                                : y.last_name
                                    ? truncateName(y.last_name)
                                    : "Guest"
                        }
                    </Text>
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
                    <Text as={"span"}>{moment(y.updated_at).format('ll')}</Text>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    })
    const rowMarkupImportHistory = (importHistory.lists || []).map((z, k) => {
        return (
            <IndexTable.Row key={k} id={k}>
                <IndexTable.Cell>
                    <Text as={"span"}>{z?.status == 0 ?
                        <Badge tone="critical">Fail</Badge> : z?.status == 1 ?
                            <Badge tone="success">Success</Badge> : z?.status == 2 ?
                                <Badge tone="attention">In Progress</Badge> : null}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as={"span"}>{moment(z?.created_at).format('ll')}</Text>
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
    })
    return (
        <Page title={"Wishlist History"}
            primaryAction={{ content: 'Import', onAction: handleChange, icon: Icons.ImportIcon }}
            secondaryActions={[{ content: 'Export', onAction: Export, icon: Icons.ExportIcon }]}>
            <Layout>
                {message !== "" && isError === false ?
                    <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                        setIsErrorServer={setIsErrorServer} /> : ""}
                <CustomErrorBanner link={AppDocsLinks.article["422"]} message={message} setMessage={setMessage}
                    setIsError={setIsError} isError={isError} />
                <Layout.Section variant="oneThird">
                    <Card padding={"100"}>
                        <OptionList selected={selected} onChange={setSelected} options={tabs} />
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    {
                        selected.includes("1") &&
                        <Card padding={"025"}>
                            <SearchOnlyIndexTable setSearchValue={setsearchProductValue} queryPlaceholder={"Search by product name"} />
                            <IndexTable
                                resourceName={resourceNameWishlistProduct}
                                itemCount={isLoading ? limit : wlProduct.length}
                                loading={isLoading}
                                emptyState={<EmptySearchResult title={'No product wishlist found'}
                                    withIllustration={(!isLoading) || !isLoading} />}
                                hasMoreItems={isLoading}
                                headings={[
                                    { title: 'Product' },
                                    // {title: 'Price', alignment: 'end'},
                                    { title: 'Item Count', alignment: 'end' },
                                ]}
                                selectable={false}>
                                {isLoading ? tableLoading(limit, 3) : rowMarkupWishlistProduct}
                            </IndexTable>
                            {!isLoading && <Box padding="300" paddingBlockStart="500">
                                <InlineStack align="space-between" blockAlign="center">
                                    <Text as="span" fontWeight="regular">
                                        {totalProduct}  Product Wishlist
                                    </Text>

                                    <Box>
                                        <InlineStack align="space-between" blockAlign="center" gap="400">
                                            <Text as="span" fontWeight="medium" tone="text">
                                                {`Page ${ProductPage} of ${totalPageCountProduct}`}
                                            </Text>
                                            <InlineStack gap="200" blockAlign="center">
                                                <Pagination
                                                    hasPrevious={ProductPage > 1}
                                                    onPrevious={() => onChangePaginationProduct('minus')}
                                                    hasNext={ProductPage < totalPageCountProduct}
                                                    onNext={() => onChangePaginationProduct('plus')}
                                                />
                                                <InlineStack gap="100" blockAlign="center">
                                                    <Text as="span" fontWeight="medium" tone="text">Go to</Text>
                                                    <Box width="60px">
                                                        <TextField
                                                            value={ProductPage.toString()}
                                                            onChange={(value) => {
                                                                const num = parseInt(value);
                                                                if (!isNaN(num) && num >= 1 && num <= totalPageCountProduct) {
                                                                    setProductPage(num);
                                                                }
                                                            }}
                                                            type="number"
                                                            labelHidden
                                                            autoComplete="off"
                                                            min={1}
                                                            max={totalPageCountProduct}
                                                            size="small"
                                                            align="center"
                                                        />
                                                    </Box>
                                                    <Text as="span" fontWeight="medium" tone="text">Page</Text>
                                                </InlineStack>
                                            </InlineStack>
                                        </InlineStack>
                                    </Box>
                                </InlineStack>
                            </Box>}
                        </Card>
                    }
                    {
                        selected.includes("2") &&
                        <Card padding={"025"}>
                            <SearchOnlyIndexTable setSearchValue={setSearchUserValue} queryPlaceholder={"Search by user name, email"} />
                            <IndexTable
                                resourceName={resourceNameWishlistUser}
                                itemCount={isLoading ? limit : wlUser.length}
                                emptyState={<EmptySearchResult title={'No user wishlist found'}
                                    withIllustration={(!isLoading) || !isLoading} />}
                                loading={isLoading}
                                headings={[
                                    { title: 'Name' },
                                    { title: 'Email' },
                                    { title: 'Item Count' },
                                    { title: 'Last Update' },
                                ]}
                                selectable={false}>
                                {isLoading ? tableLoading(limit, 4) : rowMarkupWishlistUser}
                            </IndexTable>
                            {!isLoading && <Box padding="300" paddingBlockStart="500">
                                <InlineStack align="space-between" blockAlign="center">
                                    <Text as="span" fontWeight="regular">
                                        {userPage}    User Wishlist
                                    </Text>

                                    <Box>
                                        <InlineStack align="space-between" blockAlign="center" gap="400">
                                            <Text as="span" fontWeight="medium" tone="text">
                                                {`Page ${PageNo} of ${totalPageCountUser}`}
                                            </Text>
                                            <InlineStack gap="200" blockAlign="center">
                                                <Pagination
                                                    hasPrevious={PageNo > 1}
                                                    onPrevious={() => onChangePaginationUser('minus')}
                                                    hasNext={PageNo < totalPageCountUser}
                                                    onNext={() => onChangePaginationUser('plus')}
                                                />
                                                <InlineStack gap="100" blockAlign="center">
                                                    <Text as="span" fontWeight="medium" tone="text">Go to</Text>
                                                    <Box width="60px">
                                                        <TextField
                                                            value={PageNo.toString()}
                                                            onChange={(value) => {
                                                                const num = parseInt(value);
                                                                if (!isNaN(num) && num >= 1 && num <= totalPageCountUser) {
                                                                    setPageNo(num);
                                                                }
                                                            }}
                                                            type="number"
                                                            labelHidden
                                                            autoComplete="off"
                                                            min={1}
                                                            max={totalPageCountUser}
                                                            size="small"
                                                            align="center"
                                                        />
                                                    </Box>
                                                    <Text as="span" fontWeight="medium" tone="text">Page</Text>
                                                </InlineStack>
                                            </InlineStack>
                                        </InlineStack>
                                    </Box>
                                </InlineStack>
                            </Box>}
                        </Card>
                    }
                    {
                        selected.includes("3") &&
                        <Card padding={"025"}>
                            <IndexTable
                                resourceName={resourceNameImportHistory}
                                itemCount={isLoading ? limit : importHistory.lists.length}
                                emptyState={<EmptySearchResult title={'No wishlist import history found'}
                                    withIllustration={(!isLoading) || !isLoading} />}
                                loading={isLoading}
                                headings={[
                                    { title: 'Status' },
                                    { title: 'Created At' },
                                    { title: 'Excute Time' },
                                    { title: 'Total' },
                                ]}
                                selectable={false}>
                                {isLoading ? tableLoading(limit, 4) : rowMarkupImportHistory}
                            </IndexTable>
                            {!isLoading && <Box padding="300" paddingBlockStart={"500"} >
                                <InlineStack align="space-between" blockAlign="center">
                                    <Text as="span" fontWeight="regular">
                                        {importHisPage}   Wishlist Import History
                                    </Text>
                                    <Box>
                                        <InlineStack align="space-between" blockAlign="center" gap="400">
                                            <Text as="span" fontWeight="medium" tone="text">
                                                {`Page ${importHisPageNo} of ${totalPageCountImport}`}
                                            </Text>

                                            <InlineStack gap="200" blockAlign="center">
                                                <Pagination
                                                    hasPrevious={importHisPageNo > 1}
                                                    onPrevious={() => onChangePaginationImportHistory('minus')}
                                                    hasNext={importHisPageNo < totalPageCountImport}
                                                    onNext={() => onChangePaginationImportHistory('plus')}
                                                />
                                                <InlineStack gap="100" blockAlign="center">
                                                    <Text as="span" fontWeight="medium" tone="text">Go to</Text>
                                                    <Box width="60px">
                                                        <TextField
                                                            value={importHisPageNo.toString()}
                                                            onChange={(value) => {
                                                                const num = parseInt(value);
                                                                if (!isNaN(num) && num >= 1 && num <= totalPageCountImport) {
                                                                    setImportHisPageNo(num);
                                                                }
                                                            }}
                                                            type="number"
                                                            labelHidden
                                                            autoComplete="off"
                                                            min={1}
                                                            max={totalPageCountImport}
                                                            size="small"
                                                            align="center"
                                                        />
                                                    </Box>
                                                    <Text as="span" fontWeight="medium" tone="text">Page</Text>
                                                </InlineStack>
                                            </InlineStack>
                                        </InlineStack>
                                    </Box>
                                </InlineStack>
                            </Box>}
                        </Card>
                    } {
                        selected.includes("4") &&
                        <EmailHistory />
                    }
                </Layout.Section>
            </Layout>
            {active ? (
                <Modal open={active}>
                    <TitleBar title={"Import your wishlist items"}>
                        <button variant="primary" loading={isImportLoading && ''} onClick={() => Import()}>{'Confirm'}</button>
                        <button onClick={() => handleChange()}>CancelImport</button>
                    </TitleBar>

                    <Box padding={'400'}>
                        <BlockStack gap={"400"}>
                            <Text as={"span"}>If you are not known to the CSV template, download a <Link url={AppDocsLinks.wishListClubData} removeUnderline download> Sample CSV </Link> template to get an idea about how to deal with CSV format to import wishlist products.</Text>
                            <DropZone accept=".csv" type="file" onDrop={handleDropZoneDrop}>{uploadedFile}{fileUpload}</DropZone>
                        </BlockStack>
                    </Box>
                </Modal>
            ) : ''}
        </Page>
    );
};

export default WishlistItems;