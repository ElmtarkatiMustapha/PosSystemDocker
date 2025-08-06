import { Route, Routes } from "react-router-dom";
import PurchasesContext from "../../../context/purchasesContext";
import { Purchases } from ".";
import { SinglePurchase } from "./singlePage";

export function PurchasesRoute() {
    return(
        <PurchasesContext>
            <Routes>
                <Route index element={<Purchases/>} />
                <Route path="/:id" element={<SinglePurchase/>}/>
            </Routes>
        </PurchasesContext>
    )
}