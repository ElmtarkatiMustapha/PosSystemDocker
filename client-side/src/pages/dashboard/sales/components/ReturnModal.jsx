import { useEffect, useState } from "react"
import { PrimaryButton } from "../../../../components/primaryButton"
import { Lang } from "../../../../assets/js/lang";
import { useSalesAction, useSalesState } from "../../../../context/salesContext";
import { ReturnDataTable } from "./ReturnDataTable";
import { useAppAction } from "../../../../context/context";
import api from "../../../../api/api";

export function ReturnModal() {
    const [loading, setLoading] = useState(true);
    const [allItems, setAllItems] = useState([]);
    const salesAction = useSalesAction();
    const salesState = useSalesState();
    const appAction = useAppAction();
    /**
     * @desc this function submit the retun data to the server
     * @return success message or error message
     */
    const handleSubmit = (e) => {
        //submit modal
        e.preventDefault()
        setLoading(true)
        api({
            method: "post",
            url: "/saveReturn/"+salesState.returnSaleId,
            data: {
                details_returns :salesState.selectedItems
            },
            // withCredentials:true
        }).then(res=>{
            return res.data
        }).then(res => {
            //respons server
            setLoading(true)
            salesAction({
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
    /**
     * @desc close the modal by changing the state of modal
     */
    const handleClose = () => {
        salesAction({
            type: "TOGGLE_RETURN_MODAL",
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
            url: "saleReturn/" + salesState.returnSaleId,
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
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
                        <ReturnDataTable loading={loading} allItems={allItems} />
                    </div>
                    <div className="modal-footer">
                        <PrimaryButton label={"Save"} handleClick={()=>null} disabled={loading} type={"submit"} />
                    </div>
                </form>
            </div>
        </div>
    )
}