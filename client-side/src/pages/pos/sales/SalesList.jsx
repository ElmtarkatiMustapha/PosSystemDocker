import { useEffect, useState } from "react";
import { FilterDate } from "../../../components/FilterDate";
import { SalesDataTable } from "./components/SalesDataTable";
import { format } from "date-fns";
import { Lang } from "../../../assets/js/lang";
import { DateRangeModal } from "../../../components/DateRangeModal";
import { SearchForm } from "./components/SearchForm";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { useAppAction, useAppState } from "../../../context/context";
import { usePosAction, usePosState } from "../../../context/posContext";
import { ViewModal } from "./components/ViewModal";

export function SalesList() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const appAction = useAppAction()
    const appState = useAppState();
    const posAction = usePosAction();
    const posState = usePosState();
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
    const handleAction = (e) => {
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "view":
                posAction({
                    type: "SET_CURRENT_SALE",
                    payload: id
                })
                posAction({
                    type: "TOGGLE_VIEW_SALE_MODAL",
                    payload: true
                })
                e.target.value = "default"
                break;
            case "remove":
                if (window.confirm("are you sure you want to delete this Sale")) {
                    setLoading(true)
                    // handle remove
                    api({
                        method: "delete",
                        url: "/sale/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "Success"
                        });
                        posAction({
                            type: "REMOVE_ONE_SALE",
                            payload: id
                        })
                        setLoading(false)
                    }).catch(err => {
                        //handle error
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        })
                        setLoading(false)
                        e.target.value = "default"
                    })
                } else {
                    e.target.value = "default"
                }
                break;
            case "edit":
                //edit here
                
                navigate("/pos/sales/" + id)
                e.target.value = "default"
                break;
            case "download_invoice":
                //edit here
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
                break;
            case "send":
                setLoading(true)
                api({
                    method: "post",
                    url: "/sale/sendToCustomer/"+id,
                    // withCredentials:true
                }).then(res => {
                    //handle response
                    appAction({
                        type: "SET_SUCCESS",
                        payload: res?.data?.message
                    })
                    setLoading(false)
                }).catch(err => {
                    appAction({
                        type: "SET_ERROR",
                        payload: err?.response?.data?.message
                    })
                    setLoading(false)
                })
                e.target.value = "default"
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        api({
            method: "post",
            url: "/salesUser",
            data: {
                filter : filter,
                startDate : startDate,
                endDate : endDate
            },
            withCredentials: true,
        }).then((res) => {
            return res.data
        }).then(res => {
            console.log(res)
            posAction({
                type:"SET_ALL_SALES",
                payload: res.data.sales
            })
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    },[])
    useEffect(() => {
        posAction({
            type: "SET_ALL_SALES_ITEMS",
            payload:posState.sales.storedItems 
        })
    }, [posState.sales.storedItems])
    useEffect(() => {
        setLoading(true)
        api({
            method: "post",
            url: "/salesUser",
            data: {
                filter : filter,
                startDate : startDate,
                endDate : endDate
            },
            withCredentials: true,
        }).then((res) => {
            return res.data
        }).then(res => {
            console.log(res)
            posAction({
                type:"SET_ALL_SALES",
                payload: res.data.sales
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
    return (
        <main style={{height:"100vh"}} className="w-100">
            <div
                style={{marginTop:"4.5rem"}}
                className="text-start d-inline-block w-100"
            >
                <div className="container-fluid">
                    <div className="row m-0">
                        <div className="col-12 headerPage p-2 container-fluid">
                            <div className="row m-0 justify-content-between">
                                <div className={"col-5 h2 align-content-center "}><Lang>Sales</Lang></div>
                                <div className="col-12 col-sm-12 col-md-7 col-lg-7 text-end">
                                    <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                        <FilterDate onChange={handleFilter} filter={filter} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SearchForm/>
                </div>
                    
                <div className="container-fluid">
                    <div className="row m-0">
                        <div className="col-12 p-2 dataTableBox items">
                            <SalesDataTable loading={loading} state={posState.sales} handleActions={handleAction} />
                        </div>
                    </div>
                </div>
                {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}
                {posState.salesContext?.openViewModal && <ViewModal/>}
            </div>
        </main>
    )
}