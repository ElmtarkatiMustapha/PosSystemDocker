import { useState } from "react";
import { Lang } from "../assets/js/lang";
import { DateRangeModal } from "./DateRangeModal";
import { format } from "date-fns";

export function DateFilter({state, dispatch }) {
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
            dispatch({
                type: "SET_FILTER",
                payload: e.target.value
            })
        }
    }
    
    const handleSubmitRange = (e) => {
        e.preventDefault()
        dispatch({
            type: "SET_START_DATE",
            payload: format(selectionRange[0].startDate, "Y-MM-dd")
        })
        dispatch({
            type: "SET_END_DATE",
            payload: format(selectionRange[0].endDate, "Y-MM-dd")
        })
        dispatch({
            type: "SET_FILTER",
            payload: "range"
        })
        handleCloseRangeModal();
    }
    const handleCloseRangeModal = () => {
        setOpenCalendar(false);
    }
    return (
        <>
            <div className="d-inline-block ps-1 pe-1">
                <select onChange={handleFilter} className=" pt-1 pb-1 ps-2 pe-2  blueFilterSelect" defaultValue={state.filter}>
                    <option value="default"><Lang>filter by(Week)</Lang></option>
                    <option value="today"><Lang>Today</Lang></option>
                    <option value="yesterday"><Lang>Yesterday</Lang></option>
                    <option value="week"><Lang>Current Week</Lang></option>
                    <option value="month"><Lang>Current Month</Lang></option>
                    <option value="year"><Lang>Current Year</Lang></option>
                    <option value="range"><Lang>Range</Lang></option>
                </select>
            </div>
            {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}
        </>
    )
}