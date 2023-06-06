import React, {Fragment, useState, useEffect} from 'react';
import {
    DataTable,
    LegacyCard,
    Text,
    LegacyStack,
    Layout,
    LegacyTabs,
    TextField,
    Button,
    Pagination,
    SkeletonBodyText,
    Thumbnail,
    Badge,
    IndexTable
} from '@shopify/polaris';
import moment from "moment";
import {apiService} from "../../../Utills/Constant";
import NoDataFound from "../../Common/NoDataFound";
import DateRangePicker from "react-bootstrap-daterangepicker";


const BisStockAnalytics = () => {
    const limit = 10;
    const [selected, setSelected] = useState(0);
    const [bisAnalytics, setBisAnalytics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState('Last 30 days');
    const [state, setState] = useState({startDate: moment().subtract(29, 'days'), endDate: moment(),});
    const [PageNo, setPageNo] = useState(1)
    const [totalAnalytics, setTotalAnalytics] = useState(1)
    const [filter, setFilter] = useState({search: ""})

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


    const renderData = () => {
        let bisAnalyticsData = [];
        if (isLoading) {
            Array.from(Array(10)).map((_, i) => {
                let obj = [<SkeletonBodyText lines={1}/>, <SkeletonBodyText lines={1}/>, <SkeletonBodyText lines={1}/>];
                bisAnalyticsData.push(obj);
            })
        } else if (bisAnalytics.length > 0) {
            bisAnalytics.map((x, i) => {
                let Obj = [
                    <LegacyStack alignment="center" wrap={false}>
                        <Thumbnail size={"small"} source={x.image}/>
                        <LegacyStack.Item fill>
                            <Text as={"span"}>{x.title}</Text>
                        </LegacyStack.Item>
                    </LegacyStack>,
                    <Text>{x.email}</Text>,
                    <Fragment>{x.is_in_stock == 0 ? <Badge status="info">Awaiting stock</Badge> :
                        <Badge status="success">Available stock</Badge>}</Fragment>,
                    <Text>{moment(x.created_at).format('L')}</Text>,
                ]
                bisAnalyticsData.push(Obj)
            })
        } else {
            let NoDataObj = [<NoDataFound title="No Data Found"/>]
            bisAnalyticsData.push(NoDataObj);
        }
        return bisAnalyticsData;
    }

    const handleTabChange = async (selectedTabIndex) => {
        setSelected(selectedTabIndex);
        setState({startDate: moment().subtract(29, 'days'), endDate: moment(),})
        setSelectedDay('Last 30 days')
        setPageNo(1)
        BisAnalytics({selected: selectedTabIndex, search: ""})

    }
    const handleChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        })
        BisAnalytics({selected: selected, search: e.target.value})

    }

    const handleCallback = (start, end, label) => {
        setState({startDate: start, endDate: end})
        setSelectedDay(label)
    };

    const tabs = [
        {
            id: 'all-customers-1',
            content: 'Request',
            accessibilityLabel: 'All customers',
            panelID: 'all-customers-content-1',
        },
        {
            id: 'accepts-marketing-1',
            content: 'Awaiting stock',
            panelID: 'accepts-marketing-content-1',
        },
        {
            id: 'repeat-customers-1',
            content: 'Sent notifications',
            panelID: 'repeat-customers-content-1',
        },
    ];

    return (
        <Fragment>
            <Layout.Section>
                <LegacyCard title={"Back in stock analytics"}>
                    <LegacyTabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
                    <LegacyCard.Section>
                        <LegacyStack>
                            <LegacyStack.Item fill>
                                <TextField name="search" value={filter.search}
                                           placeholder="Filter by product"
                                           onChange={(value) => {
                                               handleChange({
                                                   target: {
                                                       name: "search",
                                                       value
                                                   }
                                               })
                                           }}
                                />
                            </LegacyStack.Item>
                            <LegacyStack.Item>
                                <DateRangePicker
                                    autoApply={true}
                                    initialSettings={{
                                        startDate: state.startDate,
                                        endDate: state.endDate,
                                        maxDate: new Date(),
                                        ranges: {
                                            Today: [moment().toDate(), moment().toDate()],
                                            Yesterday: [
                                                moment().subtract(1, 'days').toDate(),
                                                moment().subtract(1, 'days').toDate(),
                                            ],
                                            'Last 7 Days': [
                                                moment().subtract(6, 'days').toDate(),
                                                moment().toDate(),
                                            ],
                                            'Last 30 Days': [
                                                moment().subtract(29, 'days').toDate(),
                                                moment().toDate(),
                                            ],
                                            'This Month': [
                                                moment().startOf('month').toDate(),
                                                moment().endOf('month').toDate(),
                                            ],
                                            'Last Month': [
                                                moment().subtract(1, 'month').startOf('month').toDate(),
                                                moment().subtract(1, 'month').endOf('month').toDate(),
                                            ],
                                        },
                                    }}
                                    onCallback={handleCallback}
                                >
                                    <div>
                                        <Button primary>{selectedDay}</Button>
                                    </div>
                                </DateRangePicker>
                            </LegacyStack.Item>
                        </LegacyStack>
                    </LegacyCard.Section>
                    <DataTable
                        hideScrollIndicator={true}
                        columnContentTypes={[
                            'text',
                            'text',
                            'text',
                            'text',
                        ]}
                        headings={[
                            'Product',
                            'Email',
                            'Request Status',
                            'Request Time',
                        ]}
                        rows={renderData()}
                        footerContent={
                            <Pagination
                                label={PageNo}
                                hasPrevious={PageNo > 1}
                                onPrevious={() => onChangePagination('minus')}
                                hasNext={PageNo < totalPageCount}
                                onNext={() => onChangePagination('plus')}
                            />}
                    />

                </LegacyCard>
            </Layout.Section>

        </Fragment>
    );
};

export default BisStockAnalytics;