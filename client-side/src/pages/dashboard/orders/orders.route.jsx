import { Route, Routes } from "react-router-dom";
import OrdersContext from "../../../context/ordersContext";
import { Orders } from ".";

export function OrdersRoute() {
    return (
        <OrdersContext>
            <Routes>
                <Route index element={<Orders/>}/>
            </Routes>
        </OrdersContext>
    )
}