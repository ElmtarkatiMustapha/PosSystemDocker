import { FaPaperPlane } from "react-icons/fa"
import { ButtonWithIcon } from "../../../../components/ButtonWithIcon"
import { ChartLineLoading } from "../../../../components/ChartLineLoading"
import { useStatisticsState } from "../../../../context/statisticsContext"
import { LoadingContent } from "./LoadingContent"
import { Lang } from "../../../../assets/js/lang"
import { ChartPie } from "../../../../components/ChartPie"
import { useAppState } from "../../../../context/context"

export function Stocks() {
    const state = useStatisticsState()
    const appState = useAppState()
    const sendReport = () => {
        
    }
    return (
        <div className="container-fluid p-3">
            <div className="row">
                <div className="col-sm-12 col-md-9 col-lg-9 order-sm-2 order-xs-2 order-md-1">
                    {state.loading ?
                        <ChartLineLoading />
                    : 
                        <ChartPie title={"Stocks"} data={state.data?.stocks?.data} labels={["0 - 49", "50 - 99", "100 - 199", "200 - 299", "300 - 399", "400+"]} flag={Number(state.data?.stocks?.turnover).toFixed(2)+`${appState.settings?.businessInfo?.currency?.symbol}`} />
                    }
                </div>
                <div className="col-sm-12 col-md-3 col-lg-3 order-sm-1 order-xs-1 order-md-2">
                    {state.loading ? 
                    <LoadingContent/>
                    :
                    <>
                        <div className="p-3 ">
                            <div className="rounded-4 bg-white h-100 align-content-center text-center p-3">
                                <div className="title  h5 m-0"><Lang>Total Stocks</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{Number(state.data?.stocks?.total).toFixed(2)}</div>
                            </div>
                        </div>
                        <div className="p-3 ">
                            <div className="rounded-4 bg-white align-content-center h-100 text-center p-3">
                                <div className="title h5 m-0"><Lang>Turnover</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{Number(state.data?.stocks?.turnover).toFixed(2)} <span className="fs-5">{appState.settings?.businessInfo?.currency?.symbol}</span></div>
                            </div>
                        </div>
                        <div className="p-3 ">
                            <div className="rounded-4 bg-white text-center align-content-center h-100 p-3">
                                <ButtonWithIcon Icon={<FaPaperPlane fontSize={"1.7rem"} color="white"/>} label={"Send Report"} handleClick={sendReport} type={"button"} />
                            </div>
                        </div>
                    </>
                    }
                </div>
            </div>
        </div>
    )
}