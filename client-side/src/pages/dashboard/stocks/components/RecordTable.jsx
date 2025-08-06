import DataTable from "react-data-table-component";
import { Lang } from "../../../../assets/js/lang";
import { useAppAction, useAppState } from "../../../../context/context";
import { CustomLoader } from "../../../../components/CustomLoader";
import { format } from "date-fns";
import { SelectAction } from "../../../../components/SelectAction";
import api from "../../../../api/api";

export function RecordTable({ action, state, loading,setLoading }) {
    const appState = useAppState();
    const appAction = useAppAction();
    const conditionStyles = [
        {
            when: row => Date.parse(row.expired_at) < Date.now(),
            style: {
                backgroundColor: "#f8d7da",
            }
        },
        {
            when: row => {
                return Number(Date.now()) <= Number(Date.parse(row.expired_at)) && Number(Date.parse(row.expired_at)) <= Number(Number(Date.now()) + appState.settings?.alertSettings?.stock_expiration * 24 * 3600*1000)
            },
            style: {
                backgroundColor: "#fff3cd",
            }
        },
        {
            when: row => {
                return Number(Date.parse(row.expired_at)) > Number(Number(Date.now()) + appState.settings?.alertSettings?.stock_expiration * 24 * 3600*1000) || row.expired_at == null
            },
            style: {
                backgroundColor: "#e8fbff",
            }
        }
    ]
    const styleRows = {
        headRow: {
            style: {
                fontSize: "1rem",
                fontFamily: "var(--bs-font-sans-serif)"
            }
        }
    }
    const columns = [
        {
            name: Lang({ children: "Id" }),
            selector: row => row.id,
            sortable: false
        },
        {
            name: Lang({ children: "Barcode" }),
            selector: row => row.product.barcode,
            sortable: true
        },
        {
            name: Lang({ children: "Product Name" }),
            selector: row => row.product.name,
            sortable: true
        },
        {
            name: Lang({ children: "Purchase" }),
            selector: row => row.purchase?.id,
            sortable: true
        },
        {
            name: Lang({ children: "Qnt initial" }),
            selector: row => row.stock_init,
            sortable: true
        },
        {
            name: Lang({ children: "Qnt Current" }),
            selector: row => row.stock_actuel,
            sortable: true
        },
        {
            name: Lang({ children: "Price" }),
            selector: row => row.price,
            sortable: true
        },
        {
            name: Lang({ children: "Date.C" }),
            selector: row => row.created_at?format(row.created_at, "dd-MM-yyyy"): "" ,
            sortable: true
        },
        {
            name: Lang({ children: "Date.E" }),
            selector: row => row.expired_at?format(row?.expired_at, "dd-MM-yyyy"): "",
            sortable: true
        },
        {
            name: Lang({ children: "Status" }),
            selector: row => Number(row.stock_actuel) > 0 ? "In Stock" :"Out of stock" ,
            sortable: true,
            conditionalCellStyles: [
			{
				when: row => Number(row.stock_actuel) > 0,
				style: {
                    color: 'var(--success)',
                    fontWeight: "bold",
				},
			},
			{
				when: row => Number(row.stock_actuel) == 0,
				style: {
                    color: 'var(--danger)',
                    fontWeight: "bold",
				},
			}
		]
        }, 
        {
            name: Lang({ children: "Actions" }),
            cell: row => <SelectAction options={SelectData} id={row.id} onChange={handleActions} />,
            sortable: true
        },
    ]
    const handleActions = (e) => {
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "remove":
                if (window.confirm("are you sure you want to delete this stock")) {
                    setLoading(true)
                    //handle remove
                    api({
                        method: "delete",
                        url: "/stock/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "success"
                        });
                        action({
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
                action({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                action({
                    type: "SET_EDIT_ITEM",
                    payload: id
                })
                e.target.value = "default"
                break;
            default:
                break;
        }
    }
    return (
        <div className="col-12 p-2 dataTableBox items">
            <DataTable
                columns={columns}
                data={state.allItems}
                customStyles={styleRows}
                conditionalRowStyles={conditionStyles}
                pagination
                progressPending={loading}
                progressComponent={<CustomLoader />}
            />
        </div>
    )
}

const SelectData = [
    {
        name: "Remove",
        value: "remove"
    },
    {
        name: "Edit",
        value: "edit"
    }
]