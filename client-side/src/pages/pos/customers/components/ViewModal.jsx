import { useEffect, useState } from "react"
import { Lang } from "../../../../assets/js/lang"
import { Spinner } from "../../../../components/Spinner";
import api, { getImageURL } from "../../../../api/api";
import { useAppAction } from "../../../../context/context";
import { usePosAction, usePosState } from "../../../../context/posContext";

export function ViewModal() {
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState();
    const appAction = useAppAction();
    const posState = usePosState();
    const posAction = usePosAction();
    const handleClose = () => {
        //handle close
        posAction({
            type: "TOGGLE_CUSTOMER_CURRENT_MODAL",
            payload: false
        })
        posAction({
            type: "SET_CUSTOMER_CURRENT",
            payload: 0
        })
    }
    useEffect(() => {
        api({
            method: "GET",
            url: "/cashierCustomer/" + posState.customersContext.currentItem,
            //withCredentials: true,
        }).then(res => {
            return res.data
        }).then(res => {
            setItem(res.data);
            setLoading(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            handleClose();
        })
    },[])
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>View Customer</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={true} name="name"  className="form-control" defaultValue={item?.name} placeholder={Lang({ children: "Tap Name" })}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Adresse</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={true} name="adresse"  className="form-control" defaultValue={item?.adresse} placeholder={Lang({ children: "Tap adresse" })} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Ice</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={true} name="ice"  className="form-control" defaultValue={item?.ice} placeholder={Lang({ children: "Tap Ice" })}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={true} name="phone"  className="form-control" defaultValue={item?.phone} placeholder={Lang({ children: "Tap Phone" })}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Sector</Lang> : {loading && <Spinner />}</label>
                            <input type="text"  disabled={true}   className="form-control" defaultValue={item?.phone} placeholder={Lang({ children: "Tap Phone" })}  id="" />
                            
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner />}</label>
                            <div style={{ backgroundImage: "url('" + getImageURL(item?.picture) + "')" }} className="uploadIamge text-center">
                                <div className="pt-5 pb-5 text-center">
                                    <div className="pt-4 pb-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}