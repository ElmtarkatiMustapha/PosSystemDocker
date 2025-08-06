import { useEffect, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { ReturnDataTable } from "./ReturnDataTable";
import { PrimaryButton } from "../../../../components/primaryButton";
import api from "../../../../api/api";
import { useAppAction } from "../../../../context/context";

export function EditModal({ state, action }) {
    const [loading, setLoading] = useState(true);
    const [allItems, setAllItems] = useState([]);
    const appAction = useAppAction();
    //handle submit
    const handleSubmit = (e) => {
        /**
         * @todo
         */
        e.preventDefault()
        setLoading(true)
        api({
            method: "post",
            url: "/return/"+state.editItem,
            data: {
                details_returns :state.selectedItems
            },
            // withCredentials:true
        }).then(res=>{
            return res.data
        }).then(res => {
            //respons server
            setLoading(true)
            action({
                type: "RELOAD_DATA"
            });
            appAction({
                type: "SET_SUCCESS",
                payload: res?.message
            })
            handleClose()
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false);
        })
    }
    //handle close
    const handleClose = () => {
        action({
            type: "SET_EDIT_ITEM",
            payload: 0
        })
        action({
            type: "TOGGLE_EDIT_MODAL",
            payload: false
        })
    }
    /**
     * @desc get the data of sale return from the server
     * @param {Integer} returnSaleId
     * @return {details_returns}
     */
    useEffect(() => {
        api({
            method: "get",
            url: "returnToEdit/" + state.editItem,
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
            console.log(res.data)
            setAllItems(res.data)
            setLoading(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false);
            handleClose();
        })
    },[])
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Sale Return</Lang> :</div>
                            <div className="sub-title"><Lang>Select products returned</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <ReturnDataTable state={state} action={action} loading={loading} allItems={allItems} />
                    </div>
                    <div className="modal-footer">
                        <PrimaryButton label={"Save"} handleClick={()=>null} disabled={loading} type={"submit"} />
                    </div>
                </form>
            </div>
        </div>
    )
}