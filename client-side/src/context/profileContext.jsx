import { createContext, useContext, useReducer } from "react";

const ProfileStateContext = createContext()
const ProfileActionContext = createContext()

const Reducer = (state,action) => {
    //logique
    //toggle edit modal
    if (action.type === "TOGGLE_EDIT_MODAL") {
        return {
            ...state,
            openEditModal: action.payload
        }
    }
    if (action.type === "UPDATE_CURRENT_ITEM") {
        let newItem = {
            ...state.currentItem,
            name: action.payload.name,
            phone: action.payload.phone,
            cin: action.payload.cin,
            picture: action.payload.picture
        }
        return {
            ...state,
            currentItem: newItem
        }
    }
    if (action.type === "SET_CURRENT_ITEM") {
        return {
            ...state,
            currentItem: action.payload
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
    currentItem: null,
    editItem: 0,
    filter: "week",
    startDate: 0,
    endDate: 0
}

export default function ProfileContext({ children }) {
    const [state, dispatch] = useReducer(Reducer, initState)
    return (
        <ProfileStateContext.Provider value={state}>
            <ProfileActionContext.Provider value={dispatch}>
                {children}
            </ProfileActionContext.Provider>
        </ProfileStateContext.Provider>
    )
}

export function useProfileState() {
    return useContext(ProfileStateContext)
}

export function useProfileAction() {
    return useContext(ProfileActionContext)
}