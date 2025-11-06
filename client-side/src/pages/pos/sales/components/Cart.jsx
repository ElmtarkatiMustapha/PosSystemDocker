import { FaTrash } from "react-icons/fa6";
import { Lang } from "../../../../assets/js/lang";
import { usePosState } from "../../../../context/posContext";
import { CartHeader } from "../../components/CartHeader";
import { CartItem } from "../../components/CartItem";
import { AmountProvided } from "../../components/AmountProvided";
import { FooterCart } from "../../components/FooterCart";
import { CartControlsButtons } from "./CartControlsButtons";

export function Cart({handleClick=()=>null}) {
    const posState = usePosState();
    // useEffect(() => {
    //     console.log(posState.cart)
    // },[])
    return (
        <div className="container-fluid p-3 cart-box">
            <div className="row pt-1 pb-1">
                <div className="col-12 h4 text-center">
                    <Lang>Cart</Lang>
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
                </div>
            </div>
            <div className="row ps-3 pt-1 pb-1">
                <AmountProvided/>
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

