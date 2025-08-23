import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../../../assets/js/lang";
import { PrimaryButton } from "../../../../../components/primaryButton";
import { useSettingsAction } from "../../../../../context/settingsContext";
import { Spinner } from "../../../../../components/Spinner";
import api from "../../../../../api/api";
import { useAppAction } from "../../../../../context/context";

export function PosModal() {
    const [loading, setLoading] = useState(true)
    const [state, setState] = useState();
    const appAction = useAppAction();
    const settingsAction = useSettingsAction();
    const refDiscount = useRef(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        formData.append("discount",refDiscount.current.checked?1:0)
        setLoading(true)
        api({
            method: "post",
            url: "/settings/pos",
            data: formData,
            // withCredentials:true
        }).then(res => {
            return res.data
        }).then(res => {
            //handle good update
            settingsAction({
                type: "UPDATE_SETTINGS",
                payload: res.data
            })
            appAction({
                type: "UPDATE_SETTINGS",
                payload: res.data
            })
            handleClose();
            setLoading(false)
        }).catch(err => {
            //error handler
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    }
    const handleClose = () => {
        settingsAction({
            type: "TOGGLE_POS_MODAL",
            payload: false
        })
    }
    useEffect(() => {
        api({
            method: "get",
            url: "/settings/pos",
            // withCredentials:true
        }).then(res => {
            return res.data
        }).then(res => {
            setState(res.data)
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
            <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                    <form onSubmit={handleSubmit} className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title">
                                <div className="title h3 m-0"><Lang>Pos Settings</Lang> :</div>
                                <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                            </div>
                            <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label h5"><Lang>Default TVA</Lang> : {loading && <Spinner/>}</label>
                                <input type="number" required  disabled={loading} name="tva" min={0} max={100}  className="form-control" placeholder={Lang({ children: "Tap TVA" })} defaultValue={state?.tva} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label h5"><Lang>Product per page</Lang> : {loading && <Spinner/>}</label>
                                <input type="number" required  disabled={loading} name="productPerPage"   className="form-control" placeholder={Lang({ children: "Tap product per page" })} defaultValue={state?.productPerPage} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label h5"><Lang>Discount</Lang> : {loading && <Spinner/>}</label>
                                <div className="state">
                                    <div className="form-check form-switch">
                                        <input  className="form-check-input" ref={refDiscount} type="checkbox" role="switch" id="flexSwitchCheckChecked3" defaultChecked={state?.discount} />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked3"><Lang>Enable</Lang></label>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="modal-footer">
                            <PrimaryButton label={"Save"} handleClick={()=>null} disabled={loading} type={"submit"} />
                        </div>
                    </form>
                </div>
            </div>
        )
}