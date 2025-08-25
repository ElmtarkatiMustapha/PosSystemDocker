import DataTable from "react-data-table-component";
import { Lang } from "../../../../assets/js/lang";
import { SelectAction } from "../../../../components/SelectAction";
import { useAppAction, useAppState } from "../../../../context/context";
import { CustomLoader } from "../../../../components/CustomLoader";
import { useReturnAction, useReturnState } from "../../../../context/returnContext";
import api from "../../../../api/api";

const SelectOption = [
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
        },
        {
            name: "Download Invoice",
            value: "download_invoice"
        }
]

export const ReturnsDataTable = ({loading, setLoading}) => {
    const appState = useAppState();
    const appAction = useAppAction();
    const returnState = useReturnState();
    const returnAction = useReturnAction();
    const columns = [
        {
            name: Lang({ children: "id" }),
            selector: row => row.id,
            sortable: true,
        },
        {
            name: Lang({ children: "Sale id" }),
            selector: row => row.sale_id,
            sortable: true
        },
        {
            name: Lang({ children: "User" }),
            selector: row => row.user,
            sortable: true
        },
        {
            name: Lang({ children: "Qnt" }),
            selector: row => row.qnt,
            sortable: true
        },
        {
            name: Lang({ children: `Total(${appState.settings?.businessInfo?.currency?.symbol})` }),
            selector: row => Number(Number(row.total).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Date" }),
            selector: row => row.created_at,
            sortable: true
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <SelectAction options={SelectOption} id={row.id} onChange={handleActions} />,
            sortable: false
        },
    ];

    /**
     * handle actions of return record
     * @param {Event} e
     * for View
     * *@todo show modale with the data to view
     */
    const handleActions = (e) => {
        //handle actions
        let id = e.target.getAttribute("data-id")
        switch (e.target.value) {
            case "view":
                //show modale view 
                returnAction({
                    type: "SET_VIEW_ITEM",
                    payload: id
                })
                returnAction({
                    type: "TOGGLE_VIEW_MODAL",
                    payload: true
                })
                e.target.value = "default"
                break;
            case "edit":
                //show edit modal
                returnAction({
                    type: "SET_EDIT_ITEM",
                    payload: id
                })
                returnAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true
                })
                e.target.value = "default"
                break;
            case "remove":
                //send delete request
                if (window.confirm("Are you sure with this action?")) {
                    setLoading(true)
                    api({
                        method: "delete",
                        url: "return/" + id,
                        // withCredentials:true
                    }).then(res => {
                        //handle success delete
                        appAction({
                            type: "SET_SUCCESS",
                            payload:res.data.message
                        })
                        returnAction({
                            type: "REMOVE_ONE",
                            payload:id
                        })
                        setLoading(false)
                    }).catch(err => {
                        //handle error 
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        })
                    })
                    e.target.value = "default"
                }
                break;
            default:
                break;
        }
    }

    
    return (
        <DataTable
            columns={columns}
            data={returnState.allItems}
            customStyles={appState.tableStyle}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
        />
    )
}