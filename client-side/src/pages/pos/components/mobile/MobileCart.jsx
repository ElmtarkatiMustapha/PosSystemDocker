import { motion } from "framer-motion"
import { Cart } from "../Cart"
import {Cart as EditSaleCart} from "../../sales/components/Cart"
import { Cart as PurchaseCart} from "../../purchase/components/Cart"
import { EditCart as EditPurchaseCart } from "../../purchase/components/EditCart";
import { useLocation } from "react-router-dom";
export function MobileCart({ handleCart }) {
    const menuVariant = {
        open: {
            opacity: 1,
        },
        closed: {
            opacity: 0,
        }
    }
    const location = useLocation();
    
    return (
        <motion.div
            variants={menuVariant}
            animate={"open"}
            initial={"closed"}
            exit={"closed"}
            className="bg-white container-fluid overflow-auto position-fixed top-0 z-3 w-100 h-100">
            <div className="row h-100 align-items-center m-0">
                <div className="col-12 container-fluid">
                    {location.pathname.includes("/pos/purchase")? 
                        location.pathname == "/pos/purchase"?
                            <PurchaseCart handleClick={handleCart} />
                            :
                            <EditPurchaseCart handleClick={handleCart} />
                        :
                        location.pathname == "/pos"?
                            <Cart handleClick={handleCart}/>
                            :
                            <EditSaleCart handleClick={handleCart}/>
                    }
                </div>
            </div>
            <div style={{height:"4rem"}}></div>
        </motion.div>
    )
}