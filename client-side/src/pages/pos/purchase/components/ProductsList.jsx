import { useEffect } from "react";
import api from "../../../../api/api";
import { usePosAction, usePosState } from "../../../../context/posContext";
import { ProductsListLoading } from "../../components/ProductsListLoading";
import { ProductItem } from "./ProductItem";
import { useAppAction } from "../../../../context/context";

export function ProductsList() {
    const posState = usePosState();
    const posAction = usePosAction();
    const appAction = useAppAction();
    const loadProduct = () => {
        return new Promise((resolve, reject) => {
            api({
            method: "get",
            url: "/products",
            // withCredentials:true
            }).then(res => {
                return res.data;
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        });
    }
    useEffect(() => {
        /**
         * 1-load data
         * 2-calculate all variable 
         */
        loadProduct()
            .then(data => {
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
            })
            .catch(err => {
                appAction({
                    type: "SET_ERROR",
                    payload: err
                })
                posAction({
                    type: "SEL_LOADING_PRODUCTS",
                    payload: false
                })
            })
        

    }, []);
    useEffect(() => {
        posAction({ 
                type: "SET_CURRENT_PRODUCTS",
                payload: 
                    posState.categoryProducts.slice(
                        (posState.currentPage - 1) * posState.productsPerPage,
                        posState.currentPage * posState.productsPerPage
                    )
                
            })
    }, [posState.currentPage]);
    useEffect(() => {
        posAction({type:"SET_NUMBER_PAGES",payload: Math.ceil(posState.categoryProducts.length / posState.productsPerPage)})
        posAction({ 
            type: "SET_CURRENT_PRODUCTS",
            payload: 
                posState.categoryProducts.slice(
                    (posState.currentPage - 1) * posState.productsPerPage,
                    posState.currentPage * posState.productsPerPage
                )
            
        })
        
    }, [posState.categoryProducts])
    return (
        posState.loadingProduct ? <ProductsListLoading/>:
        posState.currentProducts?.map((product) => {
            //get the quantity
            var qnt
            if (posState.purchaseCart.cartItems.length > 0) {
                for (let i = 0; i < posState.purchaseCart.cartItems.length; i++){
                    if (posState.purchaseCart.cartItems[i].product.codebar === product.barcode) {
                        qnt = posState.purchaseCart.cartItems[i].qnt;
                        break;
                    }
                }
            } else {
                qnt = 0;
            }
            return ( 
                <ProductItem key={product.id} id={product.id} codebar={product.barcode} name={product.name} Rprice={product.retail_price} Wprice={product.wholesales_price} discount={product.discount} image={product.picture} qnt={qnt} />
            )
        })
    )
}