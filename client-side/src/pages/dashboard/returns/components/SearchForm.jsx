import { useRef } from "react"
import { PrimaryButton } from "../../../../components/primaryButton";
import { useReturnAction, useReturnState } from "../../../../context/returnContext";

export function SearchForm() {
    const refSearch = useRef();
    const returnsState = useReturnState();
    const returnsAction = useReturnAction();
    const handleSearch = (e) => {
        e.preventDefault();
        let textSearch = refSearch.current.value;
        if (textSearch.trim().length < 1) {
            returnsAction({
                type: "SET_ALL_ITEMS",
                payload: returnsState.storedItems
            })
        } else {
            returnsAction({
                type: "SET_ALL_ITEMS",
                payload: returnsState.storedItems.filter(item => {
                    return  item.sale_id == textSearch.trim().toLowerCase()
                })
            })
        }

    }
    return (
        <div className="row m-0">
            <div className="col-12 text-end pt-0 pb-3">
                <form style={{verticalAlign:"middle"}} onSubmit={handleSearch} className="d-inline-block pe-1 ps-1">
                    <input ref={refSearch} type="text"   className="form-control form-control-lg" placeholder={"Search by Sale Id"} />
                </form>
                <div style={{verticalAlign:"middle"}} className="d-inline-block pe-1 ps-1">
                    <PrimaryButton label={"Search"} handleClick={handleSearch} type={"button"} />
                </div>
            </div>
        </div>
    )
}