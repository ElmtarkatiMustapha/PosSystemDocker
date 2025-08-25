import { motion } from "framer-motion"
import api, { getImageURL } from "../../../api/api"
import { usePosAction, usePosState } from "../../../context/posContext"
import { useAppAction, useAppState } from "../../../context/context";
import { useState } from "react";
import { subDays } from "date-fns";
// eslint-disable-next-line react/prop-types
export function ProductItem({ id,codebar, name, Wprice, Rprice, discount, image, qnt }) {
    const posState = usePosState();
    const posAction = usePosAction();
    const appAction = useAppAction();
    const appState = useAppState();
    const [fetchedProduct, setFetchedProduct] = useState(0);
    const addToCart = () => {
        if (fetchedProduct === id) return true;
        let check = false;
        posAction({
            type: "SET_LOADING",
            payload: true
        })
        if (posState.cart.cartItems.length > 0) {
            //incriment qnt if product exist in the cart 
            for (let i = 0; i < posState.cart.cartItems.length; i++){
                if (posState.cart.cartItems[i].product.id === id) {
                    posAction({
                        type: "INC_QNT",
                        payload: id
                    })
                    check = true;
                    break;
                }
            }
        } else {
            //set loading false
            posAction({
                type: "SET_LOADING",
                payload: false
            })
        }
        //if not exist add it 
        if (!check) {
            //add to cart
            setFetchedProduct(id);
            api({
                method: "get",
                url: "/product/"+id,
                withCredentials: true
            }).then((res) => {
                return res.data
            }).then(res => {
                posAction({
                    type: "ADD_TO_CART",
                    payload: {
                        product: {
                            id:res.data.product.id,
                            codebar: res.data.product.barcode,
                            name: res.data.product.name,
                            retailPrice: res.data.product.retail_price,
                            wholesalePrice: res.data.product.wholesales_price,
                            discount: res.data.product.discount,
                            maxQnt:res.data.maxQnt, 
                        },
                        qnt: 1
                    }
                })
                if (res.data?.maxQnt < appState.settings?.alertSettings?.stock_alert && res.data?.maxQnt != -1) {
                    appAction({
                        type: "SET_WARNING",
                        payload: "stock less then "+ appState.settings?.alertSettings?.stock_alert
                    })
                }
                if (res.data?.product.expires) {
                    const date1 = new Date(res.data.product.expired_at).getTime();
                    const date2 = new Date().getTime();
                    const daysBetween = Math.round((date1 - date2) / (1000 * 3600 * 24)); 
                    if (daysBetween < appState.settings?.alertSettings?.stock_expiration && daysBetween > 0) {
                        appAction({
                            type: "SET_WARNING",
                            payload: "Product will expired near "
                        })
                    } else if (daysBetween <= 0) {
                        appAction({
                            type: "SET_ERROR",
                            payload: "Product expired !!"
                        })
                    }
                }
                //set loading false
                posAction({
                    type: "SET_LOADING",
                    payload: false
                })
                setFetchedProduct(0);
            }).catch(err => {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                //set loading false
                posAction({
                    type: "SET_LOADING",
                    payload: false
                })
                setFetchedProduct(0);
            })
            //set loading false
            posAction({
                type: "SET_LOADING",
                payload: false
            })
        } else {
            //set loading false
            posAction({
                type: "SET_LOADING",
                payload: false
            })
        }
    }
    return (
        <div style={appState.isMobile?{minWidth:"14rem"} : {
            minWidth: "14rem",
            maxWidth: "18rem"
        }} className="col p-2">
            <motion.div
                style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor:"pointer"
                }}
                className="elem container-fluid p-0 bg-white"
                whileTap={{ scale: 0.9 }}
                onClick={addToCart}
            >
                <div className="row m-0 p-0">
                    <div className="col-9 p-2">
                        <div style={{ fontSize: "smaller" }} className="barcode">{ codebar}</div>
                        <div style={{ fontSize: "small",fontWeight:"bold",WebkitLineClamp:1,overflow:"hidden",WebkitBoxOrient:"vertical",display:"-webkit-box" }}  className="title m-0">{name}</div>
                        <div style={{ fontSize: "small" }} className="price">P.R {discount > 0 ? <del>{Number(Rprice).toFixed(2)}{appState.settings?.businessInfo?.currency?.symbol}</del>:""} {Number(Rprice -(discount*Rprice/100)).toFixed(2) }{appState.settings?.businessInfo?.currency?.symbol}</div>
                        <div style={{ fontSize: "small" }} className="price">P.W {discount > 0 ? <del>{Number(Wprice).toFixed(2)}{appState.settings?.businessInfo?.currency?.symbol}</del>:""} {Number(Wprice -(discount*Wprice/100)).toFixed(2)}{appState.settings?.businessInfo?.currency?.symbol}</div>
                    </div>
                    <div
                        style={{
                            borderRadius: "50px 0px  0px 50px",
                            overflow: "hidden",
                            backgroundImage: "url("+getImageURL(image)+")",
                            backgroundPosition: "center",
                            backgroundSize:"cover"
                        }}
                        className="col-3 p-0 m-0 bg-dark">
                        {qnt > 0 ? 
                            <div style={{
                                alignContent: "center",
                                backgroundColor:"#00000059"
                            }} className="w-100 h-100 text-center">
                                <span style={{color:"white"}} className="qnt h4">{qnt}</span>
                            </div>
                        : "" }
                    </div>
                </div>
            </motion.div>
        </div>
    )
}