import { useEffect, useState } from "react";
import { usePosAction, usePosState } from "../../../context/posContext";
import { Lang } from "../../../assets/js/lang";

export function Paginate() {
    const posState = usePosState();
    const posAction = usePosAction();
    const [value, setValue] = useState(posState.currentPage);
    const setCurrentPage = (e) => {
        posAction({ type: "SET_CURRENT_PAGE", payload: e.target.value })
        setValue(posState.currentPage);
    }
    const incCurrentPage = () => {
        posAction({ type: "INC_CURRENT_PAGE" });
    }
    const decCurrentPage = () => {
        posAction({ type: "DEC_CURRENT_PAGE" });
    }
    useEffect(() => {
        setValue(posState.currentPage) 
    },[posState.currentPage])
    return (
        <>
            <div className="col-12 text-center paginate">
                <div className="text-center d-block d-sm-inline-block p-1">
                    <button onClick={decCurrentPage}  className="btn btn-prev"><Lang>Preview</Lang></button>
                </div>
                <div className="text-center p-1 d-block d-sm-inline-block">
                    <input className="form-control currentPage" onChange={(e)=>setValue(e.target.value)} onBlur={setCurrentPage} value={value} type="number" />
                    <span className="nb-page">/{posState.numberPages}</span>
                </div>
                <div className="text-center p-1 d-block d-sm-inline-block">
                    <button onClick={incCurrentPage} className="btn btn-next"><Lang>Next</Lang></button>
                </div>
            </div>
        </>
    )
}