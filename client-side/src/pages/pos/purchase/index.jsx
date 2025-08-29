import { motion } from "framer-motion"
import { useAppAction, useAppState } from "../../../context/context"
import { useEffect, useRef, useState } from "react";
import { MobileCategorySidebar } from "../components/mobile/MobileCategorySidebar";
import { CategorySidebar } from "../../../components/CategorySidebar";
import { usePosAction, usePosState } from "../../../context/posContext";
import api from "../../../api/api";
import { Lang } from "../../../assets/js/lang";
import { Cart } from "./components/Cart";
import { ProductsList } from "./components/ProductsList";
import { Paginate } from "../components/Paginate";
import { CartControlsButtons } from "../components/CartControlsButtons";
export function Purchase() {
    const appState = useAppState();
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const posAction = usePosAction();
    const posState = usePosState();
    const searchRef = useRef();
    const appAction = useAppAction();
    const variantsContent = {
        open: {
            width: "calc(100% - 15rem)",
        },
        close: {
            width: "100%",
        }
    }
    const handleCategories = () => {
         setCategoriesOpen(!categoriesOpen);
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        //start search
        const value = searchRef.current.value
        if (String(value).trim().length !== 0) {
            //set loading 
            posAction({
                type: "SET_LOADING",
                payload: true
            })
            api({
                method: "get",
                url: "/searchPurchaseProduct/"+value,
                withCredentials: true
            }).then(res => {
                return res.data;
            }).then(res => {
                if (res.products.length === 1) {
                    /*
                    *add to cart if not exist in the cart
                    *clear search input
                    */
                    let check = false;
                    if (posState.purchaseCart.cartItems.length > 0) {
                        //incriment qnt if product exist in the cart 
                        for (let i = 0; i < posState.purchaseCart.cartItems.length; i++){
                            if (posState.purchaseCart.cartItems[i].product.id === res.products[0].id) {
                                posAction({
                                    type: "INC_PURCHASE_QNT",
                                    payload: res.products[0].id
                                })
                                check = true;
                                break;
                            }
                        }
                    }
                    //add to cart if not
                    if (!check) {
                        posAction({
                        type: "ADD_TO_PURCHASE_CART",
                        payload: {
                            product: {
                                id:res.products[0].id,
                                codebar: res.products[0].barcode,
                                name: res.products[0].name,
                                retailPrice: res.products[0].retail_price,
                                wholesalePrice: res.products[0].wholesales_price,
                                discount: res.products[0].discount,
                                purchasePrice: 0,
                                stocks:res.products[0].stocks, 
                            },
                            qnt: 1
                        }
                    })
                    }
                    //clear search input
                    searchRef.current.value = ""
                    appAction({
                        type: "SET_SUCCESS",
                        payload: "product Add"
                    })
                } else if (res.products.length > 1) {
                    //if products
                    const filterData = posState.allProducts.filter((item) => {
                        const found = res.products.find((elem) => elem.id ==item.id)
                        return item.id === found?.id
                    })
                    posAction({
                        type: "SET_CATEGORY_PRODUCTS",
                        payload: filterData
                    })
                } else {
                    appAction({
                        type: "SET_ERROR",
                        payload: "none product mutch"
                    })
                    searchRef.current.select();
                }
                posAction({
                    type: "SET_LOADING",
                    payload: false
                })
            }).catch(err => {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                searchRef.current.select();
                posAction({
                    type: "SET_LOADING",
                    payload: false
                })
            })
        } else {
            posAction({
                type: "SET_CATEGORY_PRODUCTS",
                payload: posState.allProducts
            })
        }
    }
    useEffect(() => {
        posAction({
            type: "INIT_PURCHASE_CART"
        })
    },[])
    return (
        <>
            {appState.isMobile && <MobileCategorySidebar />}
            {!appState.isMobile && <CategorySidebar handle={handleCategories} isOpen={categoriesOpen} />}
            <main style={{height:"100vh"}} className="w-100 text-end">
                <motion.div
                    style={{
                        marginTop:"4.5rem"
                    }}
                    variants={variantsContent}
                    animate={categoriesOpen ? "open" : "close"}
                    className="text-start d-inline-block"
                >
                    <div className="container-fluid ps-2">
                            <div className="row">
                                <div className={ appState.isMobile ? "col-12":"col-7" }>
                                    <div className="container-fluid ">
                                        <div className="row">
                                            <form onSubmit={handleSubmit} className="col-12">
                                                <input ref={searchRef} autoFocus disabled={posState.loading} className="form-control form-control-lg" type="text" placeholder={Lang({children:"Search for products"})} aria-label=".form-control-lg example"/>
                                            </form>
                                        </div>
                                        <div className="row m-0 pt-2 pb-2">
                                            <ProductsList />
                                        </div>
                                        <div className="row m-0 p-2">
                                            {posState.numberPages > 1 && <Paginate/>} 
                                        </div>
                                    </div>
                            </div>
                            {!appState.isMobile &&
                                <div className="col-5">
                                    <Cart CartControlsButtons={<CartControlsButtons/>} />
                                </div>
                            }
                            </div>
                        </div>
                </motion.div>
            </main>
        </>
    )
}