import { useContext } from "react";
import { createContext, useReducer } from "react";

const OrdersStateContext = createContext();
const OrdersActionContext = createContext();

const Reducer = (state, action) => {
    //logique
    if (action.type === "SET_STORED_ITEMS") {
        return {
            ...state,
            storedItems: action.payload
        }
    }
    if (action.type === "SET_ALL_ITEMS") {
        return {
            ...state,
            allItems: action.payload
        }
    }
}


const initialState = {
    storedItems :[],
    allItems: [],
}


export default function OrdersContext({ children }) {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <OrdersStateContext.Provider value={state}>
            <OrdersActionContext.Provider value={dispatch}>
                {children}
            </OrdersActionContext.Provider>
        </OrdersStateContext.Provider>
    )
}

//HOOKS

export function useOrdersState() {
    return useContext(OrdersStateContext);
}

export function useOrdersAction() {
    return useContext(OrdersActionContext);
}