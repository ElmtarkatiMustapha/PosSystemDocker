import { createContext, useContext, useReducer } from "react";

const StateCustomersContext = createContext();
const ActionCustomersContext = createContext();

const Reducer = (state,action) => {
    //conditions
    //set stored items
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
    //toggle edit modal 
    if (action.type === "TOGGLE_EDIT_MODAL") {
        return {
            ...state,
            openEditModal: action.payload 
        }
    }
    //toggle add modal 
    if (action.type === "TOGGLE_ADD_MODAL") {
        return {
            ...state,
            openAddModal: action.payload 
        }
    }
    //set current item
    if (action.type === "SET_CURRENT_ITEM") {
        return {
            ...state,
            currentItem: action.payload
        }
    }
    //set the edited item
    if (action.type === "SET_EDIT_ITEM") {
        return {
            ...state,
            editItem: action.payload
        }
    }
    //add item to 
    if (action.type === "ADD_ITEM") {
        let newArray = Array.from(state.storedItems);
        newArray.push(action.payload);
        return {
            ...state,
            storedItems: newArray
        }
    }
    //update item
    if (action.type === "UPDATE_ITEM") {
        return {
            ...state,
            storedItems: state.storedItems.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload;
                } else {
                    return item;
                }
            })
        }
    }
    //update current item info
    if (action.type === "UPDATE_CURRENT_ITEM") {
        return {
            ...state,
            currentItem: action.payload
        }
    }
    //remove one
    if (action.type === "REMOVE_ONE") {
        return {
            ...state, 
            storedItems: state.storedItems.filter(item=>item.id != action.payload)
        }
    }
    //set start date 
    if (action.type === "SET_START_DATE") {
        return {
            ...state,
            startDate : action.payload
        }
    }
    //set end date
    if(action.type === "SET_END_DATE"){
        return {
            ...state,
            endDate: action.payload
        }
    }
    // set filter
    if (action.type === "SET_FILTER") {
        return {
            ...state,
            filter: action.payload
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
    filter: "week",
    startDate: 0,
    endDate: 0
}

export default function CustomersContext({children}) {
    const [state, dispatch] = useReducer(Reducer, initState);
    return (
        <StateCustomersContext.Provider value={state}>
            <ActionCustomersContext.Provider value={dispatch}>
                {children}
            </ActionCustomersContext.Provider>
        </StateCustomersContext.Provider>
    )
}
//hooks
export const useCustomersState = () => {
    return useContext(StateCustomersContext);
}
export const useCustomersAction = () => {
    return useContext(ActionCustomersContext);
}