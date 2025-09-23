import { useNavigate, useParams } from "react-router-dom";
import { ActionSelect } from "../../../../components/ActionSelect";
import { LoadingHeader } from "../components/LoadingHeader";
import { useEffect, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { DateFilter } from "../../../../components/DateFilter";
import api, { getImageURL } from "../../../../api/api";
import DataTable from "react-data-table-component";
import { useAppAction, useAppState } from "../../../../context/context";
import { CustomLoader } from "../../../../components/CustomLoader";
import { SelectAction } from "../../../../components/SelectAction";
import { ChartLineLoading } from "../../../../components/ChartLineLoading";
import { ChartLine } from "../../../../components/ChartLine";
import { LoadingCart } from "../components/LoadingCart";
import { useCashRegisterSessionAction, useCashRegisterSessionState } from "../../../../context/cashRegisterSessionContext";
import { Carte } from "../components/Carte";
import { EditModal } from "../components/EditModal";
export function SingleCashRegisterSession() {
    const { id } = useParams();
    const [loading, setLoading] = useState();
    const cashRegisterSessionState = useCashRegisterSessionState();
    const cashRegisterSessionsActions = useCashRegisterSessionAction();
    const appState = useAppState();
    const appAction = useAppAction();
    const navigate = useNavigate();
    const columns= [
            {
                name: Lang({ children: "id" }),
                selector: row => row.id,
                sortable: true,
            },
            {
                name: Lang({ children: "Customer" }),
                selector: row => row.customer,
                sortable: true
            },
            {
                name: Lang({ children: "User" }),
                selector: row => row.user,
                sortable: true
            },
            {
                name: Lang({ children: "Type" }),
                selector: row => row.type,
                sortable: true
            },
            {
                name: Lang({ children: "Qnt" }),
                selector: row => row.qnt,
                sortable: true
            },
            {
                name: Lang({ children: "Return Qnt" }),
                selector: row => row.return_qnt,
                sortable: true
            },
            {
                name: Lang({ children: `Total HT` })+`(${appState.settings?.businessInfo?.currency?.symbol})`,
                selector: row => Number(Number(row.total).toFixed(2)),
                sortable: true
            },
            {
                name: Lang({ children: `Discount` })+`(${appState.settings?.businessInfo?.currency?.symbol})`,
                selector: row => Number(Number(row.discount).toFixed(2)),
                sortable: true
            },
            {
                name: Lang({ children: "Date" }),
                selector: row => row.date,
                sortable: true
            },
            {
                name: Lang({ children: "Status" }),
                selector: row => row.status ,
                sortable: true,
                conditionalCellStyles: [
                {
                    when: row => row.status == "delivered",
                    style: {
                        color: 'var(--success)',
                        fontWeight: "bold",
                    },
                },
                {
                    when: row => row.status == "pending",
                    style: {
                        color: 'var(--bs-warning)',
                        fontWeight: "bold",
                    },
                }
            ]
            },
        ]
    /**
     * loading data 
     */
    useEffect(() => {
        setLoading(true);
        api({
            method: "get",
            url: "/singleCashRegisterSession/"+id,
            withCredentials: true
        }).then((res) => {
            return res.data;
        }).then((res) => {
            //data here in res.data
            cashRegisterSessionsActions({
                type: "SET_CURRENT_ITEM",
                payload: res.data
            })
            setLoading(false);
        }).catch((err) => {
            //handle error
            setLoading(false);
        })
    }, [cashRegisterSessionState.reloadData])
    /**
     * handle the actions  
     * @param {Event} e 
     */
    const handleActions = (e) => {
        switch (e.target.value) {
            case "remove":
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
                        navigate("/cashRegisterSessions")
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
            case "edit":
                cashRegisterSessionsActions({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                cashRegisterSessionsActions({
                    type: "SET_EDITED_ITEM",
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
                            <Carte state={cashRegisterSessionState} handleAction={handleActions} /> 
                        }
                </div>
                <div className="row m-0 pt-2 pb-2">
                    {loading ? <LoadingHeader /> :
                        <div className="col-12 p-2 headerPage">
                            
                            <div style={{ verticalAlign: "middle" }} className=" align-self-center p-2 d-inline-block">
                                <div className="h3 m-0 title"><Lang>Sales</Lang> </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="row m-0 pt-2 pb-2">
                    <div className="col-12 p-2 container-fluid">
                        <div className="row m-0">
                            <div className="col-12 customBox">
                                <DataTable
                                    columns={columns}
                                    data={cashRegisterSessionState?.currentItem?.orders}
                                    customStyles={appState.tableStyle}
                                    pagination
                                    progressPending={loading}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                {cashRegisterSessionState?.openEditModal && <EditModal />}
        </>
    )
}