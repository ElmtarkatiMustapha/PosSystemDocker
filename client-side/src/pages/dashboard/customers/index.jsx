import DataTable from "react-data-table-component";
import { Lang } from "../../../assets/js/lang";
import { PrimaryButton } from "../../../components/primaryButton";
import { CustomLoader } from "../../../components/CustomLoader";
import { useCustomersAction, useCustomersState } from "../../../context/customersContext";
import { useEffect, useRef, useState } from "react";
import { useAppAction, useAppState } from "../../../context/context";
import { SelectAction } from "../../../components/SelectAction";
import { Picture } from "../components/Picture";
import api from "../../../api/api";
import { searchFunction } from "../../../assets/js/sharedFunction";
import { AddModal } from "./components/AddModal";
import { EditModal } from "./components/EditModal";
import { useNavigate } from "react-router-dom";


export function Customers() {
    const customersState = useCustomersState();
    const customersAction = useCustomersAction();
    const appState = useAppState();
    const appAction = useAppAction();
    const [loading, setLoading] = useState(true);
    const refSearch = useRef();
    const navigate = useNavigate();
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
            name: Lang({ children: "Sector" }),
            selector: row => row.sector?.title,
            sortable: true
        },
        {
            name: Lang({ children: "Phone" }),
            selector: row => row.phone,
            sortable: true
        },
        {
            name: Lang({ children: "Total" }),
            selector: row => Number(Number(row.total).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Purchase" }),
            selector: row => row.purchase,
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
        searchFunction(textSearch, customersState, customersAction, "name");
    }
    const handleAddNew = (e) => {
        customersAction({
            type: "TOGGLE_ADD_MODAL",
            payload: true 
        })
    }
    const handleActions = (e) => {
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "view":
                navigate("/customers/"+id)
                break;
            case "remove":
                if (window.confirm("are you sure you want to delete this products")) {
                    setLoading(true)
                    // handle remove
                    api({
                        method: "delete",
                        url: "/customer/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "success"
                        });
                        customersAction({
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
                customersAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                customersAction({
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
            url: "/allCustomers",
            withCredentials: true,
        }).then((res) => {
            return res.data;
        }).then((res) => {
            //add to the context state
            // console.log(res.data)
            customersAction({
                type: "SET_STORED_ITEMS",
                payload:res.data
            })
            customersAction({
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
        customersAction({
            type: "SET_ALL_ITEMS",
            payload: customersState.storedItems
        })
    },[customersState.storedItems])
    return (
        <>
        <div className="container-fluid">
            <div className="row m-0">
                <div className="col-12 headerPage p-2 container-fluid">
                    <div className="row m-0 justify-content-between">
                        <div className={"col-5 h2 align-content-center "}><Lang>Customers</Lang></div>
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
                        <input ref={refSearch} type="text"   className="form-control form-control-lg" placeholder={Lang({children: "Search for customer"})} />
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
                        data={customersState.allItems}
                        customStyles={appState.tableStyle}
                        pagination
                        progressPending={loading}
                        progressComponent={<CustomLoader />}
                        />
                </div>
            </div>
        </div>
        { customersState.openAddModal && <AddModal/>}
        { customersState.openEditModal && <EditModal/>}
        </>
    )
}