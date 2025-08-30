import { FaPaperPlane } from "react-icons/fa"
import { ButtonWithIcon } from "../../../../components/ButtonWithIcon"
import { ChartLine } from "../../../../components/ChartLine"
import { ChartLineLoading } from "../../../../components/ChartLineLoading"
import { useStatisticsAction, useStatisticsState } from "../../../../context/statisticsContext"
import { LoadingContent } from "./LoadingContent"
import { Lang } from "../../../../assets/js/lang"
import { useAppAction, useAppState } from "../../../../context/context"
import api from "../../../../api/api"

export function Purchases() {
    const state = useStatisticsState()
    const statisticsAction = useStatisticsAction()
    const appState = useAppState()
    const appAction = useAppAction()
    const exportData = () => {
        statisticsAction({
            type: "SET_LOADING",
            payload: true
        })
        api({
            method: "post",
            url: "/purchases/export",
            data: {
                supplier: -1,
                filter : state.filter,
                startDate : state.startDate,
                endDate : state.endDate
            },
            responseType: "blob",
            withCredentials: true,
        }).then(res=>{
            //export data 
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;

                // Extraire le nom du fichier si dispo sinon par défaut
                const contentDisposition = res.headers["content-disposition"];
                let fileName = "purshase_export.csv";
                if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match?.[1]) {
                    fileName = match[1];
                }
                }

                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                
                statisticsAction({
                type: "SET_LOADING",
                payload: false
            })
        }).catch(err=>{
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            statisticsAction({
                type: "SET_LOADING",
                payload: false
            })
        })
    }
    return (
        <div className="container-fluid p-3">
            <div className="row">
                <div className="col-sm-12 col-md-9 col-lg-9 order-sm-2 order-xs-2 order-md-1">
                    {state.loading ?
                        <ChartLineLoading />
                    : 
                        <ChartLine title={"Purchases"} subTitle={String(state.data?.filterTitle)} dataX={state.data?.purchases?.dataX} dataY={state?.data?.purchases?.dataY} flag={Number(state.data?.purchases?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                    }
                </div>
                <div className="col-sm-12 col-md-3 col-lg-3 order-sm-1 order-xs-1 order-md-2">
                    {state.loading ? 
                    <LoadingContent/>
                    :
                    <>
                        <div className="p-3 ">
                            <div className="rounded-4 bg-white h-100 align-content-center text-center p-3">
                                <div className="title  h5 m-0"><Lang>Purchases Number</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{state?.data?.purchases?.count}</div>
                            </div>
                        </div>
                        <div className="p-3 ">
                            <div className="rounded-4 bg-white align-content-center h-100 text-center p-3">
                                <div className="title h5 m-0"><Lang>Turnover</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{Number(state.data?.purchases?.dataY.reduce((prev,curr)=>prev+curr)).toFixed(2)} <span className="fs-5">{appState.settings?.businessInfo?.currency?.symbol}</span></div>
                            </div>
                        </div>
                        <div className="p-3 ">
                            <div className="rounded-4 bg-white text-center align-content-center h-100 p-3">
                                <ButtonWithIcon Icon={<FaPaperPlane fontSize={"1.7rem"} color="white"/>} label={"Export Data"} handleClick={exportData} type={"button"} />
                            </div>
                        </div>
                    </>
                    }
                </div>
            </div>
        </div>
    )
}