/**
 * @usage containe the list of sidebar items 
 * @mode mobile mode
 * @param listVariant the animation of the list
 * @param itemVariant the animation of the btns
 * @param handleOpen function used to handle opening sidebar menu
 * @param handleManage function used to handle opening manage menu(sub menu)
 * @returns jsx component
 */
import { motion } from "framer-motion"
import { MobileSidebarBtn } from "./MobileSidebarBtn"
import { MobileManageBtn } from "./MobileManageBtn"
import { FaHouse,FaGear, FaChartLine, FaBagShopping, FaCartArrowDown, FaSackDollar } from "react-icons/fa6"
import { FaArrowRotateLeft, FaTruckFast} from "react-icons/fa6"
import { FaTasks } from "react-icons/fa"
import { Link, useLocation } from "react-router-dom"
import { Lang } from "../../../../assets/js/lang"
import { LangSelect } from "../LangSelect"
import { useAppState } from "../../../../context/context"
// eslint-disable-next-line react/prop-types
export function MobileSidebarContent({ listVariant,itemVariant, handleOpen,handleManage }) {
    
    return (
        <motion.div
            className="row justify-content-center"
            variants={listVariant}
        >
            <MobileSidebarBtn variants={itemVariant} path="/" Icon={FaHouse} handle={handleOpen} />
            <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/returns"} Icon={FaArrowRotateLeft} />
            <MobileManageBtn variants={itemVariant} handle={handleManage} Icon={FaTasks} />
            {/* these links is private for admin  */}
            <AdminLinks itemVariant={itemVariant} handleOpen={handleOpen} />
            {/* this link is user has cahier role   */}
            <CachierBtn itemVariant={itemVariant}/>
            <DashboardBtn itemVariant={itemVariant}/>
            {/* this link is user has delivery role  */}
            <DeliveryBtn itemVariant={itemVariant}/>
            <motion.div
                variants={itemVariant}
                className="col-12 pt-3 text-center">
                <LangSelect/>
            </motion.div>
        </motion.div>
    )
}
// eslint-disable-next-line react/prop-types
function DeliveryBtn({itemVariant}) {
    const state = useAppState();
    if (state.userRoles.includes("delivery") || state.userRoles.includes("admin")) {
        return (
            <motion.div
                variants={itemVariant}
                className="col-12 text-center">
                <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                    <Link to={"/delivery"} style={{
                            borderRadius: "40px",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                        }}
                        className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                        <FaTruckFast fontSize={"1.7rem"} color="white" />
                        <span className="ps-2 pe-2"><Lang>Delivery</Lang></span>
                    </Link>
                </div>
            </motion.div>
        )
    } else {
        return "";
    }
}
/**
 * check if the user has the access to delivery part
 * @return delivery button
 */
// eslint-disable-next-line react/prop-types
function CachierBtn({itemVariant}) {
    const state = useAppState();
    if (state.userRoles.includes("cachier") || state.userRoles.includes("admin")) {
        return (
            <motion.div
                variants={itemVariant}
                className="col-12 text-center">
                <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                    <Link to={"/pos"} style={{
                            borderRadius: "40px",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                        }}
                        className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                        <FaSackDollar fontSize={"1.7rem"} color="white" />
                        <span className="ps-2 pe-2"><Lang>Pos</Lang></span>
                    </Link>
                </div>
            </motion.div>
        )
    } else {
        return "";
    }
    
}
/**
 * check if user is admin to display admin links
 * @param {*} param0 
 * @returns 
 */
// eslint-disable-next-line react/prop-types
function AdminLinks({handleOpen,itemVariant}) {
    const state = useAppState();
    if (state.userRoles.includes("admin")) {
        return (
            <>
                <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/statistics"} Icon={FaChartLine} />
                <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/sales"} Icon={FaBagShopping} />
                <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/purchases"} Icon={FaCartArrowDown} />
                <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/spents"} Icon={FaSackDollar} />
                <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/settings"} Icon={FaGear} />
            </>
        )
    } else {
        return <></>
    }    
}

function DashboardBtn({itemVariant}) {
    const state = useAppState();
    const location = useLocation();
    if ((state.userRoles.includes("manager") || state.userRoles.includes("admin")) && location.pathname =="/profile") {
        return (
            <motion.div variants={itemVariant} style={{verticalAlign:"middle"}} className="text-center p-1">
                <Link to={"/"} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaHouse fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>Dashboard</Lang></span>
                </Link>
            </motion.div>
        )
    } else {
        return "";
    }
    
}