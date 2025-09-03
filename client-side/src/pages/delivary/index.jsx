import { useEffect, useRef, useState } from "react"
import { useAppAction, useAppState } from "../../context/context"
import { Lang } from "../../assets/js/lang";
import { SearchForm } from "./components/SearchForm";
import api from "../../api/api";
import { useDeliveryAction, useDeliveryState } from "../../context/deliveryContext";
import { SelectAction } from "./components/SelectAction";
import { SalesDataTable } from "./components/SalesDataTable";
import { LoadingPage } from "./components/LoadingPage";
import { ViewModal } from "./components/ViewModal";
import { Link } from "react-router-dom";


export function Delivery() {
    const appState = useAppState()
    const appAction = useAppAction()
    const [sectors, setSectors] = useState();
    const [sector, setSector] = useState();
    const [loading, setLoading] = useState(true);
    const deliveryState = useDeliveryState()
    const deliveryAction = useDeliveryAction()
    const handleSectors = (e) => {
        // console.log(e.target.value)
        deliveryAction({
            type: "CHANGE_SECTOR",
            payload:e.target.value
        })
    }
    const handleAction = (e) => {
        let action = e.target.value
        let id = e.target.getAttribute("data-id");
        if (action == "view") {
            //open view modal containe all order infos
            deliveryAction({
                type: "SET_VIEW_ITEM",
                payload: id
            })
            deliveryAction({
                type: "TOGGLE_VIEW_MODAL",
                payload: true
            })
            e.target.value = "default"
        } else if (action == "delivered") {
            //set order as delivered
            //send request 
            //remove order from list
            let conf = window.confirm("are you sure")
            if (conf) {
                setLoading(true)
                api({
                    method: "post",
                    url: "/deliveryOrder/" + id,
                    // withCredentials:true
                })
                .then(res => res.data)
                .then(res => {
                    //data
                    deliveryAction({
                        type: "REMOVE_ONE",
                        payload: id
                    })
                    setLoading(false)
                }).catch(err => {
                    appAction({
                        type: "SET_ERROR",
                        payload: err?.response?.data?.message
                    })
                    setLoading(false)
                })
            }
            e.target.value = "default"
        } else if (action == "invoice") {
            //print invoice 
            setLoading(true)
            api({
                method: "post",
                url: "/deliverySale/print/"+id,
                // withCredentials:true
            }).then(res => {
                if(appState.currentUser.cashier == 0){
                    const pdfBlob = atob(res.data.data); // Decode Base64
                    const byteNumbers = new Array(pdfBlob.length);
                    for (let i = 0; i < pdfBlob.length; i++) {
                        byteNumbers[i] = pdfBlob.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'application/pdf' });
        
                    // Create a URL for the PDF blob
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, "_blanc")
                }
                setLoading(false)
            }).catch(err => {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                setLoading(false)
            })
            e.target.value = "default"
        } else {
            e.target.value = "default"
            //dont do anything
        }
    }
    useEffect(() => {
        (async () => {
            try {
                //get users
                const sectorsData = await getSectors()
                //set users
                setSectors(sectorsData);
                //get sales
                const salesData = await getSales();
                //set sales statistics
                deliveryAction({
                    type: "SET_STORED_ITEMS",
                    payload: salesData
                })
                deliveryAction({
                    type: "SET_ALL_ITEMS",
                    payload: salesData
                })
                setLoading(false)
            } catch (err) {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                setLoading(false)
            }

        })();
    }, [])
    return (
        <>
            <main className="p-1"> 
                <div style={{marginTop:"4rem"}}>
                    {!loading ?
                        <>
                            <div className="container-fluid p-2">
                                <div className="row m-0">
                                    <div className="col-12 headerPage p-2 container-fluid">
                                        <div className="row m-0 justify-content-between">
                                            <div className={"col-5 h2 align-content-center "}><Lang>Orders</Lang></div>
                                            <div className="col-12 col-sm-12 col-md-7 col-lg-7 text-end">
                                                <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                                    <SelectAction options={sectors} onChange={handleSectors} defTitle="All Sectors" defaultValue={sector} defaultOption={-1} />
                                                </div>
                                                <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                                    <DeliveredOrdersBtn/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <SearchForm/>
                        </>
                        : 
                        <LoadingPage/>
                    }
                </div>
                <div className="container-fluid">
                    <div className="row m-0">
                        <div className="col-12 p-2 dataTableBox items">
                            <SalesDataTable loading={loading} state={deliveryState} handleActions={handleAction} />
                        </div>
                    </div>
                </div>
            </main>
            {deliveryState.openViewModal && <ViewModal/>}
        </>
    )
}

/**
 * @desc call allUsers api to get all user
 * @todo call all user api
 * @todo set users state
 * @todo handle error message
*/
const getSectors = async () => {
    const res = await api({
        method: "get",
        url: "/deliverySectors",
        withCredentials: true
    });
    return res.data.data;
}

const getSales = async () => {
    const res = await api({
        method: "get",
        url: "/deliverySales",
        // withCredentials:true
    })
    return res.data.data;
}
const DeliveredOrdersBtn = () => {
    return (
        <div style={{verticalAlign:"middle"}} className="p-1 text-center">
            <Link to={"/delivery/sales"}  style={{
                borderRadius: "29px",
                fontSize: "1rem",
                fontWeight: "600",
            }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                <span className="ps-1 pe-1"><Lang>Delivered orders</Lang></span>
            </Link>
        </div>
    )
}