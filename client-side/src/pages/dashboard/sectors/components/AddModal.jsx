import {  useState } from "react";
import { Lang } from "../../../../assets/js/lang"
import { Spinner } from "../../../../components/Spinner"
import { useSectorAction } from "../../../../context/sectorsContext"
import api from "../../../../api/api";
import { useAppAction } from "../../../../context/context";
import { PrimaryButton } from "../../../../components/primaryButton";

export function AddModal() {
    const sectorsActions = useSectorAction();
    const appAction = useAppAction();
    const [loading, setLoading] = useState(false);
    const handleClose = () => {
        sectorsActions({
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
            url: "/addSector",
            data: formData,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            sectorsActions({
                type: "ADD_ITEM",
                payload: res.data
            })
            appAction({
                type: "SET_SUCCESS",
                payload: res?.message
            });
            console.log(res.data);
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
                            <div className="title h3 m-0"><Lang>Add Sector</Lang> :</div>
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
                            <label className="form-label h5"><Lang>Adresse</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="adresse"  className="form-control" placeholder={Lang({ children: "Tap adresse" })} id="" />
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