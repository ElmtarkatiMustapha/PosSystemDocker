import { useEffect, useState } from "react"
import { Lang } from "../../../../../assets/js/lang"
import { PrimaryButton } from "../../../../../components/primaryButton"
import { Spinner } from "../../../../../components/Spinner"
import { useSettingsAction } from "../../../../../context/settingsContext"
import api, { getImageURL } from "../../../../../api/api"
import { useAppAction } from "../../../../../context/context"
import { UploadImage } from "../../../../../components/UploadImage"

export function BusinessModal() {
    const [loading, setLoading] = useState(true)
    const settingsAction = useSettingsAction();
    const appAction = useAppAction();
    const [currencies, setCurrencies] = useState();
    const [infos, setInfos] = useState();
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        setLoading(true)
        api({
            method: "post",
            url: "/settings/business",
            data: formData,
            // withCredentials:true
        }).then(res => {
            return res.data
        }).then(res => {
            settingsAction({
                type: "UPDATE_SETTINGS",
                payload: res.data
            })
            appAction({
                type: "UPDATE_SETTINGS",
                payload: res.data
            })
            handleClose();
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    }
    const handleClose = () => {
        settingsAction({
            type: "TOGGLE_BUSINESS_MODAL",
            payload: false
        })
    }
    useEffect(() => {
        //at this point i need to load business settings and currencies list
        api({
            method: "get",
            url: "/settings/business",
            // withCredentials:true
        }).then(res => {
            return res.data
        }).then(res => {
            setCurrencies(res.data?.currencies)
            setInfos(res.data?.businessInfo)
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    },[])
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Business Infos</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={loading} name="name"  className="form-control" placeholder={Lang({ children: "Tap Name" })} defaultValue={infos?.name} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>ICE</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="ice"  className="form-control" placeholder={Lang({ children: "Tap ice" })} defaultValue={infos?.ice} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Adresse</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="adresse"  className="form-control" placeholder={Lang({ children: "Tap adresse" })} defaultValue={infos?.adresse} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Email</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="email"  className="form-control" placeholder={Lang({ children: "Tap Email" })} defaultValue={infos?.email} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="phone"  className="form-control" placeholder={Lang({ children: "Tap phone" })} defaultValue={infos?.phone} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Currency</Lang> : {loading && <Spinner />}</label>
                            <select name="currency"  disabled={loading} className="form-select">
                                {currencies?.map(item => {
                                    return (
                                        item.name === infos?.currency?.name ? 
                                        <option key={item.name} selected value={item.name}>{item.name}</option>
                                        : 
                                        <option key={item.name} value={item.name}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner/>}</label>
                            <UploadImage loading={loading} image={getImageURL(infos?.logo)}/>
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