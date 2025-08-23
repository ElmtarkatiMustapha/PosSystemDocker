import { FaMinus, FaPlus } from "react-icons/fa"
import { TiDelete } from "react-icons/ti"
import { usePosAction, usePosState } from "../../../context/posContext"
import { useDeferredValue, useEffect, useRef } from "react";
import { useAppState } from "../../../context/context";

export function CartItem({ id, codebar, name, price, qnt, discount }) {
    const posAction = usePosAction();
    const appState = useAppState();
    const qntInput = useRef(null);
    const discountInput = useRef(null);
    const remove = () => {
        posAction({
            type: "REMOVE_PRODUCT",
            payload:id
        })
    }
    const changeDiscount = (event) => {
        posAction({
            type: "SET_DISCOUNT",
            payload: {
                id: id,
                discount:Number(event.target.value)
            }
        })
        discountInput.current.value = discount
    }
    const changeQnt = (event) => {
        posAction({
            type: "SET_QNT",
            payload: {
                id: id,
                qnt: Number(event.target.value) 
            }
        })
        qntInput.current.value = qnt
    }
    const incQnt = () => {
        posAction({
            type: "INC_QNT",
            payload:id
        })
    }
    const decQnt = () => {
        posAction({
            type: "DEC_QNT",
            payload:id
        })
    }
    useEffect(() => {
         qntInput.current.value = Number(qnt)
    },[qnt])
    useEffect(() => {
        discountInput.current.value = Number(discount)
    },[discount])
    
        
    return (
        <tr className="mt-1 mb-1">
            <td>
                <button onClick={remove} className="btn-remove p-0">
                    <TiDelete className="icon-remove p-1"/>
                </button>
            </td>
            <td>
                <div style={{ WebkitLineClamp: 1, overflow: "hidden", WebkitBoxOrient: "vertical", display: "-webkit-box" }} className="p-0">{name}</div>
                <div className="p-0">{price} {appState.settings.businessInfo.currency.symbol}</div>
            </td>
            <td style={{minWidth: "10.3rem"}}>
                <button onClick={decQnt} className=" btn-minus"><FaMinus/></button>
                <input ref={qntInput}  min={1} onBlur={changeQnt} style={{border:"none"}} className=" form-control d-inline-block quantity"  type="number" name="" defaultValue={qnt} />
                <button onClick={incQnt} className=" btn-plus"><FaPlus/></button>
            </td>
            <td>
                {
                    appState.settings?.posSettings?.discount ==1 ? 
                        <input ref={discountInput} onBlur={changeDiscount} min={0} max={100} className="discount form-control d-inline-block"  type="number" name="" defaultValue={discount} id="" />
                        :
                        <div ref={discountInput}>
                            {Number(discount).toFixed(2)}
                        </div>
                }
            </td>
            <td>
                { Number((price*qnt) - (price*qnt*discount/100)).toFixed(2) } {appState.settings.businessInfo.currency.symbol}
            </td>
        </tr>
    )
}