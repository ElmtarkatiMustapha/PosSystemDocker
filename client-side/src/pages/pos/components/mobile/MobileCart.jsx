import { motion } from "framer-motion"
import { Cart } from "../Cart"
export function MobileCart({ handleCart }) {
    const menuVariant = {
        open: {
            opacity: 1,
        },
        closed: {
            opacity: 0,
        }
    }
    
    return (
        <motion.div
            variants={menuVariant}
            animate={"open"}
            initial={"closed"}
            exit={"closed"}
            className="bg-white container-fluid overflow-auto position-fixed top-0 z-3 w-100 h-100">
            <div className="row h-100 align-items-center m-0">
                <div className="col-12 container-fluid">
                    <Cart handleClick={handleCart}/>
                </div>
            </div>
            <div style={{height:"4rem"}}></div>
        </motion.div>
    )
}