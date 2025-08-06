import { useState } from "react";
import { useAppAction } from "../../../../context/context";
import { useSpentsAction } from "../../../../context/spentsContext";
import api from "../../../../api/api";
import { Lang } from "../../../../assets/js/lang";
import { Spinner } from "../../../../components/Spinner";
import { PrimaryButton } from "../../../../components/primaryButton";

export function AddModal() {
    const spentsAction = useSpentsAction();
    const appAction = useAppAction();
    const [loading, setLoading] = useState(false);
    const handleClose = () => {
        spentsAction({
            type: "TOGGLE_ADD_MODAL",
            payload: false,
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        let formData = new FormData(e.target);
        api({
            method: "post",
            url: "/addSpent",
            data: formData,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            spentsAction({
                type: "ADD_ITEM",
                payload: res.data
            })
            appAction({
                type: "SET_SUCCESS",
                payload: res?.message
            });
            setLoading(false);
            handleClose();
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            });
            setLoading(false)
        })
    }
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Add Spent</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Title</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={loading} name="title"  className="form-control" placeholder={Lang({ children: "Tap Title" })}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Amount</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" step={0.1}  disabled={loading} name="amount"  className="form-control" placeholder={Lang({ children: "Tap Amount" })} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Description</Lang> : {loading && <Spinner/>}</label>
                            <textarea name="description" disabled={loading} className="form-control" placeholder={Lang({ children:"Tap description"})}  id=""></textarea>
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