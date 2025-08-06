import { useEffect, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { useCateAction, useCateState } from "../../../../context/categoriesContext";

export function Paginate() {
    const cateState = useCateState();
    const cateAction = useCateAction();
    const [pageChn, setPageChn] = useState(cateState.currentPage);

    const incr = () => {
        cateAction({
            type: "INC_PAGE"
        });
    }
    const decr = () => {
        cateAction({
            type: "DEC_PAGE"
        })
    }
    const setPage = () => {
        if (pageChn <= 0) {
            cateAction({
                type: "SET_PAGE",
                payload: 1
            })
            setPageChn(1)
        } else {
            setPageChn(pageChn > cateState.numberPages ? cateState.numberPages:pageChn)
            cateAction({
                type: "SET_PAGE",
                payload: pageChn > cateState.numberPages ? cateState.numberPages:pageChn
            })
        }
    }
    const handleChange = (e) => {
        setPageChn(e.target.value);
    }
    useEffect(() => {
        setPageChn(cateState.currentPage);
    },[cateState.currentPage])
    return (
        <>
            <div className="col-12 text-center paginate">
                <div className="text-center d-block d-sm-inline-block p-1">
                    <button onClick={decr}  className="btn btn-prev"><Lang>Preview</Lang></button>
                </div>
                <div className="text-center p-1 d-block d-sm-inline-block">
                    <input className="form-control currentPage" onChange={handleChange} onBlur={setPage} value={pageChn} type="number" />
                    <span className="nb-page">/{cateState.numberPages}</span>
                </div>
                <div className="text-center p-1 d-block d-sm-inline-block">
                    <button onClick={incr} className="btn btn-next"><Lang>Next</Lang></button>
                </div>
            </div>
        </>
    )
}