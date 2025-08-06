import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../../components/CustomLoader";
import { Lang } from "../../../../assets/js/lang";
import { SelectAction } from "../../../../components/SelectAction";
import { useAppState } from "../../../../context/context";

export function SpentsDataTable({state,loading,handleActions}) {
    const appState = useAppState();
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
        }
    ]
    const columns = [
        {
            name: Lang({ children: "id" }),
            selector: row => row.id,
            sortable: true,
        },
        {
            name: Lang({ children: "Title" }),
            selector: row => row.title,
            sortable: true
        },
        {
            name: Lang({ children: "User" }),
            selector: row => row.user,
            sortable: true
        },
        {
            name: Lang({ children: "Amount(dh)" }),
            selector: row => Number(Number(row.amount).toFixed(2)),
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
    ]
    
    return (
        <DataTable
            columns={columns}
            data={state.allItems}
            customStyles={appState.tableStyle}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
        />
    )
}