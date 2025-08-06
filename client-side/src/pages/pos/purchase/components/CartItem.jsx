import { useEffect, useRef } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import { Lang } from "../../../../assets/js/lang";
import { usePosAction } from "../../../../context/posContext";

export function CartItem({ id, codebar, name, stocks, qnt, price }) {
    const qntInput = useRef();
    const priceInput = useRef();
    const posAction = usePosAction();
    const changePrice = () => {
        posAction({
            type: "SET_PRICE",
            payload: {
                id: id,
                price:Number(event.target.value)
            }
        })
        priceInput.current.value = price
    }
    const remove = () => {
        posAction({
            type: "REMOVE_PRODUCT_PURCHASE",
            payload:id
        })
    }
    const changeQnt = (event) => {
        posAction({
            type: "SET_PURCHASE_QNT",
            payload: {
                id: id,
                qnt: Number(event.target.value) 
            }
        })
        qntInput.current.value = qnt
    }
    const decQnt = () => {
        posAction({
            type: "DEC_PURCHASE_QNT",
            payload: id
        })
    }
    const incQnt = () => {
        posAction({
            type: "INC_PURCHASE_QNT",
            payload: id
        })
    }
    useEffect(() => {
        qntInput.current.value = Number(qnt)
    }, [qnt])

    useEffect(() => {
        priceInput.current.value = Number(price)
    },[price])
    return (
        <tr className="mt-1 mb-1">
            <td>
                <button onClick={remove} className="btn-remove p-0">
                    <TiDelete className="icon-remove p-1"/>
                </button>
            </td>
            <td>
                <div className="p-0">{name}</div>
                <div className="p-0"><Lang>Stock</Lang> :{stocks}</div>
            </td>
            <td>
                <input ref={priceInput} onBlur={changePrice} min={0}  className="discount form-control d-inline-block"  type="number" name="" defaultValue={price} id="" />
            </td>
            <td className="">
                <button onClick={decQnt} className=" btn-minus"><FaMinus/></button>
                <input ref={qntInput}  min={1} onBlur={changeQnt} style={{border:"none"}} className=" form-control d-inline-block quantity"  type="number" name="" defaultValue={qnt} />
                <button onClick={incQnt} className=" btn-plus"><FaPlus/></button>
            </td>
            <td>
                { Number((price*qnt)).toFixed(2) }dh
            </td>
        </tr>
    )
}