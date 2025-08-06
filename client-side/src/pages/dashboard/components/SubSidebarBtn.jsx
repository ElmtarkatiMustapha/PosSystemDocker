import { NavLink } from "react-router-dom";
import { Lang } from "../../../assets/js/lang";
import { motion } from "framer-motion";
/**
 * 
 * @param {JSON} variants object contain animation of btn 
 * @param {Link} path the link
 * @param {String} title the title of the btn 
 * @param {function} handle execute when btn is clicked 
 * @returns 
 */
export function SubSidebarBtn({variants,path,title, handle = null}) {
    return (
        <motion.div
            variants={variants}
            className="col-4 p-4">
            <motion.div 
                className="d-inline-block"
                whileHover={{scale:1.2}}
                whileTap={{scale:0.8}}
            >
                <NavLink onClick={handle} className="btn ps-4 pe-4 btn-lg" to={path}><Lang>{ title }</Lang></NavLink>
            </motion.div>
        </motion.div>
    )
}