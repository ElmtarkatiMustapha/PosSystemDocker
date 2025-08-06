import { Route, Routes } from "react-router-dom";
import { AdminRoute } from "./admin.route";
import { useAppState } from "../../context/context";
import { DashboardNavbar } from "./components/DashboardNavbar";
import { Sidebar } from "./components/Sidebar";
import { MobileNavbar } from "./components/mobile/MobileNavbar";
import { MobileSidebar } from "./components/mobile/MobileSidebar";
import { PrivateAdminRoute } from "../components/PrivateRoute";
import { CategoriesRoutes } from "./categories/categories.route";
import "../../assets/css/dashboard/style.css";
import { ProductsRoute } from "./products/products.route";
import { SectorsRoute } from "./sectors/sectors.route";
import { CustomersRoute } from "./customers/customers.route";
import { SuppliersRoute } from "./suppliers/suppliers.route";
import { StocksRoute } from "./stocks/stocks.route";
import { OrdersRoute } from "./orders/orders.route";
import { ReturnRoute } from "./returns/returns.route";
import { Dashboard } from ".";
export function ManageRoute() {
    const state = useAppState();
    return (
        <>
            {!state.isMobile && <DashboardNavbar />}
            {state.isMobile && <MobileNavbar/>} 
            {!state.isMobile && <Sidebar />}
            {state.isMobile && <MobileSidebar/>}
            <main style={!state.isMobile ? { marginLeft: "5rem" } : {}} className="p-1"> 
                <div
                    style={{
                        marginTop:"4rem"
                }}
                >
                    <Routes>
                        <Route index element={<Dashboard/>} />
                        <Route path="/products/*" element={<ProductsRoute/>} />
                        <Route path="/sectors/*" element={<SectorsRoute/>} />
                        <Route path="/customers/*" element={<CustomersRoute/>} />
                        <Route path="/orders/*" element={<OrdersRoute/>} />
                        <Route path="/returns/*" element={<ReturnRoute/>} />
                        <Route path="/stocks/*" element={<StocksRoute/>} />
                        <Route path="/categories/*" element={<CategoriesRoutes />} />
                        <Route path="/suppliers/*" element={<SuppliersRoute/>} />
                        {/* just for admin */}
                        <Route path="/*" element={<PrivateAdminRoute component={<AdminRoute/>} />} />
                    </Routes>
                </div>
            </main>
            
        </>
    )
}