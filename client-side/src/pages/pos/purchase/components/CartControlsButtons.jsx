import api from "../../../../api/api";
import { Lang } from "../../../../assets/js/lang";
import { useAppAction } from "../../../../context/context";
import { usePosAction, usePosState } from "../../../../context/posContext"

export function CartControlsButtons() {
    const posState = usePosState();
    const appAction = useAppAction();
    const posAction = usePosAction();
    const handleSave = () => {
        if (posState.purchaseCart.supplier == 0) {
            appAction({
                    type: "SET_ERROR",
                    payload: "Chose a supplier"
            })
            return true
        }
        appAction({
            type: "SET_LOADING",
            payload: true
        })
            api({
                method: 'POST',
                url: '/savePurchase',
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
                //set loading
                posAction({
                    type: "SEL_LOADING_PRODUCTS",
                    payload: true
                })
                //reload product
                loadProduct();
                //handle return
                appAction({
                    type: "SET_LOADING",
                    payload: false
                })
            }).catch(err => {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                appAction({
                    type: "SET_LOADING",
                    payload: false
                })
            })
        
    }
    const loadProduct = () => {
        api({
            method: "get",
            url: "/products",
            // withCredentials:true
            }).then(res => {
                return res.data;
            }).then(res => {
                const data = res.data;
                posAction({ type: "SET_ALL_PRODUCTS", payload: data });
                    posAction({
                        type: "SET_CATEGORY_PRODUCTS",
                        payload: data
                    })
                    posAction({type:"SET_NUMBER_PAGES",payload: Math.ceil(data.length / posState.productsPerPage)})
                    posAction({ 
                        type: "SET_CURRENT_PRODUCTS",
                        payload: 
                            data.slice(
                                (posState.currentPage - 1) * posState.productsPerPage,
                                posState.currentPage * posState.productsPerPage
                            )
                    })
                    posAction({
                        type: "SEL_LOADING_PRODUCTS",
                        payload: false
                    })
            }).catch(err => {
                appAction({
                    type: "SET_ERROR",
                    payload: err
                })
                posAction({
                    type: "SEL_LOADING_PRODUCTS",
                    payload: false
                })
            })
    }
    const handleSavePrint = () => {
        return null
    }
    if (posState.purchaseCart.cartItems.length === 0) {
        return (
        <>
            <div className="col-6 text-center z-0">
                <button disabled  className="btn blueBtn"><Lang>Save</Lang></button>
            </div>
            <div className="col-6 text-center z-0">
                <button disabled className="btn grayBtn"><Lang>Save & Print</Lang></button>
            </div>
        </>
    )
    } else {
        return (
        <>
            <div className="col-6 text-center z-0">
                <button onClick={handleSave}  className="btn  blueBtn"><Lang>Save</Lang></button>
            </div>
            <div className="col-6 text-center z-0">
                <button onClick={handleSavePrint} className="btn grayBtn"><Lang>Save & Print</Lang></button>
            </div>
        </>
    )
    }
}