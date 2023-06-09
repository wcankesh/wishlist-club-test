import React, {Fragment, useState, useCallback, useEffect} from 'react';
import {
    Page,
    Layout,
    LegacyCard,
    LegacyTabs,
    DataTable,
    Pagination,
    SkeletonBodyText,
    Badge,
    Link,
    LegacyStack,
    Thumbnail,
    Text,
    Popover,
    Button,
    ResourceList,
    Modal,
    DropZone
} from "@shopify/polaris"
import moment from "moment";
import {apiService} from "../../utils/Constant";
import {useSelector} from "react-redux";
import {ToastMessage, NoDataFound} from "../../components";

export default function WishlistItems() {
    const limit = 10;
    const [selected, setSelected] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isImportLoading, setIsImportLoading] = useState(false);
    const [wlProduct, setWlProduct] = useState([]);
    const [wlUser, setWlUser] = useState([]);
    const [email, setEmail] = useState({lists: []});
    const [PageNo, setPageNo] = useState(1)
    const [EmailPageNo, setEmailPageNo] = useState(1)
    const [ProductPage, setProductPage] = useState(1)
    const [totalProduct, setTotalProduct] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const [emailPage, setEmailPage] = useState(1);
    const [popoverActive, setPopoverActive] = useState(null);
    const [active, setActive] = useState(false);
    const [file, setFile] = useState("")
    const [message, setMessage] = useState("");
    const shopDetails = useSelector((state) => state.shopDetails)

    const totalPageCountProduct = Math.ceil(totalProduct / limit)
    const totalPageCountUser = Math.ceil(userPage / limit)
    const totalPageCountEmail = Math.ceil(emailPage / limit)

    useEffect(() => {
        WishlistAnalytics();
    }, [PageNo, ProductPage])

    useEffect(() => {
        Email();
    }, [EmailPageNo])

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
        } else {
            setIsLoading(false)
        }
    }

    const Email = async () => {
        const payload = {
            page_no: EmailPageNo,
            limit: limit,
        }
        const response = await apiService.Email(payload);
        if (response.status === 200) {
            setEmail(response.data)
            setEmailPage(response.data.total)

        } else {
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
            setMessage(response.message)
            setActive(false);
        } else {
            setFile("")
            setIsImportLoading(false)
            setMessage(response.message)
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
    ];

    const WlProductData = () => {
        let productData = [];
        if (isLoading) {
            Array.from(Array(10)).map((_, i) => {
                let obj = [<SkeletonBodyText lines={1}/>, <SkeletonBodyText lines={1}/>, <SkeletonBodyText lines={1}/>];
                productData.push(obj);
            })
        } else if (wlProduct && wlProduct.length > 0) {

            (wlProduct || []).map((x, i) => {
                let Obj = [
                    <LegacyStack alignment="center" wrap={false}>
                        <Thumbnail size={"small"} source={x.product.image}/>
                        <LegacyStack.Item fill>
                            <Text as={"span"}>{x.product.title}</Text>
                        </LegacyStack.Item>
                    </LegacyStack>,
                    <Text>{"$"}{x.product.price}</Text>,
                    <Text>{x.total}</Text>
                ]
                productData.push(Obj)
            })
        } else {
            let NoDataObj = [<NoDataFound title="No Data Found"/>]
            productData.push(NoDataObj);
        }
        return productData;
    }

    const UserData = () => {
        let userData = [];
        if (isLoading) {
            Array.from(Array(10)).map((_, i) => {
                let obj = [<SkeletonBodyText lines={1}/>, <SkeletonBodyText lines={1}/>, <SkeletonBodyText lines={1}/>];
                userData.push(obj);
            })
        } else if (wlUser.length > 0) {
            wlUser.map((y, j) => {
                let Obj = [
                    <Text>{(y.first_name || y.last_name) ? `${y.first_name} ${y.last_name}` : "Guest"}</Text>,
                    <Text>{y.email ? y.email : " - "}</Text>,
                    <LegacyStack alignment="center">
                        <Popover
                            sectioned
                            active={popoverActive === j}
                            activator={<Button plain disclosure={popoverActive === j ? 'up' : 'down'}
                                               onClick={() => togglePopoverActive(j)}>{y.products.length} Products</Button>}
                            onClose={() => togglePopoverActive(j)}
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
                    </LegacyStack>,
                    <Text>{moment(y.updated_at).format("L")}</Text>
                ]
                userData.push(Obj)
            })
        } else {
            let NoDataObj = [<NoDataFound title="No Data Found"/>]
            userData.push(NoDataObj);
        }
        return userData;
    }

    const EmailData = () => {
        let emailData = [];
        if (isLoading) {
            Array.from(Array(10)).map((_, i) => {
                let obj = [<SkeletonBodyText lines={1}/>, <SkeletonBodyText lines={1}/>, <SkeletonBodyText lines={1}/>,
                    <SkeletonBodyText lines={1}/>];
                emailData.push(obj);
            })
        } else if (email.lists.length > 0) {
            email.lists.map((z, k) => {
                let Obj = [
                    <Text as={"span"}>{z.email}</Text>,
                    <Text>{`${z.type == 1 ? "Wishlist reminder" : z.type == 2 ? "Price drop alert" : z.type == 3 ? "Restock alert" : ''}`}</Text>,
                    <Text>{z.created_at}</Text>,
                    <Text>{z.message_id ? <Badge status="success">Sent</Badge> : ""}</Text>,


                ]
                emailData.push(Obj)
            })
        } else {
            let NoDataObj = [<NoDataFound title="No Data Found"/>]
            emailData.push(NoDataObj);
        }
        return emailData;
    }


    return (
        <Fragment>
            <ToastMessage message={message} setMessage={setMessage}/>
            <Page title={"Wishlist Items"} primaryAction={{content: 'Import', onAction: handleChange}}
                  secondaryActions={[{content: 'Export', onAction: Export}]}>
                <Layout>
                    <Layout.Section>
                        <LegacyCard>
                            <LegacyTabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                                {selected == 0 &&
                                <DataTable
                                    hideScrollIndicator={true}
                                    columnContentTypes={[
                                        'text',
                                        'text',
                                        'text',
                                    ]}
                                    headings={[
                                        'Product',
                                        'Price',
                                        'Item Count',
                                    ]}
                                    rows={WlProductData()}
                                    footerContent={
                                        <Pagination
                                            label={ProductPage}
                                            hasPrevious={ProductPage > 1}
                                            onPrevious={() => onChangePaginationProduct('minus')}
                                            hasNext={ProductPage < totalPageCountProduct}
                                            onNext={() => onChangePaginationProduct('plus')}
                                        />}
                                />}
                                {selected == 1 &&
                                <DataTable
                                    hideScrollIndicator={true}
                                    columnContentTypes={[
                                        'text',
                                        'text',
                                        'text',
                                        'text',
                                    ]}
                                    headings={[
                                        'Name',
                                        'Email',
                                        'Item Count',
                                        'Last Update'
                                    ]}
                                    rows={UserData()}
                                    footerContent={
                                        <Pagination
                                            label={PageNo}
                                            hasPrevious={PageNo > 1}
                                            onPrevious={() => onChangePaginationUser('minus')}
                                            hasNext={PageNo < totalPageCountUser}
                                            onNext={() => onChangePaginationUser('plus')}
                                        />}
                                />
                                }
                                {selected == 2 &&
                                <DataTable
                                    hideScrollIndicator={true}
                                    columnContentTypes={[
                                        'text',
                                        'text',
                                        'text',
                                        'text',
                                    ]}
                                    headings={[
                                        'Email',
                                        'Email Type',
                                        'Date',
                                        'Email Status',
                                    ]}
                                    rows={EmailData()}
                                    footerContent={
                                        <Pagination
                                            label={EmailPageNo}
                                            hasPrevious={EmailPageNo > 1}
                                            onPrevious={() => onChangePaginationEmail('minus')}
                                            hasNext={EmailPageNo < totalPageCountEmail}
                                            onNext={() => onChangePaginationEmail('plus')}
                                        />}
                                />
                                }
                            </LegacyTabs>
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

