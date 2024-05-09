import React, {useEffect, useState} from 'react';
import {Page, Layout} from "@shopify/polaris";
import BisStockAnalytics from './BisStockAnalytics';
import CountAnalytics from './CountAnalytics';
import Chart from './Chart';
import TopProducts from "../Dashboard/TopProducts/TopProducts";
import moment from "moment";
import {apiService} from "../../utils/Constant";

const initialState = {
    wishlistOrderAmount: 0,
    wishlistPageView: 0,
    totalItem: 0,
    totalWishlist: 0,
    totalUniqueItem: 0,
    cartProduct: 0,
    wishlistOrder: 0,
}

const Analytics = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState({startDate: moment().subtract(29, 'days'), endDate: moment(),});
    const [analytics, SetAnalytics] = useState(initialState);
    const [currency, setCurrency] = useState("INR");
    const [wishlistAddDateWise, setWishlistAddDateWise] = useState([]);
    const [wishlistPageViewDateWise, setWishlistPageViewDateWise] = useState([]);
    const [topProducts, setTopProducts] = useState([])

    useEffect(() => {
        const getAnalytics = async () => {
            setIsLoading(true);
            const payload = {
                start_date: moment(state.startDate).format("YYYY-MM-DD"),
                end_date: moment(state.endDate).format("YYYY-MM-DD")
            }
            const response = await apiService.Analytics(payload);
            if (response.status === 200) {
                SetAnalytics({
                    wishlistOrderAmount: response?.data?.wishlistOrderAmount || 0,
                    wishlistPageView: response?.data?.totalWishlistPageView || 0,
                    totalItem: response?.data?.totalItem || 0,
                    totalWishlist: response?.data?.totalWishlist || 0,
                    totalUniqueItem: response?.data?.totalUniqueItem || 0,
                    cartProduct: response?.data?.cartProduct || 0,
                    wishlistOrder: response?.data?.wishlistOrder || 0,
                })
                setCurrency(response.data.currency);
                setTopProducts(response?.data?.top10Products || [])
                let wishlistAddDate = [];
                let wishlistPageViewDate = [];
                (response.data.wishlistAddDateWise || []).map((j) => {
                    let obj = {x: new Date(j.x), y: Number(j.y)}
                    wishlistAddDate.push(obj)
                });
                (response.data.wishlistPageViewDateWise || []).map((j) => {
                    let obj = { x: new Date(j.x), y: Number(j.y) }
                    wishlistPageViewDate.push(obj)
                });
                setWishlistAddDateWise(wishlistAddDate);
                setWishlistPageViewDateWise(wishlistPageViewDate);
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        }
        getAnalytics();
    }, [state]);


    return (
        <Page title={"Analytics"}>
            <Layout>
                <CountAnalytics analytics={analytics} currency={currency}/>
                <Chart setState={setState} wishlistAddDateWise={wishlistAddDateWise}
                       wishlistPageViewDateWise={wishlistPageViewDateWise}/>
                <Layout.Section>
                    <TopProducts topProducts={topProducts} isLoading={isLoading}/>
                </Layout.Section>
                <BisStockAnalytics/>
            </Layout>
        </Page>
    );
};

export default Analytics;