/**
 * @description this file containe two type of btn one for simple navigation and other to open the sub menu
 */
import { NavLink, useLocation } from "react-router-dom";
import { Lang } from "../../../assets/js/lang";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
/**
 * 
 * @param {string} title btn title 
 * @param {link} path the link  
 * @param {Icon} Icon   
 * @param {function} handle the function that will execute when btn clicked   
 * @returns 
 */
export function SidebarBtn({ title, path, Icon, handle }) {
    return (
        <div className="p-1 box-shadow">
            <motion.div
                className="box ms-0 container-fluid ps-0 pe-4"
                initial={{
                    clipPath: "circle(23px at 22px 23px)"
                }}
                whileHover={{
                    clipPath: "circle(15rem at 0px 0px)"
                }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="row w-100 align-items-center h-100 p-0 ">
                    <NavLink onClick={handle} to={path} className="link text-start col pt-0 ps-2 ">
                        <span>
                            <Icon className="icon" size={"1.7rem"} />
                        </span>
                        <span style={{ verticalAlign: "middle" }} className="ps-3 h6"><Lang>{ title}</Lang></span>
                    </NavLink>
                </div>
            </motion.div>
        </div>
    )
}
/**
 * this btn will open a sub menu 
 * @param {string} title btn title  
 * @param {Icon} Icon   
 * @param {function} handle the function that will execute when btn clicked   
 * @returns 
 */
export function SidebarSubBtn({ title, handle, Icon }) {
    const location = useLocation();
    const [isActive, setIsActive] = useState("");
    const arrayPath = ["/categories", "/products", "/sectors", "/clients", "/users", "/suppliers"]
    useEffect(() => {
        if (arrayPath.includes(location.pathname)) {
            setIsActive("active");
        } else {
            setIsActive("")
        }
    }, [location.pathname])
    return (
        <div className="p-1 box-shadow">
            <motion.div
                className="box ms-0 container-fluid ps-0 pe-4"
                initial={{
                    clipPath: "circle(23px at 22px 23px)"
                }}
                whileHover={{
                    clipPath: "circle(15rem at 0px 0px)"
                }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="row w-100 align-items-center h-100 p-0 ">
                    <button style={{backgroundColor:"transparent", border:"0px"}} onClick={handle} className={isActive+" link text-start col pt-0 ps-2"}>
                        <span>
                            <Icon className="icon" size={"1.7rem"} />
                        </span>
                        <span style={{ verticalAlign: "middle" }} className="ps-3 h6"><Lang>{ title}</Lang></span>
                    </button>
                </div>
            </motion.div>
        </div>
    )
}