import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../../../assets/js/lang";
import { PrimaryButton } from "../../../../../components/primaryButton";
import { Spinner } from "../../../../../components/Spinner";
import { useSettingsAction } from "../../../../../context/settingsContext";
import api from "../../../../../api/api";
import { useAppAction } from "../../../../../context/context";

export function AlertModal() {
    const [loading, setLoading] = useState(true)
    const [state, setState] = useState();
    const settingsAction = useSettingsAction();
    const appAction = useAppAction();
    const refPass = useRef(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        setLoading(true)
        api({
            method: "post",
            url: "/settings/alert",
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
            type: "TOGGLE_ALERT_MODAL",
            payload: false
        })
    }
    //show password function 
    const showPassword = (e) => {
        e.preventDefault()
        if (refPass.current.getAttribute("type") == "password") {
            refPass.current.setAttribute("type", "text");
            e.target.innerText ="Hide password" 
        } else {
            refPass.current.setAttribute("type", "password");
            e.target.innerText ="Show password"
        }
        
    }

    useEffect(() => {
        api({
            method: "get",
            url: "/settings/alert",
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
                            <div className="title h3 m-0"><Lang>Alert Settings</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Stock Alert</Lang>(<Lang>Pieces</Lang>) *: {loading && <Spinner/>}</label>
                            <input type="number" required disabled={loading} name="stock_alert"  className="form-control" placeholder={Lang({ children: "Tap stock alert" })} defaultValue={state?.stock_alert} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Stock Experation</Lang>(<Lang>Days</Lang>) *: {loading && <Spinner/>}</label>
                            <input type="number" required disabled={loading} name="stock_expiration"  className="form-control" placeholder={Lang({ children: "Tap stock expiration" })} defaultValue={state?.stock_expiration} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Repport Emails</Lang> : {loading && <Spinner />}</label>
                            <textarea disabled={loading} name="repport_email" className="form-control" placeholder={Lang({ children: "Tap emails" })} defaultValue={state?.repport_email?.join(";")} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Host</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="host"  className="form-control" placeholder={Lang({ children: "Tap Host" })} defaultValue={state?.host} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Port</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" disabled={loading} name="port"  className="form-control" placeholder={Lang({ children: "Tap port" })} defaultValue={state?.port} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Username</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" disabled={loading} name="username"  className="form-control" placeholder={Lang({ children: "Tap username" })} defaultValue={state?.username} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Password</Lang> : {loading && <Spinner />}</label>
                            <span className="float-end"><button className="border-0 bg-transparent text-decoration-underline" onClick={showPassword}><Lang>Show password</Lang></button> </span>
                            <input type="password" ref={refPass} disabled={loading} name="password"  className="form-control" placeholder={Lang({ children: "Tap password" })} defaultValue={state?.password} id="" />
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