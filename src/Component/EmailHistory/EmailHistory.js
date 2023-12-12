import React, {useState, useEffect} from 'react';
import {
    Page,
    Layout,
    Pagination,
    Badge,
    Text,
    Card,
    IndexTable,
    EmptySearchResult, Button, Popover, ResourceList, Thumbnail, InlineStack,
} from "@shopify/polaris"
import {apiService, capitalizeMessage,} from "../../utils/Constant";
import ToastMessage from "../Comman/ToastMessage";
import CustomErrorBanner from "../Comman/CustomErrorBanner";

const EmailHistory = () => {
    const limit = 10;

    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState({lists: []});

    const [EmailPageNo, setEmailPageNo] = useState(1)

    const [emailPage, setEmailPage] = useState(1);

    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false)
    const [message, setMessage] = useState("")

    const [selectedProductIndex, setSelectedProductIndex] = useState(null);
    const totalPageCountEmail = Math.ceil(emailPage / limit)




    useEffect(() => {
        Email();
    }, [EmailPageNo])



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

    const togglePopoverActive = (index) => {
        setSelectedProductIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const onChangePaginationEmail = (value) => {
        let pCount = EmailPageNo
        if (value === "plus") {
            pCount = pCount + 1;
        } else {
            pCount = pCount - 1;
        }
        setEmailPageNo(pCount)
    }

    const resourceNameEmail = {
        singular: 'email history',
        plural: 'email historys',
    };
    return (
        <Page title={"Email History"}>
            {message !== "" && isError === false ?
                <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                              setIsErrorServer={setIsErrorServer}/> : ""}
            <CustomErrorBanner link={"https://webcontrive.helpscoutdocs.com/article/515-how-to-check-email-sent-out-history"} message={message} setMessage={setMessage} setIsError={setIsError} isError={isError}
                               />
            <Layout>
                <Layout.Section>
                    <Card padding={"050"}>
                        <IndexTable
                            resourceName={resourceNameEmail}
                            itemCount={isLoading ? 0 : email.lists.length}
                            emptyState={<EmptySearchResult title={'No email history found'}
                                                           withIllustration={(!isLoading) || !isLoading}/>}
                            loading={isLoading}
                            headings={[
                                {title: 'Email'},
                                {title: 'Email Type'},
                                {title: 'Products'},
                                {title: 'Date'},
                                {title: 'Email Status'},
                            ]}
                            selectable={false}
                        >
                            {
                                email.lists.map((z, i) => {
                                    return (
                                        <IndexTable.Row key={i} id={i}>
                                            <IndexTable.Cell>
                                                <Text as={"span"}>{z.email}</Text>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <span className={`custom-badge badge-type-${z.type}`}>{`${z.type == 1 ? "Wishlist reminder" : z.type == 2 ? "Price drop alert" : z.type == 3 ? "Restock alert" : z.type == 4 ? "Share wishlist" : z.type == 5 ? "Back In Stock thank you" : z.type == 6 ? "Back In Stock alert" : z.type == 7 ? "Wishlist notification" : ""}`}</span>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Popover
                                                    active={selectedProductIndex === i}
                                                    activator={<Button variant={"plain"} removeUnderline onClick={() => togglePopoverActive(i)} disclosure={selectedProductIndex === i ? 'up' : 'down'}>{z.type == 1 || z.type == 2 || z.type == 3 || z.type == 4 || z.type == 7 ? `${z.wishlist_products.length} Products` : `${z.bis_products.length} Products`}</Button>}
                                                    onClose={() => togglePopoverActive(i)}
                                                >
                                                    <Popover.Pane>
                                                        <ResourceList items={((z.type == 1 || z.type == 2 || z.type == 3 || z.type == 4 || z.type == 7 ? z.wishlist_products : z.bis_products) || [] )} renderItem={(item) => {
                                                            const {title} = item
                                                            return (
                                                                <ResourceList.Item>
                                                                    <InlineStack blockAlign={"center"} gap="200" wrap={false} >
                                                                        <Thumbnail size={"small"} source={item.image}/>
                                                                        <Text as={"span"}>{title}</Text>
                                                                    </InlineStack>
                                                                </ResourceList.Item>
                                                            )
                                                        }}/>
                                                    </Popover.Pane>
                                                </Popover>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Text>{z.created_at}</Text>
                                            </IndexTable.Cell>
                                            <IndexTable.Cell>
                                                <Text>{z.message_id ? <Badge tone="success">Sent</Badge> : ""}</Text>
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
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default EmailHistory;