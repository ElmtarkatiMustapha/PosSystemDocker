import { useEffect, useState } from "react"
import { Lang } from "../../../../assets/js/lang"
import { Spinner } from "../../../../components/Spinner"
import { PrimaryButton } from "../../../../components/primaryButton";
import { UploadImage } from "../../../../components/UploadImage";
import { usePosAction } from "../../../../context/posContext";
import api from "../../../../api/api";
import { useAppAction } from "../../../../context/context";

export function AddModal() {
    const [loading, setLoading] = useState(true);
    const [sectorsList, setSectorsList] = useState([]);
    const posAction = usePosAction();
    const appAction = useAppAction();
    const handleSubmit = (e) => {
        //handle submit
        e.preventDefault();
        setLoading(true);
        let formData = new FormData(e.target);
        api({
            method: "post",
            url: "/cashierAddCustomer",
            data: formData,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            posAction({
                type: "ADD_CUSTOMER_ITEM",
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
    const handleClose = () => {
        //close modal
        posAction({
            type: "TOGGLE_CUSTOMER_ADD_NEW_MODAL",
            payload: false
        })
    }
    useEffect(() => {
        //get all sector for this user
        api({
            method: "GET",
            url: "/posSectors",
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            //set data
            setSectorsList(res.data)
            setLoading(false)
        }).catch(err => {
            //handle error
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
        })
    },[])
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                        <form onSubmit={handleSubmit} className="modal-content">
                            <div className="modal-header">
                                <div className="modal-title">
                                    <div className="title h3 m-0"><Lang>Add Customer</Lang> :</div>
                                    <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                                </div>
                                <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label h5"><Lang>Name</Lang>* : {loading && <Spinner/>}</label>
                                    <input type="text" required  disabled={loading} name="name"  className="form-control" placeholder={Lang({ children: "Tap Name" })}  id="" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label h5"><Lang>Adresse</Lang>* : {loading && <Spinner/>}</label>
                                    <input type="text" required  disabled={loading} name="adresse"  className="form-control" placeholder={Lang({ children: "Tap adresse" })} id="" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label h5"><Lang>Ice</Lang> : {loading && <Spinner/>}</label>
                                    <input type="text"  disabled={loading} name="ice"  className="form-control" placeholder={Lang({ children: "Tap Ice" })}  id="" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                                    <input type="text"  disabled={loading} name="phone"  className="form-control" placeholder={Lang({ children: "Tap Phone" })}  id="" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label h5"><Lang>Sector</Lang> : {loading && <Spinner />}</label>
                                    <select name="sector_id" required className="form-select" id="">
                                        {sectorsList?.map((item) => {
                                            if (item.title.toLowerCase() === "default") {
                                            return <option key={item.id} selected value={item.id}>{ item.title}</option>
                                        } else {
                                            return <option key={item.id} value={item.id}>{ item.title}</option>
                                            }
                                        })}
                                    </select>
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