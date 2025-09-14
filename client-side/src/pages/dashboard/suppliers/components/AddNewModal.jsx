import { useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { Spinner } from "../../../../components/Spinner";
import { useAppAction } from "../../../../context/context";
import { PrimaryButton } from "../../../../components/primaryButton";
import api from "../../../../api/api";
import { useSuppliersAction } from "../../../../context/suppliersContext";
import { UploadImage } from "../../../../components/UploadImage";

export function AddNewModal() {
    const [loading, setLoading] = useState(false);
    const appAction = useAppAction();
    const suppliersAction = useSuppliersAction();
    
    const handleClose = () => {
        suppliersAction({
            type: "TOGGLE_ADD_MODAL",
            payload: false,
        })
    }
    //handle submit 
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        setLoading(true);
        api({
            method: "POST",
            url: "/addSupplier",
            data: formData,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            console.log(res.data);
            suppliersAction({
                type: "ADD_ITEM",
                payload: res.data
            })
            appAction({
                type: "SET_SUCCESS",
                payload: "Add with success"
            })
            handleClose();
            setLoading(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false);
        })
    }
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Add Supplier</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Ice</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="ice"  className="form-control" placeholder={Lang({ children: "Tap ICE" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="name"  className="form-control" placeholder={Lang({ children: "Tap Name" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Adresse</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="adresse"  className="form-control" placeholder={Lang({ children: "Tap Adresse" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Email</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="email"  className="form-control" placeholder={Lang({ children: "Tap Email" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="phone"  className="form-control" placeholder={Lang({ children: "Tap phone" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Description</Lang> : {loading && <Spinner/>}</label>
                            <textarea type="text"  disabled={loading} name="description"  className="form-control" placeholder={Lang({ children: "Tap Description" })}   />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner />}</label>
                            <UploadImage loading={loading} image=""/>
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