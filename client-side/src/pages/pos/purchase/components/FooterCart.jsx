import { useEffect, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { usePosState } from "../../../../context/posContext";
import { useAppState } from "../../../../context/context";

export function FooterCart() {
    const [total, setTolal] = useState(0);
    const [quantity, setquantity] = useState(0);

    const posState = usePosState();
    const appState = useAppState();

    useEffect(() => {
        //total 
        setTolal(Number(
            posState.purchaseCart.cartItems.reduce((acc, currVal) => {
                return acc + Number(currVal.qnt) * Number(currVal.product.purchasePrice)
            }, 0)
        ).toFixed(2))
        //quantity
        setquantity(
            posState.purchaseCart.cartItems.reduce((acc, currVal) => {
                return acc + currVal.qnt;
            },0)
        )
    }, [posState.purchaseCart])
    return (
        <div className="col-12 container-fluid">
            <div className="row">
                <div className="col-4 pt-1 pb-1 title"><Lang>Quantity</Lang>:</div>
                <div className="col-8 pt-1 pb-1 data">{quantity}</div>
                <div className="col-4 pt-1 pb-1 title"><Lang>Total</Lang>:</div>
                <div className="col-8 pt-1 pb-1 data">{total}{appState.settings?.businessInfo?.currency?.symbol}</div>
            </div>
        </div>
    )
}