import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../../api/api";
import { Lang } from "../../../../assets/js/lang";
import { useAppAction, useAppState } from "../../../../context/context";
import { usePosAction, usePosState } from "../../../../context/posContext";

export function EditCartControlsButtons({handleClick}) {
    const posState = usePosState();
    const appAction = useAppAction();
    const appState = useAppState();
    const posAction = usePosAction();
    const navigate = useNavigate();
    const location = useLocation();
    const handleSave = () => {
        if (posState.purchaseCart.supplier == 0) {
            appAction({
                    type: "SET_ERROR",
                    payload: "Chose a supplier"
            })
            return true
        }
        posAction({
            type: "SEL_LOADING_PRODUCTS",
            payload:true,
        })
        posAction({
            type: "SET_LOADING",
            payload: true
        })
            api({
                method: 'POST',
                url: '/updatePurchase/'+posState.purchaseCart.editPurchase,
                data: posState.purchaseCart,
                withCredentials: true
            }).then(res => {
                appAction({
                    type: "SET_SUCCESS",
                    payload: res.data.message
                });
                posAction({
                    type: "INIT_PURCHASE_CART"
                })
                handleClick()
                posAction({
                    type: "SET_LOADING",
                    payload: false
                })
                //console.log(location.state?.from)
                
                if (!location.state) {
                    navigate(-1);
                } else {
                    navigate(location.state?.from);
                }
            }).catch(err => {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                posAction({
                    type: "SET_LOADING",
                    payload: false
                })
                posAction({
                    type: "SEL_LOADING_PRODUCTS",
                    payload:true,
                })
            })
    }
    const handleSavePrint = () => {
        if (posState.purchaseCart.supplier == 0) {
            appAction({
                    type: "SET_ERROR",
                    payload: "Chose a supplier"
            })
            return true
        }
        posAction({
            type: "SET_LOADING",
            payload: true
        })
        posAction({
            type: "SEL_LOADING_PRODUCTS",
            payload:true,
        })
            api({
                method: 'POST',
                url: '/updatePrintPurchase/'+posState.purchaseCart.editPurchase,
                data: posState.purchaseCart,
                withCredentials: true
            }).then(res => {
                appAction({
                    type: "SET_SUCCESS",
                    payload: res.data.message
                });
                posAction({
                    type: "INIT_PURCHASE_CART"
                })
                posAction({
                    type: "SET_LOADING",
                    payload: false
                })
                //generate pdf purchase invoice  
                const pdfBlob = atob(res.data.data); // Decode Base64
                const byteNumbers = new Array(pdfBlob.length);
                for (let i = 0; i < pdfBlob.length; i++) {
                    byteNumbers[i] = pdfBlob.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                // Create a URL for the PDF blob
                const url = window.URL.createObjectURL(blob);
                window.open(url, "_blanc")
                handleClick()
                if (!location.state) {
                    navigate(-1);
                } else {
                    navigate(location.state?.from);
                }
            }).catch(err => {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                posAction({
                    type: "SET_LOADING",
                    payload: false
                })
                posAction({
                    type: "SEL_LOADING_PRODUCTS",
                    payload:true,
                })
            })
    }
    if (posState.purchaseCart.cartItems.length === 0 || posState.loading) {
        return (
        <>
            <div className="col-6 text-center z-0">
                <button disabled  className="btn blueBtn"><Lang>Update</Lang></button>
            </div>
            <div className="col-6 text-center z-0">
                <button disabled className="btn grayBtn"><Lang>Update & Print</Lang></button>
            </div>
        </>
    )
    } else {
        return (
        <>
            <div className="col-6 text-center z-0">
                <button onClick={handleSave}  className="btn  blueBtn"><Lang>Update</Lang></button>
            </div>
            <div className="col-6 text-center z-0">
                <button onClick={handleSavePrint} className="btn grayBtn"><Lang>Update & Print</Lang></button>
            </div>
        </>
    )
    }
}