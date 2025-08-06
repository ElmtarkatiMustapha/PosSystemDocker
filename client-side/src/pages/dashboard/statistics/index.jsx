import { useEffect, useState } from "react"
import { Lang } from "../../../assets/js/lang"
import { FilterDate } from "../../../components/FilterDate"
import { SelectAction } from "../../../components/SelectAction"
import { useStatisticsAction, useStatisticsState } from "../../../context/statisticsContext"
import api from "../../../api/api"
import { format } from "date-fns"
import { DateRangeModal } from "../../../components/DateRangeModal"
import { useAppAction } from "../../../context/context"
import { AllStatistics } from "./components/AllStatistics"
import { ChoiceStatistic } from "./components/ChoiceStatistic"
import { LoadingHeader2 } from "../../../components/LoadingHeader2"

export function Statistics() {
    const statisticsState = useStatisticsState()
    const statisticsAction = useStatisticsAction()
    const appAction = useAppAction()
    const [openCalendar, setOpenCalendar] = useState(false);
    const [selectionRange,setSelectionRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }])
    const handleFilter = (e) => {
        if (e.target.value === "range") {
            setOpenCalendar(true);
        } else {
            statisticsAction({
                type: "SET_FILTER",
                payload:e.target.value
            })
            statisticsAction({
                type: "SET_LOADING",
                payload: true
            })
        }
    }
    const handleParts = (e) => {
        statisticsAction({
            type: "SET_CURRENT_ITEM",
            payload:e.target.value
        })
    }
    const handleSubmitRange = (e) => {
        e.preventDefault()
        statisticsAction({
            type: "SET_START_DATE",
            payload: format(selectionRange[0].startDate, "Y-MM-dd")
        })
        statisticsAction({
            type: "SET_END_DATE",
            payload: format(selectionRange[0].endDate, "Y-MM-dd")
        })
        statisticsAction({
            type: "SET_FILTER",
            payload: "range"
        })
        handleCloseRangeModal();
        statisticsAction({
            type: "SET_LOADING",
            payload: true
        })
    }
    const handleCloseRangeModal = () => {
        setOpenCalendar(false);
    }
    useEffect(() => {
        api({
            method: 'post',
            url: '/statistics',
            data: {
                filter : statisticsState.filter,
                startDate : statisticsState.startDate,
                endDate : statisticsState.endDate
            },
            withCredentials: true,
        })
        .then(res => res.data)
        .then(res => {
            statisticsAction({
                type: "SET_DATA",
                payload: res.data
            })
            statisticsAction({
                type: "SET_LOADING",
                payload: false
            })
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
            statisticsAction({
                type: "SET_LOADING",
                payload: false
            })
            // setLoading(false)
        })
    },[statisticsState.filter])
    return (
        <>
                <div className="container-fluid">
                    <div className="row m-0">
                        {statisticsState.loading ?
                            <LoadingHeader2/>
                            :
                        <div className="col-12 headerPage p-2 container-fluid">
                            <div className="row m-0 justify-content-between">
                                <div className={"col-5 h2 align-content-center "}><Lang>Statistics</Lang></div>
                                <div className="col-12 col-sm-12 col-md-7 col-lg-7 text-end">
                                    <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                        <SelectAction options={statisticsState.options} onChange={handleParts} defTitle="All" defaultValue={statisticsState.currentItem} defaultOption={-1} />
                                    </div>
                                    <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                        <FilterDate onChange={handleFilter} filter={statisticsState.filter} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    <div className="row m-0">
                        {statisticsState.currentItem == -1 && <AllStatistics />}
                        {statisticsState.currentItem != -1 && <ChoiceStatistic />}
                    </div>
                </div>
            {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}

        </>
    )
}