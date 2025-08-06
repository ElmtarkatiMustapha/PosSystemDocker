import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { Spinner } from "../../../../components/Spinner";
import { useAppAction } from "../../../../context/context";
import { PrimaryButton } from "../../../../components/primaryButton";
import api, { getImageURL } from "../../../../api/api";
import { useSuppliersAction, useSuppliersState } from "../../../../context/suppliersContext";
import { UploadImage } from "../../../../components/UploadImage";

export function EditModal() {
    const [loading, setLoading] = useState(true);
    const [supplier, setSupplier] = useState();
    const appAction = useAppAction();
    const suppliersState = useSuppliersState();
    const suppliersAction = useSuppliersAction();
    useEffect(()=> {
        //get supplier infos
        api({
            method: "GET",
            url: "/supplierManage/" + suppliersState.editItem,
            withCredentials: true,
        }).then(res => {
            return res.data
        }).then(res => {
            setSupplier(res.data);
            setLoading(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            handleClose();
        })
    },[])
    const handleClose = () => {
        suppliersAction({
            type: "TOGGLE_EDIT_MODAL",
            payload: false,
        })
    }
    //handle submit 
    const refActive = useRef();
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        formData.append("active",refActive.current.checked?1:0)
        setLoading(true);
        api({
            method: "POST",
            url: "/supplier/" + supplier.id,
            data: formData,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            suppliersAction({
                type: "UPDATE_CURRENT_ITEM",
                payload: res.data
            })
            suppliersAction({
                type: "UPDATE_ITEM",
                payload: res.data
            })
            appAction({
                type: "SET_SUCCESS",
                payload: "Updated with success"
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
                            <div className="title h3 m-0"><Lang>Edit Supplier</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Ice</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="ice"  className="form-control" placeholder={Lang({ children: "Tap ICE" })}  defaultValue={supplier?.ice}  />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="name"  className="form-control" placeholder={Lang({ children: "Tap Name" })}  defaultValue={supplier?.name} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Adresse</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="adresse"  className="form-control" placeholder={Lang({ children: "Tap Adresse" })}  defaultValue={supplier?.adresse} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Email</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="email"  className="form-control" placeholder={Lang({ children: "Tap Email" })} defaultValue={supplier?.email}  />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="phone"  className="form-control" placeholder={Lang({ children: "Tap phone" })}  defaultValue={supplier?.phone} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Description</Lang> : {loading && <Spinner/>}</label>
                            <textarea type="text"  disabled={loading} name="description"  className="form-control" placeholder={Lang({ children: "Tap Description" })} defaultValue={supplier?.description}  />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner />}</label>
                            <UploadImage loading={loading} image={getImageURL(supplier?.picture)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>State</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input  className="form-check-input" ref={refActive} type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={supplier?.active} />
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