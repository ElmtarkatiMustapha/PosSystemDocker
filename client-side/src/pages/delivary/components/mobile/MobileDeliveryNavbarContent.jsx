import { motion } from "framer-motion"
import { useAppState } from "../../../../context/context"
import { Link } from "react-router-dom"
import { FaHouse, FaSackDollar, FaUsers } from "react-icons/fa6"
import { Lang } from "../../../../assets/js/lang"
export function MobileDeliveryNavbarContent() {
    const menuVariant = {
        open: {
            opacity: 1,
        },
        closed: {
            opacity: 0,
            transition: {
                delay: 0.7,
            }
        }
    }
    const listVariant = {
        open: {
            transition: {
                staggerChildren:0.07,delayChildren:0.2
            }
        },
        closed: {
            transition: {
                staggerChildren:0.05,staggerDirection: -1
            }
        }
    }
    const itemVariant = {
        open: {
            y:0,
            opacity: 1,
            transition: {
                y: {
                    stiffness:1000,velocity:-100
                }
            }
        },
        closed: {
            y:50,
            opacity: 0,
            transition: {
                y: {
                    stiffness:1000
                }
            }
        }
    }
    return (
        <motion.div
            variants={menuVariant}
            animate={"open"}
            initial={"closed"}
            exit={"closed"}
            className="mobilePosNavbarContent container-fluid position-fixed top-0 z-3 w-100 h-100">
            <div className="row h-100 align-items-center">
                <div className="col-12 container-fluid">
                    <motion.div
                        variants={listVariant}
                        className="row"
                    >
                        <ClientsBtn variants={itemVariant} />
                        <PosBtn variants={itemVariant} />
                        <DashboardBtn variants={itemVariant} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

function ClientsBtn({variants}) {
    const state = useAppState();
    if (state.userRoles.includes("manager") || state.userRoles.includes("admin")) {
        return (
            <motion.div
                style={{ verticalAlign: "middle" }}
                className="col-12 col-sm-12 col-md-6 text-center p-1"
                variants={variants}
            >
                <Link to={"/customers"} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaUsers fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>Customers</Lang></span>
                </Link>
            </motion.div>
        )
    } else if(state.userRoles.includes("cachier")){
        return (
            <motion.div
                style={{ verticalAlign: "middle" }}
                className="col-12 col-sm-12 col-md-6 text-center p-1"
                variants={variants}
            >
                <Link to={"/pos/customers"} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaUsers fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>Customers</Lang></span>
                </Link>
            </motion.div>
        )
    } else {
        return ""
    }
}

/**
 * check if the user has the access to cachier part
 * @return delivery button
 */
function PosBtn({variants}) {
    const state = useAppState();
    if (state.userRoles.includes("cachier") || state.userRoles.includes("admin")) {
        return (
            <motion.div
                style={{ verticalAlign: "middle" }}
                className="col-12 col-sm-12 col-md-6 text-center p-1"
                variants={variants}
            >
                <Link to={"/pos"} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaSackDollar fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>POS</Lang></span>
                </Link>
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
function DashboardBtn({variants}) {
    const state = useAppState();
    if (state.userRoles.includes("manager") || state.userRoles.includes("admin")) {
        return (
            <motion.div
                style={{ verticalAlign: "middle" }}
                className="col-12 col-sm-12 col-md-6 text-center p-1"
                variants={variants}
            >
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