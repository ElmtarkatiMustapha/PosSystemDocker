import { useEffect, useState } from "react"
import { LoadingPage } from "../components/LoadingPage";
import { Lang } from "../../../assets/js/lang";
import { FilterDate } from "../../../components/FilterDate";
import { DateRangeModal } from "../../../components/DateRangeModal";
import { format } from "date-fns";
import { SearchForm } from "./SearchForm";
import { SalesDataTable } from "./SalesDataTable";
import { useDeliveryAction, useDeliveryState } from "../../../context/deliveryContext";
import api from "../../../api/api";
import { useAppAction, useAppState } from "../../../context/context";
import { ViewModal } from "./components/ViewModal";
import { Link } from "react-router-dom";

export function DeliveredOrders() {
    const [loading, setLoading] = useState(true);
    const deliveryState = useDeliveryState()
    const deliveryAction = useDeliveryAction();
    const appAction = useAppAction();
    const appState = useAppState();
    const [filter, setFilter] = useState("week");
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [selectionRange,setSelectionRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }])
    const handleFilter = (e) => {
        if (e.target.value === "range") {
            setOpenCalendar(true);
        } else {
            setFilter(e.target.value)
        }
    }
    const handleSubmitRange = (e) => {
        e.preventDefault()
        setStartDate(format(selectionRange[0].startDate, "Y-MM-dd"));
        setEndDate(format(selectionRange[0].endDate, "Y-MM-dd"));
        setFilter("range");
        handleCloseRangeModal();
    }
    //close date model
    const handleCloseRangeModal = () => {
        setOpenCalendar(false);
    }
    useEffect(() => {
        deliveryAction({
            type: "SET_ALL_SALES_ITEMS",
            payload:deliveryState.salesContext.storedItems 
        })
    }, [deliveryState.salesContext.storedItems])

    useEffect(() => {
        setLoading(true)
        api({
            method: "post",
            url: "/deliveredSalesUser",
            data: {
                filter : filter,
                startDate : startDate,
                endDate : endDate
            },
            withCredentials: true,
        }).then((res) => {
            return res.data
        }).then(res => {
            deliveryAction({
                type:"SET_STORED_SALES_ITEMS",
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
    
    }, [filter])
    const handleActions = (e) => {
        //handle action
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
                                            <div className={"col-5 h2 align-content-center "}><Lang>Sales</Lang></div>
                                            <div className="col-12 col-sm-12 col-md-7 col-lg-7 text-end">
                                                <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                                    <FilterDate onChange={handleFilter} filter={filter} />
                                                </div>
                                                <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                                    <DeliveryBtn/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <SearchForm/>
                            </div>
                        </>
                        : 
                        <LoadingPage/>
                    }
                </div>
                <div className="container-fluid">
                    <div className="row m-0">
                        <div className="col-12 p-2 dataTableBox items">
                            <SalesDataTable loading={loading} state={deliveryState.salesContext} handleActions={handleActions}/>
                        </div>
                    </div>
                </div>
            </main>
            {deliveryState.openViewModal && <ViewModal/>}
            {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}
        </>
    )
}
const DeliveryBtn = () => {
    return (
        <div style={{verticalAlign:"middle"}} className="p-1 text-center">
            <Link to={"/delivery"}  style={{
                borderRadius: "29px",
                fontSize: "1rem",
                fontWeight: "600",
            }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                <span className="ps-1 pe-1"><Lang>Delivery</Lang></span>
            </Link>
        </div>
    )
}