import { createContext, useContext, useReducer } from "react";

const ActionProductsContext = createContext();
const StateProductsContext= createContext();

const reducer = (state, action) => {
    //actions here
    if (action.type === "SET_ALL_PRODUCTS") {
        return {
            ...state,
            allProducts: action.payload
        }
    }
    if (action.type === "SET_STORED_PRODUCTS") {
        return {
            ...state,
            storedProducts: action.payload
        }
    }
    if (action.type === "REMOVE_ONE") {
        return {
            ...state,
            storedProducts: state.storedProducts.filter(item=>item.id != action.payload)
        }
    }
    if (action.type === "TOGGLE_EDIT_MODAL") {
        return {
            ...state,
            openEditModal: action.payload 
        }
    }
    if (action.type === "TOGGLE_ADD_MODAL") {
        return {
            ...state,
            openAddModal: action.payload 
        }
    }
    if (action.type === "SET_CURRENT_PRODUCT") {
        return {
            ...state,
            currentProduct: action.payload
        }
    }
    if (action.type === "UPDATE_CURRENT_PRODUCT") {
        return {
            ...state,
            currentProduct: {
                ...state.currentProduct,
                active : action.payload.active,
                barcode:action.payload.barcode,
                cachier_margin: action.payload.cachier_margin,
                category_id: action.payload.category_id,
                current_stocks: action.payload.current_stocks,
                discount: action.payload.discount,
                enable_stock:action.payload.enable_stock,
                name: action.payload.name,
                picture:action.payload.picture,
                retail_price:action.payload.retail_price,
            }
        }
    }
    if (action.type === "UPDATE_PRODUCT") {
        return {
            ...state,
            storedProducts: state.storedProducts.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload;
                } else {
                    return item;
                }
            })
        }
    }
    if (action.type === "SET_EDIT_PRODUCT") {
        return {
            ...state,
            editProducts: action.payload
        }
    }
    if (action.type === "ADD_PRODUCT") {
        return {
            ...state,
            storedProducts: state.storedProducts.concat([action.payload])
        }
    }
    if (action.type === "UPDATE_STOCK") {
        return {
            ...state,
            currentProduct: {
                ...state.currentProduct,
                stocks: action.payload
            }
        }
    }
    if (action.type === "EDIT_STOCK") {
        return {
            ...state,
            currentProduct: {
                ...state.currentProduct,
                stocks: state.currentProduct.stocks.map(item => {
                    if (item.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return item;
                    }
                })
            }
        }
    }
}

const initState = {
    //state
    storedProducts: [],
    allProducts: [],
    openEditModal: false,
    editProducts: 0,
    openAddModal: false,
    currentProduct: null,
    
}


export default function ProductsContext({children}) {
    const [state, dispatch] = useReducer(reducer, initState);
    return (
        <ActionProductsContext.Provider value={dispatch}>
            <StateProductsContext.Provider value={state}>
                {children}
            </StateProductsContext.Provider>
        </ActionProductsContext.Provider>
    )
}

//hooks

export function useProductsState() {
    return useContext(StateProductsContext);
}

export function useProductsAction() {
    return useContext(ActionProductsContext);
}