import { createContext, useContext, useReducer } from "react";

const StatisticsStateContext = createContext();
const StatisticsActionContext = createContext();

const Reducer = (state,action) => {
    //logique
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
    //set data
    if (action.type === "SET_DATA") {
        return {
            ...state,
            data: action.payload
        }
    }
    //set loading 
    if (action.type === "SET_LOADING") {
        return {
            ...state,
            loading: action.payload
        }
    }
}
const parts = [
    {
        name: "Sales",
        value: "sales"
    },
    {
        name: "Purchases",
        value: "purchases"
    },
    {
        name: "Returns",
        value: "returns"
    },
    {
        name: "Stocks",
        value: "stocks"
    },
    {
        name: "Spents",
        value: "spents"
    },
    {
        name: "Users Earning",
        value: "users_earning"
    },
    {
        name: "Users Turnover",
        value: "users_turnover"
    },
    {
        name: "Customers",
        value: "customers"
    },
    {
        name: "Suppliers",
        value: "suppliers"
    }
]
const initState = {
    options: parts,
    data: [],
    openEditModal: false,
    loading : true,
    currentItem: -1,
    editItem: 0,
    filter: "week",
    startDate: 0,
    endDate: 0
}

export default function StatisticsContext({children}) {
    const [state, dispatch] = useReducer(Reducer, initState)
    return (
        <StatisticsActionContext.Provider value={dispatch}>
            <StatisticsStateContext.Provider value={state}>
                {children}
            </StatisticsStateContext.Provider>
        </StatisticsActionContext.Provider>
    )
} 

export function useStatisticsAction() {
    return useContext(StatisticsActionContext)
}

export function useStatisticsState() {
    return useContext(StatisticsStateContext)
}