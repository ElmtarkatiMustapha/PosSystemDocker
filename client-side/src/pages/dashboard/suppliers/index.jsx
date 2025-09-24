import { useEffect, useState } from "react";
import { Lang } from "../../../assets/js/lang";
import { PrimaryButton } from "../../../components/primaryButton";
import { useRef } from "react";
import { searchFunction } from "../../../assets/js/sharedFunction";
import { useSuppliersAction, useSuppliersState } from "../../../context/suppliersContext";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { useAppAction, useAppState } from "../../../context/context";
import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../components/CustomLoader";
import { SelectAction } from "../../../components/SelectAction";
import { Picture } from "../components/Picture";
import { AddNewModal } from "./components/AddNewModal";
import { EditModal } from "./components/EditModal";

export function Suppliers() {
    const [loading, setLoading] = useState(true);
    const refSearch = useRef();
    const suppliersState = useSuppliersState();
    const suppliersAction = useSuppliersAction();
    const navigate = useNavigate();
    const appAction = useAppAction();
    const appState = useAppState();
    const columns = [
        {
            name: Lang({ children: "Picture" }),
            selector: row => <Picture  picture={row.picture? row.picture:"defaultProfile.jpg" } />,
            sortable: false
        },
        {
            name: Lang({ children: "Name" }),
            selector: row => row.name,
            sortable: true
        },
        {
            name: Lang({ children: "Ice" }),
            selector: row => row.ice,
            sortable: true
        },
        {
            name: Lang({ children: "Email" }),
            selector: row => row.email,
            sortable: true
        },
        {
            name: Lang({ children: "Total" }),
            selector: row => Number(Number(row.total).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Purchases" }),
            selector: row => row.purchases,
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
            sortable: false
        },
    ]
    const handleSearch = (e) => {
        e.preventDefault();
        let textSearch = refSearch.current.value;
        searchFunction(textSearch, suppliersState, suppliersAction, "name");
    }
    const handleAddNew = (e) => {
        suppliersAction({
            type: "TOGGLE_ADD_MODAL",
            payload: true 
        })
    }
    const handleActions = (e) => {
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "view":
                navigate("/suppliers/"+id)
                break;
            case "remove":
                if (window.confirm("are you sure you want to delete this products")) {
                    setLoading(true)
                    // handle remove
                    api({
                        method: "delete",
                        url: "/supplier/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "Success"
                        });
                        suppliersAction({
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
                suppliersAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                suppliersAction({
                    type: "SET_EDIT_ITEM",
                    payload: id
                })
                e.target.value = "default"
                break;
            default:
                break;
        }
    }
    //fetch data from server 
    useEffect(() => {
        api({
            method: "GET",
            url: "/allSuppliers",
            withCredentials: true,
        }).then((res) => {
            return res.data;
        }).then((res) => {
            //add to the context state
            // console.log(res.data)
            suppliersAction({
                type: "SET_STORED_ITEMS",
                payload:res.data
            })
            suppliersAction({
                type: "SET_ALL_ITEMS",
                payload: res.data
            })
            setLoading(false)
        }).catch(err => {
            //handle errors
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    }, [])
    useEffect(() => {
        suppliersAction({
            type: "SET_ALL_ITEMS",
            payload: suppliersState.storedItems
        })
    },[suppliersState.storedItems])
    return (
        <div className="container-fluid pt-2">
            <div className="row m-0">
                <div className="col-12 headerPage p-2 container-fluid">
                    <div className="row m-0 justify-content-between">
                        <div className={"col-5 h2 align-content-center "}><Lang>Suppliers</Lang></div>
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
                        <input ref={refSearch} type="text"   className="form-control form-control-lg" placeholder={Lang({children: "Search for supplier"})} />
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
                        data={suppliersState.allItems}
                        customStyles={appState.tableStyle}
                        pagination
                        progressPending={loading}
                        progressComponent={<CustomLoader />}
                        />
                </div>
            </div>
            { suppliersState.openEditModal && <EditModal/>}
            { suppliersState.openAddModal && <AddNewModal/>}
        </div>
    )
}