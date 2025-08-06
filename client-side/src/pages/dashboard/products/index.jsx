import { useEffect, useRef, useState } from "react"
import { Lang } from "../../../assets/js/lang"
import { PrimaryButton } from "../../../components/primaryButton"
import DataTable from "react-data-table-component";
import { SelectAction } from "../../../components/SelectAction";
import api, { getImageURL } from "../../../api/api";
import { useProductsAction, useProductsState } from "../../../context/productsContext";
import { ActionSelect } from "../../../components/ActionSelect";
import { useAppAction, useAppState } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import { EditModal } from "./components/EditModal";
import { AddNewModal } from "./components/AddNewModal";
import { CustomLoader } from "../../../components/CustomLoader";
import { Picture } from "../components/Picture";

export function Products() {
    
    const columns = [
        {
            name: Lang({ children: "Picture" }),
            selector: row => <Picture picture={row.picture} />,
            sortable: false
        },
        {
            name: Lang({ children: "barcode" }),
            selector: row => row.barcode,
            sortable: true
        },
        {
            name: Lang({ children: "Name" }),
            selector: row => row.name,
            sortable: true
        },
        {
            name: Lang({ children: "P.U.W" }),
            selector: row => Number(Number(row.wholesales_price).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "P.U.D" }),
            selector: row => Number(Number(row.retail_price).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Discount" }),
            selector: row => row.discount,
            sortable: true
        },
        {
            name: Lang({ children: "Cachier Margin" }),
            selector: row => Number(Number(row.cachier_margin).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Sales" }),
            selector: row => row.nbOrders,
            sortable: true
        },
        {
            name: Lang({ children: "Current Stock" }),
            selector: row => row.stocks === -1? Infinity : row.stocks,
            sortable: true
        },
        {
            name: Lang({ children: "Status" }),
            selector: row => row.active == 1? "Active" :"Disactive" ,
            sortable: true,
            conditionalCellStyles: [
			{
				when: row => row.active == 1,
				style: {
                    color: 'var(--success)',
                    fontWeight: "bold",
				},
			},
			{
				when: row => row.active == 0,
				style: {
                    color: 'var(--danger)',
                    fontWeight: "bold",
				},
			}
		]
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <SelectAction options={appState.selectData} id={row.id} onChange={handleActions} />,
            sortable: true
        },
    ]
    const refSearch = useRef();
    const productsState = useProductsState()
    const productsAction = useProductsAction();
    const appAction = useAppAction();
    const appState = useAppState();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(true)
    useEffect(() => {
        api({
            method: "get",
            url: "/allProducts",
            // withCredentials:true
        }).then(res => {
            return res.data;
        }).then(res => {
            productsAction({
                type: "SET_STORED_PRODUCTS",
                payload:res.data
            })
            productsAction({
                type: "SET_ALL_PRODUCTS",
                payload: res.data
            })
            setLoading(false)
        }).catch(err => {
            //handle error
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    }, [])
    useEffect(() => {
        productsAction({
            type: "SET_ALL_PRODUCTS",
            payload:productsState.storedProducts 
        })
    },[productsState.storedProducts])
    
    const handleActions = (e) => {
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "view":
                navigate("/products/"+id)
                break;
            case "remove":
                if (window.confirm("are you sure you want to delete this products")) {
                    setLoading(true)
                    //handle remove
                    api({
                        method: "delete",
                        url: "/product/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "success"
                        });
                        productsAction({
                            type: "REMOVE_ONE",
                            payload: id
                        })
                        setLoading(false)
                    }).catch(err => {
                        //handle error
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        })
                        setLoading(false)
                        e.target.value = "default"
                    })
                } else {
                    e.target.value = "default"
                }
                break;
            case "edit":
                productsAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                productsAction({
                    type: "SET_EDIT_PRODUCT",
                    payload: id
                })
                e.target.value = "default"
                break;
            default:
                break;
        }
        //handle change action 
    }
    const handleAddNew = () => {
        productsAction({
            type: "TOGGLE_ADD_MODAL",
            payload: true,
        })
    }
    const handleSearch = (e) => {
        e.preventDefault();
        let textSearch = refSearch.current.value;
        if (textSearch.trim().length < 1) {
            productsAction({
                type: "SET_ALL_PRODUCTS",
                payload: productsState.storedProducts
            })
        } else {
            productsAction({
                type: "SET_ALL_PRODUCTS",
                payload: productsState.storedProducts.filter(item => {
                    return item.name.toLowerCase().includes(textSearch.trim().toLowerCase()) || item.barcode.toLowerCase().includes(textSearch.trim().toLowerCase())
                })
            })
        }

    }
    const customStyle = {
        headRow: {
            style: {
                fontSize: "1rem",
                fontFamily: "var(--bs-font-sans-serif)"
            }
        },
        rows: {
            style: {
                backgroundColor: "white",
                "&:nth-child(2n)": {
                    backgroundColor: "#e8fbff",
                },
                border: "0px",
                fontFamily:"var(--bs-font-sans-serif)"
            },
        }
    }
    return (
        <>
        <div className="container-fluid products-page">
            <div className="row m-0">
                <div className="col-12 headerPage p-2 container-fluid">
                    <div className="row m-0 justify-content-between">
                        <div className={"col-5 h2 align-content-center "}><Lang>Products</Lang></div>
                        <div className="col-7 text-end">
                            <div style={{ verticalAlign: "middle" }} className="d-inline-block p-1">
                                <PrimaryButton className="float-start float-sm-end" label={"Add New"} handleClick={handleAddNew} type={"button"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row m-0">
                <div className="col-12 text-end ps-0 pe-0 pt-3 pb-3">
                    <form style={{verticalAlign:"middle"}} onSubmit={handleSearch} className="d-inline-block p-1">
                        <input ref={refSearch} type="text"   className="form-control form-control-lg" placeholder={"Search for category"} />
                    </form>
                    <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                        <PrimaryButton label={"Search"} handleClick={handleSearch} type={"button"} />
                    </div>
                </div>
            </div>
            <div className="row m-0">
                <div className="col-12 p-2 dataTableBox items">
                    <DataTable
                        columns={columns}
                        data={productsState.allProducts}
                        customStyles={customStyle}
                        pagination
                        progressPending={loading}
			            progressComponent={<CustomLoader />}
                    />
                </div>
            </div>
            </div>
            { productsState.openEditModal && <EditModal/>}
            { productsState.openAddModal && <AddNewModal/>}
        </>
    )
}


