import { Route, Routes } from "react-router-dom";
import { UsersRoute } from "./users/users.route";
import { SalesRoute } from "./sales/sales.route";
import { PurchasesRoute } from "./purchases/purchases.route";
import { SpentsRoute } from "./spents/spents.route";
import { StatisticsRoute } from "./statistics/statistics.route";
import { SettingsRoute } from "./settings/settings.route";
import { CashRegisterSessionsRoutes } from "./cashRegister/CashRegisterSessions.route";

export function AdminRoute() {
    return (
        <>
            <Routes>
                <Route path="/users/*" element={<UsersRoute/>} />
                <Route path="/settings/*" element={<SettingsRoute/>} />
                <Route path="/statistics/*" element={<StatisticsRoute/>} />
                <Route path="/sales/*" element={<SalesRoute/>} />
                <Route path="/purchases/*" element={<PurchasesRoute/>} />
                <Route path="/spents/*" element={<SpentsRoute/>} />
                <Route path="/cashRegisterSessions/*" element={<CashRegisterSessionsRoutes/>} />
                <Route path="/*" element={<h1>Not Found 4O4</h1>} />
            </Routes>
        </>
    )
}