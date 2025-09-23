import { useEffect, useState } from "react";
import { useAppAction } from "../../../../context/context";
import { useCashRegisterSessionAction, useCashRegisterSessionState } from "../../../../context/cashRegisterSessionContext";
import { Lang } from "../../../../assets/js/lang";
import { Spinner } from "../../../../components/Spinner";
import { PrimaryButton } from "../../../../components/primaryButton";
import api from "../../../../api/api";

export function EditModal(){
    const [loading,setLoading] = useState(true)
    const [session,setSession] = useState(null)
    const appAction = useAppAction()
    const cashRegisterSessionState = useCashRegisterSessionState();
    const cashRegisterSessionsActions = useCashRegisterSessionAction();

    //open a cash register session 
    const handleSubmit = (e)=>{
        e.preventDefault();
        setLoading(true);
        let formData = new FormData(e.target);
        
        api({
            method: "post",
            url: "/updateCashRegisterSession/"+cashRegisterSessionState?.editedItem,
            data: formData,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            appAction({
                type: "SET_SUCCESS",
                payload: res?.message
            });
            cashRegisterSessionsActions({
                type: "RELOAD_DATA"
            })
            setLoading(false);
            cashRegisterSessionsActions({
                type: "TOGGLE_EDIT_MODAL",
                payload: false
            })
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            });
            setLoading(false)
        })
    }
    //get data of this session to edit
    useEffect(() => {
        api({
            method: "get",
            url: "/cashRegisterSession/" + cashRegisterSessionState?.editedItem,
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
            setSession(res.data);
            setLoading(false)
        }).catch(err => {
            //error handle
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
        })
        
    }, [])
    const handleClose = ()=>{
        cashRegisterSessionsActions({
            type: "TOGGLE_EDIT_MODAL",
            payload: false
        })    
    }
    return(
        <div className="editModal modal z-2 d-block "  data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content text-start">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Edit Cash register</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body ">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Enter opening Amount</Lang>* : {loading && <Spinner/>}</label>
                            <input type="number" step={0.1} required disabled={loading}  name="openingAmount"  className="form-control" defaultValue={session?.opening_amount} placeholder={Lang({ children: "Tap opening amount" })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Note</Lang> : {loading && <Spinner/>}</label>
                            <textarea disabled={loading}  name="note"  className="form-control" defaultValue={session?.note} placeholder={Lang({ children: "Tap note" })} />
                        </div>
                        
                    </div>
                    <div className="p-3 modal-footer">
                        <PrimaryButton label={"Save"} handleClick={()=>null} disabled={loading} type={"submit"} />
                    </div>
                </form>
            </div>
        </div>
    )
}