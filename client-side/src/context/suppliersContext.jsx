import { createContext, useContext, useReducer } from "react";

const stateSuppliersContext = createContext();
const actionSuppliersContext = createContext();

const reducer = (state,action) => {
    //logique of app
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
    //toggle add modal
    if (action.type === "TOGGLE_ADD_MODAL") {
        return {
            ...state,
            openAddModal: action.payload
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
    if (action.type === "SET_CURRENT_ITEM") {
        return {
            ...state,
            currentItem: action.payload
        }
    }
    if (action.type === "UPDATE_CURRENT_ITEM") {
        let newItem = {
            ...state.currentItem,
            name: action.payload.name,
            phone: action.payload.phone,
            ice: action.payload.ice,
            email: action.payload.email,
            adresse: action.payload.adresse,
            picture: action.payload.picture,
            active: action.payload.active,
            description: action.payload.description
        }
        return {
            ...state,
            currentItem: newItem
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


//init state

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
//export context

export default function SuppliersContext({ children }) {
    const [state, dispatch] = useReducer(reducer, initState);
    return (
        <stateSuppliersContext.Provider value={state}>
            <actionSuppliersContext.Provider value={dispatch}>
                {children}
            </actionSuppliersContext.Provider>
        </stateSuppliersContext.Provider>
    )
}

//export hooks
export function useSuppliersState() {
    return useContext(stateSuppliersContext);
}
export function useSuppliersAction() {
    return useContext(actionSuppliersContext);
}