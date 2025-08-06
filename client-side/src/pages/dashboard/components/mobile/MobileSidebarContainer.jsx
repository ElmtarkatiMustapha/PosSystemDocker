/**
 * @usage this component is the container of menu items (manage items and sidebar items)
 * @mode mobile mode
 * @param isOpen the state of the sidebar menu 
 * @param isManage the state of manage menu (sub menu)
 * @param handleOpen function used to handle opening sidebar menu
 * @param handleManage function used to handle opening manage menu(sub menu)
 * @returns jsx component
 */
import { MobileManageContent } from "./MobileManageContent"
import { MobileSidebarContent } from "./MobileSidebarContent"
import { motion } from "framer-motion"
// eslint-disable-next-line react/prop-types
export function MobileSidebarContainer({isOpen, isManage, handleManage, handleOpen}) {
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
            className="mobile-sidebar z-1 container-fluid position-fixed top-0 w-100 h-100">
            <div className="row align-items-center h-100">
                <div className="col-12 container-fluid">
                    
                        {isOpen && isManage ?
                            <MobileManageContent listVariant={listVariant} itemVariant={itemVariant} handleOpen={handleOpen} handleManage={handleManage}/>
                            :
                            isOpen &&
                            <MobileSidebarContent listVariant={listVariant} itemVariant={itemVariant} handleOpen={handleOpen} handleManage={handleManage}/>
                        }
                </div>
            </div>
        </motion.div>
    )
}