import { useEffect, useState } from "react";
import { Lang } from "../../../assets/js/lang";
import { FilterDate } from "../../../components/FilterDate";
import { SelectActionBlue } from "../../../components/SelectActionBlue";
import { LoadingPage } from "./components/LoadingPage";
import { DateRangeModal } from "../../../components/DateRangeModal";
import { format } from "date-fns";
import { SpentsDataTable } from "./components/SpentsDataTable";
import { useSpentsAction, useSpentsState } from "../../../context/spentsContext";
import { AddModal } from "./components/AddModal";
import { EditModal } from "./components/EditModal";
import api from "../../../api/api";
import { useAppAction, useAppState } from "../../../context/context";
import { ViewModal } from "./components/ViewModal";

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

export function Spents() {
    const spentsState = useSpentsState();
    const spentsAction = useSpentsAction();
    const appAction = useAppAction();
    const appState = useAppState();
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("week");
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [selectionRange,setSelectionRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }])
    /***
     * change the filter 
     */
    const handleFilter = (e) => {
        if (e.target.value === "range") {
            setOpenCalendar(true);
        } else {
            setFilter(e.target.value)
        }
    }
    /**
     * 
     * @param {Event} e
     * if the filter is range this function will prepae the strat and the end date 
     */
    const handleSubmitRange = (e) => {
        e.preventDefault()
        setStartDate(format(selectionRange[0].startDate, "Y-MM-dd"));
        setEndDate(format(selectionRange[0].endDate, "Y-MM-dd"));
        setFilter("range");
        handleCloseRangeModal();
    }
    /**
     * @desc close the calendry 
     */
    const handleCloseRangeModal = () => {
        setOpenCalendar(false);
    }
    const exportData = ()=>{
        setLoading(true)
         api({
            method: "post",
            url: "/spents/export",
            data: {
                filter : filter,
                startDate : startDate,
                endDate : endDate
            },
            withCredentials: true
        }).then(res=>{
            //export data 
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;

            // Extraire le nom du fichier si dispo sinon par défaut
            const contentDisposition = res.headers["content-disposition"];
            let fileName = "spents_export.csv";
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
    /**
     * @desc handle page action 
     * @param {Event} e
     */
    const handlePageActions = (e) => {
        switch (e.target.value) {
            case "addNew":
                //code
                spentsAction({
                    type: "TOGGLE_ADD_MODAL",
                    payload: true,
                })
                e.target.value = "default";
                break;
            case "export":
                //code
                exportData()
                e.target.value = "default";
                break;
            default:
                e.target.value = "default";
        }
    }
    /**
     * @desc handle spent action
     * @param {Event} e
     */
    const handleAction = (e) => {
        let id = e.target.getAttribute("data-id");
        switch (e.target.value) {
            case "view":
                //set current item id
                spentsAction({
                    type: "SET_CURRENT_ITEM",
                    payload: id
                });
                //toggle the view modal
                spentsAction({
                    type: "TOGGLE_VIEW_MODAL",
                    payload: true,
                });
                e.target.value = "default";
                break;
            case "remove":
                if (window.confirm("are you sure you want to delete this Spent")) {
                    setLoading(true)
                    // handle remove
                    api({
                        method: "delete",
                        url: "/spent/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "success"
                        });
                        spentsAction({
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
                spentsAction({
                    type: "SET_EDIT_ITEM",
                    payload: id,
                })
                spentsAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                e.target.value = "default"
                break;
            default:
                break;
        }
    }
    /**
     * useEffect used here to get the data from the server side
     * @todo send request
     * @todo get data 
     * @todo set data in spent context 
     */
    useEffect(() => {
        setLoading(true);
        api({
            method: "post",
            url: "/spents",
            data: {
                filter : filter,
                startDate : startDate,
                endDate : endDate
            },
            withCredentials: true
        })
        .then(res => res.data)
            .then(res => {
            spentsAction({
                type: "SET_STORED_ITEMS",
                payload:res.data.spents
            })
            spentsAction({
                type: "SET_ALL_ITEMS",
                payload:res.data.spents
            })
            spentsAction({
                type: "SET_STATISTICS",
                payload: res.data.statistics
            })
            appAction({
                type: "SET_LOADING",
                payload: false
            })
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            appAction({
                type: "SET_LOADING",
                payload: false
            })
            setLoading(false)
        })
    }, [filter])
    /**
     * when stored items change allItems must change
     * i'm not stupied but i did it for futur update (if i need to add the search for spent)
    */
    useEffect(() => {
        spentsAction({
            type: "SET_ALL_ITEMS",
            payload: spentsState.storedItems
        })
    }, [spentsState.storedItems]);
    return (
        <>
            {loading ?
                <LoadingPage/>
                :
                <div className="container-fluid pt-2">
                    <div className="row m-0">
                        <div className="col-12 headerPage p-2 container-fluid">
                            <div className="row m-0 justify-content-between">
                                <div className={"col-5 h2 align-content-center "}><Lang>Spents</Lang></div>
                                <div className="col-12 col-sm-12 col-md-7 col-lg-7 text-end">
                                    <div style={{ verticalAlign: "middle" }} className="d-inline-block ">
                                        {/* <SelectAction options={suppliers} onChange={handleSuppliers} defTitle="All Suppliers" defaultValue={supplier} defaultOption={-1} /> */}
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
                                <div className="title  h5 m-0"><Lang>Spents Number</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{spentsState.statistics?.spents_count }</div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 p-3 ">
                            <div className="rounded-4 bg-white align-content-center h-100 text-center p-3">
                                <div className="title  h5 m-0"><Lang>Total</Lang></div>
                                <div className="data h3 m-0 pt-2 pb-2">{Number(spentsState.statistics?.total).toFixed(2)} <span className="fs-5">{appState.settings?.businessInfo?.currency?.symbol}</span></div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4  p-3 ">
                            <div className="rounded-4 bg-white text-center align-content-center h-100 p-3">
                                <div className="d-inline-block">
                                    <SelectActionBlue options={options} onChange={handlePageActions} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="container-fluid">
                <div className="row m-0">
                    <div className="col-12 p-2 dataTableBox items">
                        <SpentsDataTable loading={loading} state={spentsState} handleActions={handleAction} />
                    </div>
                </div>
            </div>
            {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}
            {
                spentsState.openEditModal && <EditModal />
            }
            {
                spentsState.openAddModal && <AddModal />
            }
            {
                spentsState.openViewModal && <ViewModal/>
            }
        </>
    )
}