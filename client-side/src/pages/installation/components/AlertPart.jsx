import { useRef } from "react";
import { Lang } from "../../../assets/js/lang"
import { Spinner } from "../../../components/Spinner"

export function AlertPart({loading}){
    const refPass = useRef(null);
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
    return(
        <div className="col-12 col-lg-6 text-start p-2">
            <div className="header">
                <div className="title h3 m-0"><Lang>Alert Settings</Lang> :</div>
            </div>
            <div className=" p-4">
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Stock Alert</Lang>(<Lang>Pieces</Lang>) *: {loading && <Spinner/>}</label>
                    <input type="number" required disabled={loading} name="stock_alert"  className="form-control" defaultValue={10} placeholder={Lang({ children: "Tap stock alert" })}  id="" />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Stock Experation</Lang>(<Lang>Days</Lang>) *: {loading && <Spinner/>}</label>
                    <input type="number" required disabled={loading} name="stock_expiration"  className="form-control" defaultValue={7} placeholder={Lang({ children: "Tap stock expiration" })}  id="" />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Repport Emails</Lang> : {loading && <Spinner />}</label>
                    <textarea disabled={loading} name="repport_email" className="form-control" placeholder={Lang({ children: "Tap emails" })}  />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Host</Lang> : {loading && <Spinner/>}</label>
                    <input type="text"  disabled={loading} name="host"  className="form-control" placeholder={Lang({ children: "Tap Host" })}  />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Port</Lang> : {loading && <Spinner/>}</label>
                    <input type="text" disabled={loading} name="port"  className="form-control" placeholder={Lang({ children: "Tap port" })}  />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Username</Lang> : {loading && <Spinner/>}</label>
                    <input type="text" disabled={loading} name="alertUsername"  className="form-control" placeholder={Lang({ children: "Tap username" })} />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Password</Lang> : {loading && <Spinner />}</label>
                    <span className="float-end"><button className="border-0 bg-transparent text-decoration-underline" onClick={showPassword}><Lang>Show password</Lang></button> </span>
                    <input type="password" ref={refPass} disabled={loading} name="alertPassword"  className="form-control" placeholder={Lang({ children: "Tap password" })}  id="" />
                </div>
            </div>
        </div>
    )
}