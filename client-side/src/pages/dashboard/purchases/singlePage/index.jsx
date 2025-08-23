import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { CustomLoader } from "../../../../components/CustomLoader";
import { Lang } from "../../../../assets/js/lang";
import { SelectActionBlue } from "../../../../components/SelectActionBlue";
import { DetailsPurchaseDataTable } from "../components/DetailsPurchaseDataTable";
import { usePurchaseAction, usePurchaseState } from "../../../../context/purchasesContext";
import api from "../../../../api/api";
import { useAppAction, useAppState } from "../../../../context/context";

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
        name: "Download Invoice",
        value: "download_invoice"
    },
    {
        name: "Print Invoice",
        value: "print_invoice"
    }
]
export function SinglePurchase() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const purchasesState = usePurchaseState();
    const purchasesAction = usePurchaseAction();
    const appAction = useAppAction();
    const appState = useAppState();
    const navigate = useNavigate();
    /**
     * @desc this function for handle remove-edit-download-send action 
     * @param {Event} e
     */
    const handleActions = (e) => {
        switch (e.target.value) {
            case "remove":
                if (window.confirm("are you sure you want to delete this Purchase")) {
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
                        navigate("/purchases")
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
                navigate("/pos/purchase/"+id,{ state: { from: '/purchases/'+id } })
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        api({
            method: "get",
            url: "purchase/" + id,
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
            // console.log(res)
            purchasesAction({
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
    },[])
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-md-6 col-lg-5 p-2">
                    <div className="customBox h-100 container-fluid p-4 ">
                        {
                        loading ? <CustomLoader /> :
                            <>
                                <div className="row m-0 pb-2">
                                    <div className="col-7 p-0">
                                        <h4><Lang>Purchases infos</Lang> </h4>
                                    </div>
                                    <div className="col-5 text-end">
                                        <SelectActionBlue options={options} onChange={handleActions} defTitle="Default" defaultOption={"default"} />
                                    </div>
                                </div>
                                <div className="row m-0 w-100 table-responsive">
                                    <table className="table">
                                        {/* <tbody> */}
                                            <tr>
                                                <th><Lang>Purchase Id</Lang>: </th>
                                                    <td className="subTitle">{id}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>User</Lang>: </th>
                                                <td className="subTitle">{purchasesState.currentItem?.user}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Supplier</Lang>: </th>
                                                <td className="subTitle">{purchasesState.currentItem?.supplier}</td>
                                            </tr>
                                        {/* </tbody>     */}
                                    </table>
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-5 p-2">
                    <div className="customBox h-100 container-fluid p-4 ">
                        {
                        loading ? <CustomLoader /> :
                            <>
                                <div className="row m-0 pb-2">
                                    <div className="col-12 p-0">
                                        <h4><Lang>Purchases Details</Lang> </h4>
                                    </div>
                                </div>
                                <div className="row m-0 w-100 table-responsive">
                                    <table className="table">
                                        {/* <tbody> */}
                                            <tr>
                                                <th><Lang>QNT</Lang>: </th>
                                                    <td className="subTitle">{purchasesState.currentItem?.qnt}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Total</Lang>: </th>
                                                <td className="subTitle">{purchasesState.currentItem?.total}{appState.settings.businessInfo.currency.symbol}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Date</Lang>: </th>
                                                <td className="subTitle">{purchasesState.currentItem?.date}</td>
                                            </tr>
                                        {/* </tbody> */}
                                    </table>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className="row p-2">
                <div className="col-12 p-2 dataTableBox items">
                    <DetailsPurchaseDataTable state={purchasesState} loading={loading}/>
                </div>
            </div>
        </div>
    )
}