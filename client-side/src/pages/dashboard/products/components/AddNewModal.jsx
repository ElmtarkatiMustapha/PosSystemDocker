import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { Spinner } from "../../../../components/Spinner";
import { useAppAction } from "../../../../context/context";
import { PrimaryButton } from "../../../../components/primaryButton";
import { useProductsAction } from "../../../../context/productsContext";
import api from "../../../../api/api";
import { UploadImage } from "../../../../components/UploadImage";

export function AddNewModal() {
    const [loading, setLoading] = useState(true);
    const [enableStock, setEnableStock] = useState(false);
    const [categories, setCategories] = useState();
    const appAction = useAppAction();
    const productsAction = useProductsAction();
    const refStock = useRef();
    const refExpires = useRef();
    useEffect(()=> {
        //get product infos
        api({
            method: "GET",
            url: "/allCategories",
            withCredentials: true,
        }).then(res => {
            return res.data
        }).then(res => {
            setCategories(res.data);
            setLoading(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            handleClose();
        })
    },[])
    const handleClose = () => {
        productsAction({
            type: "TOGGLE_ADD_MODAL",
            payload: false,
        })
    }
    //handle submit 
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        formData.append("enable_stock",refStock.current.checked?1:0)
        formData.append("expires",refExpires.current.checked?1:0)
        setLoading(true);
        api({
            method: "POST",
            url: "/addProduct",
            data: formData,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            console.log(res.data);
            productsAction({
                type: "ADD_PRODUCT",
                payload: res.data
            })
            appAction({
                type: "SET_SUCCESS",
                payload: "Add with success"
            })
            handleClose();
            setLoading(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false);
        })
    }
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Add Product</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Barcode</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={loading} name="barcode"  className="form-control" placeholder={Lang({ children: "Tap barcode" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="name"  className="form-control" placeholder={Lang({ children: "Tap Name" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Wholesales Price</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" min={0} step={0.1} required disabled={loading} name="wholesales_price"  className="form-control" placeholder={Lang({ children: "Tap Wholesales price" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Retail Price</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" min={0} step={0.1} required disabled={loading} name="retail_price" className="form-control" placeholder={Lang({ children: "Tap Retail Price" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Discount</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" min={0} step={0.1} required disabled={loading} name="discount"  className="form-control" placeholder={Lang({ children: "Tap Discount" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Cachier Margin</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" min={0} step={0.01} required disabled={loading} name="cachier_margin"  className="form-control" placeholder={Lang({ children: "Tap Cachier Margin" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Category</Lang> : {loading && <Spinner/>}</label>
                            <select name="category_id" required disabled={loading} className="form-select">
                                <option key={0} value={""}><Lang>Chose Category </Lang> </option>
                                {categories?.map(item => {
                                    return (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner/>}</label>
                            <UploadImage loading={loading} image="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Expires</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input  className="form-check-input" ref={refExpires} type="checkbox" role="switch" id="flexSwitchCheckChecked"  />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked"><Lang>Enable</Lang></label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Stock Manage</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input onChange={(e) => { setEnableStock(e.target.checked) }} className="form-check-input" ref={refStock}  type="checkbox" role="switch" id="flexSwitchCheckChecked"  />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked"><Lang>Enable</Lang></label>
                                </div>
                            </div>
                        </div>
                        {enableStock && 
                            <StockInput/>
                        }
                    </div>
                    <div className="modal-footer">
                        <PrimaryButton label={"Save"} handleClick={()=>null} disabled={loading} type={"submit"} />
                    </div>
                </form>
            </div>
        </div>
    )
}
function StockInput() {
    return (
        <>
            <div className="mb-3">
                <label className="form-label h5"><Lang>Current Stock</Lang> :</label>
                <input type="number" min={0} required  name="current_stock"  className="form-control" placeholder={Lang({ children: "Tap Current stock" })}   />
            </div>
            <div className="mb-3">
                <label className="form-label h5"><Lang>Purchase price</Lang> :</label>
                <input type="number" min={0} step="0.01" required  name="purchase_price"  className="form-control" placeholder={Lang({ children: "Tap Purchase price" })}   />
            </div>
        </>
    )
}