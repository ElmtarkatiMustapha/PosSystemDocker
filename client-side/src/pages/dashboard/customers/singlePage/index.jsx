import { useNavigate, useParams } from "react-router-dom";
import { ActionSelect } from "../../../../components/ActionSelect";
import { LoadingHeader } from "../components/LoadingHeader";
import { useEffect, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { DateFilter } from "../../../../components/DateFilter";
import { useCustomersAction, useCustomersState } from "../../../../context/customersContext";
import api, { getImageURL } from "../../../../api/api";
import DataTable from "react-data-table-component";
import { useAppAction, useAppState } from "../../../../context/context";
import { CustomLoader } from "../../../../components/CustomLoader";
import { SelectAction } from "../../../../components/SelectAction";
import { ChartLineLoading } from "../../../../components/ChartLineLoading";
import { ChartLine } from "../../../../components/ChartLine";
import { LoadingCart } from "../components/LoadingCart";
import { Carte } from "../components/Carte";
import { EditModal } from "../components/EditModal";
export function SingleCustomer() {
    const { id } = useParams();
    const [loading, setLoading] = useState();
    const customersState = useCustomersState();
    const customersAction = useCustomersAction();
    const appState = useAppState();
    const appAction = useAppAction();
    const navigate = useNavigate();
    const columns = [
        {
            name: Lang({ children: "Id" }),
            selector: row => row.id,
            sortable: true
        },
        {
            name: Lang({ children: "User" }),
            selector: row => row.user,
            sortable: true
        },
        {
            name: Lang({ children: "QNT" }),
            selector: row => row.qnt,
            sortable: true
        },
        {
            name: Lang({ children: "Total TTC" }),
            selector: row => Number(Number(row.turnover).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Date" }),
            selector: row => row.date,
            sortable: true
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <SelectAction options={appState.selectData} id={row.id} onChange={handleActions} />,
            sortable: false
        },
    ]
    useEffect(() => {
        setLoading(true);
        api({
            method: "post",
            url: "/singleCustomers/"+id,
            data: {
                filter: customersState.filter,
                startDate: customersState.startDate,
                endDate: customersState.endDate
            },
            withCredentials: true
        }).then((res) => {
            return res.data;
        }).then((res) => {
            //data here in res.data
            customersAction({
                type: "SET_CURRENT_ITEM",
                payload: res.data
            })
            setLoading(false);
        }).catch((err) => {
            //handle error
            setLoading(false);
        })
    }, [customersState.filter])
    const handleActions = (e) => {
        
        switch (e.target.value) {
            case "remove":
                if (window.confirm("are you sure you want to delete this products")) {
                    setLoading(true)
                    // handle remove
                    api({
                        method: "delete",
                        url: "/customer/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "success"
                        });
                        customersAction({
                            type: "REMOVE_ONE",
                            payload: id
                        })
                        e.target.value = "default"
                        navigate("/customers")
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
                customersAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                customersAction({
                    type: "SET_EDIT_ITEM",
                    payload: id
                })
                e.target.value = "default"
                break;
            default:
                break;
        }
    }
    return (
        <>
            <div className="container-fluid single-page p-3">
                <div className="row m-0 pt-2 pb-2">
                    {loading ? 
                            <LoadingCart/>
                        : 
                            <Carte state={customersState} handleAction={handleActions} /> 
                        }
                </div>
                <div className="row m-0 pt-2 pb-2">
                    {loading ? <LoadingHeader /> :
                        <div className="col-12 p-2 headerPage">
                            
                            <div style={{ verticalAlign: "middle" }} className=" align-self-center p-2 d-inline-block">
                                <div className="h3 m-0 title"><Lang>Purchases</Lang> </div>
                            </div>
                            <div style={{ verticalAlign: "middle" }} className="controls d-inline-block  align-content-center float-end ">
                                <DateFilter state={customersState} dispatch={customersAction} />
                            </div>
                        </div>
                    }
                </div>
                <div className="row m-0 pt-2 pb-2">
                    <div className="col-12 col-lg-6 p-2 container-fluid">
                        <div className="row m-0">
                            <div className="col-12 customBox">
                                <DataTable
                                    columns={columns}
                                    data={customersState.currentItem?.orders}
                                    customStyles={appState.tableStyle}
                                    pagination
                                    progressPending={loading}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 p-2 container-fluid">
                        <div className="row m-0">
                            <div className="col-12 p-0">
                                {loading ? <ChartLineLoading/>:
                                    <ChartLine title={"Purchase"} subTitle={customersState.currentItem?.filterTitle} dataX={customersState.currentItem?.turnover?.dataX} dataY={customersState.currentItem?.turnover?.dataY} flag={Number(customersState.currentItem?.turnover?.dataY.reduce((prev,curr)=>prev+curr)).toFixed(2)} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { customersState.openEditModal && <EditModal/>}
        </>
    )
}