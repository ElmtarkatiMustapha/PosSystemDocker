import {  useState } from "react";
import { Lang } from "../../../../assets/js/lang"
import { useCateAction } from "../../../../context/categoriesContext";
import { useAppAction } from "../../../../context/context";
import { PrimaryButton } from "../../../../components/primaryButton";
import api from "../../../../api/api";
import { UploadImage } from "../../../../components/UploadImage";

export function AddNewModal() {
    const cateAction = useCateAction();
    const appAction = useAppAction();
    const [loading, setLoading] = useState(false);
    const handleClose = () => {
        cateAction({
            type: "TOGGLE_ADD_MODAL",
            payload:false
        })
    }
    //handle submit 
    const handleSubmit = (e) => {
        /**
         * get title,description and image
         * prepare request send request 
         * handle response
         */
        e.preventDefault();
        let formData = new FormData(e.target);
        setLoading(true)
        api.post("/create_category", formData, {
            withCredentials: true,
        }).then(res => {
            return res.data;
        }).then(res => {
            //handle response
            setLoading(false)
            console.log(res.data)
            cateAction({
                type: "ADD_ITEM",
                payload: res.data
            })
            cateAction({
                type: "SET_LOADING",
                payload: false
            })
            cateAction({
                type: "TOGGLE_ADD_MODAL",
                payload:false
            })
            appAction({
                type: "SET_SUCCESS",
                payload: "Success"
            })
        }).catch(err => {
            //handle error
            setLoading(false)
            cateAction({
                type: "SET_LOADING",
                payload: false
            })
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
        })

    }
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Add Category</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Title</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" name="name" disabled={loading} className="form-control" placeholder={Lang({ children: "Tap title" })}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Description</Lang> : {loading && <Spinner/>}</label>
                            <textarea name="desc" disabled={loading} className="form-control" placeholder={Lang({ children:"Tap description"})}  id=""></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner/>}</label>
                            <UploadImage loading={loading} image={""}/>
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

function Spinner() {
    return (
         <span className="spinner-border spinner-border-sm"></span>
    )
}