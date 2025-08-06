import { useNavigate, useParams } from "react-router-dom";
import api, { getImageURL } from "../../../../api/api";
import { useEffect, useState } from "react";
import { useSuppliersAction, useSuppliersState } from "../../../../context/suppliersContext";
import { Lang } from "../../../../assets/js/lang";
import { ActionSelect } from "../../../../components/ActionSelect";
import { useAppAction, useAppState } from "../../../../context/context";
import { ChartLineLoading } from "../../../../components/ChartLineLoading";
import { ChartLine } from "../../../../components/ChartLine";
import { DateFilter } from "../../../../components/DateFilter";
import { LoadingHeader } from "../../customers/components/LoadingHeader";
import { LoadingCart } from "../components/LoadingCart";
import { LoadingProfile } from "../../components/LoadingProfile";
import DataTable from "react-data-table-component";
import { SelectAction } from "../../../../components/SelectAction";
import { CustomLoader } from "../../../../components/CustomLoader";
import { EditModal } from "../components/EditModal";

export function SingleSupplier() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const suppliersState = useSuppliersState();
    const suppliersAction = useSuppliersAction();
    const appAction = useAppAction();
    const appState = useAppState();
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
            selector: row => Number(Number(row.total).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Date" }),
            selector: row => row.date,
            sortable: true
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <SelectAction options={appState.selectData} id={row.id} onChange={()=>null} />,
            sortable: false
        },
    ]
    const handleActions = (e) => {
        switch (e.target.value) {
            case "remove":
                if (window.confirm("are you sure you want to delete this products")) {
                    setLoading(true)
                    // handle remove
                    api({
                        method: "delete",
                        url: "/supplier/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "success"
                        });
                        suppliersAction({
                            type: "REMOVE_ONE",
                            payload: id
                        })
                        
                        setLoading(false)
                        navigate("/suppliers")
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
                suppliersAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                suppliersAction({
                    type: "SET_EDIT_ITEM",
                    payload: id
                })
                e.target.value = "default"
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        setLoading(true);
        api({
            method: "post",
            url: "/singleSupplier/"+id,
            data: {
                filter: suppliersState.filter,
                startDate: suppliersState.startDate,
                endDate: suppliersState.endDate
            },
            withCredentials: true
        }).then((res) => {
            return res.data;
        }).then((res) => {
            //data here in res.data
            suppliersAction({
                type: "SET_CURRENT_ITEM",
                payload: res.data
            })
            setLoading(false);
        }).catch((err) => {
            //handle error
            setLoading(false);
        })
    },[suppliersState.filter])
    return (
        <>
        <div className="container-fluid">
            <div className="row">
                {loading ? 
                    <LoadingProfile/>
                    : 
                    <div className="col-12 col-md-6 col-lg-3 p-2 align-self-center">
                        <div className="picture d-flex justify-content-center pb-2">
                            <div
                                style={{
                                    backgroundImage:"url("+ getImageURL(suppliersState.currentItem?.picture? suppliersState.currentItem?.picture :"defaultProfile.jpg" )+")",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    height: "10rem",
                                    width: "10rem",
                                    borderRadius: "100px",
                                    overflow: "hidden"
                                }}
                                className="bg-image ">

                            </div>
                        </div>
                        <div style={{
                            borderRadius: "8px",
                            color: "white"
                        }} className="bg-secondary p-1 text-center">
                            <div className="title fw-semibold">{suppliersState.currentItem?.name }</div>
                        </div>
                    </div>
                }
                {loading ? 
                    <LoadingCart/>
                        : 
                    <div className="col-12 col-md-6 col-lg-5 p-2">
                        <div className="customBox h-100 container-fluid p-4">
                            <div className="row m-0 pb-2">
                                <div className="col-7 p-0">
                                    <h4><Lang>Supplier Infos</Lang> </h4>
                                </div>
                                <div className="col-5">
                                    <ActionSelect onChange={handleActions}/>
                                </div>
                            </div>
                            <div className="row m-0 w-100 table-responsive">
                                <table className="table">
                                    <tr>
                                        <th>Ice: </th>
                                        <td className="subTitle">{ suppliersState.currentItem?.ice}</td>
                                    </tr>
                                    <tr>
                                        <th>Email: </th>
                                        <td className="subTitle">{suppliersState.currentItem?.email }</td>
                                    </tr>
                                    <tr>
                                        <th>Phone: </th>
                                        <td className="subTitle">{ suppliersState.currentItem?.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>Adresse: </th>
                                        <td className="subTitle">{ suppliersState.currentItem?.adresse}</td>
                                    </tr>
                                    <tr>
                                        <th>State: </th>
                                        <td>
                                            {suppliersState.currentItem?.active == 1 ? 
                                            <span style={{ borderRadius: "30px", backgroundColor: "rgba(0, 128, 0, 0.21)", color: "green", fontWeight: "bold" }} className="ps-2 pe-2"><Lang>Active</Lang></span>
                                            :
                                            <span style={{ borderRadius: "30px", backgroundColor: "rgba(128, 0, 0, 0.21)", color: "red", fontWeight: "bold" }} className="ps-2 pe-2"><Lang>Disactive</Lang></span>
                                            }
                                        </td>
                                    </tr>
                                        <tr>
                                            <th>Description: </th>
                                            <td className="subTitle"><div className="bg-transparent">{suppliersState.currentItem?.description} </div></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    }
                <div className="col-12  col-lg-4 p-2 container-fluid">
                    <div className="row m-0">
                            <div className="col-12 p-0">
                                {loading ? <ChartLineLoading/>:
                                    <ChartLine title={"Purchase"} subTitle={suppliersState.currentItem?.filterTitle} dataX={suppliersState.currentItem?.purchasesStatistics?.dataX} dataY={suppliersState.currentItem?.purchasesStatistics?.dataY} flag={Number(suppliersState.currentItem?.purchasesStatistics?.dataY.reduce((prev,curr)=>prev+curr))} />
                                }
                            </div>
                        </div>
                </div>
                
            </div>
            <div className="row">
                {loading ? <LoadingHeader /> :
                    <div className="col-12 p-2 headerPage">
                        
                        <div style={{ verticalAlign: "middle" }} className=" align-self-center p-2 d-inline-block">
                            <div className="h3 m-0 title"><Lang>Purchases</Lang> </div>
                        </div>
                        <div style={{ verticalAlign: "middle" }} className="controls h-100 d-inline-block align-content-center float-end ">
                            <DateFilter state={suppliersState} dispatch={suppliersAction} />
                        </div>
                    </div>
                }
            </div>
            <div className="row pt-2 pb-2">
                <div className="col-12 customBox">
                    <DataTable
                        columns={columns}
                        data={suppliersState.currentItem?.purchases}
                        customStyles={appState.tableStyle}
                        pagination
                        progressPending={loading}
                        progressComponent={<CustomLoader />}
                    />
                </div>
            </div>
        </div>
            { suppliersState.openEditModal && <EditModal/>}
        </>
    )
}