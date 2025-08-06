import { useEffect, useState } from "react";
import { Lang } from "../../../../../assets/js/lang";
import { Spinner } from "../../../../../components/Spinner";
import { useAppAction } from "../../../../../context/context";
import api from "../../../../../api/api";
import { useSettingsAction, useSettingsState } from "../../../../../context/settingsContext";

export function ViewPrinterModal() {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState();
    const settingsAction = useSettingsAction();
    const settingsState = useSettingsState();
    const appAction = useAppAction();
    const handleClose = (e) => {
        //close modal
        settingsAction({
            type: "TOGGLE_VIEW_PRINTER_MODAL",
            payload:false,
        })
        settingsAction({
            type: "SET_VIEWED_PRINTER",
            payload:0,
        })
    }
    useEffect(() => {
        //get data 
        api({
            method: "get",
            url: "/settings/printer/" + settingsState.viewedPrinter,
            // withCredentials:true
        }).then(res => {
            return res.data;
        }).then(res => {
            setState(res.data)
            setLoading(false)
        }).catch(err => {
            //handle error
            appAction({
                type: "SET_ERROR",
                payload: err?.message
            })
            setLoading(false)
        })
    },[])

    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Printer info</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Printer name</Lang>: {loading && <Spinner/>}</label>
                            <input type="text" disabled={true}   className="form-control"  value={state?.name} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>IP Adresse</Lang>: {loading && <Spinner/>}</label>
                            <input type="text" disabled={true}   className="form-control"  value={state?.ipAdresse} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Profile</Lang>: {loading && <Spinner/>}</label>
                            <input type="text" disabled={true}   className="form-control"  value={state?.profile} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Port</Lang>: {loading && <Spinner/>}</label>
                            <input type="text" disabled={true}   className="form-control"  value={state?.port} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Description</Lang>: {loading && <Spinner/>}</label>
                            <textarea type="text" disabled={true}   className="form-control"  value={state?.description} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Network</Lang>: {loading && <Spinner/>}</label>
                            <div className="d-inline-block ps-2">
                                {state?.network == 1 ? 
                                <span style={{ borderRadius: "30px", backgroundColor: "rgba(0, 128, 0, 0.21)", color: "green", fontWeight: "bold" }} className="ps-2 pt-1 pb-1 pe-2"><Lang>Active</Lang></span>
                                :
                                <span style={{ borderRadius: "30px", backgroundColor: "rgba(128, 0, 0, 0.21)", color: "red", fontWeight: "bold" }} className="ps-2 pt-1 pb-1 pe-2"><Lang>Disactive</Lang></span>
                                }
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>State</Lang>: {loading && <Spinner/>}</label>
                            <div className="d-inline-block ps-2">
                                {state?.active == 1 ? 
                                <span style={{ borderRadius: "30px", backgroundColor: "rgba(0, 128, 0, 0.21)", color: "green", fontWeight: "bold" }} className="ps-2 pt-1 pb-1 pe-2"><Lang>Active</Lang></span>
                                :
                                <span style={{ borderRadius: "30px", backgroundColor: "rgba(128, 0, 0, 0.21)", color: "red", fontWeight: "bold" }} className="ps-2 pt-1 pb-1 pe-2"><Lang>Disactive</Lang></span>
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}