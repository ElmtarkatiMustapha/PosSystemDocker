import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../assets/js/lang";
import { SelectAction } from "../../../components/SelectAction";
import { useAppAction, useAppState } from "../../../context/context";
import { FilterDate } from "../../../components/FilterDate";
import api from "../../../api/api";
import { LoadingPage } from "./components/LoadingPage";
import { ButtonWithIcon } from "../../../components/ButtonWithIcon";
import { FaPaperPlane } from "react-icons/fa6";
import { format } from "date-fns";
import { DateRangeModal } from "../../../components/DateRangeModal";
import { useSalesAction, useSalesState } from "../../../context/salesContext";
import { SalesDataTable } from "./components/SalesDataTable";
import { useNavigate } from "react-router-dom";
import { SearchForm } from "./components/SearchForm";
import { ReturnModal } from "./components/ReturnModal";

export function Sales() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true)
    const checkFirstRender = useRef(true)
    const appAction = useAppAction();
    const appState = useAppState();
    const salesAction = useSalesAction();
    const salesState = useSalesState();
    const navigate = useNavigate();
    const [filter, setFilter] = useState("week");
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);
    const [user, setUser] = useState(-1);
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
    //set the user
    const handleUsers = (e) => {
        setUser(e.target.value);
    }
    //handle action of each
    const handleAction = (e) => {
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "view":
                navigate("/sales/"+id)
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
                            payload: "success"
                        });
                        salesAction({
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
                navigate("/pos/sales/" + id)
                e.target.value = "default"
                break;
            case "delivered":
                //edit here
                if (window.confirm("Are you sure!!")) {
                    api({
                        method: "post",
                        url: "/deliveredSale/"+id,
                        // withCredentials:true
                    }).then(res => {
                        return res.data;
                    }).then(res => {
                        salesAction({
                            type: "TOGGLE_STATUS",
                            payload:res.data
                        })
                        //set update to delivered
                    }).catch(err => {
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        })
                        setLoading(false)
                    })
                }
                e.target.value = "default"
                break;
            case "pending":
                //edit here
                if (window.confirm("Are you sure!!")) {
                    api({
                        method: "post",
                        url: "/pendingSale/"+id,
                        // withCredentials:true
                    }).then(res => {
                        return res.data;
                    }).then(res => {
                        salesAction({
                            type: "TOGGLE_STATUS",
                            payload:res.data
                        })
                    }).catch(err => {
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        })
                        setLoading(false)
                    })
                }
                e.target.value = "default"
                break;
            case "return":
                salesAction({
                    type: "TOGGLE_RETURN_MODAL",
                    payload:true
                })
                salesAction({
                    type: "SET_RETURN_SALE_ID",
                    payload: id
                })
                e.target.value = "default";
                break;
            case "print_invoice":
                //send request to download
                setLoading(true)
                api({
                    method: "post",
                    url: "/sale/print/"+id,
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
                e.target.value ="default";
                break;
            case "send":
                //send request to send invoice to customer
                e.target.value = "default";
                break;
            default:
                break;
        }
    }
    //send report to admin
    const exportData = () => {
        setLoading(true)
        api({
            method:"post",
            url:"sales/export",
            data: {
                user,
                filter : filter,
                startDate : startDate,
                endDate : endDate
            },
            responseType: "blob",
            withCredentials: true,
        }).then((res)=>{
            //export data 
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;

            // Extraire le nom du fichier si dispo sinon par défaut
            const contentDisposition = res.headers["content-disposition"];
            let fileName = "sales_export.csv";
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
        }).catch((err)=>{
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    }
    /**
     * @desc the useEffect must load all the data of the page
     * @todo get all user and set it in users state
     * @todo get all sales and statistic fliter by date filter 
     */
    useEffect(() => {
        (async () => {
            try {
                //get users
                const usersData = await getUsers()
                //set users
                setUsers(usersData);
                //get sales
                const salesData = await getSales(user, filter, startDate, endDate);
                //set sales statistics
                salesAction({
                    type: "SET_STORED_ITEMS",
                    payload: salesData.sales
                })
                salesAction({
                    type: "SET_ALL_ITEMS",
                    payload: salesData.sales
                })
                salesAction({
                    type: "SET_STATISTICS",
                    payload: salesData.statistics
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
    useEffect(() => {
        try {
            if (checkFirstRender.current) {
                checkFirstRender.current = false;
                return;
            }
            (async () => {
                setLoading(true);
                //get sales
                const salesData = await getSales(user,filter,startDate,endDate);
                //set sales statistics
                salesAction({
                    type: "SET_STORED_ITEMS",
                    payload: salesData.sales
                })
                salesAction({
                    type: "SET_ALL_ITEMS",
                    payload: salesData.sales
                })
                salesAction({
                    type: "SET_STATISTICS",
                    payload: salesData.statistics
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

    }, [filter, user,salesState.reloadData])

    useEffect(() => {
        salesAction({
            type: "SET_ALL_ITEMS",
            payload:salesState.storedItems 
        })
    },[salesState.storedItems])
    return (
        <>
        {!loading?
                <div className="container-fluid">
                    <div className="row m-0">
                        <div className="col-12 headerPage p-2 container-fluid">
                            <div className="row m-0 justify-content-between">
                                <div className={"col-5 h2 align-content-center "}><Lang>Sales</Lang></div>
                                <div className="col-12 col-sm-12 col-md-7 col-lg-7 text-end">
                                    <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                        <SelectAction options={users} onChange={handleUsers} defTitle="All Users" defaultValue={user} defaultOption={-1} />
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
                                <div className="title  h5 m-0"><Lang>Sales Number</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{salesState?.statistics?.order_count}</div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 p-3 ">
                            <div className="rounded-4 bg-white align-content-center h-100 text-center p-3">
                                <div className="title  h5 m-0"><Lang>Turnover</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{Number(salesState?.statistics?.turnover).toFixed(2)} <span className="fs-5">{appState.settings?.businessInfo?.currency?.symbol}</span></div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4  p-3 ">
                            <div className="rounded-4 bg-white text-center align-content-center h-100 p-3">
                                <ButtonWithIcon Icon={<FaPaperPlane fontSize={"1.7rem"} color="white"/>} label={"Export Data"} handleClick={exportData} type={"button"} />
                            </div>
                        </div>
                    </div>
                    <SearchForm/>
                </div>
                : 
                <LoadingPage />
            }
        <div className="container-fluid">
            <div className="row m-0">
                <div className="col-12 p-2 dataTableBox items">
                    <SalesDataTable loading={loading} state={salesState} handleActions={handleAction} />
                </div>
            </div>
        </div>
        {salesState.openReturnModal && <ReturnModal/>}
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
const getUsers = async () => {
    const res = await api({
        method: "get",
        url: "/allUsers",
        withCredentials: true
    });
    return res.data.data;
}

const getSales = async (user,filter,startDate,endDate) => {
    const res = await api({
        method: "post",
        url: "/sales",
        data: {
            user,
            filter : filter,
            startDate : startDate,
            endDate : endDate
        },
        withCredentials: true,
    })
    return res.data.data;
}