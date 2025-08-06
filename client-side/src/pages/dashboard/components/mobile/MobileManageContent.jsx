
import { motion } from "framer-motion"
import { MobileSidebarBtn } from "./MobileSidebarBtn"
import { FaBackward,FaPuzzlePiece, FaProductHunt,FaShapes, FaClipboardCheck,FaBoxesStacked, FaDolly, FaUserShield, FaUsers } from "react-icons/fa6"
import { useAppState } from "../../../../context/context";
/**
 * @mode mobile mode
 * @param listVariant the animation of the list
 * @param itemVariant the animation of the btns
 * @param handleOpen function used to handle opening sidebar menu
 * @param handleManage function used to handle opening manage menu(sub menu)
 * @returns jsx component
 */
// eslint-disable-next-line react/prop-types
export function MobileManageContent({ listVariant,itemVariant, handleOpen,handleManage }) {
    return (
        <motion.div
            className="row justify-content-center"
            variants={listVariant}
        >
            <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/categories"} Icon={FaShapes}  />
            <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/products"} Icon={FaProductHunt} />
            <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/sectors"} Icon={FaPuzzlePiece} />
            <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/customers"} Icon={FaUsers} />
            <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/stocks"} Icon={FaBoxesStacked} />
            <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/orders"} Icon={FaClipboardCheck} />
            {/* these links for admin user */}
            <AdminLinks itemVariant={itemVariant} handleOpen={handleOpen} />
            <motion.div
                variants={itemVariant}
                className="col-6 p-3 text-center">
                    <a onClick={handleManage} className="back-button d-inline-block m-0"><FaBackward /></a>
            </motion.div>
        </motion.div>
    )
}

// eslint-disable-next-line react/prop-types
function AdminLinks({itemVariant,handleOpen}) {
    const state = useAppState();
    if (state.userRoles.includes("admin")) {
        return (
            <>
            
            <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/users"} Icon={FaUserShield} />
            <MobileSidebarBtn variants={itemVariant} handle={handleOpen} path={"/suppliers"} Icon={FaDolly} />
            </>
        )
    } else {
        return <></>
    }    
}