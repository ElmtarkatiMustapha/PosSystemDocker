import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { CustomLoader } from "../../../../components/CustomLoader";
import { Lang } from "../../../../assets/js/lang";
import { useSalesAction, useSalesState } from "../../../../context/salesContext";
import api from "../../../../api/api";
import { useAppAction } from "../../../../context/context";
import { DetailsSaleDataTable } from "../components/DetailsSaleDataTable";
import { SelectActionBlue } from "../../../../components/SelectActionBlue";
import { ReturnModal } from "../components/ReturnModal";
import { Price } from "../../../../api/Price";
const options = [
        {
            name: "Remove",
            value: "remove"
        },
        {
            name: "Edit",
            value: "edit"
        },
        {
            name: "Return",
            value: "return"
        },
        {
            name: "Download Invoice",
            value: "download_invoice"
        },
        {
            name: "Send to Customer",
            value: "send"
        }
    ]
export function SingleSale() {
    const { id } = useParams(); 
    const [loading, setLoading] = useState(true);
    const salesState = useSalesState();
    const salesAction = useSalesAction();
    const appAction = useAppAction();
    const navigate = useNavigate();
    
    const handleActions = (e) => {
        switch (e.target.value) {
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
                        navigate("/sales")
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
                
                navigate("/pos/sales/" + id);
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
            default:
                break;
        }
    }
    //load data of current sale
    useEffect(() => {
        api({
            method: "get",
            url: "sale/" + id,
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
            salesAction({
                type: "SET_CURRENT_ITEM",
                payload: res.data
            })
            setLoading(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false);
        })
    }, [])
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4 p-2">
                        <div className="customBox h-100 container-fluid p-4 ">
                            {loading ? 
                                <CustomLoader /> : 
                                <>
                                    <div className="row m-0 pb-2">
                                        <div className="col-7 p-0">
                                            <h4><Lang>Sales infos</Lang> </h4>
                                        </div>
                                        <div className="col-5 text-end">
                                            <SelectActionBlue options={options} onChange={handleActions} defTitle="Default" defaultOption={"default"} />
                                            {/* <ActionSelect onChange={handleActions}/> */}
                                        </div>
                                    </div>
                                    <div className="row m-0 w-100 table-responsive">
                                        <table className="table">
                                            <tr>
                                                <th><Lang>Order Id</Lang>: </th>
                                                <td className="subTitle">{salesState?.currentItem?.id}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>User</Lang>: </th>
                                                <td className="subTitle">{salesState?.currentItem?.user}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Customer</Lang>: </th>
                                                <td className="subTitle">{salesState?.currentItem?.customer}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Phone</Lang>: </th>
                                                <td className="subTitle">{salesState?.currentItem?.phone}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Adresse</Lang>: </th>
                                                <td className="subTitle">{salesState?.currentItem?.adresse}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6 p-2">
                        <div className="customBox h-100 container-fluid p-4">
                            {loading ?
                                <CustomLoader /> :
                                <>
                                    <div className="row  m-0 pb-2">
                                        <div className="col-12 p-0">
                                            <h4><Lang>Details Sale</Lang> </h4>
                                        </div>
                                    </div>
                                    <div className="row m-0">
                                        <div className="col-12 col-md-6 p-0  table-responsive">
                                            <table className="table m-0">
                                                <tr>
                                                    <th><Lang>Qnt</Lang>: </th>
                                                    <td className="subTitle">{salesState?.currentItem?.qnt}</td>
                                                </tr>
                                        
                                                <tr>
                                                    <th><Lang>Cachier Margin</Lang>: </th>
                                                    <td className="subTitle"><Price>{salesState?.currentItem?.cachierMargin}</Price></td>
                                                </tr>
                                                <tr>
                                                    <th><Lang>Type</Lang>: </th>
                                                    <td className="subTitle">{salesState?.currentItem?.type}</td>
                                                </tr>
                                                <tr>
                                                    <th><Lang>Date order</Lang>: </th>
                                                    <td className="subTitle">{salesState?.currentItem?.date}</td>
                                                </tr>
                                                <tr>
                                                    <th><Lang>Status</Lang>: </th>
                                                    <td className="subTitle">
                                                        {salesState?.currentItem?.status == "pending" ?
                                                            <span style={{ backgroundColor: "var(--bs-warning)", color: "black", fontWeight: "bold" }} className="ps-2 pe-2 pt-1 pb-1 rounded-pill"><Lang>Pending</Lang></span>
                                                            :
                                                            <span style={{ backgroundColor: "var(--success)", color: "white", fontWeight: "bold" }} className="ps-2 pe-2 pt-1 pb-1 rounded-pill"><Lang>Delivered</Lang></span>
                                                        }
                                                    </td>
                                                </tr>
                                                
                                            </table>
                                        </div>
                                        <div className="col-12 col-md-6 p-0  table-responsive">
                                            <table className="table m-0">
                                                <tr>
                                                    <th><Lang>Total Discount</Lang>: </th>
                                                    <td className="subTitle"><Price>{salesState?.currentItem?.discount}</Price></td>
                                                </tr>
                                                <tr>
                                                    <th><Lang>Total (HT)</Lang>: </th>
                                                    <td className="subTitle"><Price>{salesState?.currentItem?.total}</Price></td>
                                                </tr>
                                                <tr>
                                                    <th><Lang>Total (Tax)</Lang>: </th>
                                                    <td className="subTitle"><Price>{Number(salesState?.currentItem?.total)*Number(salesState?.currentItem?.tax)/100}</Price></td>
                                                </tr>
                                                <tr>
                                                    <th><Lang>Total (TTC)</Lang>: </th>
                                                    <td className="subTitle"><Price>{(Number(salesState?.currentItem?.total)*Number(salesState?.currentItem?.tax)/100)+Number(salesState?.currentItem?.total)}</Price></td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className="row p-2">
                    <div className="col-12 p-2 dataTableBox items">
                        <DetailsSaleDataTable state={salesState} loading={loading}/>
                    </div>
                </div>
            </div>
            {salesState.openReturnModal && <ReturnModal/>}
        </>
    )
}