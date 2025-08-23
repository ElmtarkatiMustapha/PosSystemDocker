import { ChartLineLoading } from "../../../../components/ChartLineLoading"
import { useStatisticsState } from "../../../../context/statisticsContext"
import { LoadingContent } from "./LoadingContent"
import { Lang } from "../../../../assets/js/lang"
import { ChartBar } from "../../../../components/ChartBar"
import { Rank } from "./Rank"
import { useAppState } from "../../../../context/context"

export function UsersTurnover() {
    const state = useStatisticsState()
    const appState = useAppState();
    const sendReport = () => {
        
    }
    return (
        <div className="container-fluid p-3">
            <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-8 order-sm-2 order-xs-2 order-md-1">
                    {state.loading ?
                        <ChartLineLoading />
                    : 
                        <ChartBar title={"Users Turnover"} subTitle={"for "+String(state.data?.filterTitle)} dataX={state.data?.usersTurnover?.dataX} dataY={state?.data?.usersTurnover?.dataY} flag={Number(state.data?.usersTurnover?.dataY?.reduce((prev,curr)=>prev+curr,0)).toFixed(2)+`${appState.settings.businessInfo.currency.symbol}`} />
                    }
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4 order-sm-1 order-xs-1 order-md-2">
                    <div className="h4 text-center"><Lang>Top Users By Turnover</Lang></div>
                    {state.loading ? 
                        <LoadingContent/>
                        :
                        state.data?.usersTurnover?.users?.slice(0,3).map((item, index) => {
                            return (
                                    <Rank key={index} name={item.name} rank={index+1} picture={item.picture} total={Number(item.turnover).toFixed(2)} />
                                    
                                )
                            })
                    }
                </div>
            </div>
        </div>
    )
}