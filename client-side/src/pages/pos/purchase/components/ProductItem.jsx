import { getImageURL } from "../../../../api/api";
import { motion } from "framer-motion";
import { useAppState } from "../../../../context/context";
import { usePosAction, usePosState } from "../../../../context/posContext";
import { useEffect } from "react";
export function ProductItem({ id, codebar, name, Wprice, Rprice, discount, image, qnt }) {
    const appState = useAppState();
    const posAction = usePosAction();
    const posState = usePosState();
    
    const addToCart = () => {
        let check = false;
        posAction({
            type: "SET_LOADING",
            payload: true
        })
        if (posState.purchaseCart.cartItems.length > 0) {
            //incriment qnt if product exist in the cart 
            for (let i = 0; i < posState.purchaseCart.cartItems.length; i++){
                if (posState.purchaseCart.cartItems[i].product.id === id) {
                    posAction({
                        type: "INC_PURCHASE_QNT",
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
            // setFetchedProduct(id);
            for (let item of posState.allProducts) {
                if (id == item.id) {
                    posAction({
                        type: "ADD_TO_PURCHASE_CART",
                        payload: {
                            product: {
                                id:item.id,
                                codebar: item.barcode,
                                name: item.name,
                                retailPrice: item.retail_price,
                                wholesalePrice: item.wholesales_price,
                                discount: item.discount,
                                purchasePrice: 0,
                                stocks:item.stocks, 
                            },
                            qnt: 1
                        }
                    })
                    //set loading false
                    posAction({
                        type: "SET_LOADING",
                        payload: false
                    })
                    break;
                }
            }
            
            
            //set loading false
            posAction({
                type: "SET_LOADING",
                payload: false
            })
            // api({
            //     method: "get",
            //     url: "/product/"+id,
            //     withCredentials: true
            // }).then((res) => {
            //     return res.data
            // }).then(res => {
            //     posAction({
            //         type: "ADD_TO_CART",
            //         payload: {
            //             product: {
            //                 id:res.data.product.id,
            //                 codebar: res.data.product.barcode,
            //                 name: res.data.product.name,
            //                 retailPrice: res.data.product.retail_price,
            //                 wholesalePrice: res.data.product.wholesales_price,
            //                 discount: res.data.product.discount,
            //                 maxQnt:res.data.maxQnt, 
            //             },
            //             qnt: 1
            //         }
            //     })
            //     //set loading false
            //     posAction({
            //         type: "SET_LOADING",
            //         payload: false
            //     })
            //     setFetchedProduct(0);
            // }).catch(err => {
            //     appAction({
            //         type: "SET_ERROR",
            //         payload: err?.response?.data?.message
            //     })
            //     //set loading false
            //     posAction({
            //         type: "SET_LOADING",
            //         payload: false
            //     })
            //     setFetchedProduct(0);
            // })
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
        <div key={id} style={appState.isMobile?{minWidth:"14rem"} : {
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
                        <div style={{ fontSize: "small" }} className="price">P.R {discount > 0 ? <del>{Number(Rprice).toFixed(2)}dh</del>:""} {Number(Rprice -(discount*Rprice/100)).toFixed(2) }dh</div>
                        <div style={{ fontSize: "small" }} className="price">P.W {discount > 0 ? <del>{Number(Wprice).toFixed(2)}dh</del>:""} {Number(Wprice -(discount*Wprice/100)).toFixed(2)}dh</div>
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
