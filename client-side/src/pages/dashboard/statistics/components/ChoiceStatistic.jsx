import { useStatisticsState } from "../../../../context/statisticsContext"
import { Customers } from "./Customers"
import { Purchases } from "./Purchases"
import { Returns } from "./Returns"
import { Sales } from "./Sales"
import { Spents } from "./Spents"
import { Stocks } from "./Stocks"
import { Suppliers } from "./Suppliers"
import { UsersEarning } from "./UsersEarning"
import { UsersTurnover } from "./UsersTurnover"

export function ChoiceStatistic() {
    const state = useStatisticsState()
    return (
        <>
            {state.currentItem === "sales" && <Sales/>}
            {state.currentItem === "purchases" && <Purchases/>}
            {state.currentItem === "spents" && <Spents/>}
            {state.currentItem === "returns" && <Returns/>}
            {state.currentItem === "stocks" && <Stocks/>}
            {state.currentItem === "users_earning" && <UsersEarning/>}
            {state.currentItem === "suppliers" && <Suppliers/>}
            {state.currentItem === "customers" && <Customers/>}
            {state.currentItem === "users_turnover" && <UsersTurnover/>}
        </>
    )
}