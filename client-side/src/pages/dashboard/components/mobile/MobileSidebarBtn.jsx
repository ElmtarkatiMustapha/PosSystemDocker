/**
 * @mode mobile mode
 * @location used for sidebar
 * @param variants for animate the btn on open and on close
 * @param path location of route
 * @param icon the icon of the btn
 * @param handle the function that execute when click the btn
 * @returns a jsx component
 */
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
// eslint-disable-next-line react/prop-types
export function MobileSidebarBtn({variants, path,Icon,handle}) {
    return (
        <motion.div
            variants={variants}
            className="col-6 p-3 text-center">
            <NavLink onClick={handle} to={path} className="btn main-btn">
                    <Icon/> 
            </NavLink>
        </motion.div>
    )
}