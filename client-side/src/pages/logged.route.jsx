import { Route, Routes } from "react-router-dom";
import { ManageRoute } from "./dashboard/manage.route";
import { PosRoute } from "./pos/pos.route";
import { DeliveryRoute } from "./delivary/delivery.route";
import { PrivateDeliveryRoute, PrivateManageRoute, PrivatePosRoute } from "./components/PrivateRoute";
import { Profile } from "./profile";


export function LoggedRoute() {
    return (
        <Routes>
            {/* roles: manager or admin */}
            <Route path="/*" element={ <PrivateManageRoute component={<ManageRoute/>} />} />
            {/* <Route path="/custom/*" element={ <PrivateAdminRoute component={<CustomRoute/>} />} /> */}
            {/* roles: admin or cachier */}
            <Route path="/pos/*" element={<PrivatePosRoute component={<PosRoute/>}/> } />
            {/* roles: admin or delivary */}
            <Route path="/delivery/*" element={<PrivateDeliveryRoute component={<DeliveryRoute/>} />} />
            {/*these routes for every user logged */}
            <Route path="/profile" element={<Profile/>} />
            <Route path="/logout" element={<h1>Main Pos/logout</h1>} />
        </Routes>
    )
}