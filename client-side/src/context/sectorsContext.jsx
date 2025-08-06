import { createContext, useContext, useReducer } from "react";

const StateSectorContext = createContext();
const ActionSectorContext = createContext();

const reducer = (state, action) => {
    //
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
            title: action.payload.title,
            adresse: action.payload.adresse,
            active: action.payload.active
        }
        return {
            ...state,
            currentItem: newItem
        }
    }
    //detach user 
    if (action.type === "DETACH_USER") {
        return {
            ...state,
            currentItem: {
                ...state.currentItem,
                userData: state.currentItem.userData.filter((item) => item.id = action.payload)
            }
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
export default function SectorsContext({ children }) {
    const [state, dispatch] = useReducer(reducer, initState);
    return (
        <StateSectorContext.Provider value={state}>
            <ActionSectorContext.Provider value={dispatch}>
                {children}
            </ActionSectorContext.Provider>
        </StateSectorContext.Provider>
    )
}
//hook

export function useSectorState() {
    return useContext(StateSectorContext);
}

export function useSectorAction() {
    return useContext(ActionSectorContext);
}