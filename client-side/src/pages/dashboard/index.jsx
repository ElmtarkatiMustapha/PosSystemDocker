import { useEffect, useState } from "react";
import { Lang } from "../../assets/js/lang";
import { ChartBar } from "../../components/ChartBar";
import { ChartLine } from "../../components/ChartLine";
import { ChartPie } from "../../components/ChartPie";
import { useAppAction, useAppState } from "../../context/context";
import { LoadingDashboard } from "./components/LoadingDashboard";
import api from "../../api/api";

export function Dashboard() {
    const appState = useAppState()
    const appAction = useAppAction()
    const [state,setState] = useState();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api({
            method: 'post',
            url: '/statisticsDashboard',
            data: {
                filter : "week",
                startDate : 0,
                endDate : 0
            },
            withCredentials: true,
        })
        .then(res => res.data)
        .then(res => {
            setState(res)
            setLoading(false)
            // setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            appAction({
                type: "SET_LOADING",
                payload: false
            })
            setLoading(false)
            // setLoading(false)
        })
    },[])
    return (
        <>
            <div className="container-fluid">
                <div className="row m-0">
                    <div className="col-md-12 col-lg-8 ">
                        <div className="container-fluid p-2">
                            <div className="row m-0">
                                <div className="col-12 headerPage bg-primary color-white  p-3 mt-2">
                                    <h3><Lang>Welcome back</Lang>, <i>{String(appState.currentUser.name).toUpperCase()}</i></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-4"></div>
                </div>
                <div className="row m-0">
                    <div className="row m-0">
                        {loading ? 
                            <LoadingDashboard/>
                            : <>
                                <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                                    <ChartLine title={"Sales"} subTitle={String(state.data?.filterTitle)} dataX={state.data?.sales?.dataX} dataY={state?.data?.sales?.dataY} flag={Number(state.data?.sales?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                                    <ChartLine title={"Purchases"} subTitle={String(state.data?.filterTitle)} dataX={state.data?.purchases?.dataX} dataY={state?.data?.purchases?.dataY} flag={Number(state.data?.purchases?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                                    <ChartLine title={"Spents"} subTitle={String(state.data?.filterTitle)} dataX={state.data?.costs?.dataX} dataY={state?.data?.costs?.dataY} flag={Number(state.data?.costs?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                                    <ChartLine title={"Returns"} subTitle={String(state.data?.filterTitle)} dataX={state.data?.returns?.dataX} dataY={state?.data?.returns?.dataY} flag={Number(state.data?.returns?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                                    <ChartPie title={"Stock"} data={state.data?.stocks?.data} labels={["0 - 49", "50 - 99", "100 - 199", "200 - 299", "300 - 399", "400+"]} flag={Number(state.data?.stocks?.turnover).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                                    <ChartBar title={"Users Earning"} subTitle={""} dataX={state.data?.users?.dataX} dataY={state?.data?.users?.dataY} flag={Number(state.data?.users?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                                    <ChartBar title={"Users Turnover"} subTitle={"for "+String(state.data?.filterTitle)} dataX={state.data?.usersTurnover?.dataX} dataY={state?.data?.usersTurnover?.dataY} flag={Number(state.data?.usersTurnover?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                                    <ChartBar title={"Customers Turnover"} subTitle={"for "+String(state.data?.filterTitle)} dataX={state.data?.customers?.dataX} dataY={state?.data?.customers?.dataY} flag={Number(state.data?.customers?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                                    <ChartBar title={"Suppliers Turnover"} subTitle={"for "+String(state.data?.filterTitle)} dataX={state.data?.suppliers?.dataX} dataY={state?.data?.suppliers?.dataY} flag={Number(state.data?.suppliers?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                                </div>
                            </>}
                    </div>
                </div>
            </div>
        </>
    )
}



