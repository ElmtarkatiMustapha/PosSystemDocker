import { useNavigate, useParams } from "react-router-dom"
import { Lang } from "../../../../assets/js/lang";
import { LoadingHeader } from "../../../../components/LoadingHeader";
import { useEffect, useState } from "react";
import api, { getImageURL } from "../../../../api/api";
import { useProductsAction, useProductsState } from "../../../../context/productsContext";
import { FilterDate } from "../../../../components/FilterDate";
import { ActionSelect } from "../../../../components/ActionSelect";
import { useAppAction } from "../../../../context/context";
import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../../components/CustomLoader";
import { ChartLineLoading } from "../../../../components/ChartLineLoading";
import { ChartLine } from "../../../../components/ChartLine";
import { CustomLoaderSmall } from "../../../../components/CustomLoaderSmall";
import { EditStockModal } from "../../stocks/components/EditStockModal";
import { EditModal } from "../components/EditModal";
import { format } from "date-fns";
import { DateRangeModal } from "../../../../components/DateRangeModal";
import { AddStockModal } from "../../stocks/components/AddStockModal";

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
export function SingleProduct() {
    const columns = [
        {
            name: Lang({ children: "Id" }),
            selector: row => row.id,
        },
        {
            name: Lang({ children: "Id Purchase" }),
            selector: row => row.purchase_id,
            sortable: true
        },
        {
            name: Lang({ children: "Initial Stock" }),
            selector: row => row.stock_init,
            sortable: true
        },
        {
            name: Lang({ children: "Current Stock" }),
            selector: row => row.stock_actuel,
            sortable: true
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <StockActions  id={row.id} onChange={handleStockActions} />,
            sortable: true
        },
    ]
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("week");
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [openEditStock, setOpenEditStock] = useState(false);
    const [openAddStock, setOpenAddStock] = useState(false);
    const [stockId, setStockId] = useState(0);
    const productState = useProductsState();
    const appAction = useAppAction();
    const navigate = useNavigate(); 
    const productsAction = useProductsAction();
    const productsState = useProductsState();
    const [selectionRange,setSelectionRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }])
    useEffect(() => {
        //get product infos
        setLoading(true)
        api({
            method: "post",
            url: "/productSingle/" + id,
            data: {
                filter : filter,
                startDate : startDate,
                endDate : endDate
            },
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
            productsAction({
                type: "SET_CURRENT_PRODUCT",
                payload: res.data
            })
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    },[filter])
    const handleFilter = (e) => {
        if (e.target.value === "range") {
            setOpenCalendar(true);
        } else {
            setFilter(e.target.value)
        }
    }
    const handleSubmitRange = (e) => {
        e.preventDefault()
        setStartDate(format(selectionRange[0].startDate, "Y-MM-dd"));
        setEndDate(format(selectionRange[0].endDate, "Y-MM-dd"));
        setFilter("range");
        handleCloseRangeModal();
    }
    const handleCloseRangeModal = () => {
        setOpenCalendar(false);
    }
    const handleAction = (e) => {

        switch (e.target.value) {
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
                        navigate("/products")
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
            default:

        }
    }
    const handleStockActions = (e) => {
        switch (e.target.value) {
            case "edit":
                setStockId(e.target.getAttribute("data-id"));
                setOpenEditStock(true);
                e.target.value = "default";
                break;
            case "remove":
                if (window.confirm("are you sure you want to delete this stock")) {
                    setLoading(true)
                    //handle remove
                    api({
                        method: "post",
                        url: "/deleteStockProduct/" + id,
                        data: {
                            stock_id: e.target.getAttribute("data-id")
                        },
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        return res.data;
                    }).then(res => {
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "success"
                        });
                        productsAction({
                            type: "UPDATE_STOCK",
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
                        e.target.value = "default"
                    })
                } else {
                    e.target.value = "default"
                }
                break;
            default:
            //default
                e.target.value = "default"
        }
    }
    const handleStockClose = () => {
        setOpenEditStock(false);
    }
    const handleStockSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        api({
            method: "post",
            url: "/stock/" + stockId,
            data: formData,
            withCredentials: true,
        }).then(res => {
            return res.data;
        }).then(res => {
            productsAction({
                type: 'EDIT_STOCK',
                payload: res.data
            });
            setOpenEditStock(false);
            setStockId(0);
        })

    }
    const handleAddStockClose = () => {
        setOpenAddStock(false)
    }
        return (
        <>
            <div className="single-page container-fluid">
                <div className="row  p-2 m-0">
                    {loading ? <LoadingHeader /> :
                        <div className="col-12 p-2 headerPage">
                            <div style={{ verticalAlign: "middle" }} className="image align-self-center  p-2 d-inline-block">
                                <div
                                    style={{
                                        backgroundImage: "url(" + getImageURL(productState.currentProduct?.picture) + ")",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        height: "3.5rem",
                                        width: "3.5rem",
                                        borderRadius: "50px",
                                        overflow: "hidden"
                                    }}
                                    className="bg-image">
                                </div>
                            </div>
                            <div style={{ verticalAlign: "middle" }} className=" align-self-center p-2 d-inline-block">
                                <div className="h5 m-0 title">{productState.currentProduct?.name} </div>
                                <div className="subTitle">{productState.currentProduct?.barcode}</div>
                            </div>
                            <div style={{ verticalAlign: "middle" }} className="controls d-inline-block align-content-center float-end ">
                                <FilterDate onChange={handleFilter} filter={filter} />
                                <ActionSelect onChange={handleAction} />
                            </div>
                        </div>
                    }
                </div>
                <div className="row m-0">
                    <div className="col-12 p-2 col-md-8">
                        <div className="customBox stocks">
                            {/* <div className="title p-2 pt-3 m-0 text-center h3">
                                <Lang>Stocks</Lang>
                            </div> */}
                            <div className="head p-2 pt-3  ">
                                <div className="title ps-2 m-0 h3 d-inline-block text-start"><Lang>Stocks</Lang></div>
                                <a role="button" onClick={()=>setOpenAddStock(true)} className="d-inline-block pe-2 float-end"><Lang>Add New</Lang></a>
                            </div>
                            <div className="content p-2">
                                <DataTable
                                    columns={columns}
                                    data={productState.currentProduct?.stocks}
                                    customStyles={customStyle}
                                    pagination
                                    progressPending={loading}
                                    progressComponent={<CustomLoader />}
                                    paginationPerPage={4}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 p-2 col-md-4">
                        <div className="customBox p-3  pricing">
                            <div className="head border border-secondary border-start-0 border-end-0 border-top-0">
                                <div className="title h5 d-inline-block text-start"><Lang>Pricing</Lang></div>
                                <a role="button" className="d-inline-block float-end"><Lang>Edit</Lang></a>
                            </div>
                            <div className="content text-center">
                                {loading ? <CustomLoaderSmall /> :
                                    <table className="table  text-start">
                                        <tbody>
                                            <tr className="">
                                                <td className="border-0 fs-6 pt-2 ps-2 pe-2 pb-0 text-secondary"><Lang>Retail Price</Lang>: </td>
                                                <td className=" border-0 fs-6 pt-2 ps-2 pe-2 pb-0 text-secondary">{productState.currentProduct?.retail_price} dh</td>
                                            </tr>
                                            <tr>
                                                <td className="border-0 fs-6 pt-2 ps-2 pe-2 pb-0 text-secondary"><Lang>Wholesale Price</Lang>: </td>
                                                <td className="border-0 fs-6 pt-2 ps-2 pe-2 pb-0 text-secondary">{productState.currentProduct?.wholesales_price} dh</td>
                                            </tr>
                                            <tr>
                                                <td className="border-0 fs-6 pt-2 ps-2 pe-2 pb-0 text-secondary"><Lang>Discount</Lang>: </td>
                                                <td className="border-0 fs-6 pt-2 ps-2 pe-2 pb-0 text-secondary">{productState.currentProduct?.discount}%</td>
                                            </tr>
                                            <tr>
                                                <td className="border-0 fs-6 pt-2 ps-2 pe-2 pb-0 text-secondary"><Lang>Cachier Margin</Lang>: </td>
                                                <td className="border-0 fs-6 pt-2 ps-2 pe-2 pb-0 text-secondary">{productState.currentProduct?.cachier_margin} dh</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row m-0">
                    <div className="col-12 p-2 col-md-6">
                        {loading ? <ChartLineLoading/>:
                            <ChartLine title={"Sales"} subTitle={productState.currentProduct?.filterTitle} dataX={productState.currentProduct?.sales?.dataX} dataY={productState.currentProduct?.sales?.dataY} flag={productState.currentProduct?.sales?.dataY.reduce((prev,curr)=>prev+curr)} />
                        }
                    </div>
                    <div className="col-12 p-2 col-md-6">
                        {loading ? <ChartLineLoading/>:
                            <ChartLine title={"Turnover"} subTitle={productState.currentProduct?.filterTitle} dataX={productState.currentProduct?.turnover?.dataX} dataY={productState.currentProduct?.turnover?.dataY} flag={productState.currentProduct?.turnover?.dataY.reduce((prev,curr)=>prev+curr).toFixed(2)+"dh"} />
                        }
                    </div>
                </div>
            </div>
            {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}
            {productsState.openEditModal && <EditModal/>}
            { openEditStock && <EditStockModal id={stockId} handleClose={handleStockClose} handleSubmit={handleStockSubmit} /> }
            { openAddStock && <AddStockModal state={productState} handleClose={handleAddStockClose} action={productsAction} /> }
        </>
    )
}

function StockActions({onChange, id}) {
    return (
        <div className="d-inline-block ps-1 pe-1">
            <select  onChange={onChange} data-id={id} className=" pt-1 pb-1 ps-2 pe-2  purpleSelect" defaultValue={"default"} name="" id="">
                <option value="default">Actions</option>
                <option value="edit"><Lang>Edit</Lang></option>
                <option value="remove"><Lang>Remove</Lang></option>
            </select>
        </div>
    )
}