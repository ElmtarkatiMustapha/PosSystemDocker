import { FaTrash } from "react-icons/fa6";
import { Lang } from "../../../assets/js/lang";
import { usePosState } from "../../../context/posContext";
import { CartHeader } from "./CartHeader";
import { CartItem } from "./CartItem";
import { AmountProvided } from "./AmountProvided";
import { FooterCart } from "./FooterCart";
import { CartControlsButtons } from "./CartControlsButtons";
import { useEffect, useRef } from "react";

export function Cart({handleClick}) {
    const posState = usePosState();
    const bottomRef = useRef(null);

    useEffect(() => {
        // Scroll to bottom when cartItems changes
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [posState?.cart?.cartItems]);
    return (
        <div className="container-fluid p-3 cart-box m-0">
            <div className="row pt-1 pb-1 m-0">
                <div className="col-12 h4 text-center">
                    <Lang>Cart</Lang>
                </div>
            </div>
            <div className="row m-0">
                <CartHeader/>
            </div>
            <div className="row pt-1 pb-1 m-0">
                <div className="col-12 parent-table table-responsive">
                    <table className="table ">
                        <tr>
                            <th>
                                <FaTrash color="black" className="icon-remove p-2"/>
                            </th>
                            <th><Lang>Product</Lang></th>
                            <th><Lang>QNT</Lang></th>
                            <th><Lang>Discount</Lang></th>
                            <th><Lang>Total (HT)</Lang></th>
                        </tr>
                        {posState?.cart?.cartItems?.map((item) => {
                            return (
                                <CartItem key={item.product.id} id={item.product.id} codebar={item.product.codebar} name={item.product.name} price={posState.cart.orderType=="retail"?item.product.retailPrice:item.product.wholesalePrice} qnt={item.qnt} discount={item.product.discount} />
                            )
                        })}
                    </table>
                    <div ref={bottomRef} />
                </div>
            </div>
            <div className="row ps-3 pt-1 pb-1 m-0">
                <AmountProvided/>
            </div>
            <div className="row ps-3 pt-1 pb-1 m-0">
                <FooterCart/>
            </div>
            <div className="row ps-3 pt-1 pb-1 m-0">
                <CartControlsButtons handleClick={handleClick} />
            </div>
        </div>
    )
}

