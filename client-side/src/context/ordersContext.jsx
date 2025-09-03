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
            allItems: action.payload.filter(item=>state.selectedUsers.includes(item.user_id))
        }
    }
    if(action.type === "FILTER_BY_USERS"){
        return {
            ...state,
            allItems: state.storedItems.filter(item=>action.payload.includes(item.user_id))
        }
    }
    if(action.type === "SET_SELECTED_USERS"){
         return {
            ...state,
            selectedUsers: action.payload,
            allItems: state.storedItems.filter(item=>action.payload.includes(item.user_id))
        }
    }
    if(action.type === "UPDATE_ITEMS"){
        return {
            ...state,
            storedItems: state.storedItems.filter(item=>!state.selectedUsers.includes(item.user_id))
        }
    }
}


const initialState = {
    storedItems :[],
    allItems: [],
    selectedUsers: []
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