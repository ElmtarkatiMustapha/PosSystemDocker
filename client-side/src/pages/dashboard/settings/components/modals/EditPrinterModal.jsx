import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../../../assets/js/lang";
import { PrimaryButton } from "../../../../../components/primaryButton";
import { Spinner } from "../../../../../components/Spinner";
import { useAppAction } from "../../../../../context/context";
import { useSettingsAction, useSettingsState } from "../../../../../context/settingsContext";
import api from "../../../../../api/api";

export function EditPrinterModal() {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState();
    const appAction = useAppAction();
    const settingsState = useSettingsState();
    const settingsAction = useSettingsAction();
    const refNetwork = useRef();
    const refActive = useRef();
    const handleSubmit = (e) => {
        //handle submit
        e.preventDefault();
        let formData = new FormData(e.target);
        formData.append("network",refNetwork.current.checked?1:0)
        formData.append("active",refActive.current.checked?1:0)
        setLoading(true)
        api({
            method: "post",
            url: "/settings/printer/"+settingsState.editedPrinter,
            data: formData,
            // withCredentials:true
        }).then(res => {
            return res.data
        }).then(res => {
            settingsAction({
                type: "UPDATE_PRINTERS",
                payload: res.data
            })
            appAction({
                type: "SET_SUCCESS",
                payload: res?.message
            })
            handleClose();
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    }
    const handleClose = () => {
        //handle close
        settingsAction({
            type: "TOGGLE_EDIT_PRINTER_MODAL",
            payload:false,
        })
        settingsAction({
            type: "SET_EDITED_PRINTER",
            payload:0,
        })
    }
    useEffect(() => {
        //get data
        api({
            method: "get",
            url: "/settings/printer/" + settingsState.editedPrinter,
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
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Add Printer</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={loading} name="name"  className="form-control" placeholder={Lang({ children: "Tap Name" })} defaultValue={state?.name}  />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>IP Adresse</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={loading} name="ipAdresse"  className="form-control" placeholder={Lang({ children: "Ex: 192.168.1.11" })} defaultValue={state?.ipAdresse} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Profile</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"   disabled={loading} name="profile"  className="form-control" placeholder={Lang({ children: "Tap Profile" })} defaultValue={state?.profile} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Port</Lang> : {loading && <Spinner/>}</label>
                            <input type="number"   disabled={loading} name="port"  className="form-control" placeholder={Lang({ children: "Ex: 9100" })} defaultValue={state?.port} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Description</Lang> : {loading && <Spinner/>}</label>
                            <textarea disabled={loading} name="description"  className="form-control" placeholder={Lang({ children: "Tap description" })}  defaultValue={state?.description} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Network Mode</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input  className="form-check-input" ref={refNetwork} type="checkbox" role="switch" id="flexSwitchCheckChecked1" defaultChecked={state?.network} />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked1"><Lang>Enable</Lang></label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Active</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input  className="form-check-input" ref={refActive} type="checkbox" role="switch" id="flexSwitchCheckChecked2" defaultChecked={state?.active} />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked2"><Lang>Enable</Lang></label>
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