import { useEffect, useState } from "react"
import { ChartLine } from "../../../../components/ChartLine"
import { Lang } from "../../../../assets/js/lang";
import DataTable from "react-data-table-component";
import api, { getImageURL } from "../../../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { FilterDate } from "../../../../components/FilterDate";
import { ActionSelect } from "../../../../components/ActionSelect";
import { ChartLineLoading } from "../../../../components/ChartLineLoading";
import { useCateAction, useCateState } from "../../../../context/categoriesContext";
import { useAppAction } from "../../../../context/context";
import { EditModal } from "../components/EditModal";
import { AddNewModal } from "../components/AddNewModal";
import { LoadingHeader } from "../../../../components/LoadingHeader";
import { format } from "date-fns";
import { DateRangeModal } from "../../../../components/DateRangeModal";
/**
 * for test chart line
 * @returns 
 */
export function SingleCategory() {
    const columns = [
    {
        name: Lang({ children: "Ranked" }),
        selector: (row,rowIndex)=>rowIndex+1,
        sortable: true
    },
    {
        name: Lang({ children: "Barcode" }),
        selector: row=>row.barcode,
        sortable: true,
    },
    {
        name: Lang({ children: "Product" }),
        sortable: true,
        selector: row=>row.name
    },
    {
        name: Lang({ children: "Qnt Sold" }),
        sortable: true,
        selector: row=>Number(row.quantity)
    },
    {
        name: Lang({ children: "Turnover" }),
        sortable: true,
        selector: row=> Number(Number(row.turnover).toFixed(2))
    }
    ]
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
    const [startDate,setStartDate]=useState(0)
    const [endDate, setEndDate] = useState(0)
    const [filter, setFilter] = useState("week");
    const [openCalendar, setOpenCalendar] = useState(false);
    const [selectionRange,setSelectionRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }])
    const [salesStatistic, setSalesStatistic] = useState(null);
    const [turnoverStatistic, setTurnoverStatistic] = useState(null);
    const [products, setProducts] = useState([]);
    const [filterTitle, setFilterTitle] = useState("Current Week"); 
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const cateAction = useCateAction();
    const cateState = useCateState();
    const appAction = useAppAction();
    const navigate = useNavigate();
    useEffect(() => {
        setLoading(true)
        api({
            method: "post",
            url: "/singleCategory/" + id,
            data: {
                filter: filter,
                startDate: startDate,
                endDate: endDate
            },
            withCredentials: true
        }).then(res=>{
            return res.data;
        }).then(res => {
            cateAction({
                type: "SET_CATEGORY",
                payload: res.data.info
            });
            // setCategoryInfos(res.data.info)
            setSalesStatistic(res.data.sales)
            setTurnoverStatistic(res.data.turnover)
            setFilterTitle(res.data.filterTitle)
            setProducts(res.data.products)
            setLoading(false)
        }).catch(err => {
            //handle error
            navigate(-1);
            setLoading(false)
        })
    }, [filter])
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
            case "remove":
                //code break
                if (window.confirm("are you sure you want to delete this category")) {
                    api({
                        method: "DELETE",
                        url: "/category/"+id,
                        // withCredentials:true,
                    }).then(res => {
                        return res.data;
                    }).then(res => {
                        //reload the list 
                        cateAction({
                            type: "LOAD_CATEGORIES",
                            payload:{
                                ...cateState,
                                allItems: res.data,
                                storedItems:res.data,
                                numberPages: Math.ceil(res.data.length / cateState.itemsPerPage),
                                currentList: res.data.slice(
                                    (cateState.currentPage - 1) * cateState.itemsPerPage,
                                    cateState.currentPage * cateState.itemsPerPage
                                )
                            }
                        });
                        appAction({
                            type: "SET_SUCCESS",
                            payload: res.message
                        })
                        navigate("/categories");
                        
                    }).catch(err => {
                        cateAction({
                            type: "SET_LOADING",
                            payload: false
                        })
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        })
                    })
                } else {
                    e.target.value = "default"
                }
                break;
            case "edit":
                cateAction({
                    type: "SET_EDIT_CATEGORY",
                    payload:id
                })
                cateAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload:true
                })
                e.target.value = "default"
                break;
            default:
                //code
        }
    }
    return (
        <>
        <div className="single-category-page single-page container-fluid p-3">
            <div className="row  p-2 m-0">
                {loading ? <LoadingHeader /> :
                    <div className="col-12 p-2 headerPage">
                        <div style={{ verticalAlign: "middle" }} className="image align-self-center  p-2 d-inline-block">
                            <div
                                style={{
                                    backgroundImage: "url(" + getImageURL(cateState.categoryInfos?.picture) + ")",
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
                            <div className="h5 m-0 title">{cateState.categoryInfos?.name}</div>
                            <div className="subTitle"><Lang>Products: </Lang>{cateState.categoryInfos?.nbProducts}</div>
                        </div>
                        <div style={{ verticalAlign: "middle" }} className="controls d-inline-block align-content-center float-end ">
                            <FilterDate onChange={handleFilter} filter={filter} />
                            <ActionSelect onChange={handleAction} />
                        </div>
                    </div>
                }
            </div>
            <div className="row pt-2 pb-2 m-0 statistics">
                <div className="col-12 col-md-6 p-2">
                        {loading ? <ChartLineLoading /> :
                        <ChartLine title={"Sales"} subTitle={String(filterTitle)} dataX={salesStatistic?.dataX} dataY={salesStatistic?.dataY} flag={Number(salesStatistic?.dataY.reduce((prev,curr)=>prev+curr)).toFixed(2)} />
                    }
                </div>
                {/* <div className="col-12 col-md-6 p-2">
                    {loading? <ChartLineLoading/>:
                        <ChartLine title={"Turnover"} subTitle={filterTitle} dataX={turnoverStatistic?.dataX} dataY={turnoverStatistic?.dataY} flag={Number(turnoverStatistic?.dataY.reduce((prev,curr)=>prev+curr)).toFixed(2)+"dh"} />
                    }
                </div> */}
            </div>
            <div className="row p-2 m-0 z-n1">
                <div className="col-12 products  p-3">
                    <div className="title text-center h3"><Lang>Top Products</Lang></div>
                    <div className="data">
                        <DataTable
                            columns={columns}
                            data={products}
                            customStyles={customStyle}
                        />
                    </div>
                </div>
            </div>
            </div>
            {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}
            {cateState.openEditModal &&
                <EditModal/>
            }
        </>
    )
}


