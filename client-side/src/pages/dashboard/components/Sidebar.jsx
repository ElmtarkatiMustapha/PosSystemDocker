
import { FaHouse, FaChartLine, FaBagShopping, FaGear , FaCartArrowDown, FaSackDollar, FaArrowRotateLeft } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import "../../../assets/css/dashboard/sidebar.css";
import { SidebarBtn, SidebarSubBtn } from "./SidebarBtn";
import { ManageMenu } from "./ManageMenu";
import { useState } from "react";
import {  useAppState } from "../../../context/context";
/**
 * @usage this the main component of the sidebar 
 * @mode browser mode
 * @item openManage state 
 * @returns jsw component 
 */
export function Sidebar() {
    const [manageOpen, setManageOpen] = useState(false)
    const handleOpenManage = () => {
        setManageOpen(!manageOpen);
    }
    const handlecloseManage = () => {
        setManageOpen(false);
    } 
    return (
        <>
            <ManageMenu handle={handleOpenManage} manageOpen={manageOpen} />
            <div className="container-fluid sidebar z-2 h-100 ">
                <div className="row ps-3 align-items-center h-100">
                    <div style={{ textAlign: "-webkit-center" }} className="col-12 p-0 w-100">
                        <SidebarBtn title={"Dashboard"} handle={handlecloseManage} path={"/"} Icon={FaHouse} />
                        <SidebarBtn title={"Returns"} handle={handlecloseManage} path={"/returns"} Icon={FaArrowRotateLeft  } />
                        <SidebarSubBtn  title={"Manage"} handle={handleOpenManage}  Icon={FaTasks} />
                        <AdminLinks handlecloseManage={handlecloseManage}/>
                    </div>
                </div>
            </div>
        </>
    )
}

function AdminLinks({handlecloseManage}) {
    const state = useAppState();
    if (state.userRoles.includes("admin")) {
        return (
            <>
                <SidebarBtn title={"Statistics"} handle={handlecloseManage} path={"/statistics"} Icon={FaChartLine} />
                <SidebarBtn title={"Sales"} handle={handlecloseManage} path={"/sales"} Icon={FaBagShopping} />
                <SidebarBtn title={"Purchases"} handle={handlecloseManage} path={"/purchases"} Icon={FaCartArrowDown} />
                <SidebarBtn title={"Spents"} handle={handlecloseManage} path={"/spents"} Icon={FaSackDollar } />
                <SidebarBtn title={"Settings"} handle={handlecloseManage} path={"/settings"} Icon={FaGear   } />
            </>
        )
    } else {
        return <></>
    }    
}
