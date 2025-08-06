import { Route, Routes } from "react-router-dom";
import SalesContext from "../../../context/salesContext";
import { Sales } from ".";
import { SingleSale } from "./singlePage";

export function SalesRoute() {
    return (
        <SalesContext>
            <Routes>
                <Route index element={<Sales/>} />
                <Route path="/:id" element={<SingleSale />} />
            </Routes>
        </SalesContext>
    )
}