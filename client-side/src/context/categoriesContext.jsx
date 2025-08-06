import { createContext, useContext, useReducer } from "react";



const StateCategoriesContext = createContext();
const ActionCategoriesContext = createContext();

const Reducer = (state, action) => {
    if (action.type === "LOAD_CATEGORIES") {
        return {
            ...state,
            ...action.payload,
        }
    }
    if (action.type === "SET_CURRENT_ITEMS") {
        return {
            ...state,
            currentList: action.payload
        }
    }
    if (action.type === "INC_PAGE") {
        return {
            ...state,
            currentPage: state.currentPage>=state.numberPages? state.currentPage : state.currentPage + 1
        }
    }
    if (action.type === "DEC_PAGE") {
        return {
            ...state,
            currentPage: state.currentPage<=1? 1: state.currentPage-1
        }
    }
    if (action.type === "SET_PAGE") {
        return {
            ...state,
            currentPage: action.payload,
        }
    }
    if (action.type === "SET_LOADING") {
        return {
            ...state,
            loading: action.payload
        }
    }
    if (action.type === "SET_EDIT_CATEGORY") {
        return {
            ...state,
            categoryToEdit: action.payload
        }
    }
    if (action.type === "TOGGLE_EDIT_MODAL") {
        return {
            ...state,
            openEditModal: action.payload
        }
    }
    if (action.type === "UPDATE_ITEM") {
        return {
            ...state,
            storedItems: state.allItems.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload;
                }
                return item
            })
        }
    }
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
    if (action.type === "TOGGLE_ADD_MODAL") {
        return {
            ...state,
            openAddModal: action.payload,
        }
    }
    if (action.type === "ADD_ITEM") {
        let newList = state.storedItems.concat([action.payload]);
        return {
            ...state,
            storedItems: newList,
            numberPages: Math.ceil(newList.length / state.itemsPerPage)
        }
    }
    if (action.type === "SET_CATEGORY") {
        return {
            ...state,
            categoryInfos: action.payload
        }
    }
}

const initState = {
    storedItems: [],
    allItems: [],
    currentList: [],
    itemsPerPage: 10,
    numberPages: 0,
    currentPage: 1,
    loading: true,
    openEditModal: false,
    openAddModal: false,
    categoryToEdit: 0,
    categoryInfos: {}
} 
export default  function CategoriesContext({children}) {
    const [state, dispatch] = useReducer(Reducer, initState);
    return (
        <StateCategoriesContext.Provider value={state}>
            <ActionCategoriesContext.Provider value={dispatch}>
                {children}
            </ActionCategoriesContext.Provider>
        </StateCategoriesContext.Provider>
    )
}

//hooks
export function useCateState() {
    return useContext(StateCategoriesContext);
}

export function useCateAction() {
    return useContext(ActionCategoriesContext);
}

