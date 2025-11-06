import { useEffect, useState } from "react"
import { Lang } from "../../../../assets/js/lang"
import { Spinner } from "../../../../components/Spinner"
import { UploadImage } from "../../../../components/UploadImage";
import api, { getImageURL } from "../../../../api/api";
import { PrimaryButton } from "../../../../components/primaryButton";
import { usePosAction, usePosState } from "../../../../context/posContext";
import { useAppAction } from "../../../../context/context";

export function EditModal() {
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState();
    const [sectorsList, setSectorsList] = useState();
    const posAction = usePosAction();
    const posState = usePosState();
    const appAction = useAppAction();
    const handleSubmit = (e) => {
        //handle submit
        e.preventDefault();
        let formData = new FormData(e.target);
        setLoading(true);
        api({
            method: "POST",
            url: "/cashierCustomer/" + item.id,
            data: formData,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            posAction({
                type: "UPDATE_CUSTOMER_ITEM",
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
    const handleClose = () => {
        //close modal
        posAction({
            type: "TOGGLE_CUSTOMER_EDIT_MODAL",
            payload: false
        })
        posAction({
            type: "SET_CUSTOMER_EDIT",
            payload: 0
        })
    }
    useEffect(() => {
        //get all sector for this user
        api({
            method: "GET",
            url: "/cashierCustomer/" + posState.customersContext.editItem,
            //withCredentials: true,
        }).then(res => {
            return res.data
        }).then(res => {
            setItem(res.data);
            setLoading(false);
            setSectorsList(res.sectors);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            handleClose();
        })
    },[])
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Edit Customer</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={loading} name="name"  className="form-control" defaultValue={item?.name} placeholder={Lang({ children: "Tap Name" })}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Adresse</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={loading} name="adresse"  className="form-control" defaultValue={item?.adresse} placeholder={Lang({ children: "Tap adresse" })} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Ice</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="ice"  className="form-control" defaultValue={item?.ice} placeholder={Lang({ children: "Tap Ice" })}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Email</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="email"  className="form-control" defaultValue={item?.email} placeholder={Lang({ children: "Tap email" })}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="phone"  className="form-control" defaultValue={item?.phone} placeholder={Lang({ children: "Tap Phone" })}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Sector</Lang> : {loading && <Spinner />}</label>
                            <select name="sector_id" required className="form-select" id="">
                                {sectorsList?.map((elem) => {
                                    if (elem.id === item?.sector_id) {
                                    return <option key={elem.id} selected value={elem.id}>{ elem.title}</option>
                                } else {
                                    return <option key={elem.id} value={elem.id}>{ elem.title}</option>
                                    }
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner/>}</label>
                            <UploadImage loading={loading} image={getImageURL(item?.picture)}/>
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