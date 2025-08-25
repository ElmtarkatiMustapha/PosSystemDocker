import { Lang } from "../../assets/js/lang";
import { usePosAction, usePosState } from "../../context/posContext";
import { Paginate } from "./components/Paginate";
import { ProductsList } from "./components/ProductsList";
import { Cart } from "./components/Cart";
import api from "../../api/api";
import { useEffect, useRef, useState } from "react";
import { useAppAction, useAppState } from "../../context/context";
import { MobileCategorySidebar } from "./components/mobile/MobileCategorySidebar";
import { CategorySidebar } from "../../components/CategorySidebar";
import { motion } from "framer-motion";

export function MainPos() {
    const posState = usePosState(); 
    const posAction = usePosAction();
    const appAction = useAppAction();
    const appState = useAppState(); 
    const searchRef = useRef(null); 
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const variantsContent = {
        open: {
            width: "calc(100% - 15rem)",
        },
        close: {
            width: "100%",
        }
    }

    useEffect(() => {
        posAction({
            type: "INIT_CART"
        })
    },[])
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
                url: "/searchProduct/"+value,
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
                    if (posState.cart.cartItems.length > 0) {
                        //incriment qnt if product exist in the cart 
                        for (let i = 0; i < posState.cart.cartItems.length; i++){
                            if (posState.cart.cartItems[i].product.id === res.products[0].id) {
                                posAction({
                                    type: "INC_QNT",
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
                            type: "ADD_TO_CART",
                            payload: {
                                product: {
                                    id:res.products[0].id,
                                    codebar: res.products[0].barcode,
                                    name: res.products[0].name,
                                    retailPrice: res.products[0].retail_price,
                                    wholesalePrice: res.products[0].wholesales_price,
                                    discount: res.products[0].discount,
                                    maxQnt:res.products[0].maxQnt, 
                                },
                                qnt: 1
                            }
                        })
                    }
                    if (res.products[0].maxQnt < appState.settings?.alertSettings?.stock_alert && res.products[0].maxQnt != -1) {
                        appAction({
                            type: "SET_WARNING",
                            payload: "stock less then "+ appState.settings?.alertSettings?.stock_alert
                        })
                    }
                    if (res.products[0].expires) {
                        const date1 = new Date(res.products[0].expired_at).getTime();
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
                    //clear search input
                    posAction({
                        type: "SET_LOADING",
                        payload: false
                    })
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
                        payload: "Out of Stock"
                    })
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
    const handleCategories = () => {
        setCategoriesOpen(!categoriesOpen);
    }
    useEffect(()=>{
        if(!posState.loading){
            searchRef.current.select();
        }
    },[posState.loading])
    
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
                                        <Cart/>
                                    </div>
                                }
                                
                            </div>
                        </div>
                    {/* routes */}
                </motion.div>
            </main>
        </>
        )
}




