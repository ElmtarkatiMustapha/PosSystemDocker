import { motion } from "framer-motion";
import { CategoriesBtn } from "./CategoriesBtn";
import "../assets/css/categorySidebarStyle.css";
import { usePosAction, usePosState } from "../context/posContext";
import { useEffect } from "react";
import api, { getImageURL } from "../api/api";
// eslint-disable-next-line react/prop-types
export function CategorySidebar({ handle, isOpen }) {
    const variantsSidebar = {
        open: {
            x: "0%",
        },
        close: {
            x: "-100%",
        }
    }
    const posState = usePosState();
    const posAction = usePosAction();
    useEffect(() => {
        loadCategories().then(data => {
            posAction({
                type: "SET_CATEGORIES",
                payload: data
            })
        })
    }, [])
    const loadCategories = () => {
        return new Promise((resolve, reject) => {
            api({
            method: "get",
            url: "/categories",
            // withCredentials:true
            }).then(res => {
                return res.data;
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }
    return (
        <>
            <motion.div
                    transition={{ type: "tween"}}
                    variants={variantsSidebar}
                    animate={isOpen?"open":"close"}
                    className="categorySidebar position-fixed  d-inline-block"
                >
                {/* here the content of sidebar  */}
                <div className="mainCategorySidebar p-2 container-fluid">
                    {posState.allCategories?.map((item) => {
                        return <Item key={item.id} title={item.name} image={item.picture} id={item.id}/>
                    })}
                </div>
                </motion.div>
                <CategoriesBtn handle={handle} isOpen={isOpen} />
        </>
    )
}

// eslint-disable-next-line react/prop-types
function Item({ title, image, id }) {
    const posState = usePosState();
    const posAction = usePosAction();

    const handleCategory = () => {
        posAction({
            type: "SET_CATEGORY_PRODUCTS",
            payload: posState.allProducts.filter(item => {
                return item.category_id === id;
            })
        })
        posAction({
            type: "SET_CURRENT_PAGE",
            payload: 1
        })
    }
    return (
        <div className="row p-2 m-0">
            <motion.div
                style={{
                    backgroundImage: "url("+getImageURL(image)+")"
                }}
                className="col-12 p-0 m-0 elem"
                onClick={handleCategory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="p-2 w-100 h-100 filter">
                    <h4 className="title text-center">
                        {title}
                    </h4>
                </div>
            </motion.div>
        </div>
    )
}