/**
 * @mode mobile mode
 * @location used for the sidebar is private for manage btn
 * @param variants for animate the btn on open and on close
 * @param icon the icon of the btn
 * @param handle the function that execute when click the btn
 * @returns a jsx component
 */
import { motion } from "framer-motion"
// eslint-disable-next-line react/prop-types
export function MobileManageBtn({ variants, Icon, handle }) {
    return (
        <motion.div
            variants={variants}
            className="col-6 p-3 text-center">
            <button onClick={handle}  className="btn main-btn">
                    <Icon/> 
            </button>
        </motion.div>
    )
}