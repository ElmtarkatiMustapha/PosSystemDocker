import { createContext, useContext, useReducer } from "react";


const StocksStateContext = createContext();
const StocksActionContext = createContext();

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
    //remove 
    if (action.type === "REMOVE_ONE") {
        return {
            ...state,
            storedItems: state.storedItems.filter(item=>item.id != action.payload)
        }
    }
    //toggle edit modal
    if (action.type === "TOGGLE_EDIT_MODAL") {
        return {
            ...state,
            openEditModal: action.payload
        }
    }
    //set the edited item
    if (action.type === "SET_EDIT_ITEM") {
        return {
            ...state,
            editItem: action.payload
        }
    }
    //update item 
    if (action.type === "UPDATE_ITEM") {
        return {
            ...state,
            storedItems: state.storedItems.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload
                } else {
                    return item;
                }
            })
        }
    }
}

const initState = {
    storedItems :[],
    allItems: [],
    openEditModal: false,
    openAddModal: false,
    currentItem: null,
    editItem: 0,
}


export default function StocksContext({ children }) {
    const [state, dispatch] = useReducer(Reducer, initState);
    return (
        <StocksStateContext.Provider value={state}>
            <StocksActionContext.Provider value={dispatch}>
                {children}
            </StocksActionContext.Provider>
        </StocksStateContext.Provider>
    )
}

export const useStocksState = () => {
    return useContext(StocksStateContext);
} 
export const useStocksAction = () => {
    return useContext(StocksActionContext);
}