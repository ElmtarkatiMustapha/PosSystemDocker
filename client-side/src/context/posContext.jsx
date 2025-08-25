/**
 * create StatePosContext
 * create ActionPosContext
 * define reducer function
 * set initial state
 * set main PosContext
 * create hooks
 */

import { createContext, useContext, useReducer } from "react";
import api from "../api/api";


//Contexts
const StatePosContext = createContext();
const ActionPosContext = createContext();

//reducer function

const reducer = (state,action) => {
    //actions
    //set current page 
    if (action.type === "SET_CURRENT_PAGE") {
        if (action.payload <= 0) {
            return {
                ...state,
                currentPage: 1,
            }
        } else {
            return {
                ...state,
                currentPage: action.payload > state.numberPages ? state.numberPages:action.payload
            }
        }
    }
    //incriment current page
    if (action.type === "INC_CURRENT_PAGE") {
        return {
            ...state,
            currentPage: state.currentPage>=state.numberPages? state.currentPage: state.currentPage+1 
        }
    }
    //decriment current page
    if (action.type === "DEC_CURRENT_PAGE") {
        return {
            ...state,
            currentPage: state.currentPage<=1? 1: state.currentPage-1
        }
    }
    //set All Product
    if (action.type === "SET_ALL_PRODUCTS") {
        return {
            ...state,
            allProducts: action.payload
        }
    }
    //set products to load
    if (action.type === "SET_CATEGORY_PRODUCTS") {
        console.log(action.payload);
        return {
            ...state,
            categoryProducts: action.payload
        }
    }
    //set product to show
    if (action.type === "SET_CURRENT_PRODUCTS") {
        return {
            ...state,
            currentProducts : action.payload
        }
    }
    //set number of pages
    if (action.type === "SET_NUMBER_PAGES") {
        return {
            ...state,
            numberPages: action.payload
        }
    }
    //set Products per page
    if (action.type === "SET_PRODUCTS_PER_PAGE") {
        return {
            ...state,
            productsPerPage: action.payload
        }
    }
    //change the order type
    if (action.type === "TOGGLE_ORDER_TYPE") {
        return {
            ...state,
            cart: {
                ...state.cart,
                orderType: action.payload
            }
        }
    }
    //remove product from cart
    if (action.type === "REMOVE_PRODUCT") {
        return {
            ...state,
            cart: {
                ...state.cart,
                cartItems: state.cart.cartItems.filter((item)=>item.product.id!=action.payload)
            }
        }
    }
    //increment quantity
    if (action.type === "INC_QNT") {
        return {
            ...state,
            cart: {
                ...state.cart,
                cartItems: state.cart.cartItems.map((item) => {
                    if (item.product.id === action.payload && (item.qnt < item.product.maxQnt || item.product.maxQnt == -1 )) {
                        return {
                            ...item,
                            qnt: item.qnt+1
                        }
                    }
                    return item;
                })
            }
        }
    }
    //decriment quantity
    if (action.type === "DEC_QNT") {
        return {
            ...state,
            cart: {
                ...state.cart,
                cartItems: state.cart.cartItems.map((item) => {
                    if (item.product.id === action.payload && item.qnt > 1) {
                        return {
                            ...item,
                            qnt: item.qnt-1
                        }
                    }
                    
                    return item;
                })
            }
        }
    }
    //change QNT
    if (action.type === "SET_QNT") {
        return {
            ...state,
            cart: {
                ...state.cart,
                cartItems: state.cart.cartItems.map((item) => {
                    if (item.product.id === action.payload.id) {
                        if (action.payload.qnt < 1) {
                            return {
                                ...item,
                                qnt: 1
                            }
                        } else if (item.product.maxQnt == -1) {
                            return {
                                ...item,
                                qnt: action.payload.qnt
                            }
                        }else if (action.payload.qnt > item.product.maxQnt) {
                            return {
                                ...item,
                                qnt: item.product.maxQnt
                            }
                        } else {
                            return {
                                ...item,
                                qnt: action.payload.qnt
                            }
                        }
                    }
                    return item;
                })
            }
        }
    }
    //change discount
    if (action.type === "SET_DISCOUNT") {
        return {
            ...state,
            cart: {
                ...state.cart,
                cartItems: state.cart.cartItems.map((item) => {
                    if (item.product.id === action.payload.id) {
                        if (action.payload.discount < 0) {
                            return {
                                ...item,
                                product: {
                                    ...item.product,
                                    discount: 0
                                }
                            }
                        } else if (action.payload.discount > 100) {
                            return {
                                ...item,
                                product: {
                                    ...item.product,
                                    discount: 100
                                }
                            }
                        } else {
                            return {
                                ...item,
                                product: {
                                    ...item.product,
                                    discount: action.payload.discount
                                }
                            }
                        }
                    }
                    return item;
                })
            }
        }
    }
    //set amount provided
    if (action.type === "SET_AMOUNT_PROVIDED") {
        return {
            ...state,
            cart: {
                ...state.cart,
                amountProvided: action.payload > 0 ? action.payload : 0
            }
        }
    }
    //set sector
    if (action.type === "SET_SECTORS") {
        return {
            ...state,
            sectors: action.payload
        }
    }
    //set customers
    if (action.type === "SET_CUSTOMERS") {
        return {
            ...state,
            customers: action.payload
        }
    }
    //set current customer
    if (action.type === "SET_CURRENT_CUSTOMERS") {
        return {
            ...state,
            currentCustomers: action.payload
        }
    }
    //set selected customer
    if (action.type === "SET_SELECTED_CUSTOMER") {
        return {
            ...state,
            cart: {
                ...state.cart,
                customer: action.payload
            }
        }
    }
    //set categories
    if (action.type === "SET_CATEGORIES") {
        return {
            ...state,
            allCategories: action.payload
        }
    }
    //add to cart
    // if (action.type === "ADD_TO_CART") {
    //     let array = state.cart.cartItems;
    //     array.push(action.payload);
    //     return {
    //         ...state,
    //         cart: {
    //             ...state.cart,
    //             cartItems: array
    //         }
    //     }
    // }
    if (action.type === "ADD_TO_CART") {
    return {
        ...state,
        cart: {
        ...state.cart,
        cartItems: [...state.cart.cartItems, action.payload] // ✅ new array
        }
    };
    }
    //toggle loading
    if (action.type === "SET_LOADING") {
        return {
            ...state,
            loading: Boolean(action.payload)
        }
    }
    //init cart 
    if (action.type === "INIT_CART") {
        return {
            ...state,
            cart: {
                ...state.cart,
                cartItems: [],
                amountProvided: 0,
                tax: state.cart.tax,
                editOrder: 0,
            }
        }
    }
    //set TVA 
    if (action.type === "SET_TAX") {
        return {
            ...state,
            cart: {
                ...state.cart,
                tax: action.payload
            }
        }
    }
    //init purchase cart 
    if (action.type === "INIT_PURCHASE_CART") {
        return {
            ...state,
            purchaseCart: {
                ...state.purchaseCart,
                cartItems: [],
            }
        }
    }
    //set loading products
    if (action.type === "SEL_LOADING_PRODUCTS") {
        return {
            ...state,
            loadingProduct: action.payload
        }
    }
    //set suppliers
    if (action.type === "SET_SUPPLIERS") {
        return {
            ...state,
            suppliers: action.payload
        }
    }
    //toogle supplier
    if (action.type === "TOGGLE_SUPPLIER") {
        return {
            ...state,
            purchaseCart: {
                ...state.purchaseCart,
                supplier: action.payload
            }
        }
    }
    //add to cart purchase
    if (action.type === "ADD_TO_PURCHASE_CART") {
        let array = state.purchaseCart.cartItems;
        array.push(action.payload);
        return {
            ...state,
            purchaseCart: {
                ...state.purchaseCart,
                cartItems: array
            }
        }
    }
    if (action.type === "INC_PURCHASE_QNT") {
        return {
            ...state,
            purchaseCart: {
                ...state.purchaseCart,
                cartItems: state.purchaseCart.cartItems.map((item) => {
                    if (action.payload === item.product.id) {
                        return {
                            ...item,
                            qnt: item.qnt+1
                        }
                    } else {
                        return item
                    }
                })
            }
        }
    }
    //decriment quantity
    if (action.type === "DEC_PURCHASE_QNT") {
        return {
            ...state,
            purchaseCart: {
                ...state.purchaseCart,
                cartItems: state.purchaseCart.cartItems.map((item) => {
                    if (item.product.id === action.payload && item.qnt > 1) {
                        return {
                            ...item,
                            qnt: item.qnt-1
                        }
                    }
                    return item;
                })
            }
        }
    }
    //set price in purchase cart
    if (action.type === "SET_PRICE") {
        return {
            ...state,
            purchaseCart: {
                ...state.purchaseCart,
                cartItems: state.purchaseCart.cartItems.map((item) => {
                    if (item.product.id === action.payload.id) {
                        if (action.payload.price < 0) {
                            return {
                                ...item,
                                product: {
                                    ...item.product,
                                    purchasePrice: 0
                                }
                            }
                        }  else {
                            return {
                                ...item,
                                product: {
                                    ...item.product,
                                    purchasePrice: action.payload.price
                                }
                            }
                        }
                    }
                    return item;
                })
            }
        }
    }
    //set purchase quantity 
    if (action.type === "SET_PURCHASE_QNT") {
        return {
            ...state,
            purchaseCart: {
                ...state.purchaseCart,
                cartItems: state.purchaseCart.cartItems.map((item) => {
                    if (item.product.id === action.payload.id) {
                        if (action.payload.qnt < 1) {
                            return {
                                ...item,
                                qnt: 1
                            }
                        } else {
                            return {
                                ...item,
                                qnt: action.payload.qnt
                            }
                        }
                    }
                    return item;
                })
            }
        }
    }
    //removr product from purchase cart 
    if (action.type === "REMOVE_PRODUCT_PURCHASE") {
        return {
            ...state,
            purchaseCart: {
                ...state.purchaseCart,
                cartItems: state.purchaseCart.cartItems.filter((item)=>item.product.id!=action.payload)
            }
        }
    }
    //set cart items
    if (action.type == "SET_ITEMS") {
        return {
            ...state,
            cart: {
                ...state.cart,
                cartItems: action.payload
            }
        }
    }
    if (action.type == "SET_EDIT_ORDER") {
        return {
            ...state,
            cart: {
                ...state.cart,
                editOrder: action.payload
            }
        }
    }
    if (action.type == "SET_EDIT_PURCHASE") {
        return {
            ...state,
            purchaseCart: {
                ...state.purchaseCart,
                editPurchase: action.payload
            }
        }
    }
    if (action.type == "SET_PURCHASE_ITEMS") {
        return {
            ...state,
            purchaseCart: {
                ...state.purchaseCart,
                cartItems: action.payload
            }
        }
    }
    //sales state
    if (action.type == "SET_ALL_SALES") {
        return {
            ...state,
            sales: {
                ...state.sales,
                storedItems :action.payload,
            }
        }
    }
    if (action.type == "SET_ALL_SALES_ITEMS") {
        return {
            ...state,
            sales: {
                ...state.sales,
                allItems: action.payload,
            }
        }
    }
    /**
     * this part for customer page
     */
    //set all items
    if (action.type === "SET_CUSTOMERS_ALL_ITEMS") {
        return {
            ...state,
            customersContext: {
                ...state.customersContext,
                allItems: action.payload
            }
        }
    }
    //set stored items
    if (action.type === "SET_CUSTOMERS_STORED_ITEMS") {
        return {
            ...state,
            customersContext: {
                ...state.customersContext,
                storedItems: action.payload
            }
        }
    }
    //toogle add new modal 
    if (action.type === "TOGGLE_CUSTOMER_ADD_NEW_MODAL") {
        return{
            ...state,
            customersContext: {
                ...state.customersContext,
                openAddModal: action.payload
            }
        }
    }
    //toogle Edit modal 
    if (action.type === "TOGGLE_CUSTOMER_EDIT_MODAL") {
        return{
            ...state,
            customersContext: {
                ...state.customersContext,
                openEditModal: action.payload
            }
        }
    }
    //set Edit customer 
    if (action.type === "SET_CUSTOMER_EDIT") {
        return{
            ...state,
            customersContext: {
                ...state.customersContext,
                editItem: action.payload
            }
        }
    }
    //add cutomer 
    if (action.type === "ADD_CUSTOMER_ITEM") {
        let newArray = Array.from(state.customersContext.storedItems);
        newArray.push(action.payload);
        return {
            ...state,
            customersContext: {
                ...state.customersContext,
                storedItems: newArray,
                allItems: newArray
            }
        }
    }
    //update item
    if (action.type === "UPDATE_CUSTOMER_ITEM") {
        return {
            ...state,
            customersContext: {
                ...state.customersContext,
                storedItems: state.customersContext.storedItems.map(item => {
                    if (item.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return item;
                    }
                }),
                allItems: state.customersContext.allItems.map(item => {
                    if (item.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return item;
                    }
                })
            }
        }
    }
    //toogle view modal 
    if (action.type === "TOGGLE_CUSTOMER_CURRENT_MODAL") {
        return{
            ...state,
            customersContext: {
                ...state.customersContext,
                openViewModal: action.payload
            }
        }
    }
    //set Edit customer 
    if (action.type === "SET_CUSTOMER_CURRENT") {
        return{
            ...state,
            customersContext: {
                ...state.customersContext,
                currentItem: action.payload
            }
        }
    }

}


