import { createContext, useContext } from "react";
import { useReducer } from "react";

const StateSettingsContext = createContext();
const ActionSettingsContext = createContext();
const Reducer = (state, action) => {
    //toggle business modal
    if (action.type === "TOGGLE_BUSINESS_MODAL") {
        return {
            ...state,
            businessModal:action.payload
        }
    }
    //toggle alert modal
    if (action.type === 'TOGGLE_ALERT_MODAL') {
        return {
            ...state,
            alertModal: action.payload
        }
    }
    //toggle pos Modal 
    if (action.type === "TOGGLE_POS_MODAL") {
        return {
            ...state,
            posModal: action.payload
        }
    }
    //toggle printers Modal
    if (action.type === "TOGGLE_ADD_PRINTER_MODAL") {
        return {
            ...state,
            addPrintersModal: action.payload
        }
    }
    //update info
    if (action.type === "UPDATE_SETTINGS") {
        return {
            ...state,
            settings: action.payload
        }
    }
    //set loading
    if (action.type === "SET_LOADING") {
        return {
            ...state,
            loading: action.payload
        }
    }
    //set data
    if (action.type === "SET_SETTINGS") {
        return {
            ...state,
            settings : action.payload
        }
    }
    if (action.type === "TOGGLE_VIEW_PRINTER_MODAL") {
        return {
            ...state,
            viewPrinterModal : action.payload
        }
    }
    if (action.type === "SET_VIEWED_PRINTER") {
        return {
            ...state,
            viewedPrinter : action.payload
        }
    }
    if (action.type === "TOGGLE_EDIT_PRINTER_MODAL") {
        return {
            ...state,
            editPrinterModal : action.payload
        }
    }
    if (action.type === "SET_EDITED_PRINTER") {
        return {
            ...state,
            editedPrinter : action.payload
        }
    }
    if (action.type === "UPDATE_PRINTERS") {
        return {
            ...state,
            settings: {
                ...state.settings,
                printers: action.payload
            }
        }
    }
}

const initialState = {
    businessModal: false,
    alertModal: false,
    posModal: false,
    addPrintersModal: false,
    settings: null,
    loading: true,
    viewPrinterModal: false,
    viewedPrinter: 0,
    editPrinterModal: false,
    editedPrinter: 0,
}

export default function SettingsContext({ children }) {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <StateSettingsContext.Provider value={state}>
            <ActionSettingsContext.Provider value={dispatch}>
                {children}
            </ActionSettingsContext.Provider>
        </StateSettingsContext.Provider>
    )
} 

export function useSettingsState() {
    return useContext(StateSettingsContext)
}
export function useSettingsAction() {
    return useContext(ActionSettingsContext)
}