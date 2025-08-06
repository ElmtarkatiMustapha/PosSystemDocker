import { useEffect, useRef, useState } from "react";
import { useCateAction, useCateState } from "../../../../context/categoriesContext"
import api, { getImageURL } from "../../../../api/api";
import { Lang } from "../../../../assets/js/lang";
import { PrimaryButton } from "../../../../components/primaryButton";
import { useAppAction } from "../../../../context/context";
import { Spinner } from "../../../../components/Spinner";
import { UploadImage } from "../../../../components/UploadImage";
export function EditModal() {
    const cateAction = useCateAction();
    const cateState = useCateState();
    const appAction = useAppAction();
    const [category, setCategory] = useState({}); 
    const [loading, setLoading] = useState(true);
    const refActive = useRef();
    //get category infos q
    useEffect(() => {
        api({
            method: "get",
            url: "/category/" + cateState.categoryToEdit,
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
            setCategory(res.data);
            setLoading(false)
        }).catch(err => {
            //error handle
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
        })
        
    }, [])
    //to close modal
    const handleClose = () => {
        cateAction({
            type: "TOGGLE_EDIT_MODAL",
            payload:false
        })
        cateAction({
            type: "SET_EDIT_CATEGORY",
            payload:0
        })
    }
    //handle submit to save edit
    const handleSubmit = (e) => {
        /**
         * get all field like(title, image, description, state)
         * ckeck if title is empty
         * send data to the server-side 
         */
        e.preventDefault();
        let formData = new FormData(e.target);
        formData.append("active", refActive.current.checked ? 1 : 0)
        cateAction({
            type: "SET_LOADING",
            payload: true
        })
        setLoading(true)
        api.post("/category/" + category.id,
            formData,
            {
                // withCredentials:true
            }).then(res => {
                return res.data
            }).then(res => {
                setLoading(false)
                cateAction({
                    type: "UPDATE_ITEM",
                    payload:res.data
                });
                cateAction({
                    type: "SET_CATEGORY",
                    payload: res.data
                });
                cateAction({
                    type: "SET_LOADING",
                    payload: false
                })
                appAction({
                    type: "SET_SUCCESS",
                    payload: res.message
                })
                cateAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload:false
                })
            }).catch(err => {
                setLoading(false)
                //handle error
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
                            <div className="title h3 m-0"><Lang>Edit Category</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Title</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required name="name" disabled={loading}  className="form-control" placeholder={Lang({ children: "Tap title" })} defaultValue={category?.name} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Description</Lang> : {loading && <Spinner/>}</label>
                            <textarea name="desc" disabled={loading} className="form-control" placeholder={Lang({ children:"Tap description"})} defaultValue={category?.description} id=""></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner/>}</label>
                            <UploadImage loading={loading} image={getImageURL(category?.picture)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>State</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input ref={refActive} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={category?.active} />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked"><Lang>Enable</Lang></label>
                                </div>
                            </div>
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

