import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../assets/js/lang";
import { SelectAction } from "../../../components/SelectAction";
import { FilterDate } from "../../../components/FilterDate";
import { format } from "date-fns";
import { LoadingPage } from "./components/LoadingPage";
import { DateRangeModal } from "../../../components/DateRangeModal";
import { useAppAction, useAppState } from "../../../context/context";
import { usePurchaseAction, usePurchaseState } from "../../../context/purchasesContext";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { PurchaseDataTable } from "./components/PurchasesDataTable";
import { SelectActionBlue } from "../../../components/SelectActionBlue";

const options = [
    {
        name: "Add New",
        value: "addNew"
    },
    {
        name: "Export Data",
        value: "export"
    }
]
export function Purchases() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true)
    const checkFirstRender = useRef(true)
    const appAction = useAppAction();
    const appState = useAppState()
    const purchasesAction = usePurchaseAction();
    const purchasesState= usePurchaseState();
    const navigate = useNavigate();
    const [filter, setFilter] = useState("week");
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);
    const [supplier, setSupplier] = useState(-1);
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
    const handleCloseRangeModal = () => {
        setOpenCalendar(false);
    }
    const handleSuppliers = (e) => {
        setSupplier(e.target.value);
    }
    //export purshase 
    const exportData = () => {
        setLoading(true)
        api({
            method: "post",
            url: "/purchases/export",
            data: {
                supplier,
                filter : filter,
                startDate : startDate,
                endDate : endDate
            },
            responseType: "blob",
            withCredentials: true,
        }).then(res=>{
            //export data 
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;

                // Extraire le nom du fichier si dispo sinon par défaut
                const contentDisposition = res.headers["content-disposition"];
                let fileName = "purshase_export.csv";
                if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match?.[1]) {
                    fileName = match[1];
                }
                }

                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                
                setLoading(false)
        }).catch(err=>{
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    }
    //handle action of purchase 
    const handleAction = (e) => {
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "view":
                navigate("/purchases/"+id)
                break;
            case "remove":
                if (window.confirm("are you sure you want to delete this Sale")) {
                    setLoading(true)
                    // handle remove
                    api({
                        method: "delete",
                        url: "/purchase/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "success"
                        });
                        purchasesAction({
                            type: "REMOVE_ONE",
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
                e.target.value = "default"
                navigate("/pos/purchase/"+id,{ state: { from: '/purchases' } })
                break;
            default:
                break;
        }
    }
    //handle page actions 
    const handlePageActions = (e) => {
        switch (e.target.value) {
            case "addNew":
                //code
                navigate("/pos/purchase")
                e.target.value = "default";
                break;
            case "export":
                //export data
                exportData();
                e.target.value = "default";
                break;
            default:
                e.target.value = "default";
        }
    }
    //load data from server-side
    useEffect(() => {
        (async () => {
            try {
                //get users
                const supplierData = await getSuppliers()
                //set users
                setSuppliers(supplierData);
                //get sales
                const purchaseData = await getPurchases(supplier, filter, startDate, endDate);
                //set sales statistics
                purchasesAction({
                    type: "SET_STORED_ITEMS",
                    payload: purchaseData.purchases
                })
                purchasesAction({
                    type: "SET_ALL_ITEMS",
                    payload: purchaseData.purchases
                })
                purchasesAction({
                    type: "SET_STATISTICS",
                    payload: purchaseData.statistics
                })
                setLoading(false)
                appAction({
                    type: "SET_LOADING",
                    payload: false
                })
            } catch (err) {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                appAction({
                    type: "SET_LOADING",
                    payload: false
                })
                setLoading(false)
            }

        })();
    },[])
    useEffect(() => {
        try {
            if (checkFirstRender.current) {
                checkFirstRender.current = false;
                return;
            }
            (async () => {
                setLoading(true);
                //get sales
                const purchaseData = await getPurchases(supplier,filter,startDate,endDate);
                //set sales statistics
                purchasesAction({
                    type: "SET_STORED_ITEMS",
                    payload: purchaseData.purchases
                })
                purchasesAction({
                    type: "SET_ALL_ITEMS",
                    payload: purchaseData.purchases
                })
                purchasesAction({
                    type: "SET_STATISTICS",
                    payload: purchaseData.statistics
                })
                setLoading(false)
            })()
        } catch (err) {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        }

    },[filter, supplier])
    return (
        <>
        {!loading?
                <div className="container-fluid pt-2">
                    <div className="row m-0">
                        <div className="col-12 headerPage p-2 container-fluid">
                            <div className="row m-0 justify-content-between">
                                <div className={"col-5 h2 align-content-center "}><Lang>Purchases</Lang></div>
                                <div className="col-12 col-sm-12 col-md-7 col-lg-7 text-end">
                                    <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                        <SelectAction options={suppliers} onChange={handleSuppliers} defTitle="All Suppliers" defaultValue={supplier} defaultOption={-1} />
                                    </div>
                                    <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                        <FilterDate onChange={handleFilter} filter={filter} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row m-0">
                        <div className="col-sm-12 col-md-6 col-lg-4 p-3 ">
                            <div className="rounded-4 bg-white h-100 align-content-center text-center p-3">
                                <div className="title  h5 m-0"><Lang>Purchases Number</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{purchasesState?.statistics?.purchasesNumber}</div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 p-3 ">
                            <div className="rounded-4 bg-white align-content-center h-100 text-center p-3">
                                <div className="title  h5 m-0"><Lang>Total</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{purchasesState?.statistics?.total} <span className="fs-5">{appState.settings?.businessInfo?.currency?.symbol}</span></div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4  p-3 ">
                            <div className="rounded-4 bg-white text-center align-content-center h-100 p-3">
                                <div className="d-inline-block">
                                    <SelectActionBlue options={options} onChange={handlePageActions} />
                                </div>
                                {/* <ButtonWithIcon Icon={<FaPaperPlane fontSize={"1.7rem"} color="white"/>} label={"Send Report"} handleClick={sendReport} type={"button"} /> */}
                            </div>
                        </div>
                    </div>
                </div>
                : 
                <LoadingPage />
            }
        <div className="container-fluid">
            <div className="row m-0">
                <div className="col-12 p-2 dataTableBox items">
                    <PurchaseDataTable loading={loading} state={purchasesState} handleActions={handleAction} />
                </div>
            </div>
        </div>
        {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}
        </>
    )
}

/**
 * @desc call allUsers api to get all user
 * @todo call all user api
 * @todo set users state
 * @todo handle error message
*/
const getSuppliers = async () => {
    const res = await api({
        method: "get",
        url: "/allSuppliers",
        withCredentials: true
    });
    return res.data.data;
}

const getPurchases = async (supplier,filter,startDate,endDate) => {
    const res = await api({
        method: "post",
        url: "/purchases",
        data: {
            supplier,
            filter : filter,
            startDate : startDate,
            endDate : endDate
        },
        withCredentials: true,
    })
    return res.data.data;
}