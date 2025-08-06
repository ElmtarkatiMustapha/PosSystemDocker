import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../../components/CustomLoader";
import { Lang } from "../../../../assets/js/lang";
import { Spinner } from "../../../../components/Spinner";
import { useEffect, useState } from "react";
import api from "../../../../api/api";
import { useDeliveryAction, useDeliveryState } from "../../../../context/deliveryContext";
import { useAppAction, useAppState } from "../../../../context/context";

export function ViewModal() {
    const deliveryAction = useDeliveryAction()
    const deliveryState = useDeliveryState()
    const appState = useAppState()
    const appAction = useAppAction()
    const [order, setOrder] = useState();
    const [loading,setLoading] = useState(true)
    const columns = [
        {
            name: Lang({ children: "id" }),
            selector: row => row.id,
            sortable: true,
        },
        {
            name: Lang({ children: "Barcode" }),
            selector: row => row.product.barcode,
            sortable: true,
            minWidth:"130px"
        },
        {
            name: Lang({ children: "Product" }),
            selector: row => row.product.name,
            sortable: true,
            minWidth:"130px"
        },
        {
            name: Lang({ children: "Qnt" }),
            selector: row => row.qnt,
            sortable: true
        },
        {
            name: Lang({ children: "Discount" }),
            selector: row => Number(row.discount).toFixed(2),
            sortable: true,
            minWidth:"130px"
        },
        {
            name: Lang({ children: "U.P" }),
            selector: row => Number(row.price).toFixed(2),
            sortable: true,
            minWidth:"130px"
        },
        {
            name: Lang({ children: "Total(dh)" }),
            selector: row => Number(Number(row.price*row.qnt - row.price*row.qnt*row.discount/100).toFixed(2)),
            sortable: true,
            minWidth:"130px"
        }
    ]
    const handleClose = () => {
        deliveryAction({
            type: "SET_VIEW_ITEM",
            payload: 0
        })
        deliveryAction({
            type: "TOGGLE_VIEW_MODAL",
            payload: false
        })
    }
    useEffect(() => {
        api({
            method: "get",
            url: "/deliveredOrder/" + deliveryState.viewItem,
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
            //set order
            setOrder(res.data)
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    },[])
    return (
        <div className="editModal modal z-3 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Order </Lang> :</div>
                            <div className="sub-title"><Lang>Order Info</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Id</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  defaultValue={order?.id}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Customer</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  defaultValue={order?.customer?.name}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Adresse</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  defaultValue={order?.customer?.adresse}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  defaultValue={order?.customer?.phone}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Sector</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  defaultValue={order?.customer?.sector?.title}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Qnt</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  defaultValue={order?.qnt}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Discount</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  defaultValue={order?.discount.toFixed(2)}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Total</Lang>(HT) : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  defaultValue={order?.total.toFixed(2)}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Total</Lang>(Tax) : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  value={(Number(order?.total) * Number(order?.tax)/100)}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Total</Lang>(TTC) : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  value={(Number(order?.total)+(Number(order?.total) * Number(order?.tax)/100)).toFixed(2)}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Delivered at</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={true} name="title"  className="form-control"  defaultValue={order?.delivered_at}  id="" />
                        </div>
                        <DataTable
                            columns={columns}
                            data={order?.details_order}
                            customStyles={appState.tableStyle}
                            pagination
                            progressPending={loading}
                            progressComponent={<CustomLoader />}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}