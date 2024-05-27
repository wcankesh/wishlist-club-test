import React, {Fragment, useState, useEffect, useCallback} from 'react';
import {
    Button, Card, Text, InlineStack, Layout, Tabs, TextField, Pagination, Thumbnail,
    Grid, Box, Badge, EmptySearchResult, IndexTable, Modal, BlockStack, Link, DropZone,
} from '@shopify/polaris';
import {apiService, capitalizeMessage} from "../../utils/Constant";
import moment from "moment";
import DateRangePicker from "../Comman/DateRangePicker";
import {useSelector} from "react-redux";
import ToastMessage from "../Comman/ToastMessage";
import {AppDocsLinks} from "../../utils/AppDocsLinks";

const BisStockAnalytics = () => {
    const shopDetails = useSelector((state) => state.shopDetails)
    const limit = 10;
    const [selected, setSelected] = useState(0);
    const [bisAnalytics, setBisAnalytics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState({startDate: moment().subtract(29, 'days'), endDate: moment(),});
    const [PageNo, setPageNo] = useState(1)
    const [totalAnalytics, setTotalAnalytics] = useState(1)
    const [filter, setFilter] = useState({search: ""})
    const [active, setActive] = useState(false);
    const [file, setFile] = useState("")
    const [message, setMessage] = useState("")
    const [isImportLoading, setIsImportLoading] = useState(false);
    const [isError, setIsError] = useState(false)
    const [isErrorServer, setIsErrorServer] = useState(false);

    useEffect(() => {
        BisAnalytics({selected: selected});
    }, [PageNo, state]);

    const BisAnalytics = async (record) => {
        setIsLoading(true);
        const payload = {
            search: record.search,
            status: record.selected == 0 ? "" : record.selected == 1 ? "0" : record.selected == 2 ? "1" : "",
            start_date: moment(state.startDate).format("YYYY-MM-DD"),
            end_date: moment(state.endDate).format("YYYY-MM-DD"),
            page: record.PageNo ? record.PageNo : PageNo,
            limit: limit
        }
        const response = await apiService.BisAnalytics(payload);
        if (response.status === 200) {
            setBisAnalytics(response.data)
            setTotalAnalytics(response.total)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    const totalPageCount = Math.ceil(totalAnalytics / limit)
    const onChangePagination = (value) => {
        let pCount = PageNo
        if (value === "plus") {
            pCount = pCount + 1;
        } else {
            pCount = pCount - 1;
        }
        setPageNo(pCount)
    }

    const handleTabChange = async (selectedTabIndex) => {
        setSelected(selectedTabIndex);
        setState({startDate: moment().subtract(29, 'days'), endDate: moment(),})
        setPageNo(1)
        BisAnalytics({selected: selectedTabIndex, search: ""})
    }

    const handleChange = (e) => {
        setFilter({...filter, [e.target.name]: e.target.value})
        BisAnalytics({selected: selected, search: e.target.value})
    }

    const handleCallback = (range) => {
        setState(range)
    };

    const tabs = [
        {id: 'all-customers-1', content: 'Request', panelID: 'all-customers-content-1'},
        {id: 'accepts-marketing-1', content: 'Awaiting stock', panelID: 'accepts-marketing-content-1'},
        {id: 'repeat-customers-1', content: 'Sent notifications', panelID: 'repeat-customers-content-1'},
    ];

    const resourceNameRequest = {singular: 'request', plural: 'request'};
    const resourceNameAwaitingStock = {singular: 'awaiting stock', plural: 'awaiting stock'};
    const resourceNameSentNotification = {singular: 'sent notification', plural: 'sent notification'};

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
                <Text variant="bodySm" as="span"> {file.size} bytes </Text>
            </div>
        </BlockStack>
    );

    const Import = async () => {
        setMessage("")
        setIsError(false)
        setIsImportLoading(true)
        const formData = new FormData();
        formData.append("file", file)
        const response = await apiService.bisImport(formData, true)
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
            setIsErrorServer(true);
        }

    }

    const Export = async () => {
        const payload = {
            shop: shopDetails.shop
        }
        const response = await apiService.getBisExport(payload);
    }

    const handleImportChange = () => {
        setActive(!active);
        setFile("");
    };

    return (
        <Fragment>
            {message !== "" && isError === true ?
                <ToastMessage message={message} setMessage={setMessage} isErrorServer={isErrorServer}
                              setIsErrorServer={setIsErrorServer}/> : ""}

            <Layout.Section>
                <Card padding={"0"}>
                    <Box paddingBlockStart={"500"} paddingInlineStart={"500"} paddingInlineEnd={"500"}>
                        <InlineStack align={"space-between"}>
                            <Text as={"span"} variant={"headingMd"} fontWeight={"medium"}>Back in stock analytics</Text>
                            <InlineStack gap={"200"}>
                                <div className="Polaris-ActionMenu-SecondaryAction">
                                    <Button
                                        disabled={shopDetails.plan_type !== "8" ? shopDetails.bis_import_export_btn === false : false}
                                        onClick={() => Export()}>Export</Button>
                                </div>
                                    <Button variant={"primary"}
                                        disabled={shopDetails.plan_type !== "8" ? shopDetails.bis_import_export_btn === false : false}
                                        onClick={() => handleImportChange()}>Import</Button>

                            </InlineStack>
                        </InlineStack>
                    </Box>
                    <Box paddingInlineStart={"100"} paddingInlineEnd={"100"}><Tabs tabs={tabs} selected={selected}
                                                                                   onSelect={handleTabChange}/></Box>
                    <Box paddingInlineStart={"400"} paddingBlockStart={"100"} paddingBlockEnd={"300"}
                         paddingInlineEnd={"400"}>
                        <Grid>
                            <Grid.Cell columnSpan={{xs: 6, sm: 4, md: 5, lg: 10, xl: 10}}>
                                <TextField name="search" value={filter.search}
                                           placeholder="Filter by product"
                                           onChange={(value) => {
                                               handleChange({target: {name: "search", value}})
                                           }}/>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 6, sm: 2, md: 1, lg: 2, xl: 2}}>
                                <DateRangePicker fullWidth onChange={handleCallback}/>
                            </Grid.Cell>
                        </Grid>
                    </Box>
                    <Box paddingBlockEnd={"200"}>
                        <IndexTable
                            resourceName={selected === 0 ? resourceNameRequest : selected === 1 ? resourceNameAwaitingStock : selected === 2 ? resourceNameSentNotification : null}
                            itemCount={isLoading ? 0 : bisAnalytics.length}
                            loading={isLoading}
                            emptyState={<EmptySearchResult
                                title={selected === 0 ? 'No Request found' : selected === 1 ? 'No Awaiting Stock found' : selected === 2 ? 'No Sent Notifications Found' : null}
                                withIllustration={(!isLoading) || !isLoading}/>}
                            hasMoreItems={isLoading}
                            headings={[
                                {title: 'Product'},
                                {title: 'Email'},
                                {title: 'Request Status'},
                                {title: 'Request Time'},
                            ]}
                            selectable={false}
                        >{(bisAnalytics || []).map((x, i) => {
                            return (
                                <IndexTable.Row key={i} id={i}>
                                    <IndexTable.Cell>
                                        <InlineStack blockAlign={"center"} gap="200" wrap={false}>
                                            <Thumbnail size={"small"} source={x.image}/>
                                            <Text as={"span"}>{x.title}</Text>
                                        </InlineStack>
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        <Text as={"span"}>{x.email}</Text>
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        <Fragment>{x.is_in_stock == 0 ? <Badge tone="info">Awaiting stock</Badge> :
                                            <Badge tone="success">Available stock</Badge>}</Fragment>
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        <Text as={"span"}>{moment(x.created_at).format('L')}</Text>
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
                                    &nbsp;
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    <div className={"d-flex"} style={{justifyContent: "end"}}>
                                        <Pagination
                                            label={PageNo}
                                            hasPrevious={PageNo > 1}
                                            onPrevious={() => onChangePagination('minus')}
                                            hasNext={PageNo < totalPageCount}
                                            onNext={() => onChangePagination('plus')}
                                        />
                                    </div>
                                </IndexTable.Cell>
                            </IndexTable.Row>
                        </IndexTable>
                    </Box>
                </Card>
            </Layout.Section>

            <Modal
                open={active}
                onClose={handleImportChange}
                title="Import your back in stock products"
                primaryAction={{content: 'Import', onAction: Import, loading: isImportLoading}}
                secondaryActions={[{content: 'Cancel', onAction: handleImportChange},]}
            >
                <Modal.Section>
                    <BlockStack gap={"400"}>
                        <Text as={"span"}> If you are not known to the CSV template, download a <Link
                            url={AppDocsLinks.backInStockData} removeUnderline download> Sample CSV </Link> template to
                            get an idea about how to deal with CSV format to import back in stock products.</Text>
                        <DropZone accept=".csv" type="file" onDrop={handleDropZoneDrop}>
                            {uploadedFile}
                            {fileUpload}
                        </DropZone>
                    </BlockStack>
                </Modal.Section>
            </Modal>
        </Fragment>
    );
};

export default BisStockAnalytics;