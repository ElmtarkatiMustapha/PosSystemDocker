import { createContext, useContext, useReducer } from "react";

const PurchaseStateContext = createContext();
const PurchaseActionContext = createContext();

const Reducer = (state,action) => {
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
    if (action.type === "SET_CURRENT_ITEM") {
        return {
            ...state,
            currentItem: action.payload
        }
    }
    //SET_INFOS
    if (action.type === "SET_STATISTICS") {
        return {
            ...state,
            statistics : action.payload
        }
    }
    //remove 
    if (action.type === "REMOVE_ONE") {
        let newStatistics = state.statistics;
        let newItems =  state.storedItems.filter(item => {
                if (item.id == action.payload) {
                    newStatistics = {
                        total: state.statistics.total - item.total,
                        purchasesNumber: --state.statistics.purchasesNumber
                    }
                    return false;
                } else {
                    return true;
                }
        }) 
        return {
            ...state,
            allItems: newItems,
            storedItems: newItems,
            statistics: newStatistics
        }
    }
}

const initialState = {
    storedItems :[],
    allItems: [],
    statistics: {},
    currentItem: null,
    filter: "week",
    startDate: 0,
    endDate: 0
}

export default function PurchasesContext({children}) {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <PurchaseStateContext.Provider value={state}>
            <PurchaseActionContext.Provider value={dispatch}>
                {children}
            </PurchaseActionContext.Provider>
        </PurchaseStateContext.Provider>
    )
}

//hook

export function usePurchaseState() {
    return useContext(PurchaseStateContext);
}
export function usePurchaseAction() {
    return useContext(PurchaseActionContext);
}

