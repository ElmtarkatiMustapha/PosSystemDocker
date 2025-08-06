import { FaPaperPlane } from "react-icons/fa";
import { Lang } from "../../../../assets/js/lang";
import { ButtonWithIcon } from "../../../../components/ButtonWithIcon";
import { ChartLine } from "../../../../components/ChartLine";
import { useStatisticsState } from "../../../../context/statisticsContext";
import { ChartLineLoading } from "../../../../components/ChartLineLoading";
import { LoadingContent } from "./LoadingContent";

export function Sales() {
    const state = useStatisticsState()
    const sendReport = () => {
        
    }
    return (
        <div className="container-fluid p-3">
            <div className="row">
                <div className="col-sm-12 col-md-9 col-lg-9 order-sm-2 order-xs-2 order-md-1">
                    {state.loading ?
                        <ChartLineLoading />
                    : 
                        <ChartLine title={"Sales"} subTitle={String(state.data?.filterTitle)} dataX={state.data?.sales?.dataX} dataY={state?.data?.sales?.dataY} flag={Number(state.data?.sales?.dataY?.reduce((prev,curr)=>prev+curr),0).toFixed(2)+"dh"} />
                    }
                </div>
                <div className="col-sm-12 col-md-3 col-lg-3 order-sm-1 order-xs-1 order-md-2">
                    {state.loading ? 
                    <LoadingContent/>
                    :
                    <>
                        <div className="p-3 ">
                            <div className="rounded-4 bg-white h-100 align-content-center text-center p-3">
                                <div className="title  h5 m-0"><Lang>Sales Number</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{state?.data?.sales?.count}</div>
                            </div>
                        </div>
                        <div className="p-3 ">
                            <div className="rounded-4 bg-white align-content-center h-100 text-center p-3">
                                <div className="title h5 m-0"><Lang>Turnover</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{Number(state.data?.sales?.dataY.reduce((prev,curr)=>prev+curr)).toFixed(2)} <span className="fs-5">dh</span></div>
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