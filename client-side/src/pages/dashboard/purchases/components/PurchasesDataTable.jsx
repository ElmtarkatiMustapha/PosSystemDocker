import DataTable from "react-data-table-component";
import { Lang } from "../../../../assets/js/lang";
import { SelectAction } from "../../../../components/SelectAction";
import { CustomLoader } from "../../../../components/CustomLoader";
import { useAppState } from "../../../../context/context";

export function PurchaseDataTable({state,loading,handleActions}) {
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
            name: Lang({ children: "Supplier" }),
            selector: row => row.supplier,
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
            name: Lang({ children: "Total(dh)" }),
            selector: row => Number(Number(row.total).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Date" }),
            selector: row => row.date,
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