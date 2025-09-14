import { useEffect, useRef } from "react";
import { Lang } from "../../../assets/js/lang";
import { PrimaryButton } from "../../../components/primaryButton";
import { CategoriesList } from "./CategoriesList";
import { useCateAction, useCateState } from "../../../context/categoriesContext";
import api from "../../../api/api";
import { useAppAction } from "../../../context/context";
import { CategoriesListLoading } from "./components/CategoriesListLoading";
import { EditModal } from "./components/EditModal";
import { AddNewModal } from "./components/AddNewModal";
import { searchFunction } from "../../../assets/js/sharedFunction";
export function Categories() {
    const cateAction = useCateAction();
    const cateState = useCateState();
    const appAction = useAppAction();
    const refSearch = useRef();
    useEffect(() => {
        //load categories from server side
        api({
            method: "get",
            url: "/allCategories",
            // withCredentials:true
        }).then((res) => {
            return res.data
        }).then(res => {
        cateAction({
            type: "LOAD_CATEGORIES",
            payload:{
                ...cateState,
                allItems: res.data,
                storedItems: res.data,
                numberPages: Math.ceil(res.data.length / cateState.itemsPerPage),
                currentList: res.data.slice(
                    (cateState.currentPage - 1) * cateState.itemsPerPage,
                    cateState.currentPage * cateState.itemsPerPage
                )
            }
        });
        cateAction({
            type: "SET_LOADING",
            payload: false
        })
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            cateAction({
                type: "SET_LOADING",
                payload: false
            })
        })
        
    }, [])
    //set the current item to display in the screen
    useEffect(() => {
        cateAction({
            type: "SET_CURRENT_ITEMS",
            payload: cateState.allItems.slice(
                (cateState.currentPage - 1) * cateState.itemsPerPage,
                cateState.currentPage * cateState.itemsPerPage
            )
        })
    }, [cateState.currentPage])
    useEffect(() => {
        cateAction({
            type: "LOAD_CATEGORIES",
            payload:{
                ...cateState,
                numberPages: Math.ceil(cateState.allItems.length / cateState.itemsPerPage),
                currentPage: 1,
                currentList: cateState.allItems.slice(
                    (1 - 1) * cateState.itemsPerPage,
                    1 * cateState.itemsPerPage
                )
            }
        });
    }, [cateState.allItems])
    
    useEffect(() => {
        cateAction({
            type: "SET_ALL_ITEMS",
            payload: cateState.storedItems
        })
    }, [cateState.storedItems])
    
    
    const handleSearch = () => {
        /**
         * get search text
         * select category 
         * set selected categories in current items
         */ 
        const searchText = refSearch.current.value.trim();
        searchFunction(searchText, cateState, cateAction, "name");
        cateAction({
            type: "SET_PAGE",
            payload: 1
        })
    }
    //handle open add modal
    const handleAddNew = () => {
        cateAction({
            type: "TOGGLE_ADD_MODAL",
            payload: true,
        })
    }
    const handleSort = (e) => {
        let shortBy = e.target.value;
        let newList=[]
        switch (shortBy) {
            case "mostSale":
                newList = cateState.storedItems.sort((a, b) => {
                    return Number(b.nbOrders) - Number(a.nbOrders);
                });
                cateAction({
                    type: "LOAD_CATEGORIES",
                    payload:{
                        ...cateState,
                        allItems:newList,
                        currentPage: 1,
                        currentList: newList.slice(
                            (1 - 1) * cateState.itemsPerPage,
                            1 * cateState.itemsPerPage
                        )
                    }
                });
                break;
            case "disable":
                cateAction({
                    type: "SET_ALL_ITEMS",
                    payload: cateState.storedItems.filter((item) => item.active === 0)
                })
                break;
            default:
                newList = cateState.storedItems.sort((a, b) => {
                        return  a.name.localeCompare(b.name);
                    })
                cateAction({
                    type: "LOAD_CATEGORIES",
                    payload:{
                        ...cateState,
                        allItems:newList,
                        currentPage: 1,
                        currentList: newList.slice(
                            (1 - 1) * cateState.itemsPerPage,
                            1 * cateState.itemsPerPage
                        )
                    }
                });
                break;
        }
    }
    return (
            <div className="categoriesPage container-fluid p-2">
                <div className="row m-0">
                    <div className="col-12 headerPage p-2 container-fluid">
                        <div className="row m-0 justify-content-between">
                            <div className={"col-12 col-sm-4 h2 align-content-center "}><Lang>Categories</Lang></div>
                            <div className="col-12 col-sm-8 text-center text-sm-end">
                                <div style={{ verticalAlign: "middle" }} className="d-inline-block p-1">
                                    <PrimaryButton className="float-start float-sm-end" label={"Add New"} handleClick={handleAddNew} type={"button"}/>
                                </div>
                                <div style={{verticalAlign:"middle"}} className="d-inline-block float-end  p-1">
                                    <select className="slectLang form-select" defaultValue={"name"} onChange={handleSort} name="" id="">
                                        <option value="name"><Lang>Order By:(Name)</Lang></option>
                                        <option value="mostSale"><Lang>Most Sale</Lang></option>
                                        <option value="disable"><Lang>disable</Lang></option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-end ps-0 pe-0 pt-3">
                        <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                            <input ref={refSearch} type="text" className="form-control form-control-lg" placeholder={Lang({children: "Search for category"})} />
                        </div>
                        <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                            <PrimaryButton label={"Search"} handleClick={handleSearch} type={"button"} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 container-fluid">
                    <div className="row m-0 items">
                        {cateState.loading ? 
                        <CategoriesListLoading/>
                        : 
                            <CategoriesList />
                        }
                        </div>
                    </div>
            </div>
            {cateState.openEditModal &&
                <EditModal/>
            }
            {cateState.openAddModal &&
                <AddNewModal/>
            }
            </div>
    )
}

