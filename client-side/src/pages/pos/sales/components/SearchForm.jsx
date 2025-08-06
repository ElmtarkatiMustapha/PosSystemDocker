import { useRef } from "react";
import { PrimaryButton } from "../../../../components/primaryButton";
import { usePosAction, usePosState } from "../../../../context/posContext";

export function SearchForm() {
    const refSearch = useRef();
    const salesState = usePosState();
    const salesAction = usePosAction();
    const handleSearch = (e) => {
        e.preventDefault();
        let textSearch = refSearch.current.value;
        if (textSearch.trim().length < 1) {
            salesAction({
                type: "SET_ALL_ITEMS",
                payload: salesState.sales.storedItems
            })
        } else {
            salesAction({
                type: "SET_ALL_ITEMS",
                payload: salesState.sales.storedItems.filter(item => {
                    return item.customer.toLowerCase().includes(textSearch.trim().toLowerCase()) || item.id == textSearch.trim().toLowerCase()
                })
            })
        }

    }
    return (
        <div className="row m-0">
            <div className="col-12 text-end pt-3 pb-3">
                <form style={{verticalAlign:"middle"}} onSubmit={handleSearch} className="d-inline-block pe-1 ps-1">
                    <input ref={refSearch} type="text"   className="form-control form-control-lg" placeholder={"Search for sale"} />
                </form>
                <div style={{verticalAlign:"middle"}} className="d-inline-block pe-1 ps-1">
                    <PrimaryButton label={"Search"} handleClick={handleSearch} type={"button"} />
                </div>
            </div>
        </div>
    )
}