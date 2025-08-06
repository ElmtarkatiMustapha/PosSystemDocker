import { ChartBar } from "../../../../components/ChartBar";
import { ChartLine } from "../../../../components/ChartLine";
import { ChartPie } from "../../../../components/ChartPie";
import { useStatisticsState } from "../../../../context/statisticsContext";
import { LoadingAll } from "./LoadingAll";

export function AllStatistics() {
    const state = useStatisticsState();
    return (
        state.loading ? 
        <LoadingAll/>
        : <>
            <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                <ChartLine title={"Sales"} subTitle={String(state.data?.filterTitle)} dataX={state.data?.sales?.dataX} dataY={state?.data?.sales?.dataY} flag={Number(state.data?.sales?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+"dh"} />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                <ChartLine title={"Purchases"} subTitle={String(state.data?.filterTitle)} dataX={state.data?.purchases?.dataX} dataY={state?.data?.purchases?.dataY} flag={Number(state.data?.purchases?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+"dh"} />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                <ChartLine title={"Spents"} subTitle={String(state.data?.filterTitle)} dataX={state.data?.costs?.dataX} dataY={state?.data?.costs?.dataY} flag={Number(state.data?.costs?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+"dh"} />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                <ChartLine title={"Returns"} subTitle={String(state.data?.filterTitle)} dataX={state.data?.returns?.dataX} dataY={state?.data?.returns?.dataY} flag={Number(state.data?.returns?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+"dh"} />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                <ChartPie title={"Stocks"} data={state.data?.stocks?.data} labels={["0 - 49", "50 - 99", "100 - 199", "200 - 299", "300 - 399", "400+"]} flag={Number(state.data?.stocks?.turnover).toFixed(2)+"dh"} />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                <ChartBar title={"Users Earning"} subTitle={""} dataX={state.data?.users?.dataX} dataY={state?.data?.users?.dataY} flag={Number(state.data?.users?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+"dh"} />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                <ChartBar title={"Users Turnover"} subTitle={"for "+String(state.data?.filterTitle)} dataX={state.data?.usersTurnover?.dataX} dataY={state?.data?.usersTurnover?.dataY} flag={Number(state.data?.usersTurnover?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+"dh"} />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                <ChartBar title={"Customers Turnover"} subTitle={"for "+String(state.data?.filterTitle)} dataX={state.data?.customers?.dataX} dataY={state?.data?.customers?.dataY} flag={Number(state.data?.customers?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+"dh"} />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                <ChartBar title={"Suppliers Turnover"} subTitle={"for "+String(state.data?.filterTitle)} dataX={state.data?.suppliers?.dataX} dataY={state?.data?.suppliers?.dataY} flag={Number(state.data?.suppliers?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+"dh"} />
            </div>
        </>
    )
}