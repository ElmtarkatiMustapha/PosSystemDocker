import { useRef } from "react";
import { Lang } from "../../../assets/js/lang"
import { Spinner } from "../../../components/Spinner"

export function PosPart({loading}){
    return(
        <div className="col-12 col-lg-6 text-start p-2">
            <div className="header">
                <div className="title h3 m-0"><Lang>Pos Settings</Lang> :</div>
            </div>
            <div className=" p-4">
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Default TVA</Lang> : {loading && <Spinner/>}</label>
                    <input type="number" required  disabled={loading} name="tva" min={0} max={100} defaultValue={0} className="form-control" placeholder={Lang({ children: "Tap TVA" })}  />
                </div>
                <div className="mb-3">
                    <label className="form-label h5"><Lang>Product per page</Lang> : {loading && <Spinner/>}</label>
                    <input type="number" required  disabled={loading} name="productPerPage"   className="form-control" defaultValue={20} placeholder={Lang({ children: "Tap product per page" })} />
                </div>
            </div>
        </div>
    )
}