import React, { useState, useEffect } from 'react';
import {
    Pagination, Badge, Text, Card, IndexTable, EmptySearchResult, Button,
    Popover, ResourceList, Thumbnail, InlineStack, Box, Icon,
    TextField,
} from "@shopify/polaris"
import { apiService, capitalizeMessage, } from "../../utils/Constant";
import { tableLoading } from "../../utils/RenderLoading";
import { Icons } from "../../utils/Icons";

const EmailHistory = () => {
    const limit = 10;
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState([]);
    const [EmailPageNo, setEmailPageNo] = useState(1);
    const [emailPage, setEmailPage] = useState(null);
    const [message, setMessage] = useState("");
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);
    const totalPageCountEmail = Math.ceil(emailPage / limit)

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
        if (response.status === true) {
            setEmail(response.data && response.data)
            setEmailPage(response.total_records)
            setIsLoading(false);
        } else if (response.status !== true) {
            setMessage(capitalizeMessage(response.message))
            setIsLoading(false)
        } else {
            setMessage(capitalizeMessage(response.message))
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

    const resourceNameEmail = { singular: 'email history', plural: 'email historys' };

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
                        {z.type === 13 ? <span className="icons"><Icon source={Icons.MinusIcon} /></span> : (
                            <Popover
                                active={selectedProductIndex === i}
                                activator={<Button variant={"plain"} onClick={() => togglePopoverActive(i)}
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
                                                            <Thumbnail size={"small"} source={item.image} />
                                                            <Text as={"span"}>{item.title}</Text>
                                                        </InlineStack>
                                                    </ResourceList.Item>
                                                )
                                            }} />
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
        // <Page>
        //     {message !== "" && isError === false ?
        //         <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
        //                       setIsErrorServer={setIsErrorServer}/> : ""}
        //     <Layout>
        //         <CustomErrorBanner link={AppDocsLinks.article["515"]} message={message} setMessage={setMessage}
        //                            setIsError={setIsError} isError={isError}
        //         />
        //         <Layout.Section>
        <Card padding={"050"}>
            {/* <Box padding={"300"}>
                <Text as={"span"} variant={"headingMd"}>{`Email History`}</Text>
            </Box> */}
            <IndexTable
                resourceName={resourceNameEmail}
                itemCount={isLoading ? limit : email.length}
                emptyState={<EmptySearchResult title={'No email history found'}
                    withIllustration={(!isLoading) || !isLoading} />}
                loading={isLoading}
                headings={[
                    { title: 'Email' },
                    { title: 'Email Type' },
                    { title: 'Products', alignment: 'center' },
                    { title: 'Date' },
                    { title: 'Email Status' },
                ]}
                selectable={false}
            >
                {isLoading ? tableLoading(limit, 5) : rowMarkup}
            </IndexTable>
            {!isLoading && <Box padding="300" paddingBlockStart="500">
                <InlineStack align="space-between" blockAlign="center">
                    <Text as="span" fontWeight="regular">
                        {emailPage}   Email History
                    </Text>
                    <Box>
                        <InlineStack align="space-between" blockAlign="center" gap="400">
                            <Text as="span" fontWeight="medium" tone="text">
                                {`Page ${EmailPageNo} of ${totalPageCountEmail}`}
                            </Text>
                            <InlineStack gap="200" blockAlign="center">
                                <Pagination
                                    hasPrevious={EmailPageNo > 1}
                                    onPrevious={() => onChangePaginationEmail('minus')}
                                    hasNext={EmailPageNo < totalPageCountEmail}
                                    onNext={() => onChangePaginationEmail('plus')}
                                />

                                <InlineStack gap="100" blockAlign="center">
                                    <Text as="span" fontWeight="medium" tone="text">Go to</Text>
                                    <Box width="60px">
                                        <TextField
                                            value={EmailPageNo.toString()}
                                            onChange={(value) => {
                                                const num = parseInt(value);
                                                if (!isNaN(num) && num >= 1 && num <= totalPageCountEmail) {
                                                    setEmailPageNo(num);
                                                }
                                            }}
                                            type="number"
                                            labelHidden
                                            autoComplete="off"
                                            max={totalPageCountEmail}
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
    );
};

export default EmailHistory;