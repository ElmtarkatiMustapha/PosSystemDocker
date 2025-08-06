import { createContext, useContext, useReducer } from "react";

const SalesStateContext = createContext();
const SalesActionContext = createContext();

const Reducer = (state, action) => {
    //logic of the app
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
    //remove 
    if (action.type === "REMOVE_ONE") {
        let newStatistics = state.statistics;
        let newItems =  state.storedItems.filter(item => {
                if (item.id == action.payload) {
                    newStatistics = {
                        turnover: state.statistics.turnover - item.total,
                        order_count: --state.statistics.order_count
                    }
                    return false;
                } else {
                    return true;
                }
        }) 
        return {
            ...state,
            storedItems: newItems,
            statistics: newStatistics
        }
    }
    //SET_INFOS
    if (action.type === "SET_STATISTICS") {
        return {
            ...state,
            statistics : action.payload
        }
    }
    //set current item
    if (action.type === "SET_CURRENT_ITEM") {
        return {
            ...state,
            currentItem: action.payload
        }
    }
    //set delivered
    if (action.type === "TOGGLE_STATUS") {
        let newItems =  state.storedItems.map(item => {
                if (item.id == action.payload.id) {
                    
                    return {
                        ...item,
                        status: action.payload.status,
                        delivered_at: action.payload.delivered_at,
                        delivered_by: action.payload.delivered_by,
                    };
                } else {
                    return item;
                }
        }) 

        return {
            ...state,
            storedItems: newItems,
        }
    }
    if (action.type === "TOGGLE_RETURN_MODAL") {
        return {
            ...state,
            openReturnModal:action.payload
        }
    }
    if (action.type === "SET_RETURN_SALE_ID") {
        return {
            ...state,
            returnSaleId: action.payload
        }
    }
    if (action.type === "SET_SELECTED_ITEM") {
        return {
            ...state,
            selectedItems: action.payload
        }
    }
    if (action.type === "RELOAD_DATA") {
        return {
            ...state,
            reloadData: state.reloadData+1
        }
    }
}

//initial state
const initialState = {
    storedItems :[],
    allItems: [],
    statistics: {},
    selectedItems: [],
    currentItem: null,
    openReturnModal: false,
    returnSaleId:0,
    filter: "week",
    startDate: 0,
    endDate: 0,
    reloadData: 0
}

//export context
export default function SalesContext({children}) {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <SalesStateContext.Provider value={state}>
            <SalesActionContext.Provider value={dispatch}>
                {children}
            </SalesActionContext.Provider>
        </SalesStateContext.Provider>
    )
}

//export hooks
export function useSalesState() {
    return useContext(SalesStateContext);
}
export function useSalesAction() {
    return useContext(SalesActionContext);
}