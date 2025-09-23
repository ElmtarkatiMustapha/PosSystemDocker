import { useState } from "react"
import { Lang } from "../../../assets/js/lang";
import { PrimaryButton } from "../../../components/primaryButton";
import { Spinner } from "../../../components/Spinner";
import api from "../../../api/api";
import { useAppAction } from "../../../context/context";
import { ButtonDanger } from "../../../components/ButtonDanger";
import { useNavigate } from "react-router-dom";

export function CashRegisterModal({handleOpen}){
    const [loading,setLoading] = useState(false)
    const appAction = useAppAction()
    const navigate = useNavigate(); 

    //open a cash register session 
    const handleSubmit = (e)=>{
        e.preventDefault();
        setLoading(true);
        let formData = new FormData(e.target);
        
        api({
            method: "post",
            url: "/openCashRegisterSession",
            data: formData,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            appAction({
                type: "SET_SUCCESS",
                payload: res?.message
            });
            setLoading(false);
            handleOpen(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            });
            setLoading(false)
        })
    }
    //go back function 
    const goBack = ()=>{
        navigate(-1);
    }
    return(
        <div className="editModal modal z-0 d-block pt-5 pb-5"  data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog pb-4 pt-3 modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content text-start">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Cash register</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        {/* <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                    </div>
                    <div className="modal-body ">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Enter opening Amount</Lang>* : {loading && <Spinner/>}</label>
                            <input type="number" step={0.1} required disabled={loading}  name="openingAmount"  className="form-control" placeholder={Lang({ children: "Tap opening amount" })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Note</Lang> : {loading && <Spinner/>}</label>
                            <textarea disabled={loading}  name="note"  className="form-control" placeholder={Lang({ children: "Tap note" })} />
                        </div>
                        
                    </div>
                    <div className="p-3 container-fluid">
                        <div className="row m-0">
                            <div className="col-6 text-start">
                                <ButtonDanger label={"Back"} handleClick={goBack} disabled={loading} type={"button"} />
                            </div>
                            <div className="col-6 text-end">
                                <PrimaryButton label={"Save"} handleClick={()=>null} disabled={loading} type={"submit"} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}