import { createContext, useContext, useReducer } from "react";

const StateDeliveryContext = createContext();
const ActionDeliveryContext = createContext();

const Reducer = (state, action) => {
    //logique
    if (action.type == "SET_STORED_ITEMS") {
        return {
            ...state,
            storedItems: action.payload
        }
    }
    //set all items
    if (action.type === "SET_ALL_ITEMS") {
        return {
            ...state,
            allItems: action.payload
        }
    }
    //change sector
    if (action.type === "CHANGE_SECTOR") {
        if (action.payload == -1) {
            return {
                ...state,
                allItems: state.storedItems
            }
        } else {
            return {
                ...state,
                allItems:state.storedItems.filter((item) => item.customer.sector.id == action.payload) 
            }
        }
    }
    //
    if (action.type === "SET_VIEW_ITEM") {
        return {
            ...state,
            viewItem: action.payload
        }
    }
    //
    if (action.type === "TOGGLE_VIEW_MODAL") {
        return{
            ...state,
            openViewModal: action.payload
        }
    }
    //remove one 
    if (action.type === "REMOVE_ONE") {
        return {
            ...state,
            storedItems: state.storedItems.filter((res) => res.id != action.payload),
            allItems: state.allItems.filter((res)=>res.id != action.payload)
        }
    }
    //handle sales context
    if (action.type === "SET_ALL_SALES_ITEMS") {
        return {
            ...state,
            salesContext: {
                ...state.salesContext,
                allItems: action.payload
            }
        }
    }
    if (action.type === "SET_STORED_SALES_ITEMS") {
        return {
            ...state,
            salesContext: {
                ...state.salesContext,
                storedItems: action.payload
            }
        }
    }
}
const salesContext = {
    storedItems :[],
    allItems: [],
}
const initState = {
    storedItems :[],
    allItems: [],
    salesContext:salesContext,
    openViewModal: false,
    openAddModal: false,
    currentItem: null,
    viewItem: 0,
}

export default function DeliveryContext({children}) {
    const [state, dispatch] = useReducer(Reducer, initState);
    return (
        <StateDeliveryContext.Provider value={state}>
            <ActionDeliveryContext.Provider value={dispatch}>
                {children}
            </ActionDeliveryContext.Provider>
        </StateDeliveryContext.Provider>
    )
}

export function useDeliveryState() {
    return useContext(StateDeliveryContext)
}

export function useDeliveryAction() {
    return useContext(ActionDeliveryContext)
}
