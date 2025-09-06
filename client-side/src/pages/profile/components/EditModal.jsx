import { useState } from "react";
import { Lang } from "../../../assets/js/lang";
import { PrimaryButton } from "../../../components/primaryButton";
import { Spinner } from "../../../components/Spinner";
import { UploadImage } from "../../../components/UploadImage";
import api, { getImageURL } from "../../../api/api";
import { useAppAction, useAppState } from "../../../context/context";
import { useProfileAction, useProfileState } from "../../../context/profileContext";
import { ButtonDanger } from "../../../components/ButtonDanger";
import { useNavigate } from "react-router-dom";

export function EditModal() {
    const [loading, setLoading] = useState(false);
    const appAction = useAppAction();
    const profileAction = useProfileAction()
    const profileState = useProfileState()
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        setLoading(true);
        api({
            method: "POST",
            url: "/profile/" + profileState.currentItem?.id,
            data: {
                name: formData.get("name"),
                cin: formData.get("cin"),
                phone: formData.get("phone"),
                picture: formData.get("picture")
            },
            withCredentials: true,
            headers:{
                "accept": "application/json",
                "Content-Type":"multipart/form-data"
            }
        }).then(res => {
            return res.data;
        }).then(res => {
            profileAction({
                type: "UPDATE_CURRENT_ITEM",
                payload: res.data
            })
            appAction({
                type: "UPDATE_CURRENT_USER",
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
        profileAction({
            type: "TOGGLE_EDIT_MODAL",
            payload: false
        })
    }
    /**
     * handle change password
     */
    const navigateToResetPass = ()=>{
        navigate("/login/resetpass/step3")
    }
    
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Edit User</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>CIN</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="cin"  className="form-control" defaultValue={profileState.currentItem?.cin} placeholder={Lang({ children: "Tap CIN" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="name"  className="form-control" defaultValue={profileState.currentItem?.name} placeholder={Lang({ children: "Tap Name" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Username</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={true} name="username"  className="form-control" defaultValue={profileState.currentItem?.username} placeholder={Lang({ children: "Tap UserName" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Email</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={true} name="email"  className="form-control" defaultValue={profileState.currentItem?.email} placeholder={Lang({ children: "Tap Email" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="phone"  className="form-control" defaultValue={profileState.currentItem?.phone} placeholder={Lang({ children: "Tap phone" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner/>}</label>
                            <UploadImage loading={loading} image={getImageURL(profileState.currentItem?.picture)} />
                        </div>
                        <div className="mb-3">
                            <ButtonDanger label={"Change Password"} handleClick={navigateToResetPass} disabled={loading} />
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