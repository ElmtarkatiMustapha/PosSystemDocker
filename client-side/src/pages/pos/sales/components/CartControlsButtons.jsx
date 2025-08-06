import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";
import { Lang } from "../../../../assets/js/lang";
import { useAppAction } from "../../../../context/context";
import { usePosAction, usePosState } from "../../../../context/posContext";


export function CartControlsButtons() {
    const posState = usePosState();
    const posAction = usePosAction();
    const appAction = useAppAction();
    const navigate = useNavigate();
    const handleSave = () => {
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
            //navigate to sales page
            navigate(-1)
            //handle return 
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
        })
    }
    const handleSavePrint = () => {
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
            //navigate sales page
            //handle return 
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
        })
    }
    if (posState.cart.cartItems.length === 0) {
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
