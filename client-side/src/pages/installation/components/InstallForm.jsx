import { Lang } from "../../../assets/js/lang"
import { useState } from "react";
import { BusinessPart } from "./BusinessPart";
import { UserPart } from "./UserPart";
import { AlertPart } from "./AlertPart";
import { PosPart } from "./PosPart";
import { ButtonBlue } from "../../../components/ButtonBlue";
import api from "../../../api/api";
import { useAppAction } from "../../../context/context";
import { useNavigate } from "react-router-dom";

export function InstallForm(){
     const [loading,setLoading] = useState(false)
     const appAction = useAppAction()
     const navigate =  useNavigate();
     /**
      * this function will install the app
      * @param {*} e 
      */
     const handleSubmit = (e)=>{
        e.preventDefault();
        let formData = new FormData(e.target);
        setLoading(true)
        appAction({ type: "SET_LOADING", payload: true })
        api({
            method: "post",
            url: "/install",
            data: formData,
        }).then(res => {
            return res.data
        }).then(res => {
            //navigate to the login page
            setLoading(false)
            appAction({ type: "SET_SUCCESS", payload: res.message })
            appAction({
                type: "TOGGLE_INSTALLED",
                payload: true
            })
            appAction({ type: "SET_LOADING", payload: false })
            navigate("/", { replace: true })
        }).catch(err => {
            //error handler
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            appAction({ type: "SET_LOADING", payload: false })
            setLoading(false)
        })
     }
    return (
         <>
                <div className="title p-1 h1">
                    <Lang>Installation</Lang>
                </div>
                <div className="container-fluid">
                    <form onSubmit={handleSubmit} className="row">
                        <BusinessPart loading={loading} setLoading={setLoading}/>
                        <UserPart loading={loading} />
                        <AlertPart loading={loading}/>
                        <PosPart loading={loading}/>
                        <div className="col-12 ">
                            <div className="submitBtn p-2">
                                <ButtonBlue type="submit" label="Install" />
                            </div>
                        </div>
                    </form>
                </div>
            </>
    )
}