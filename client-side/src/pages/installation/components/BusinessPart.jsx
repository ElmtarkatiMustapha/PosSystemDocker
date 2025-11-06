import { useEffect, useState } from "react";
import api, { getImageURL } from "../../../api/api";
import { Lang } from "../../../assets/js/lang";
import { Spinner } from "../../../components/Spinner";
import { UploadImage } from "../../../components/UploadImage";
import { useAppAction } from "../../../context/context";

export function BusinessPart({loading, setLoading}){
    const [currencies,setCurrencies] = useState();
    const appAction = useAppAction()
     useEffect(() => {
        //at this point i need to load business settings and currencies list
        api({
            method: "get",
            url: "/install/currencies",
        }).then(res => {
            return res.data
        }).then(res => {
            setCurrencies(res.data?.currencies)
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
        <div className="col-12 col-lg-6 text-start p-2">
            <div className="header">
                <div className="title h3 m-0"><Lang>Business Infos</Lang> :</div>
            </div>
            <div className=" p-4">
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Name</Lang>* : {loading && <Spinner/>}</label>
                    <input type="text" required  disabled={loading} name="businessName"  className="form-control" placeholder={Lang({ children: "Tap Name" })}  id="" />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>ICE</Lang> : {loading && <Spinner/>}</label>
                    <input type="text"  disabled={loading} name="businessIce"  className="form-control" placeholder={Lang({ children: "Tap ice" })}  id="" />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Adresse</Lang> : {loading && <Spinner/>}</label>
                    <input type="text"  disabled={loading} name="businessAdresse"  className="form-control" placeholder={Lang({ children: "Tap adresse" })}  id="" />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Email</Lang> : {loading && <Spinner/>}</label>
                    <input type="text"  disabled={loading} name="businessEmail"  className="form-control" placeholder={Lang({ children: "Tap Email" })}  id="" />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                    <input type="text"  disabled={loading} name="businessPhone"  className="form-control" placeholder={Lang({ children: "Tap phone" })}  id="" />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Currency</Lang> : {loading && <Spinner />}</label>
                    <select name="currency"  disabled={loading} className="form-select">
                        {currencies?.map(item => {
                            return (
                                <option key={item.name} value={item.name}>{item.name}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner/>}</label>
                    <UploadImage loading={loading} image={getImageURL("")}/>
                </div>
            </div>
        </div>
    )
}