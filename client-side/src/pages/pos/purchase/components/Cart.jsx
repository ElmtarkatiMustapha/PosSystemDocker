import { useEffect } from "react";
import { usePosState } from "../../../../context/posContext";
import { Lang } from "../../../../assets/js/lang";
import { FaTrash } from "react-icons/fa6";
import { CartHeader } from "./CartHeader";
import { FooterCart } from "./FooterCart";
import { CartControlsButtons } from "./CartControlsButtons";
import { CartItem } from "./CartItem";


export function Cart({handleClick}) {
    const posState = usePosState();
    useEffect(() => {
        // console.log(posState.products)
    },[])
    return (
        <div className="container-fluid p-3 cart-box">
            <div className="row pt-1 pb-1">
                <div className="col-12 h4 text-center">
                    <Lang>Purchase Cart</Lang>
                </div>
            </div>
            <div className="row ">
                <CartHeader/>
            </div>
            <div className="row pt-1 pb-1 ">
                <div className="col-12 parent-table table-responsive">
                    <table className="table ">
                        <tr>
                            <th>
                                <FaTrash color="black" className="icon-remove p-2"/>
                            </th>
                            <th><Lang>Product</Lang></th>
                            <th><Lang>Price</Lang></th>
                            <th><Lang>QNT</Lang></th>
                            <th><Lang>Total</Lang></th>
                        </tr>
                        {posState?.purchaseCart?.cartItems?.map((item) => {
                            return (
                                <CartItem key={item.product.id} id={item.product.id} codebar={item.product.codebar} name={item.product.name} price={item.product.purchasePrice} qnt={item.qnt} stocks={item.product.stocks} />
                            )
                        })}
                    </table>
                </div>
            </div>
            <div className="row ps-3 pt-1 pb-1">
                <FooterCart/>
            </div>
            <div className="row ps-3 pt-1 pb-1">
                <CartControlsButtons handleClick={handleClick}/>
            </div>
        </div>
    )
}