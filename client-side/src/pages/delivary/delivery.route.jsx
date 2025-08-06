import { Route, Routes } from "react-router-dom";
import DeliveryContext from "../../context/deliveryContext";
import { DeliveryNavbar } from "./components/DeliveryNavbar";
import { useAppState } from "../../context/context";
import { Delivery } from ".";
import { MobileDeliveryNavbar } from "./components/mobile/MobileDeliveryNavbar";
import { DeliveredOrders } from "./deliveredOrders";

export function DeliveryRoute() {
    const state = useAppState()
    return (
        <DeliveryContext>
            {!state.isMobile && <DeliveryNavbar />}
            {state.isMobile && <MobileDeliveryNavbar />}
            <Routes>
                <Route index element={<Delivery />} />
                <Route path="/sales" element={<DeliveredOrders/>} />
            </Routes>
        </DeliveryContext> 
    )
}