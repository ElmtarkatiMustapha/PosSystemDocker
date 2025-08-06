import { useEffect } from "react";
import { Lang } from "../../../assets/js/lang";
import { usePosAction, usePosState } from "../../../context/posContext";
import api from "../../../api/api";

export function CartHeader() {
    const posState = usePosState();
    const posAction = usePosAction();
    useEffect(() => {
        //load and set sector 
        loadSector().then((data) => {
            posAction({
                type: "SET_SECTORS",
                payload: data
            })
            posAction({
                type: "SET_LOADING",
                payload: false
            })
        })
        //set customers
        loadCustomers().then((data) => {
            posAction({
                type: "SET_CUSTOMERS",
                payload: data
            })
            posAction({
                type: "SET_CURRENT_CUSTOMERS",
                payload: data
            })
            posAction({
                type: "SET_LOADING",
                payload: false
            })
        })
    },[])
    //change order type
    const handleOrderType = (event) => {
        posAction({ 
            type: "TOGGLE_ORDER_TYPE",
            payload:event.target.value
        })
    }
    //load sectors
    const loadSector = () => {
        
        return new Promise((resolve, reject) => {
           api({
                method: "GET",
                url: "/posSectors",
                withCredentials: true
            }).then(res => {
                return res.data;
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        })
    }
    //load customers
    const loadCustomers = () => {
        return new Promise((resolve, reject) => {
            api({
                method: "GET",
                url: "/posCustomers",
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
    //change sector
    const toggleSector = (event) => {
        let data=[]
        if (event.target.value == 0) {
            data = posState.customers
        } else {
            data = posState.customers.filter(((item) => {
                return (item.sector == event.target.value) || (item.name ==="default")
            }))
        }
        posAction({
            type: "SET_CURRENT_CUSTOMERS",
            payload:data
        })
    }
    const toggleCustomers = (event) => {
        posAction({
            type: "SET_SELECTED_CUSTOMER",
            payload: event.target.value
        })
    }
    return (
        <>
        <div className="col-lg-6 col-md-12 pt-1 pb-1">
            <select onChange={handleOrderType} className="form-select" defaultValue={posState.cart.orderType} name="" id="">
                <option value="retail" ><Lang>Retail</Lang></option>
                <option value="wholesale" selected={posState.cart.orderType =="wholesale"}><Lang>Wholesale</Lang></option>
            </select>
        </div>
        <div className="col-lg-6 col-md-12 pt-1 pb-1">
            <select onChange={toggleSector} className="form-select" defaultValue={0} name="" id="">
                <option key={0} value={0}><Lang>All Sectors</Lang></option>
                    {posState.sectors.map((item) => {
                        return (
                            <option key={item.id} value={item.id}>{item.title}</option>
                        )
                    })}
            </select>
        </div>
        <div className="col-12 pt-1 pb-1">
            <select className="form-select" defaultValue={posState.customer} onChange={toggleCustomers} name="" id="">
                    {/* <option key={1} value={1}>default</option> */}
                    {posState.currentCustomers.map((item) => {
                        if (item.id === posState.cart.customer) {
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