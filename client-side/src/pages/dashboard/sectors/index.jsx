import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../assets/js/lang";
import { PrimaryButton } from "../../../components/primaryButton";
import DataTable from "react-data-table-component";
import { SelectAction } from "../../../components/SelectAction";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { useSectorAction, useSectorState } from "../../../context/sectorsContext";
import { useAppAction } from "../../../context/context";
import { CustomLoader } from "../../../components/CustomLoader";
import { EditModal } from "./components/EditModal";
import { AddModal } from "./components/AddModal";
import { searchFunction } from "../../../assets/js/sharedFunction";
const selectData = [
    {
        name: "View",
        value: "view"
    },
    {
        name: "Remove",
        value: "remove"
    },
    {
        name: "Edit",
        value: "edit"
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
export function Sectors() {
    const columns = [
        {
            name: Lang({ children: "Id" }),
            selector: row => row.id,
            sortable: false
        },
        {
            name: Lang({ children: "Title" }),
            selector: row => row.title,
            sortable: true
        },
        {
            name: Lang({ children: "Adresse" }),
            selector: row => row.adresse,
            sortable: true
        },
        {
            name: Lang({ children: "Sales" }),
            selector: row => row.nbSales,
            sortable: true
        },
        {
            name: Lang({ children: "Users" }),
            selector: row => row.nbUsers,
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
            cell: row => <SelectAction options={selectData} id={row.id} onChange={handleActions} />,
            sortable: true
        },
    ]
    const refSearch = useRef();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(true)
    const sectorsState = useSectorState();
    const sectorsActions = useSectorAction();
    const appAction = useAppAction();
    useEffect(() => {
        //handle get all items 
        api({
            method: "get",
            url: "/allSectors",
            withCredentials: true,
        }).then(res => {
            return res.data;
        }).then(res => {
            console.log(res.data)
            sectorsActions({
                type: "SET_STORED_ITEMS",
                payload: res.data
            });
            setLoading(false)
        }).catch(err => {
            navigate(-1);
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            });
            setLoading(false);
        })
    }, [])
    useEffect(() => {
        sectorsActions({
            type: "SET_ALL_ITEMS",
            payload: sectorsState.storedItems
        })
    },[sectorsState.storedItems])
    const handleActions = (e) => {
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "remove":
                if (window.confirm("Are you sure you want to delete this sector")) {
                    setLoading(true);
                    api({
                        method: "delete",
                        url: "/sector/" + id,
                        withCredentials: true
                    }).then(res => {
                        return res.data
                    }).then(res => {
                        console.log(res.data);
                        sectorsActions({
                            type: "REMOVE_ONE",
                            payload: id,
                        })
                        appAction({
                            type: "SET_SUCCESS",
                            payload: res.message
                        })
                        setLoading(false);
                    }).catch(err => {
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        });
                        setLoading(false);
                    })
                }
                e.target.value = "default"
                break;
            case "edit":
                sectorsActions({
                    type: "SET_EDIT_ITEM",
                    payload: id,
                })
                sectorsActions({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                e.target.value = "default"
                break;
            case "view":
                navigate("/sectors/" + id);
                break;
            default:
                e.target.value = "default"
        }
    }
    const handleAddNew = (e) => {
        sectorsActions({
            type: "TOGGLE_ADD_MODAL",
            payload: true,
        })
    }
    const handleSearch = (e) => {
        e.preventDefault();
        var searchValue = refSearch.current.value;
        searchFunction(searchValue, sectorsState, sectorsActions, "title");
    }
    return (
        <>
        <div className="container-fluid products-page pt-2">
            <div className="row m-0">
                <div className="col-12 headerPage p-2 container-fluid">
                    <div className="row m-0 justify-content-between">
                        <div className={"col-5 h2 align-content-center "}><Lang>Sectors</Lang></div>
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
                        <input ref={refSearch} type="text"   className="form-control form-control-lg" placeholder={Lang({children: "Search for sector"})} />
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
                        data={sectorsState.allItems}
                        customStyles={customStyle}
                        pagination
                        progressPending={loading}
                        progressComponent={<CustomLoader />}
                    />
                </div>
            </div>
            </div>
            {
                sectorsState.openEditModal && <EditModal />
            }
            {
                sectorsState.openAddModal && <AddModal />
            }
        </>
    )
}