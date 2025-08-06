import api from "../../../api/api";
import { Lang } from "../../../assets/js/lang";
import { useAppAction } from "../../../context/context";
import { usePosAction, usePosState } from "../../../context/posContext";
import printJS from "print-js"

export function CartControlsButtons({handleClick=()=>null}) {
    const posState = usePosState();
    const posAction = usePosAction();
    const appAction = useAppAction();
    const handleSave = () => {
        posAction({
            type: "SEL_LOADING_PRODUCTS",
            payload: true
        })
        posAction({
            type: "SET_LOADING",
            payload: true
        })
        api({
            method: 'post',
            url: '/saveOrder',
            data: posState.cart,
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            appAction({
                type: "SET_SUCCESS",
                payload: res.data.message
            });
            posAction({
                type: "INIT_CART"
            })
            //set loading
            handleClick()
            //reload product
            loadProduct();
            posAction({
                type: "SET_LOADING",
                payload: false
            })
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
            posAction({
                type: "SEL_LOADING_PRODUCTS",
                payload: false
            })
        })
    }
    const handleSavePrint = () => {

        posAction({
            type: "SEL_LOADING_PRODUCTS",
            payload: true
        })
        posAction({
            type: "SET_LOADING",
            payload: true
        })
        api({
            method: 'post',
            url: '/saveOrderPrint',
            data: posState.cart,
            withCredentials: true
        }).then(res => {
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
            // // Clean up
            appAction({
                type: "SET_SUCCESS",
                payload: "Order add with success"
            });
            posAction({
                type: "INIT_CART"
            })
            posAction({
                type: "SET_LOADING",
                payload: false
            })
            handleClick()
            //reload product
            loadProduct();
        }).catch(err => {
            posAction({
                type: "SEL_LOADING_PRODUCTS",
                payload: false
            })
            posAction({
                type: "SET_LOADING",
                payload: false
            })
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
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
    if (posState.cart.cartItems.length === 0 || posState.loading) {
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
