import { useEffect, useState } from "react";
import { usePosAction, usePosState } from "../../../context/posContext";
import { Lang } from "../../../assets/js/lang";
import { useAppState } from "../../../context/context";

export function FooterCart() {
    const posState = usePosState();
    const posAction = usePosAction()
    const appState = useAppState();
    const [total, setTolal] = useState(0);
    const [quantity, setquantity] = useState(0);
    const [totalTax, setTolalTax] = useState(0);
    const [totalDiscount, setTolalDiscount] = useState(0);
    const [totalHT, setTolalHT] = useState(0);
    const [totalTTC, setTolalTTC] = useState(0);
    const [rest, setRest] = useState(0);
    useEffect(() => {
        posAction({
            type: "SET_TAX",
            payload: appState.settings?.posSettings?.tva
        })
    },[])
    useEffect(() => {
        //total 
        setTolal(Number(
            posState.cart.cartItems.reduce((acc, currVal) => {
                if (posState.cart.orderType === "retail") {
                    return acc + currVal.qnt*currVal.product.retailPrice
                } else {
                    return acc + currVal.qnt*currVal.product.wholesalePrice
                }
            }, 0)
        ).toFixed(2))
        //quantity
        setquantity(
            posState.cart.cartItems.reduce((acc, currVal) => {
                return acc + currVal.qnt;
            },0)
        )
    }, [posState])
    useEffect(() => {
        //total discount
        setTolalDiscount(Number(
            posState.cart.cartItems.reduce((acc, currVal) => {
                    return acc + total * currVal.product.discount/100
            }, 0)
        ).toFixed(2))
    }, [total, posState])
    
    useEffect(() => {
        //total HT
        setTolalHT(Number(
            total - totalDiscount
        ).toFixed(2))
    },[total,totalDiscount])
    
    useEffect(() => {
        //total tax
        setTolalTax(
            Number(
                Number(totalHT)*Number(posState.cart.tax)/100
            ).toFixed(2)
        )
    }, [totalHT,posState.cart.tax])
    
    useEffect(() => {
        //total ttc
        setTolalTTC(Number(
            Number(totalHT)+Number(totalTax)
        ).toFixed(2))
    },[totalHT,totalTax])
    useEffect(() => {
        //Rest
        setRest(Number(
            Number(posState.cart.amountProvided) - Number(totalTTC)
        ).toFixed(2))
    },[posState.cart.amountProvided,totalTTC])
    return (
        <div className="col-12 container-fluid">
            <div className="row">
                <div className="col-4 pt-1 pb-1 title"><Lang>Total</Lang>:</div>
                <div className="col-8 pt-1 pb-1 data">{total} {appState.settings?.businessInfo?.currency?.symbol}</div>
                <div className="col-4 pt-1 pb-1 title"><Lang>Quantity</Lang>:</div>
                <div className="col-8 pt-1 pb-1 data">{quantity}</div>
                <div className="col-4 pt-1 pb-1 title"><Lang>Total Discount</Lang>:</div>
                <div className="col-8 pt-1 pb-1 data">{totalDiscount} {appState.settings?.businessInfo?.currency?.symbol}</div>
                <div className="col-4 pt-1 pb-1 title"><Lang>Total</Lang>({appState.settings?.businessInfo?.currency?.symbol}):</div>
                <div className="col-8 pt-1 pb-1 data">{ totalHT} {appState.settings?.businessInfo?.currency?.symbol}</div>
                <div className="col-4 pt-1 pb-1 title"><Lang>Total Tax</Lang>:</div>
                <div className="col-8 pt-1 pb-1 data">{ totalTax} {appState.settings?.businessInfo?.currency?.symbol}</div>
                <div className="col-4 pt-1 pb-1 title"><Lang>Total</Lang>(TTC):</div>
                <div className="col-8 pt-1 pb-1 data">{ totalTTC} {appState.settings?.businessInfo?.currency?.symbol}</div>
                <div className="col-4 pt-1 pb-1 title"><Lang>The Rest</Lang>:</div>
                <div className="col-8 pt-1 pb-1 data">{rest} {appState.settings?.businessInfo?.currency?.symbol}</div>
            </div>
        </div>
    )
}