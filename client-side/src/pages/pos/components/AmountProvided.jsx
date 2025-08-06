import { useEffect, useRef } from "react";
import { Lang } from "../../../assets/js/lang";
import { usePosAction, usePosState } from "../../../context/posContext";

export function AmountProvided() {
    const posState = usePosState();
    const posAction = usePosAction();
    const amountRef = useRef(null);
    const setAmount = (event)=> {
        posAction({
            type: "SET_AMOUNT_PROVIDED",
            payload: event.target.value
        })
        amountRef.current.value = posState.cart.amountProvided
    }
    useEffect(() => {
        amountRef.current.value = posState.cart.amountProvided
    },[posState.cart.amountProvided])
    return (
        <div className="col-12">
            <label htmlFor=""><strong><Lang>Amount provided</Lang>:</strong></label>
            <input ref={amountRef} min={0}  onBlur={setAmount} className="form-control d-inline-block w-auto" type="number" name="" defaultValue={posState.cart.amountProvided} id="" />
        </div>
    )
}
