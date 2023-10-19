import React, {useEffect, useState} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {Layout, Card, BlockStack, InlineStack} from "@shopify/polaris"
import {apiService} from "../../utils/Constant";
import moment from "moment";
import DateRangePicker from "../Comman/DateRangePicker";

const Chart = () => {
    const [state, setState] = useState({startDate: moment().subtract(29, 'days'), endDate: moment()});
    const [wishlistAddDateWise, setWishlistAddDateWise] = useState([]);
    const [wishlistPageViewDateWise, setWishlistPageViewDateWise] = useState([]);
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
        setState(range)

    };

    // const options = {
    //     chart: {
    //         borderWidth: 0,
    //         type: 'line',
    //     },
    //     tooltip: {
    //         formatter: function () {
    //             return '<div>' + moment(this.x).format("ll") + ' </div><br/><br/>' +
    //                 '<b>' + this.series.name + ':</b> ' + this.y + ''
    //         }
    //     },
    //     title: "",
    //     yAxis: {
    //         type: 'logarithmic',
    //         tickInterval: 1,
    //         title: {
    //             text: ''
    //         }
    //     },
    //     xAxis: {
    //         type: 'datetime',
    //     },
    //     credits: {
    //         enabled: false
    //     },
    //     series: [{
    //         name: "Add To Wishlist",
    //         data: wishlistAddDateWise,
    //         color: "#352F6C"
    //     }, {
    //         name: "Wishlist View",
    //         data: wishlistPageViewDateWise,
    //         color: "#FFD255"
    //     },],
    //     plotOptions: {
    //         line: {
    //             dataLabels: {
    //                 enabled: false
    //             },
    //             enableMouseTracking: true
    //         },
    //     }
    //
    // };
  const renderOption = () => {
    const options = {
      chart: {
        type: "spline",
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          return(
            '<div>' +
            '<div class="mb-2"><Text variant="headingXs" as="h6">' + moment(this.x).format("ll") + '</Text></div>' +
            '<div class="mb-2"><Text  variant="headingSm" as="h6">'+`${this.y}`+'</Text></div>' +
            '<div><Text variant="headingXs" as="h6">'+this.series.name+'</Text></div>' +
            '</div>'
          )
        },
        style: {
          color: '#000'
        },
        valueDecimals: 0,
        padding:10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#caced3',
        shared: true,
        crosshairs: true
      },
      title: "",
      yAxis: {
        softMin: 0,
        softMax:  1,
        labels: {
          formatter: function () {
            return  this.value;
          }
        },
        title: {
          text: "",
        },
      },
      xAxis: {
        crosshair: {
          width: 1,
        },
        type: "datetime",
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Add To Wishlist",
          data: wishlistAddDateWise,
          color: "#352F6C",
          marker: {
            fillColor: "#352F6C",
            lineColor: "white",
            lineWidth: 1,
            radius: 4,
            enabled: false
          },
        },
        {
          name: "Wishlist View",
          data: wishlistPageViewDateWise,
          color: "#FFD255",
          marker: {
            fillColor: "#FFD255",
            lineColor: "white",
            lineWidth: 1,
            radius: 4,
            enabled: false
          },
        },
      ],
      plotOptions: {
        line: {
          dataLabels: {
            enabled: false,
          },
          enableMouseTracking: true,
        },
        series: {
          animation: true,
          fillOpacity: 0.25,
        },
      },
    };
    return options;
  };


  return (
        <Layout.Section>
            <Card sectioned>
                <BlockStack>
                    <InlineStack>
                    </InlineStack>
                    <InlineStack align={"end"}>
                        <div className="datepicker-contain">
                            <DateRangePicker
                                onChange={handleCallback}
                            />
                        </div>
                    </InlineStack>
                </BlockStack>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={renderOption()}
                />
            </Card>
        </Layout.Section>
    );
};

export default Chart;