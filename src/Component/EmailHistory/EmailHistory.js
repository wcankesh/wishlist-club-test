import React, {useState, useEffect} from 'react';
import {
    Page, Layout, Pagination, Badge, Text, Card, IndexTable, EmptySearchResult, Button,
    Popover, ResourceList, Thumbnail, InlineStack, Box, Icon,
} from "@shopify/polaris"
import {apiService, capitalizeMessage,} from "../../utils/Constant";
import ToastMessage from "../Comman/ToastMessage";
import CustomErrorBanner from "../Comman/CustomErrorBanner";
import {AppDocsLinks} from "../../utils/AppDocsLinks";
import {tableLoading} from "../../utils/RenderLoading";
import {Icons} from "../../utils/Icons";

const EmailHistory = () => {
    const limit = 10;
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState([]);
    const [EmailPageNo, setEmailPageNo] = useState(1);
    const [emailPage, setEmailPage] = useState(1);
    const [isError, setIsError] = useState(false);
    const [isErrorServer, setIsErrorServer] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);
    const totalPageCountEmail = Math.ceil(emailPage / limit);

    useEffect(() => {
        Email();
    }, [EmailPageNo]);

    const Email = async () => {
        setIsLoading(true);
        const payload = {
            page_no: EmailPageNo,
            limit: limit,
        }
        const response = await apiService.Email(payload);
        if (response.status === 200) {
            setEmail(response.data && response.data.lists)
            setEmailPage(response.data.total)
            setIsLoading(false);
            setIsError(false)
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

    const resourceNameEmail = {singular: 'email history', plural: 'email historys'};

    const emailTypeLabel = {
        1: "Wishlist reminder",
        2: "Price drop alert",
        3: "Restock alert",
        4: "Share wishlist",
        5: "Back In Stock thank you",
        6: "Back In Stock alert",
        7: "Wishlist notification",
        8: "Verify email",
        9: "Add wishlist email",
        10: "Remove wishlist email",
        11: "Low stock email",
        12: "Abandonment reminder email",
        13: "Weekly or monthly report email",
    };

    const rowMarkup = (email || []).map((z, i) => {
        return (
            <IndexTable.Row key={i} id={i}>
                <IndexTable.Cell>
                    <Text as={"span"}>{z.email}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <span className={`custom-badge badge-type-${z.type}`}>{emailTypeLabel[z.type]}</span>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <InlineStack align={'center'}>
                    {z.type === 13 ? <span className="icons"><Icon source={Icons.MinusIcon}/></span>: (
                        <Popover
                            active={selectedProductIndex === i}
                            activator={<Button variant={"plain"} removeUnderline onClick={() => togglePopoverActive(i)}
                                               disclosure={selectedProductIndex === i ? 'up' : 'down'}>{`${z.products.length} Products`}</Button>}
                            onClose={() => togglePopoverActive(i)}
                        >
                            <Popover.Pane>
                                <div className={"remove-cursor"}>
                                    <ResourceList
                                        items={z.products || []}
                                        renderItem={(item) => {
                                            return (
                                                <ResourceList.Item>
                                                    <InlineStack blockAlign={"center"} gap="200" wrap={false}>
                                                        <Thumbnail size={"small"} source={item.image}/>
                                                        <Text as={"span"}>{item.title}</Text>
                                                    </InlineStack>
                                                </ResourceList.Item>
                                            )
                                        }}/>
                                </div>
                            </Popover.Pane>
                        </Popover>
                    )}
                    </InlineStack>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as={"span"}>{z.created_at}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as={"span"}>{z.message_id ? <Badge tone="success">Sent</Badge> : ""}</Text>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    })

    return (
        <Page title={"Email History"}>
            {message !== "" && isError === false ?
                <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                              setIsErrorServer={setIsErrorServer}/> : ""}
            <Layout>
                <CustomErrorBanner link={AppDocsLinks.article["515"]} message={message} setMessage={setMessage}
                                   setIsError={setIsError} isError={isError}
                />
                <Layout.Section>
                    <Card padding={"050"}>
                        <IndexTable
                            resourceName={resourceNameEmail}
                            itemCount={isLoading ? limit : email.length}
                            emptyState={<EmptySearchResult title={'No email history found'}
                                                           withIllustration={(!isLoading) || !isLoading}/>}
                            loading={isLoading}
                            headings={[
                                {title: 'Email'},
                                {title: 'Email Type'},
                                {title: 'Products', alignment:'center'},
                                {title: 'Date'},
                                {title: 'Email Status'},
                            ]}
                            selectable={false}
                        >
                            {isLoading ? tableLoading(limit, 5) : rowMarkup}
                        </IndexTable>

                        <Box padding={'300'} borderBlockStartWidth={'025'} borderColor={'border-secondary'}>
                            <InlineStack align={'space-between'} blockAlign={'center'}>
                                <Text as={"span"} fontWeight={"semibold"}> Total : {emailPage || 0} item(s) </Text>
                                <div className={"d-flex"} style={{justifyContent: "end"}}>
                                    <Pagination
                                        label={`${EmailPageNo} / ${totalPageCountEmail}`}
                                        hasPrevious={EmailPageNo > 1}
                                        onPrevious={() => onChangePaginationEmail('minus')}
                                        hasNext={EmailPageNo < totalPageCountEmail}
                                        onNext={() => onChangePaginationEmail('plus')}
                                    />
                                </div>
                            </InlineStack>
                        </Box>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default EmailHistory;