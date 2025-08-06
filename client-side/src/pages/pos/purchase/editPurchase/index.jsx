import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useAppAction, useAppState } from "../../../../context/context";
import { MobileCategorySidebar } from "../../components/mobile/MobileCategorySidebar";
import { CategorySidebar } from "../../../../components/CategorySidebar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ProductsList } from "../components/ProductsList";
import { Paginate } from "../../components/Paginate";
import { Cart } from "../components/Cart";
import { usePosAction, usePosState } from "../../../../context/posContext";
import { Lang } from "../../../../assets/js/lang";
import api from "../../../../api/api";
import { EditCart } from "../components/EditCart";
export function EditPurchase() {
    const { id } = useParams(); 
    const appState = useAppState();
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const posState = usePosState();
    const posAction = usePosAction();
    const appAction = useAppAction();
    const navigate = useNavigate();
    const variantsContent = {
        open: {
            width: "calc(100% - 15rem)",
        },
        close: {
            width: "100%",
        }
    }
    const handleCategories = () => {
         setCategoriesOpen(!categoriesOpen);
    }
    useEffect(() => {
        api({
            method: "get",
            url: "/editPurchase/" + id,
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            //initial cart and all state
            console.log(res.data)
            posAction({
                type: "TOGGLE_SUPPLIER",
                payload: res.data.supplier
            })
            posAction({
                type: "SET_PURCHASE_ITEMS",
                payload: res.data.cartItems
            })
            posAction({
                type: "SET_EDIT_PURCHASE",
                payload: id
            })
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            navigate(-1)
        })
    },[])
    return (
        <>
            {appState.isMobile && <MobileCategorySidebar />}
            {!appState.isMobile && <CategorySidebar handle={handleCategories} isOpen={categoriesOpen} />}
            <main style={{height:"100vh"}} className="w-100 text-end">
                <motion.div
                    style={{
                        marginTop:"4rem"
                    }}
                    variants={variantsContent}
                    animate={categoriesOpen ? "open" : "close"}
                    className="text-start d-inline-block"
                >
                    <div className="container-fluid ps-2">
                            <div className="row">
                                <div className={ appState.isMobile ? "col-12":"col-7" }>
                                <div className="container-fluid ">
                                    <div className="row p-2">
                                        <div className="col-12 shadow-sm bg-white rounded-3 p-2 container-fluid">
                                            <div className="row m-0 justify-content-between">
                                                <div className={"col-12 h2 align-content-center "}><Lang>Edit Purchase</Lang>: {id}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row m-0 pt-2 pb-2">
                                        <ProductsList />
                                    </div>
                                    <div className="row m-0 p-2">
                                        {posState.numberPages > 1 && <Paginate/>} 
                                    </div>
                                </div>
                            </div>
                            {!appState.isMobile &&
                                <div className="col-5">
                                    <EditCart/>
                                </div>
                            }
                            </div>
                        </div>
                </motion.div>
            </main>
        </>
    )
}