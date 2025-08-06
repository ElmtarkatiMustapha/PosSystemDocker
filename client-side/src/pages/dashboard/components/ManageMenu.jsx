/**
 * @usage this is for sub menu (manage menu)
 * @mode browser mode
 * @param handle function execute when click the btn
 * @param manageOpen state variable to check if the menu open or not
 */
import { SubSidebarBtn } from "./SubSidebarBtn";
import { FaBackward } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useAppState } from "../../../context/context";
import { Lang } from "../../../assets/js/lang";
// eslint-disable-next-line react/prop-types
export function ManageMenu({ handle, manageOpen }) {
    const manageMenuVariant = {
        open: {
            opacity: 1,
        },
        closed: {
            opacity: 0,
            transition: {
                delay: 0.7
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
    return (
        <AnimatePresence>
            {manageOpen && <motion.div
                variants={manageMenuVariant}
                animate={"open"}
                initial={"closed"}
                exit={"closed"}
                className="container-fluid p-0 m-0 w-100 h-100 z-1 fixed-top subSidebar">
                <div className="row justify-content-center ">
                    <div className="col-9 pt-5 text-center">
                        <div className="title w-100 h1"><Lang>Manage</Lang></div>
                        <div className="container-fluid pt-5">
                            <motion.div
                                variants={listVariant}
                                className="row" >
                                <SubSidebarBtn variants={itemVariant} handle={handle} path={"/categories"} title={"Categories"} />
                                <SubSidebarBtn variants={itemVariant} handle={handle} path={"/products"} title={"Products"} />
                                <SubSidebarBtn variants={itemVariant} handle={handle} path={"/sectors"} title={"Sectors"} />
                                <SubSidebarBtn variants={itemVariant} handle={handle} path={"/customers"} title={"Customers"} />
                                <SubSidebarBtn variants={itemVariant} handle={handle} path={"/stocks"} title={"Stock"} />
                                <SubSidebarBtn variants={itemVariant} handle={handle} path={"/orders"} title={"Orders"} />
                                <motion.div
                                    variants={itemVariant}
                                    className="col-4 p-4">
                                    <motion.div
                                        className="d-inline-block"
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.8 }}
                                    >
                                        <button onClick={handle} className="back-button h3 m-0"><FaBackward /></button>
                                    </motion.div>
                                </motion.div>
                                {/* these links is private for admin  */}
                                <AdminLinks itemVariant={itemVariant} handle={handle} />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>}
                </AnimatePresence>
    )
}

// eslint-disable-next-line react/prop-types
function AdminLinks({itemVariant,handle}) {
    const state = useAppState();
    if (state.userRoles.includes("admin")) {
        return (
            <>
                <SubSidebarBtn variants={itemVariant} handle={handle} path={"/users"} title={"Users"} />
                <SubSidebarBtn variants={itemVariant} handle={handle} path={"/suppliers"} title={"Suppliers"} />
            </>
        )
    } else {
        return <></>
    }    
}