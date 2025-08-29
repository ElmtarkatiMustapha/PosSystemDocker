import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../assets/js/lang";
import { LoadingPage } from "./components/LoadingPage";
import { useAppAction, useAppState } from "../../../context/context";
import { format } from "date-fns";
import { DateRangeModal } from "../../../components/DateRangeModal";
import { SearchForm } from "./components/SearchForm";
import { SelectActionBlue } from "../../../components/SelectActionBlue";
import { SelectAction } from "../../../components/SelectAction";
import { FilterDate } from "../../../components/FilterDate";
import api from "../../../api/api";
import { ReturnsDataTable } from "./components/ReturnsDataTable";
import { useReturnAction, useReturnState } from "../../../context/returnContext";
import { ViewModal } from "./components/ViewModal";
import { EditModal } from "./components/EditModal";
const options = [
    {
        name: "Add New",
        value: "addNew"
    },
    {
        name: "Export data",
        value: "export"
    }
]

export function Returns() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true)
    const checkFirstRender = useRef(true)
    const appAction = useAppAction();
    const appState = useAppState()
    const returnsState = useReturnState();
    const returnsAction = useReturnAction();
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
    //handle page action
    const handlePageActions = (e) => {
        const value = e.target.value;
        setLoading(true)
        switch (value) {
            case "export":
                api({
                    method:"post",
                    url:"returns/export",
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
                    let fileName = "returns_export.csv";
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
                    e.target.value = "default"
                }).catch((err)=>{
                    appAction({
                        type: "SET_ERROR",
                        payload: err?.response?.data?.message
                    })
                    setLoading(false)
                    e.target.value = "default"
                })
                break;
            case "addNew":

                e.target.value = "default"
                break;
            default:
                e.target.value = "default"
                break;
        }
        return null;
    }
    // useEffect part
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
                const returnsData = await getReturns(user, filter, startDate, endDate);
                //set sales statistics
                returnsAction({
                    type: "SET_STORED_ITEMS",
                    payload: returnsData.returns
                })
                returnsAction({
                    type: "SET_ALL_ITEMS",
                    payload: returnsData.returns
                })
                returnsAction({
                    type: "SET_STATISTICS",
                    payload: returnsData.statistics
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
     * this useEffect will not executed in the first render
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
                const returnsData = await getReturns(user,filter,startDate,endDate);
                //set sales statistics
                returnsAction({
                    type: "SET_STORED_ITEMS",
                    payload: returnsData.returns
                })
                returnsAction({
                    type: "SET_ALL_ITEMS",
                    payload: returnsData.returns
                })
                returnsAction({
                    type: "SET_STATISTICS",
                    payload: returnsData.statistics
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

    }, [filter, user,returnsState.reloadData])

    useEffect(() => {
        returnsAction({
            type: "SET_ALL_ITEMS",
            payload:returnsState.storedItems 
        })
    },[returnsState.storedItems])
    return (
        <>
            {!loading?
                <div className="container-fluid">
                    <div className="row m-0">
                        <div className="col-12 headerPage p-2 container-fluid">
                            <div className="row m-0 justify-content-between">
                                <div className={"col-5 h2 align-content-center "}><Lang>Returns</Lang></div>
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
                                <div className="title  h5 m-0"><Lang>Returns Number</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{returnsState.statistics?.returns_count}</div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 p-3 ">
                            <div className="rounded-4 bg-white align-content-center h-100 text-center p-3">
                                <div className="title  h5 m-0"><Lang>Total</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{returnsState.statistics?.turnover} <span className="fs-5">{appState.settings?.businessInfo?.currency?.symbol}</span></div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4  p-3 ">
                            <div className="rounded-4 bg-white align-content-center h-100 text-center p-3">
                                <div className="d-inline-block">
                                    <SelectActionBlue options={options} onChange={handlePageActions} />
                                </div>
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
                        <ReturnsDataTable loading={loading} setLoading={setLoading} />
                    </div>
                </div>
            </div>
            {returnsState.openViewModal && <ViewModal state={returnsState} action={returnsAction} />}
            {returnsState.openEditModal && <EditModal state={returnsState} action={returnsAction} />}
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
const getReturns = async (user,filter,startDate,endDate) => {
    const res = await api({
        method: "post",
        url: "/returns",
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