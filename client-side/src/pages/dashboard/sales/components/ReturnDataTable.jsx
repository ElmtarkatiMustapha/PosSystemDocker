import { Lang } from "../../../../assets/js/lang";
import { CustomLoader } from "../../../../components/CustomLoader";
import { useEffect, useState } from "react";
import { useSalesAction, useSalesState } from "../../../../context/salesContext";
import { useAppState } from "../../../../context/context";


export const ReturnDataTable = ({loading, allItems}) => {
    const salesAction = useSalesAction();
    const salesState = useSalesState();
    const appState = useAppState();
    const [selectedIds, setSelectedIds] = useState([]);
    /**
     * @desc handle select action 
     * @param {Event} e 
     * @param {Object} item 
     */
    const handleChange = (e,item) => {
        if (e.target.checked) {
            salesAction({
                type: "SET_SELECTED_ITEM",
                payload: salesState.selectedItems.concat([item])
            })
        } else {
            salesAction({
                type: "SET_SELECTED_ITEM",
                payload: salesState.selectedItems.filter(elem => {
                    return elem.id != item.id
                })
            })
        }
    }
    /**
     * controle input value for return qnt
     */
    const controlInput = (e,max,id) => {
        let value = parseInt(e.target.value)
        if (value < 0) {
            e.target.value = 0;
        } else if (value > max) {
            e.target.value = max
        } else {
            e.target.value = parseInt(value)
        }
        salesAction({
            type: "SET_SELECTED_ITEM",
            payload: salesState.selectedItems.map(elem => {
                if (elem.id === id) {
                    return {
                        ...elem,
                        return_qnt: parseInt(e.target.value)
                    }
                } else {
                    return elem
                }
            })
        })
    }
    /**
     * toggle all 
     */
    const toggleAll = (e) => {
        if (e.target.checked) {
            salesAction({
                type: "SET_SELECTED_ITEM",
                payload: salesState.selectedItems.concat(allItems.filter(elem => {
                    return !selectedIds.includes(elem.id)
                }))
            })
        } else {
            salesAction({
                type: "SET_SELECTED_ITEM",
                payload:[]
            })
        }
    }
    useEffect(() => {
        salesAction({
            type: "SET_SELECTED_ITEM",
            payload: allItems.filter((item) => {
                return item.return_qnt>0
            })
        })
    }, [allItems]);
    useEffect(() => {
        setSelectedIds(salesState.selectedItems.map(item => {
            return item.id
        }));
    }, [salesState.selectedItems])
    if (loading) {
        return (
            <CustomLoader/>
        )
    } else {
        return (
            allItems.length > 0?
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className="align-middle">
                            <tr>
                                <th className="cut-text fw-medium"><input type="checkbox" checked={salesState.selectedItems.length ===allItems.length} onChange={toggleAll} /></th> 
                                <th className="cut-text fw-medium"><Lang>id</Lang></th> 
                                <th className="cut-text fw-medium"><Lang>Barcode</Lang></th> 
                                <th className="cut-text fw-medium"><Lang>Product</Lang></th> 
                                <th className="cut-text fw-medium"><Lang>P.U</Lang></th> 
                                <th className="cut-text fw-medium"><Lang>Qnt</Lang></th> 
                                <th className="cut-text fw-medium"><Lang>Return Qnt</Lang></th>  
                                <th className="cut-text fw-medium"><Lang>Discount(%)</Lang></th> 
                                <th className="cut-text fw-medium"><Lang>Total({appState.settings?.businessInfo?.currency?.symbol})</Lang></th> 
                            </tr>
                        </thead>
                        <tbody >
                            {allItems.map(item => {
                                    return (
                                        <tr key={item.id}>
                                            <td className="cut-text fw-medium"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={(e)=>handleChange(e,item)} /></td> 
                                            <td className="cut-text fw-normal">{item.id }</td>
                                            <td className="cut-text fw-normal">{item.barcode}</td>
                                            <td className="cut-text fw-normal">{item.product}</td>
                                            <td className="cut-text fw-normal">{item.unitPrice} {appState.settings?.businessInfo?.currency?.symbol}</td>
                                            <td className="cut-text fw-normal">{item.qnt}</td>
                                            <td className="cut-text fw-normal">{ selectedIds.includes(item.id)? <input className="form-control" type="number" step={1} name="returnQnt" min={0} max={item.qnt} onChange={(e)=>controlInput(e,item.qnt,item.id)} defaultValue={item.return_qnt} /> : null}</td>
                                            <td className="cut-text fw-normal">{item.discount}</td>
                                            <td className="cut-text fw-normal">{item.total} {appState.settings?.businessInfo?.currency?.symbol}</td>
                                        </tr>
                                    )
                                })
                            }
                            
                        </tbody>
                    </table>
                    </div>
                    :
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12 text-center">
                                <Lang>No date Founded</Lang>
                            </div>
                        </div>
                    </div>
                )
        }
}