import { createContext, useContext, useReducer } from "react";

const ReturnStateContext = createContext();
const ReturnActionContext = createContext();

const reducer = (state,action) => {
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
    //remove 
    if (action.type === "REMOVE_ONE") {
        let newStatistics = state.statistics;
        let newItems =  state.storedItems.filter(item => {
                if (item.id == action.payload) {
                    newStatistics = {
                        turnover: state.statistics.turnover - item.total,
                        returns_count: --state.statistics.returns_count
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
    // toggle view modal
    if (action.type === "TOGGLE_VIEW_MODAL") {
        return {
            ...state,
            openViewModal: action.payload
        }
    }
    // toggle edit modal
    if (action.type === "TOGGLE_EDIT_MODAL") {
        return {
            ...state,
            openEditModal: action.payload
        }
    }
    //set view Item
    if (action.type === "SET_VIEW_ITEM") {
        return {
            ...state,
            viewItem:action.payload
        }
    }
    //set edit item
    if (action.type === "SET_EDIT_ITEM") {
        return {
            ...state,
            editItem:action.payload
        }
    }
    //set selected items
    if (action.type === "SET_SELECTED_ITEM") {
        return {
            ...state,
            selectedItems: action.payload
        }
    }
    //reload data
    if (action.type === "RELOAD_DATA") {
        return {
            ...state,
            reloadData: state.reloadData+1
        }
    }
}

const initialState = {
    storedItems :[],
    allItems: [],
    statistics: {},
    currentItem: null,
    openEditModal: false,
    openViewModal: false,
    viewItem:0,
    editItem: 0,
    selectedItems: [],
    reloadData:0
}


export default function ReturnContext({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <ReturnActionContext.Provider value={dispatch}>
            <ReturnStateContext.Provider value={state}>
                {children}
            </ReturnStateContext.Provider>
        </ReturnActionContext.Provider>
    )
}

//hook

export function useReturnState() {
    return useContext(ReturnStateContext);
}

export function useReturnAction() {
    return useContext(ReturnActionContext);
}