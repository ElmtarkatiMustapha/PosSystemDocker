import { createContext, useContext, useReducer } from "react";

const StateCashRegisterSessionsContext = createContext();
const ActionCashRegisterSessionsContext = createContext();

const Reducer =(state, action)=>{
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
    if(action.type === "SET_USERS"){
        return {
            ...state,
            users: action.payload
        }
    }
    if(action.type === "SET_SELECTED_USER"){
        return {
            ...state,
            selectedUser: action.payload
        }
    }
    if(action.type === "SET_STATISTICS"){
        return {
            ...state,
            statistics: action.payload
        }
    }
    if (action.type === "RELOAD_DATA") {
        return {
            ...state,
            reloadData: state.reloadData+1
        }
    }
    if (action.type === "SET_EDITED_ITEM") {
        return {
            ...state,
            editedItem: action.payload
        }
    }
    if(action.type === "TOGGLE_EDIT_MODAL"){
        return {
            ...state,
            openEditModal: action.payload
        }
    }
    if(action.type === "SET_CURRENT_ITEM"){
        return {
            ...state,
            currentItem: action.payload
        }
    }
}
const initialState = {
    storedItems :[],
    allItems: [],
    statistics: {},
    selectedItems: [],
    currentItem: null,
    editedItem:null,
    openEditModal:false,
    users:[],
    selectedUser:-1,
    filter: "week",
    startDate: 0,
    endDate: 0,
    reloadData: 0,
}

//export context
export default function CashRegisterSessionsContext({children}) {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <StateCashRegisterSessionsContext.Provider value={state}>
            <ActionCashRegisterSessionsContext.Provider value={dispatch}>
                {children}
            </ActionCashRegisterSessionsContext.Provider>
        </StateCashRegisterSessionsContext.Provider>
    )
}

//export hooks
export function useCashRegisterSessionState() {
    return useContext(StateCashRegisterSessionsContext);
}
export function useCashRegisterSessionAction() {
    return useContext(ActionCashRegisterSessionsContext);
}
