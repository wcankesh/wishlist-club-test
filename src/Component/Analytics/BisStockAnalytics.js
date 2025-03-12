import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
    Badge, BlockStack, Box, Button, Card, DropZone, EmptySearchResult, Grid, IndexTable,
    InlineStack, Layout, Link, Pagination, Tabs, Text, TextField, Thumbnail,
} from '@shopify/polaris';
import {apiService, capitalizeMessage} from "../../utils/Constant";
import moment from "moment";
import DateRangePicker from "../Comman/DateRangePicker";
import {useSelector} from "react-redux";
import ToastMessage from "../Comman/ToastMessage";
import {AppDocsLinks} from "../../utils/AppDocsLinks";
import {tableLoading} from "../../utils/RenderLoading";
import {Icons} from "../../utils/Icons";
import {Modal, TitleBar} from "@shopify/app-bridge-react";

const BisStockAnalytics = () => {
    const shopDetails = useSelector((state) => state.shopDetails)
    const limit = 10;
    const [selected, setSelected] = useState(0);
    const [bisAnalytics, setBisAnalytics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMailLoading, setIsMailLoading] = useState('');
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
    const [isBisImportExportBtn, setIsBisImportExportBtn] = useState(false);

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
        const response = await apiService. BisAnalytics(payload);
        if (response.status === 200) {
            setIsBisImportExportBtn(response?.bis_import_export_btn)
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

    const onBisMailResend = async (id) => {
        setMessage("")
        setIsError(false)
        setIsMailLoading(`mail-resend-${id}`)
        const response = await apiService.onBisMailResend({}, id)
        if (response.status === 200) {
            setMessage(capitalizeMessage(response.message))
            setActive(false);
        } else if (response.status === 500) {
            setMessage(capitalizeMessage(response.message))
            setIsErrorServer(true);
        } else {
            setMessage(capitalizeMessage(response.message))
            setIsError(true)
            setActive(false);
            setIsErrorServer(true);
        }
        setIsMailLoading('')
    };

    const rowMarkup = (bisAnalytics || []).map((x, i) => {
        return (
            <IndexTable.Row key={i} id={i}>
                <IndexTable.Cell className={'text-truncted'}>
                    <InlineStack blockAlign={"center"} gap="200" wrap={false}>
                        <Thumbnail size={"small"} source={x.image}/>
                        <BlockStack>
                            <Text as={"span"}>{x.title}</Text>
                            {x?.variant?.title !== "Default Title" && <Text as={"span"}>Variant : {x?.variant?.title}</Text>}
                        </BlockStack>
                    </InlineStack>
                </IndexTable.Cell>
                <IndexTable.Cell className={'text-truncted'}>
                    <Text as={"span"}>{x.email}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Fragment>{x.is_in_stock == 0 ? <Badge tone="info">Awaiting stock</Badge> :
                        <Badge tone="success">Available stock</Badge>}</Fragment>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as={"span"}>{moment(x.created_at).format('L')}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                        <Button onClick={() => onBisMailResend(x.id)} loading={isMailLoading === `mail-resend-${x.id}`}>
                            Resend
                        </Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    })

    return (
        <Fragment>
            {message !== "" ?
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
                                        icon={Icons.ExportIcon}
                                        disabled={shopDetails.plan_type !== "8" ? isBisImportExportBtn === false : false}
                                        onClick={() => Export()}>Export</Button>
                                </div>
                                <Button variant={"primary"} icon={Icons.ImportIcon}
                                        disabled={shopDetails.plan_type !== "8" ? isBisImportExportBtn === false : false}
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

                    <IndexTable
                        resourceName={selected === 0 ? resourceNameRequest : selected === 1 ? resourceNameAwaitingStock : selected === 2 ? resourceNameSentNotification : null}
                        itemCount={isLoading ? limit : bisAnalytics.length}
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
                            {title: 'Action'},
                        ]}
                        selectable={false}
                    >
                        {isLoading ? tableLoading(limit, 5) : rowMarkup}
                    </IndexTable>
                    <Box padding={'300'} borderBlockStartWidth={'025'} borderColor={'border-secondary'}>
                        <InlineStack align={'end'} blockAlign={'center'}>
                            <div className={"d-flex"} style={{justifyContent: "end"}}>
                                <Pagination
                                    label={PageNo}
                                    hasPrevious={PageNo > 1}
                                    onPrevious={() => onChangePagination('minus')}
                                    hasNext={PageNo < totalPageCount}
                                    onNext={() => onChangePagination('plus')}
                                />
                            </div>
                        </InlineStack>
                    </Box>
                </Card>
            </Layout.Section>

            {active ? (
                <Modal open={active}>
                    <TitleBar title={"Import your back in stock products"}>
                        <button variant="primary" loading={isImportLoading && ''}
                                onClick={() => Import()}>Import</button>
                        <button onClick={() => handleImportChange()}>Cancel</button>

                    </TitleBar>

                    <Box padding={'400'}>
                        <BlockStack gap={"400"}>
                            <Text as={"span"}> If you are not known to the CSV template, download a <Link
                                url={AppDocsLinks.backInStockData} removeUnderline download> Sample CSV </Link> template to
                                get an idea about how to deal with CSV format to import back in stock products.</Text>
                            <DropZone accept=".csv" type="file" onDrop={handleDropZoneDrop}>
                                {uploadedFile}
                                {fileUpload}
                            </DropZone>
                        </BlockStack>
                    </Box>
                </Modal>
            ) : ''}

        </Fragment>
    );
};

export default BisStockAnalytics;