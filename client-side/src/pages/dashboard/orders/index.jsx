import DataTable from "react-data-table-component";
import { Lang } from "../../../assets/js/lang";
import { PrimaryButton } from "../../../components/primaryButton";
import { RecordTable } from "./components/RecordTable";
import { useEffect, useRef, useState } from "react";
import { useOrdersAction, useOrdersState } from "../../../context/ordersContext";
import api from "../../../api/api";
import { useAppAction } from "../../../context/context";
import MultiSelect from "../../../components/MultiSelect";
import { Button, Popover } from "bootstrap";

export function Orders() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const ordersState = useOrdersState();
    const ordersAction = useOrdersAction();
    const appAction = useAppAction();
    const setAllReady = () => {
        if (window.confirm("Are you sure that you want to set all order ready")) {
            setLoading(true);
            api({
                method: "post",
                url: "/setAllReady",
                data: {
                    users: ordersState.selectedUsers
                },
                withCredentials: true
            }).then(res => {
                ordersAction({
                    type: "UPDATE_ITEMS"
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
         (async () => {
            try {
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
                //get users
                const usersData = await getUsers()
                //set users
                setUsers(usersData);
                //get sales
            } catch (err) {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                setLoading(false)
            }
        })();

    }, [])
    useEffect(() => {
        ordersAction({
            type: "SET_ALL_ITEMS",
            payload: ordersState.storedItems
        })
    },[ordersState.storedItems])
    /**
     * handle change of the select users 
     */
    const handleChangeUsers = (selectedUsers)=>{
        ordersAction({
            type:"SET_SELECTED_USERS",
            payload: selectedUsers
        })
    }
    return (
        <>
            <div className="container-fluid pt-2">
                <div className="pt-2 pb-2 m-0">
                    <div className="col-12 headerPage p-2 container-fluid">
                        <div className="row m-0 justify-content-between">
                            <div className={"col-5 h2 align-content-center "}><Lang>Orders</Lang></div>
                            <div className="col-12 col-sm-12 col-md-7 col-lg-7 text-end">
                                <div style={{ verticalAlign: "middle" }} className="d-inline-block pe-2">
                                    <MultiSelect handleChange={handleChangeUsers} list={users}/>
                                </div>
                                
                                <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
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

/**
 * @desc call allUsers api to get all user
 * @todo call all user api
 * @todo set users state
 * @todo handle error message
*/
const getUsers = async () => {
    const res = await api({
        method: "get",
        url: "/allUsers",
        withCredentials: true
    });
    return res.data.data;
}
