import { useEffect, useRef, useState } from "react"
import { Lang } from "../../../assets/js/lang"
import { PrimaryButton } from "../../../components/primaryButton"
import { useStocksAction, useStocksState } from "../../../context/stocksContext";
import { useAppAction } from "../../../context/context";
import { RecordTable } from "./components/RecordTable";
import api from "../../../api/api";
import { EditStockModal } from "./components/EditStockModal";
import { ButtonWithIcon } from "../../../components/ButtonWithIcon";
import { FaPaperPlane } from "react-icons/fa6";

export const Stocks = () => {
    const refSearch = useRef();
    const stocksState = useStocksState();
    const stocksAction = useStocksAction();
    const appAction = useAppAction();
    const [loading, setLoading] = useState(true);
    
    const handleSearch = (e) => {
        e.preventDefault();
        let textSearch = refSearch.current.value;
        if (textSearch.trim().length < 1) {
            stocksAction({
                type: "SET_ALL_ITEMS",
                payload: stocksState.storedItems
            })
        } else {
            stocksAction({
                type: "SET_ALL_ITEMS",
                payload: stocksState.storedItems.filter(item => {
                    return item.product.name.toLowerCase().includes(textSearch.trim().toLowerCase()) || item.product.barcode.toLowerCase().includes(textSearch.trim().toLowerCase())
                })
            })
        }
    }
    //handle close
    const handleClose = () => {
        stocksAction({
            type: "TOGGLE_EDIT_MODAL",
            payload: false
        })
        stocksAction({
            type: "SET_EDIT_ITEM",
            payload: 0
        })
    }
    //request to update data to the server side
    const handleStockSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        api({
            method: "post",
            url: "/stock/" + stocksState.editItem,
            data: formData,
            withCredentials: true,
        }).then(res => {
            return res.data;
        }).then(res => {
            stocksAction({
                type: "UPDATE_ITEM",
                payload: res.data
            })
            stocksAction({
                type: "TOGGLE_EDIT_MODAL",
                payload: false
            })
            stocksAction({
                type: "SET_EDIT_ITEM",
                payload: 0
            })
        })

    }
    //export stocks report 
    const exportData = () => {
        setLoading(true)
        api({
            method: "post",
            url: "/stocks/export",
            withCredentials: true
        }).then(res=>{
            //export data 
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;

            // Extraire le nom du fichier si dispo sinon par défaut
            const contentDisposition = res.headers["content-disposition"];
            let fileName = "stock_export.csv";
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match?.[1]) {
                    fileName = match[1];
                }
            }

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            setLoading(false)
        }).catch(err=>{
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    }
    useEffect(() => {
        api({
            method: "get",
            url: "/stocks",
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            stocksAction({
                type: "SET_STORED_ITEMS",
                payload: res.data
            })
            setLoading(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            });
            setLoading(false);
        })
    }, [])
    useEffect(() => {
        stocksAction({
            type: "SET_ALL_ITEMS",
            payload: stocksState.storedItems
        })
    },[stocksState.storedItems])
    return (
        <>
            <div className="container-fluid single-page pt-2">
                <div className="row m-0">
                    <div className="col-12 headerPage p-2 container-fluid">
                        <div className="row m-0 justify-content-between">
                            <div className={"col-5 h2 align-content-center "}><Lang>Stocks</Lang></div>
                            <div className="col-7 text-end">
                                <div style={{ verticalAlign: "middle" }} className="d-inline-block p-1">
                                    <PrimaryButton label={"Export Data"} handleClick={exportData} type={"button"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row m-0">
                    <div className="col-12 text-end ps-0 pe-0 pt-3 pb-3">
                        <form style={{verticalAlign:"middle"}} onSubmit={handleSearch} className="d-inline-block p-1">
                            <input ref={refSearch} type="text"  className="form-control form-control-lg" placeholder={Lang({children: "Search for Product Stock"})} />
                        </form>
                        <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                            <PrimaryButton label={"Search"} handleClick={handleSearch} type={"button"} />
                        </div>
                    </div>
                </div>
                <div className="row m-0">
                    <RecordTable state={stocksState} action={stocksAction} loading={loading} setLoading={setLoading}/>
                </div>
            </div>
            {
                stocksState.openEditModal && 
                <EditStockModal id={stocksState.editItem} handleClose={handleClose} handleSubmit={handleStockSubmit} />
            }
        </>
    )
}