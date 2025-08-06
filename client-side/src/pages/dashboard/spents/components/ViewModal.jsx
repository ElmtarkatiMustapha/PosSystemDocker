import { useEffect, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { useSpentsAction, useSpentsState } from "../../../../context/spentsContext";

export function ViewModal() {
    const [item, setItem] = useState();
    const spentsAction = useSpentsAction();
    const spentsState = useSpentsState();
    const handleClose = () => {
        spentsAction({
            type: "TOGGLE_VIEW_MODAL",
            payload: false,
        });
    }
    useEffect(() => {
        spentsState.allItems.map((elem) => {
            if (elem.id == spentsState.currentItem) {
                setItem(elem);
            }
        })
    },[])
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>View Spent </Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Title</Lang> : </label>
                            <input type="text" required  disabled={true} name="title"  className="form-control" placeholder={Lang({ children: "Tap Title" })} defaultValue={item?.title}  id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Amount</Lang> : </label>
                            <input type="number" step={0.1}  disabled={true} name="amount"  className="form-control" placeholder={Lang({ children: "Tap Amount" })} defaultValue={item?.amount} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Description</Lang> : </label>
                            <textarea name="description" disabled={true} className="form-control" placeholder={Lang({ children:"No description"})} defaultValue={item?.description}  id=""></textarea>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
    )
}