import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../assets/js/lang";
import { PrimaryButton } from "../../../components/primaryButton";
import DataTable from "react-data-table-component";
import { AddModal } from "./components/AddModal";
import { EditModal } from "./components/EditModal";
import { CustomLoader } from "../../../components/CustomLoader";
import { useAppAction, useAppState } from "../../../context/context";
import { usePosAction, usePosState } from "../../../context/posContext";
import { Picture } from "../../dashboard/components/Picture";
import { SelectAction } from "../../../components/SelectAction";
import api from "../../../api/api";
import { ViewModal } from "./components/ViewModal";

export function Customer() {
    const refSearch = useRef();
    const [loading, setLoading] = useState(true)
    const appState = useAppState();
    const posState = usePosState();
    const posAction = usePosAction();
    const appAction = useAppAction();
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
            selector: row => row.sectorTitle,
            sortable: true
        },
        {
            name: Lang({ children: "Phone" }),
            selector: row => row.phone,
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
    const handleActions = (e) => {
        //handle actions
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "view":
                //view
                posAction({
                    type: "SET_CUSTOMER_CURRENT",
                    payload: id
                })
                posAction({
                    type: "TOGGLE_CUSTOMER_CURRENT_MODAL",
                    payload: true,
                })
                e.target.value = "default"
                break;
            case "remove":
                //remove
                e.target.value = "default"
                break;
            case "edit":
                posAction({
                    type: "SET_CUSTOMER_EDIT",
                    payload: id
                })
                posAction({
                    type: "TOGGLE_CUSTOMER_EDIT_MODAL",
                    payload: true,
                })
                e.target.value = "default"
                break;
            default:
                break;
        }
    }
    const handleAddNew = () => {
        //handle add customer
        posAction({
            type: "TOGGLE_CUSTOMER_ADD_NEW_MODAL",
            payload: true
        })
    }
    const handleSearch = (e) => {
        //handle serach
    }
    useEffect(() => {
        //get user customer
        api({
            method: "GET",
            url: "/posCustomers",
            withCredentials: true
        }).then(res => {
            return res.data;
        }).then(res => {
            //set customers list
            posAction({
                type: "SET_CUSTOMERS_ALL_ITEMS",
                payload: res.data
            })
            posAction({
                type: "SET_CUSTOMERS_STORED_ITEMS",
                payload: res.data
            })
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
        })
    },[])
    return (
        <>
            <main style={{height:"100vh"}} className="w-100">
                <div
                    style={{marginTop:"4.5rem"}}
                    className="text-start d-inline-block w-100"
                >
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
                                    data={posState.customersContext.allItems}
                                    customStyles={appState.tableStyle}
                                    pagination
                                    progressPending={loading}
                                    progressComponent={<CustomLoader />}
                                    />
                            </div>
                        </div>
                    </div>
                    { posState.customersContext.openAddModal && <AddModal/>}
                    { posState.customersContext.openEditModal && <EditModal/>}
                    { posState.customersContext.openViewModal && <ViewModal/>}
                </div>
            </main>
        </>
    )
}