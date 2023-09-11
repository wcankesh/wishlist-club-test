import React, {Fragment, useState, useEffect} from 'react';
import {
  LegacyCard,
  Text,
  LegacyStack,
  Layout,
  Tabs,
  TextField,
  Pagination,
  Thumbnail,
  Badge, EmptySearchResult, IndexTable,
} from '@shopify/polaris';
import {apiService} from "../../utils/Constant";
import moment from "moment";
import DateRangePicker from "../Comman/DateRangePicker";

const BisStockAnalytics = () => {
  const limit = 10;
  const [selected, setSelected] = useState(0);
  const [bisAnalytics, setBisAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleTabChange = async (selectedTabIndex) => {
    setSelected(selectedTabIndex);
    setState({startDate: moment().subtract(29, 'days'), endDate: moment(),})
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

  const handleCallback = (range) => {
    setState(range)

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

  const resourceNameRequest = {
    singular: 'request',
    plural: 'request',
  };
  const resourceNameAwaitingStock = {
    singular: 'awaiting stock',
    plural: 'awaiting stock',
  };
  const resourceNameSentNotification = {
    singular: 'sent notification',
    plural: 'sent notification',
  };
  return (
    <Fragment>
      <Layout.Section>
        <LegacyCard title={"Back in stock analytics"}>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
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
                <div className="datepicker-contain">
                  <DateRangePicker
                    onChange={handleCallback}
                  />
                </div>
              </LegacyStack.Item>
            </LegacyStack>
          </LegacyCard.Section>
          <IndexTable
            resourceName={selected === 0 ? resourceNameRequest :selected === 1 ? resourceNameAwaitingStock : selected === 2 ? resourceNameSentNotification : null }
            itemCount={isLoading ? 0 : bisAnalytics.length}
            loading={isLoading}
            emptyState={<EmptySearchResult title={selected === 0 ? 'No Request found':selected === 1 ? 'No Awaiting Stock found' : selected === 2 ? 'No Sent Notifications Found':null}
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
                  <LegacyStack alignment="center" wrap={false}>
                    <Thumbnail size={"small"} source={x.image}/>
                    <LegacyStack.Item fill>
                      <Text as={"span"}>{x.title}</Text>
                    </LegacyStack.Item>
                  </LegacyStack>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text>{x.email}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Fragment>{x.is_in_stock == 0 ? <Badge status="info">Awaiting stock</Badge> : <Badge status="success">Available stock</Badge>}</Fragment>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text>{moment(x.created_at).format('L')}</Text>
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
        </LegacyCard>
      </Layout.Section>
    </Fragment>
  );
};

export default BisStockAnalytics;