import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../assets/js/lang";
import { searchFunction } from "../../../assets/js/sharedFunction";
import { PrimaryButton } from "../../../components/primaryButton";
import { useUsersAction, useUsersState } from "../../../context/usersContext"
import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../components/CustomLoader";
import { useAppAction, useAppState } from "../../../context/context";
import { Picture } from "../components/Picture";
import { SelectAction } from "../../../components/SelectAction";
import api from "../../../api/api";
import { AddNewModal } from "./components/AddNewModal";
import { EditModal } from "./components/EditModal";
import { useNavigate } from "react-router-dom";

export function Users() {
    const usersState = useUsersState();
    const usersAction = useUsersAction();
    const [loading, setLoading] = useState(true);
    const refSearch = useRef();
    const appState = useAppState();
    const appAction = useAppAction();
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
            name: Lang({ children: "CIN" }),
            selector: row => row.cin,
            sortable: true
        },
        {
            name: Lang({ children: "Phone" }),
            selector: row => row.phone,
            sortable: true
        },
        {
            name: Lang({ children: "UserName" }),
            selector: row => row.username,
            sortable: true
        },
        {
            name: Lang({ children: "Email" }),
            selector: row => row.email,
            sortable: true
        },
        {
            name: Lang({ children: "Roles" }),
            selector: row => {
                let array = row.roles.map(item => {
                    return item.title
                })
                return array.toString();
            },
            sortable: true
        },
        {
            name: Lang({ children: "Earning" }),
            selector: row => Number(Number(row.earning).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Sales" }),
            selector: row => row.orders,
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
            name: Lang({ children: "Cashier Mode" }),
            selector: row => row.cashier == 1? "Active" :"Disactive" ,
            sortable: true,
            conditionalCellStyles: [
			{
				when: row => row.cashier == 1,
				style: {
                    color: 'var(--success)',
                    fontWeight: "bold",
				},
			},
			{
				when: row => row.cashier == 0,
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
    /**
     * @desc handle actions [edit, delete, view]
     * @param {Event} e
     * @todo get the id of the user 
     * @todo handle actions with @switch statement
     */
    const handleActions = (e) => {
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "view":
                navigate("/users/"+id)
                break;
            case "remove":
                if (window.confirm("are you sure you want to delete this user")) {
                    setLoading(true)
                    // handle remove
                    api({
                        method: "delete",
                        url: "/user/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "success"
                        });
                        usersAction({
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
                usersAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                usersAction({
                    type: "SET_EDIT_ITEM",
                    payload: id
                })
                e.target.value = "default"
                break;
            default:
                break;
        }
    }
    /**
     * @desc open or close the add new modal
     */
    const handleAddNew = () => {
        usersAction({
            type: "TOGGLE_ADD_MODAL",
            payload: true 
        })
    }
    /**
     * 
     * @param {Event} e 
     * @todo get the text to search
     * @todo call @function {searchFunction}
     */
    const handleSearch = (e) => {
        e.preventDefault();
        let textSearch = refSearch.current.value;
        searchFunction(textSearch, usersState, usersAction, "name");
    }
    /**
     * @desc load all users from server 
     * @todo send get request to /allUsers
     * @todo store data received
     * @todo handle the errors
     */
    useEffect(() => {
        api({
            method: "get",
            url: "/allUsers",
            withCredentials: true
        }).then(res => {
            return res.data
        }).then(res => {
            usersAction({
                type: "SET_STORED_ITEMS",
                payload:res.data
            })
            // console.log(res.data)
            usersAction({
                type: "SET_ALL_ITEMS",
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
    }, [])
    /**
     * @desc set items in allItems variable when storedItems change
     */
    useEffect(() => {
        usersAction({
            type: "SET_ALL_ITEMS",
            payload: usersState.storedItems
        })
    },[usersState.storedItems])
    return (
        <div className="container-fluid pt-2">
            <div className="row m-0">
                <div className="col-12 headerPage p-2 container-fluid">
                    <div className="row m-0 justify-content-between">
                        <div className={"col-5 h2 align-content-center "}><Lang>Users</Lang></div>
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
                <div className="col-12 p-2  dataTableBox items">
                    <DataTable
                        columns={columns}
                        data={usersState.allItems}
                        customStyles={appState.tableStyle}
                        pagination
                        progressPending={loading}
                        progressComponent={<CustomLoader />}
                        />
                </div>
            </div>
            { usersState.openEditModal && <EditModal/>}
            { usersState.openAddModal && <AddNewModal/>}
        </div>
    )
}