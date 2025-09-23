import { useEffect, useRef, useState } from "react";
import { FilterDate } from "../../../components/FilterDate";
import { SelectAction } from "../../../components/SelectAction";
import { Lang } from "../../../assets/js/lang";
import { ButtonWithIcon } from "../../../components/ButtonWithIcon";
import { FaPaperPlane } from "react-icons/fa6";
import { useCashRegisterSessionAction, useCashRegisterSessionState } from "../../../context/cashRegisterSessionContext";
import { useAppAction, useAppState } from "../../../context/context";
import { SessionDataTable } from "./components/SessionDataTable";
import api from "../../../api/api";
import { LoadingPage } from "./components/LoadingPage";
import { EditModal } from "./components/EditModal";
import { useNavigate } from "react-router-dom";

export function CashRegisterSession(){
    const cashRegisterSessionState = useCashRegisterSessionState();
    const cashRegisterSessionsActions = useCashRegisterSessionAction();
    const navigate = useNavigate();
    const checkFirstRender = useRef(true)
    const appAction = useAppAction();
    const appState = useAppState();
    const [loading, setLoading] = useState(true);
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
    //set the user
    const handleUsers = (e) => {
        cashRegisterSessionsActions({
            type: "SET_SELECTED_USER",
            payload: e.target.value
        })
    }
    //export report session 
    const exportData = ()=>{
        setLoading(true)
        api({
            method:"post",
            url:"cashRegisterSessions/export",
            data: {
                user:cashRegisterSessionState?.selectedUser,
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
            let fileName = "cash_register_sessions_export.csv";
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
    //handle action of each session
    const handleAction = (e)=>{
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "view":
                //view elem
                //navigate to single page 
                navigate("/cashRegisterSessions/"+id)
                e.target.value = "default"
                break;
            case "edit":
                //open edit modal
                cashRegisterSessionsActions({
                    type: "SET_EDITED_ITEM",
                    payload: id
                })
                cashRegisterSessionsActions({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true
                })
                e.target.value = "default"
                break;
            case "remove":
                //remove
                if(window.confirm("are you sure!!")){
                    setLoading(true)
                    api({
                        method: "post",
                        url: "/deleteCashRegisterSession/"+id,
                        withCredentials: true
                    }).then(res => {
                        return res.data;
                    }).then(res => {
                        appAction({
                            type: "SET_SUCCESS",
                            payload: res?.message
                        });
                        cashRegisterSessionsActions({
                            type: "RELOAD_DATA"
                        })
                        setLoading(false);
                    }).catch(err => {
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        });
                        setLoading(false)
                    })
                }
                e.target.value = "default"
                break;
            default:
                e.target.value = "default"
        }
    }
    /**
     * @desc the useEffect must load all the data of the page
     * @todo get all user and set it in users state
     * @todo get all sessions and statistic fliter by date filter 
     */
     useEffect(() => {
         (async () => {
                try {
                    const usersData = await getUsers()
                    //set users
                    cashRegisterSessionsActions({
                        type:"SET_USERS",
                        payload:usersData
                    })
                    //get sales
                    const sessionsData = await getSessions(cashRegisterSessionState?.selectedUser, filter, startDate, endDate);
                    //set sales statistics
                    cashRegisterSessionsActions({
                        type: "SET_STORED_ITEMS",
                        payload: sessionsData.sessions
                    })
                    cashRegisterSessionsActions({
                        type: "SET_ALL_ITEMS",
                        payload: sessionsData.sessions
                    })
                    cashRegisterSessionsActions({
                        type: "SET_STATISTICS",
                        payload: sessionsData.statistics
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
        /**
         * reload the data
         */
        useEffect(() => {
            try {
                if (checkFirstRender.current) {
                    checkFirstRender.current = false;
                    return;
                }
                (async () => {
                    setLoading(true);
                    //get sales
                    const sessionsData = await getSessions(cashRegisterSessionState?.selectedUser, filter, startDate, endDate);
                    //set sales statistics
                    cashRegisterSessionsActions({
                        type: "SET_STORED_ITEMS",
                        payload: sessionsData.sessions
                    })
                    cashRegisterSessionsActions({
                        type: "SET_ALL_ITEMS",
                        payload: sessionsData.sessions
                    })
                    cashRegisterSessionsActions({
                        type: "SET_STATISTICS",
                        payload: sessionsData.statistics
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
    
        }, [filter, cashRegisterSessionState?.selectedUser,cashRegisterSessionState?.reloadData])
    return (
        <>
            {!loading?
                    <div className="container-fluid pt-2">
                        <div className="row m-0">
                            <div className="col-12 headerPage p-2 container-fluid">
                                <div className="row m-0 justify-content-between">
                                    <div className="col-12 col-sm-12 col-md-5 col-lg-5 h2 align-content-center "><Lang>Cash register</Lang></div>
                                    <div className="col-12 col-sm-12 col-md-7 col-lg-7 text-end">
                                        <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                            <SelectAction options={cashRegisterSessionState?.users} onChange={handleUsers} defTitle="All Users" defaultValue={cashRegisterSessionState?.selectedUser} defaultOption={-1} />
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
                                    <div className="title  h5 m-0"><Lang>Records</Lang></div>
                                    <div className="data h3 m-0 pt-2 pb-2">{cashRegisterSessionState?.statistics?.records}</div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4 p-3 ">
                                <div className="rounded-4 bg-white align-content-center h-100 text-center p-3">
                                    <div className="title  h5 m-0"><Lang>Total</Lang></div>
                                    <div className="data h3 m-0 pt-2 pb-2">{Number(cashRegisterSessionState?.statistics?.total).toFixed(2)} <span className="fs-5">{appState.settings?.businessInfo?.currency?.symbol}</span></div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4  p-3 ">
                                <div className="rounded-4 bg-white text-center align-content-center h-100 p-3">
                                    <ButtonWithIcon Icon={<FaPaperPlane fontSize={"1.7rem"} color="white"/>} label={"Export Data"} handleClick={exportData} type={"button"} />
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
                        <SessionDataTable loading={loading} state={cashRegisterSessionState} handleActions={handleAction} />
                    </div>
                </div>
            </div>
                {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}
                {cashRegisterSessionState?.openEditModal && <EditModal />}
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

const getSessions = async (user,filter,startDate,endDate) => {
    const res = await api({
        method: "post",
        url: "/cashRegisterSessions",
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