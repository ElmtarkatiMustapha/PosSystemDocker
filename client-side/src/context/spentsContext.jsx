import { createContext, useContext, useReducer } from "react";

const StateSpentContext = createContext();
const ActionSpentContext = createContext();

const reducer = (state, action)=>{
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
        //get the spent that ganna deleted
        let spent=0;
        state.storedItems.forEach(item => {
            if (item.id == action.payload) {
                spent = item;
            }
        });
        return {
            ...state,
            storedItems: state.storedItems.filter(item => item.id != action.payload),
            statistics: {
                spents_count:Number(state.statistics.spents_count)-1,
                total: Number(state.statistics.total)-Number(spent?.amount),
            }
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
        let spent=0;
        state.storedItems.forEach(item => {
            if (item.id == action.payload.id) {
                spent = item;
            }
        });
        return {
            ...state,
            storedItems: state.storedItems.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload
                } else {
                    return item;
                }
            }),
            statistics: {
                ...state.statistics,
                total: Number(state.statistics.total) + Number(action.payload.amount) - Number(spent?.amount),
            }
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
            storedItems: newArray,
            statistics: {
                spents_count:Number(state.statistics.spents_count)+1,
                total: Number(state.statistics.total)+Number(action.payload?.amount),
            }
        }
    }
    if (action.type === "SET_CURRENT_ITEM") {
        return {
            ...state,
            currentItem: action.payload
        }
    }
    //toggle add modal
    if (action.type === "TOGGLE_VIEW_MODAL") {
        return {
            ...state,
            openViewModal: action.payload
        }
    }
    if (action.type === "SET_STATISTICS") {
        return {
            ...state,
            statistics : action.payload
        }
    }
}

const initState = {
    storedItems :[],
    allItems: [],
    statistics: {},
    openEditModal: false,
    openAddModal: false,
    openViewModal: false,
    currentItem: null,
    editItem: 0,
}

export default function SpentsContext({ children }) {
    const [state, dispatch] = useReducer(reducer, initState);
    return (
        <StateSpentContext.Provider value={state}>
            <ActionSpentContext.Provider value={dispatch}>
                {children}
            </ActionSpentContext.Provider>
        </StateSpentContext.Provider>
    )
}


export function useSpentsState() {
    return useContext(StateSpentContext);
}

export function useSpentsAction() {
    return useContext(ActionSpentContext);
}