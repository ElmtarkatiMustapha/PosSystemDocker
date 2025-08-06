import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingHeader } from "../../../../components/LoadingHeader";
import { useSectorAction, useSectorState } from "../../../../context/sectorsContext";
import { FilterDate } from "../../../../components/FilterDate";
import { ActionSelect } from "../../../../components/ActionSelect";
import { Lang } from "../../../../assets/js/lang";
import { ChartLineLoading } from "../../../../components/ChartLineLoading";
import { ChartLine } from "../../../../components/ChartLine";
import { EditModal } from "../components/EditModal";
import api from "../../../../api/api";
import { useAppAction } from "../../../../context/context";
import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../../components/CustomLoader";
import { DateRangeModal } from "../../../../components/DateRangeModal";
import { format } from "date-fns";
const customStyle = {
        headRow: {
            style: {
                fontSize: "1rem",
                fontFamily: "var(--bs-font-sans-serif)"
            }
        },
        rows: {
            style: {
                backgroundColor: "white",
                "&:nth-child(2n)": {
                    backgroundColor: "#e8fbff",
                },
                border: "0px",
                fontFamily:"var(--bs-font-sans-serif)"
            },
        }
    }
export function SingleSectors() {
    const columns = [
        {
            name: Lang({ children: "Id" }),
            selector: row => row.id,
            sortable: false
        },
        {
            name: Lang({ children: "Name" }),
            selector: row => row.name,
            sortable: true
        },
        {
            name: Lang({ children: "Turnover" }),
            selector: row => row.turnover,
            sortable: true
        },
        {
            name: Lang({ children: "Sales" }),
            selector: row => row.nbSales,
            sortable: true
        },
        {
            name: Lang({ children: "Remove" }),
            cell: row => <button className="blueFilterSelect" onClick={()=>{handleDetachUser(row.id)}}><Lang>Detach</Lang></button>,
            sortable: true
        },
    ]
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("week");
    const [startDate, setStartDate]  = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openCalendar, setOpenCalendar] = useState(false);
    const navigate = useNavigate();
    const appAction = useAppAction();
    const sectorsState = useSectorState();
    const sectorsActions = useSectorAction();
    const [selectionRange,setSelectionRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }])
    useEffect(() => {
        setLoading(true);
        api({
            method: "post",
            url: "/sectorSingle/" + id,
            data: {
                filter : filter,
                startDate : startDate,
                endDate : endDate
            },
            // withCredentials:true
        }).then(res => {
            return res.data;
        }).then(res => {
            sectorsActions({
                type: "SET_CURRENT_ITEM",
                payload: res.data
            });
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            });
            setLoading(false)
        })
    }, [filter])
    const handleDetachUser = (idUser) => {
        api({
            method: "put",
            url: "/detachUserSector/" + id,
            data: {
                idUser
            },
            withCredentials: true
        }).then(res => {
            sectorsActions({
                type: "DETACH_USER",
                payload: id,
            })
            appAction({
                type: "SET_SUCCESS",
                payload: "Detached with Success"
            });
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            });
            setLoading(false)
        })
    }
    const handleFilter = (e) => {
        if (e.target.value === "range") {
            setOpenCalendar(true);
        } else {
            setFilter(e.target.value)
        }
    }
    const handleAction = (e) => {
        switch (e.target.value) {
            case "remove":
            if (window.confirm("Are you sure you want to delete this sector")) {
                    setLoading(true);
                    api({
                        method: "delete",
                        url: "/sector/" + id,
                        withCredentials: true
                    }).then(res => {
                        return res.data
                    }).then(res => {
                        sectorsActions({
                            type: "REMOVE_ONE",
                            payload: id,
                        })
                        appAction({
                            type: "SET_SUCCESS",
                            payload: res.message
                        })
                        navigate("/sectors")
                        setLoading(false);
                    }).catch(err => {
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        });
                        setLoading(false);
                    })
                }
                e.target.value = "default"
                break;
            case "edit":
                sectorsActions({
                    type: "SET_EDIT_ITEM",
                    payload: id,
                })
                sectorsActions({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                e.target.value = "default"
                break;
            default:

        }
    }
    //handle select date range
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
    return (
        <>
            <div className="single-page container-fluid">
                <div className="row  p-2 m-0">
                    {loading ? <LoadingHeader /> :
                        <div className="col-12 p-2 headerPage">
                            <div style={{ verticalAlign: "middle" }} className=" align-self-center p-2 d-inline-block">
                                <div className="h5 m-0 title">{sectorsState.currentItem?.title} </div>
                                <div className="subTitle">{sectorsState.currentItem?.adresse}</div>
                            </div>
                            <div style={{ verticalAlign: "middle" }} className="controls d-inline-block align-content-center float-end ">
                                <FilterDate onChange={handleFilter} filter={filter} />
                                <ActionSelect onChange={handleAction} />
                            </div>
                        </div>
                    }
                </div>
                <div className="row m-0">
                    <div className="col-12 p-2 col-md-6">
                        {loading ? <ChartLineLoading/>:
                            <ChartLine title={"Turnover"} subTitle={sectorsState.currentItem?.filterTitle} dataX={sectorsState.currentItem?.turnover?.dataX} dataY={sectorsState.currentItem?.turnover?.dataY} flag={sectorsState.currentItem?.turnover?.dataY.reduce((prev,curr)=>prev+curr).toFixed(2)+"dh"} />
                        }
                    </div>
                    <div className="col-12 p-2 col-md-6">
                        {loading ? <ChartLineLoading/>:
                            <ChartLine title={"Sales"} subTitle={sectorsState.currentItem?.filterTitle} dataX={sectorsState.currentItem?.sales?.dataX} dataY={sectorsState.currentItem?.sales?.dataY} flag={sectorsState.currentItem?.sales?.dataY.reduce((prev,curr)=>prev+curr)} />
                        }
                    </div>
                    
                </div>
                <div className="row m-0">
                    <div className="col-12 p-2 col-md-6">
                        <div className="customBox ">
                            <div className="title p-2 pt-3 m-0 text-center h3">
                                <Lang>Users</Lang>
                            </div>
                            <div className="content p-2">
                                <DataTable
                                    columns={columns}
                                    data={sectorsState.currentItem?.usersData}
                                    customStyles={customStyle}
                                    pagination
                                    progressPending={loading}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}
            {sectorsState.openEditModal && <EditModal/>}
        </>
    )
}