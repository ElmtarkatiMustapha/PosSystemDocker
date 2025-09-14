import { useEffect } from "react";
import api from "../../../../api/api";
import { usePosAction, usePosState } from "../../../../context/posContext"
import { Lang } from "../../../../assets/js/lang";

export function CartHeader() {
    const posState = usePosState();
    const posAction = usePosAction();
    const loadSuppliers = () => {
        return new Promise((resolve, reject) => {
            api({
                method: "GET",
                url: "/posSuppliers",
                withCredentials: true
            }).then(res => {
                return res.data;
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
    useEffect(() => {
        //set suppliers
        loadSuppliers().then((data) => {
            posAction({
                type: "SET_SUPPLIERS",
                payload: data
            })
        })
    },[])
    const toggleSupplier = (e) => {
        posAction({
            type: "TOGGLE_SUPPLIER",
            payload: e.target.value
        })
    }
    return (
         <>
        <div className="col-12 pt-1 pb-1">
            <select className="form-select" required defaultValue={posState.purchaseCart.supplier} onChange={toggleSupplier} name="" id="">
                    <option key={0} ><Lang>Chose Supplier</Lang></option>
                    {posState.suppliers.map((item) => {
                        if (item.id === posState.purchaseCart.supplier) {
                            return (
                                <option selected key={item.id}  value={item.id}>{item.name}</option>
                            )
                        } else {
                            return (
                                <option key={item.id}  value={item.id}>{item.name}</option>
                            )
                        }
                    })}
            </select>
        </div>
        </>
    )
}