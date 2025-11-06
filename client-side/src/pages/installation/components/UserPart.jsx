import { useRef } from "react";
import { Lang } from "../../../assets/js/lang";
import { Spinner } from "../../../components/Spinner";

export function UserPart({loading}){
    const refPassword = useRef();
    const refPassMsg = useRef(null);
    const confirmPass = (e) => {
        let value = e.target.value
        let password = refPassword.current.value
        if (value !== "" && value === password) {
            refPassMsg.current.innerText = "Valid!!"
            refPassMsg.current.style = "color: green"
        } else {
            refPassMsg.current.innerText = "Invalid!!"
            refPassMsg.current.style = "color: red"
            
        }
    }
    return (
        <div className="col-12 col-lg-6 text-start p-2">
            <div className="header">
                <div className="title h3 m-0"><Lang>User infos</Lang> :</div>
            </div>
            <div className=" p-4">
                <div className="mb-3">
                    <label className="form-label h5"><Lang>CIN</Lang>* : {loading && <Spinner/>}</label>
                    <input type="text" required disabled={loading} name="userCIN"  className="form-control" placeholder={Lang({ children: "Tap CIN" })}   />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Name</Lang>* : {loading && <Spinner/>}</label>
                    <input type="text" required disabled={loading} name="userName"  className="form-control" placeholder={Lang({ children: "Tap Name" })}   />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Username</Lang>* : {loading && <Spinner/>}</label>
                    <input type="text" required disabled={loading} name="usernameAccount"  className="form-control" placeholder={Lang({ children: "Tap UserName" })}   />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Email</Lang>* : {loading && <Spinner/>}</label>
                    <input type="text" required disabled={loading} name="userEmail"  className="form-control" placeholder={Lang({ children: "Tap Email" })}   />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                    <input type="text"  disabled={loading} name="userPhone"  className="form-control" placeholder={Lang({ children: "Tap phone" })}   />
                </div>
                
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Password (min 4 character)</Lang>* : {loading && <Spinner/>}</label>
                    <input type="password" ref={refPassword} required minLength={4}  disabled={loading} name="userPassword"  className="form-control" placeholder={Lang({ children: "Tap Password" })}   />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Password Confirm</Lang>* : {loading && <Spinner/>}</label>
                    <input type="password"  required onChange={confirmPass} minLength={4} disabled={loading} name="userPasswordConf" className="form-control" placeholder={Lang({ children: "retap Password" })} />
                    <p><em ref={refPassMsg}><Lang>Passwords must be the same</Lang></em></p>
                </div>
                
            </div>
        </div>
    )
}