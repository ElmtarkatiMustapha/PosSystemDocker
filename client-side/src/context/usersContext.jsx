import { createContext, useContext, useReducer } from "react";

const UsersStateContext = createContext();
const UsersActionContext = createContext();

const Reducer = (state, action) => {
    //logique of users pages
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
                    return {
                        ...item,
                        name: action.payload.name,
                        phone: action.payload.phone,
                        cin: action.payload.cin,
                        email: action.payload.email,
                        picture: action.payload.picture,
                        active: action.payload.active,
                        cashier: action.payload.cashier,
                        username: action.payload.username,
                        printer: action.payload.printer,
                        sectors: action.payload.sectors,
                        roles: action.payload.roles
                    }
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
        console.log(state.storedItems)
        console.log(newArray)
        return {
            ...state,
            storedItems: newArray,
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
            cin: action.payload.cin,
            email: action.payload.email,
            picture: action.payload.picture,
            active: action.payload.active,
            cashier: action.payload.cashier,
            username: action.payload.username,
            printer: action.payload.printer,
            sectors: action.payload.sectors,
            roles: action.payload.roles
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
    //set earning
    if (action.type === "SET_EARNING") {
        let newItem = {
            ...state.currentItem,
            earning: action.payload,
        }
        return {
            ...state,
            storedItems: state.storedItems.map(item => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        earning: action.payload,
                    }
                } else {
                    return item;
                }
            }),
            currentItem: newItem
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

export default function UsersContext({ children }) {
    const [state, dispatch] = useReducer(Reducer, initState);
    return (
        <UsersStateContext.Provider value={state}>
            <UsersActionContext.Provider value={dispatch}>
                {children}
            </UsersActionContext.Provider>
        </UsersStateContext.Provider>
    )
}

export const useUsersState = () => {
    return useContext(UsersStateContext);
}
export const useUsersAction = () => {
    return useContext(UsersActionContext);
}



