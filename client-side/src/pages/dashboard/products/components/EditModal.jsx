import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { Spinner } from "../../../../components/Spinner";
import { useAppAction } from "../../../../context/context";
import { PrimaryButton } from "../../../../components/primaryButton";
import { useProductsAction, useProductsState } from "../../../../context/productsContext";
import api, { getImageURL } from "../../../../api/api";
import { UploadImage } from "../../../../components/UploadImage";

export function EditModal() {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState();
    const [categories, setCategories] = useState();
    const appAction = useAppAction();
    const productsAction = useProductsAction();
    const productsState = useProductsState();
    useEffect(()=> {
        //get product infos
        api({
            method: "GET",
            url: "/productManage/" + productsState.editProducts,
            //withCredentials: true,
        }).then(res => {
            return res.data
        }).then(res => {
            setProduct(res.data);
            setCategories(res.categories);
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
            type: "TOGGLE_EDIT_MODAL",
            payload: false,
        })
    }
    //handle submit 
    const refActive = useRef();
    const refStock = useRef();
    const refExpires = useRef();
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        formData.append("active",refActive.current.checked?1:0)
        formData.append("enable_stock",refStock.current.checked?1:0)
        formData.append("expires",refExpires.current.checked?1:0)
        setLoading(true);
        api({
            method: "POST",
            url: "/product/" + product.id,
            data: formData,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            productsAction({
                type: "UPDATE_CURRENT_PRODUCT",
                payload: res.data
            })
            productsAction({
                type: "UPDATE_PRODUCT",
                payload: res.data
            })
            appAction({
                type: "SET_SUCCESS",
                payload: "Updated with success"
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
                            <div className="title h3 m-0"><Lang>Edit Product</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Barcode</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required  disabled={loading} name="barcode"  className="form-control" placeholder={Lang({ children: "Tap barcode" })} defaultValue={product?.barcode} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="name"  className="form-control" placeholder={Lang({ children: "Tap Name" })} defaultValue={product?.name} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Wholesales Price</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" required step={0.1} disabled={loading} name="wholesales_price"  className="form-control" placeholder={Lang({ children: "Tap Wholesales price" })} defaultValue={product?.wholesales_price} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Retail Price</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" required step={0.1} disabled={loading} name="retail_price" className="form-control" placeholder={Lang({ children: "Tap Retail Price" })} defaultValue={product?.retail_price} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Discount</Lang> : {loading && <Spinner/>}</label>
                            <input type="number" required step={0.1} disabled={loading} name="discount"  className="form-control" placeholder={Lang({ children: "Tap Discount" })} defaultValue={product?.discount} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Cachier Margin</Lang> : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="cachier_margin"  className="form-control" placeholder={Lang({ children: "Tap Cachier Margin" })} defaultValue={product?.cachier_margin} id="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Category</Lang> : {loading && <Spinner/>}</label>
                            <select name="category_id" disabled={loading} className="form-select" defaultValue={product?.category_id}>
                                {categories?.map(item => {
                                    return (
                                        item.id === product.category_id ? 
                                        <option key={item.id} selected value={item.id}>{item.name}</option>
                                        : 
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner/>}</label>
                            <UploadImage loading={loading} image={getImageURL(product?.picture)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>State</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input  className="form-check-input" ref={refActive} type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={product?.active} />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked"><Lang>Enable</Lang></label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Expires</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input  className="form-check-input" ref={refExpires} type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={product?.expires} />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked"><Lang>Enable</Lang></label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Stock Manage</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input  className="form-check-input" ref={refStock}  type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={product?.enable_stock} />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked"><Lang>Enable</Lang></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <PrimaryButton label={"Save"} handleClick={()=>null} disabled={loading} type={"submit"} />
                    </div>
                </form>
            </div>
        </div>
    )
}