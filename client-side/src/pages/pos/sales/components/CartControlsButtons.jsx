import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";
import { Lang } from "../../../../assets/js/lang";
import { useAppAction, useAppState } from "../../../../context/context";
import { usePosAction, usePosState } from "../../../../context/posContext";


export function CartControlsButtons({handleClick=()=>null}) {
    const posState = usePosState();
    const posAction = usePosAction();
    const appState = useAppState();
    const appAction = useAppAction();
    const navigate = useNavigate();
    const handleSave = () => {
        posAction({
            type: "SET_LOADING",
            payload: true
        })
        api({
            method: 'POST',
            url: 'updateOrder/'+posState.cart.editOrder,
            data: posState.cart,
            withCredentials: true
        }).then(res => {
            appAction({
                type: "SET_SUCCESS",
                payload: res.data.message
            });
            posAction({
                type: "INIT_CART"
            })
            posAction({
                type: "SET_LOADING",
                payload: false
            })
            handleClick()
            //navigate to sales page
            navigate(-1)
            //handle return 
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            posAction({
                type: "SET_LOADING",
                payload: false
            })
        })
    }
    const handleSavePrint = () => {
        posAction({
            type: "SET_LOADING",
            payload: true
        })
        api({
            method: 'POST',
            url: '/updateOrderPrint/'+posState.cart.editOrder,
            data: posState.cart,
            withCredentials: true
        }).then(res => {
            appAction({
                type: "SET_SUCCESS",
                payload: res.data.message
            });
            posAction({
                type: "INIT_CART"
            })
            //set loading
            posAction({
                type: "SEL_LOADING_PRODUCTS",
                payload: true
            })
            posAction({
                type: "SET_LOADING",
                payload: false
            })
            handleClick()
            if(appState.currentUser.cashier == 0){
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
            }
            //navigate sales page
            navigate(-1)
            //handle return 
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            posAction({
                type: "SET_LOADING",
                payload: false
            })
        })
    }
    if (posState.cart.cartItems.length === 0 || posState.loading) {
        return (
        <>
            <div className="col-6 text-center z-0">
                <button  disabled  className="btn blueBtn"><Lang>Update</Lang></button>
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
