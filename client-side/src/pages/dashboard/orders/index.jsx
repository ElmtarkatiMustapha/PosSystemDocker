import DataTable from "react-data-table-component";
import { Lang } from "../../../assets/js/lang";
import { PrimaryButton } from "../../../components/primaryButton";
import { RecordTable } from "./components/RecordTable";
import { useEffect, useState } from "react";
import { useOrdersAction, useOrdersState } from "../../../context/ordersContext";
import api from "../../../api/api";
import { useAppAction } from "../../../context/context";

export function Orders() {
    const [loading, setLoading] = useState(true);
    const ordersState = useOrdersState();
    const ordersAction = useOrdersAction();
    const appAction = useAppAction();
    const setAllReady = () => {
        if (window.confirm("Are you sure that you want to set all order ready")) {
            setLoading(true);
            api({
                method: "post",
                url: "/setAllReady",
                withCredentials: true
            }).then(res => {
                ordersAction({
                    type: "SET_STORED_ITEMS",
                    payload: []
                })
                setLoading(false)
            }).catch((err) => {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                setLoading(false)
            });
        }
    }
    useEffect(() => {
        api({
            method: "GET",
            url: "/pendingOrders",
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            ordersAction({
                type: "SET_STORED_ITEMS",
                payload: res.data
            })
            setLoading(false)
        }).catch(err => {
             appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    }, [])
    useEffect(() => {
        ordersAction({
            type: "SET_ALL_ITEMS",
            payload: ordersState.storedItems
        })
    },[ordersState.storedItems])
    return (
        <>
            <div className="container-fluid">
                <div className="pt-2 pb-2 m-0">
                    <div className="col-12 headerPage p-2 container-fluid">
                        <div className="row m-0 justify-content-between">
                            <div className={"col-5 h2 align-content-center "}><Lang>Orders</Lang></div>
                            <div className="col-7 text-end">
                                <div style={{ verticalAlign: "middle" }} className="d-inline-block p-1">
                                    <PrimaryButton className="float-start float-sm-end" label={"All Ready"} handleClick={setAllReady} type={"button"}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row pt-2 pb-2 m-0">
                    <RecordTable state={ordersState} action={ordersAction} loading={loading} setLoading={setLoading}/>
                </div>
            </div>
        </>
    )
}