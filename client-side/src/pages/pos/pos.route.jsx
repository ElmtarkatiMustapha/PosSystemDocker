import { Route, Routes } from "react-router-dom";
import { PosNavbar } from "./components/PosNavbar";
import { MainPos } from ".";
import PosContext from "../../context/posContext";
import "../../assets/css/pos/posStyle.css";
import { useAppState } from "../../context/context";
import { MobilePosNavbar } from "./components/mobile/MobilePosNavbar";
import { PrivateAdminRoute } from "../components/PrivateRoute";
import { Purchase } from "./purchase";
import { EditSale } from "./sales";
import { EditPurchase } from "./purchase/editPurchase";
import { SalesList } from "./sales/SalesList";
import { Customer } from "./customers";
export function PosRoute() {
    const state = useAppState();
   
    return (
        <>
            <PosContext>
                {!state.isMobile && <PosNavbar />}
                {state.isMobile && <MobilePosNavbar/>}
                    <Routes>
                        <Route index element={<MainPos/>}/>
                        <Route path="/sales" element={<SalesList/>}/>
                        <Route path="/sales/:id" element={<EditSale />}/>
                        <Route path="/customers" element={<Customer/>} />
                        <Route path="/purchase" element={<PrivateAdminRoute component={<Purchase />} />} />
                        <Route path="/purchase/:id" element={<PrivateAdminRoute component={<EditPurchase />} />}/>
                        <Route path="/*" element={<h1>404 Not Found</h1>} />
                    </Routes>
            </PosContext>
        </>
    )
}