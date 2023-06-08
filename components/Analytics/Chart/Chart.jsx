import React, {Fragment, useEffect, useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {Layout, Button, LegacyStack, LegacyCard} from "@shopify/polaris"
import {apiService} from "../../../utils/Constant";
import moment from "moment";
import {DateRangePicker} from "materialui-daterange-picker";


export function Chart() {
    const [selectedDay, setSelectedDay] = useState("Last 30 Days");
    const [state, setState] = useState({startDate: moment().subtract(29, 'days'), endDate: moment()});
    const [wishlistAddDateWise, setWishlistAddDateWise] = useState([]);
    const [wishlistPageViewDateWise, setWishlistPageViewDateWise] = useState([]);
    const [open, setOpen] = React.useState(false);

    const toggle = () => {
        setOpen(!open)
    };

    useEffect(() => {
        Analytics();
    }, [state]);

    const Analytics = async () => {
        const payload = {
            start_date: moment(state.startDate).format("YYYY-MM-DD"),
            end_date: moment(state.endDate).format("YYYY-MM-DD")
        }
        const response = await apiService.Analytics(payload);
        if (response.status === 200) {
            let wishlistAddDate = [];
            let wishlistPageViewDate = [];
            (response.data.wishlistAddDateWise || []).map((j) => {
                let obj = {
                    x: new Date(j.x),
                    y: Number(j.y)
                }
                wishlistAddDate.push(obj)
            });
            (response.data.wishlistPageViewDateWise || []).map((j) => {
                let obj = {
                    x: new Date(j.x),
                    y: Number(j.y)
                }
                wishlistPageViewDate.push(obj)
            });
            setWishlistAddDateWise(wishlistAddDate);
            setWishlistPageViewDateWise(wishlistPageViewDate);
        } else {
        }
    }

    const handleCallback = (range) => {
        setState({startDate: range.startDate, endDate: range.endDate})
        setSelectedDay(range.label ? range.label : "Custom Range")
        setOpen(!open)
    };

    const options = {
        chart: {
            borderWidth: 0,
            type: 'line',
        },
        tooltip: {
            formatter: function () {
                return '<div>' + moment(this.x).format("ll") + ' </div><br/><br/>' +
                    '<b>' + this.series.name + ':</b> ' + this.y + ''
            }
        },
        title: "",
        yAxis: {
            type: 'logarithmic',
            tickInterval: 1,
            title: {
                text: ''
            }
        },
        xAxis: {
            type: 'datetime',
        },
        credits: {
            enabled: false
        },
        series: [{
            name: "Add To Wishlist",
            data: wishlistAddDateWise,
            color: "#352F6C"
        }, {
            name: "Wishlist View",
            data: wishlistPageViewDateWise,
            color: "#FFD255"
        },],
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            },
        }

    };

    return (
        <Fragment>
            <Layout.Section>
                <LegacyCard sectioned>
                    <LegacyStack>
                        <LegacyStack.Item fill>
                        </LegacyStack.Item>
                        <LegacyStack.Item>
                            <Button primary onClick={toggle}>{selectedDay}</Button>
                            <div className="datepicker-contain">
                                <DateRangePicker
                                    open={open}
                                    toggle={toggle}
                                    onChange={handleCallback}
                                    wrapperClassName={"datepicker"}
                                    maxDate={new Date()}
                                />
                            </div>
                        </LegacyStack.Item>
                    </LegacyStack>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </LegacyCard>
            </Layout.Section>
        </Fragment>
    );
};
