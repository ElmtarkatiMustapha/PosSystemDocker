import { useEffect, useState } from "react"
import { Lang } from "../../../../assets/js/lang"
import { PrimaryButton } from "../../../../components/primaryButton"
import { Spinner } from "../../../../components/Spinner";
import api from "../../../../api/api";
import { useAppAction } from "../../../../context/context";
import { toDate } from "date-fns/fp";
import { format } from "date-fns";

export function EditStockModal({id,handleClose,handleSubmit}) {
    const [loading, setLoading] = useState(true); 
    const [stock, setStock] = useState(null);
    const appAction = useAppAction();
    useEffect(() => {
        api({
            method: "get",
            url: "/stock/" + id,
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
            setLoading(false);
            setStock(res.data);
        }).catch(err => {
            appAction({
                type: 'SET_ERROR',
                payload: err?.response?.data?.message
            })
            handleClose();
        })
    },[])
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Edit Stock</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Product Barcode</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={true}  className="form-control" placeholder={Lang({ children: "Barcode" })} value={stock?.product?.barcode} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Product Name</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={true}  className="form-control" placeholder={Lang({ children: "Barcode" })} value={stock?.product?.name} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Initial Stock</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" min={0} required  disabled={loading} name="stock_init"  className="form-control" placeholder={Lang({ children: "Tap Initial Stock" })} defaultValue={stock?.stock_init} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Current Stock</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" min={0} required disabled={loading} name="stock_actuel"  className="form-control" placeholder={Lang({ children: "Tap Current Stock" })} defaultValue={stock?.stock_actuel} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Price</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" min={0} step={0.1} required disabled={loading} name="price"  className="form-control" placeholder={Lang({ children: "Tap Price" })} defaultValue={stock?.price} id="" />
                        </div>
                        {stock?.product?.expires==1 && 
                            <ExpiresDate loading={loading} stock={stock} />
                        }
                    </div>
                    <div className="modal-footer">
                        <PrimaryButton label={"Save"} handleClick={()=>null} disabled={loading} type={"submit"} />
                    </div>
                </form>
            </div>
        </div>
    )
}

const ExpiresDate = ({ loading, stock }) => {
    
    return (
        <div className="mb-3">
            <label className="form-label h5"><Lang>Expiration date</Lang> : {loading && <Spinner/>}</label>
            <input type="date"  required disabled={loading} name="expired_at"  className="form-control" placeholder={Lang({ children: "Tap expiration date" })} defaultValue={stock?.expired_at?format(stock?.expired_at, "yyyy-MM-dd"): ""}  />
        </div>
    )
}