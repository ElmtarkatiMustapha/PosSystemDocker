import { useEffect, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import DataTable from "react-data-table-component";
import { useAppAction, useAppState } from "../../../../context/context";
import { CustomLoader } from "../../../../components/CustomLoader";
import api from "../../../../api/api";
/**
 * 
 * @param {Array} state 
 * @param {function} action 
 * @returns {XSJ}
 * @todo get retun data
 * @todo set data in allItems state
 */
export function ViewModal({ state, action }) {
    const [allItems, setAllItems] = useState();
    const [loading, setLoading] = useState(true);
    const appState = useAppState();
    const appAction = useAppAction();
    const columns = [
        {
            name: Lang({ children: "id" }),
            selector: row => row.id,
            sortable: true,
        },
        {
            name: Lang({ children: "Barcode" }),
            selector: row => row.barcode,
            sortable: true
        },
        {
            name: Lang({ children: "Product" }),
            selector: row => row.product,
            sortable: true
        },
        {
            name: Lang({ children: "Return Qnt" }),
            selector: row => row.return_qnt,
            sortable: true
        },
        {
            name: Lang({ children: "Discount" }),
            selector: row => row.discount,
            sortable: true
        },
        {
            name: Lang({ children: "U.P" }),
            selector: row => row.price,
            sortable: true
        },
        {
            name: Lang({ children: `Total(${appState.settings.businessInfo.currency.symbol})` }),
            selector: row => Number(Number(row.total).toFixed(2)),
            sortable: true
        }
    ]
    //handle close function 
    const handleClose = () => {
        action({
            type: "SET_VIEW_ITEM",
            payload: 0
        })
        action({
            type: "TOGGLE_VIEW_MODAL",
            payload: false
        })
    }
    useEffect(() => {
        //get sale data
        api({
            method: "get",
            url: "return/" + state.viewItem,
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
            setAllItems(res.data)
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
                <form className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Sale Return</Lang> :</div>
                            <div className="sub-title"><Lang>Select products returned</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <DataTable
                            columns={columns}
                            data={allItems}
                            customStyles={appState.tableStyle}
                            pagination
                            progressPending={loading}
                            progressComponent={<CustomLoader />}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}