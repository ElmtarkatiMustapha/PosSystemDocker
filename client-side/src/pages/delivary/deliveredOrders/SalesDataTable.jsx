import DataTable from "react-data-table-component";
import { useAppState } from "../../../context/context";
import { CustomLoader } from "../../../components/CustomLoader";
import { Lang } from "../../../assets/js/lang";
import { SelectAction } from "../components/SelectAction";

export function SalesDataTable({ loading, state, handleActions }) {
    const appState = useAppState();
    const options = [
            {
                title: "View",
                value: "view"
            },
            {
                title: "download Invoice",
                value: "invoice"
            }
        ]
        
        const columns = [
            {
                name: Lang({ children: "Id" }),
                selector: row => row.id,
                sortable: true
            },
            {
                name: Lang({ children: "Customer" }),
                selector: row => row.customer,
                sortable: true,
                minWidth: '130px'
            },
            {
                name: Lang({ children: "QNT" }),
                selector: row => row.qnt,
                sortable: true
            },
            {
                name: Lang({ children: "Discount" }),
                selector: row => row.discount,
                sortable: true
            },
            {
                name: Lang({ children: "Total (HT)" }),
                selector: row => Number(Number(row.total).toFixed(2)),
                sortable: true,
                minWidth: '130px'
            },
            {
                name: Lang({ children: "Tax" }),
                selector: row => (Number(row.total) * Number(row.tax)/100).toFixed(2),
                sortable: true
            },
            {
                name: Lang({ children: "Total (TTC)" }),
                selector: row => Number(Number(row.total)+(Number(row.total) * Number(row.tax)/100)).toFixed(2),
                sortable: true,
                minWidth: '140px'
            },
            {
                name: Lang({ children: "Delivered at" }),
                selector: row => row.date,
                sortable: true,
                minWidth: '150px'
            },
            {
                name: Lang({ children: "Actions" }),
                cell: row => <SelectAction options={options} id={row.id} onChange={handleActions} />,
                sortable: false,
                minWidth: '150px'
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