const cart = {
    orderType: "retail",
    cartItems: [],
    amountProvided: 0,
    tax: 0,
    customer: 1,
    editOrder: 0
}
const purchaseCart = {
    cartItems: [],
    supplier: 0, 
    editPurchase: 0
}
const salesContext = {
    storedItems :[],
    allItems: [],
    selectedItems: [],
    currentItem: null,
    filter: "week",
    startDate: 0,
    endDate: 0,
    reloadData: 0
}
const customersContext = {
    storedItems :[],
    allItems: [],
    openEditModal: false,
    openAddModal: false,
    openViewModal: false,
    currentItem: 0,
    editItem: 0,
}
//initial state
const initState = {
    //state
    allCategories: [],
    currentPage: 1,
    productsPerPage: 12,
    cart: cart,
    purchaseCart: purchaseCart,
    currentProducts: [],
    allProducts: [],
    categoryProducts:[],
    numberPages: 1,
    sectors: [],
    selectedSector: 0,
    customers: [],
    suppliers: [],
    currentCustomers: [],
    selectedCustomer: 0,
    loading: false,
    loadingProduct: true,
    sales: salesContext,
    customersContext:customersContext
}

//PosContext
export default function PosContext({ children }) {
    const [state, dispatch] = useReducer(reducer, initState);
    return (
        <StatePosContext.Provider value={state}>
            <ActionPosContext.Provider value={dispatch}>
                {children}
            </ActionPosContext.Provider>
        </StatePosContext.Provider>
    )
}

//hooks
export function usePosState() {
    return useContext(StatePosContext);
}
export function usePosAction() {
    return useContext(ActionPosContext);
}