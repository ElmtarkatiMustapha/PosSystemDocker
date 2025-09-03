import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../components/CustomLoader";
import { Lang } from "../../../assets/js/lang";
import { useAppState } from "../../../context/context";
import { Picture } from "../../dashboard/components/Picture";
import { SelectAction } from "../../../components/SelectAction";

export const SalesDataTable = ({loading, state, handleActions}) => {
    const appState = useAppState();
    const options = [
        {
            name: "View",
            value: "view"
        },
        {
            name: "Set Delivered",
            value: "delivered"
        },
        {
            name: "Download Invoice",
            value: "invoice"
        }
    ]
    
    const columns = [
        {
            name: Lang({ children: "Picture" }),
            selector: row => <Picture  picture={row.customer?.picture?row.customer?.picture:"defaultProfile.jpg" } />,
            sortable: false
        },
        {
            name: Lang({ children: "id" }),
            selector: row => row.id,
            sortable: true,
        },
        {
            name: Lang({ children: "Customer" }),
            selector: row => row.customer?.name,
            sortable: true,
            minWidth:"130px"
        },
        {
            name: Lang({ children: "User" }),
            selector: row => row.customer?.sector?.users[0]?.name,
            sortable: true,
            minWidth:"130px"
        },
        {
            name: Lang({ children: "Sector" }),
            selector: row => row.customer?.sector?.title,
            sortable: true,
            minWidth:"130px"
        },
        {
            name: Lang({ children: "Qnt" }),
            selector: row => row.qnt,
            sortable: true
        },
        {
            name: Lang({ children: "Discount" }),
            selector: row => Number(Number(row.discount).toFixed(2)),
            sortable: true,
            minWidth:"140px"
        },
        {
            name: Lang({ children: "Total (HT)" }),
            selector: row => Number(Number(row.total).toFixed(2)),
            sortable: true,
            minWidth:"140px"
        },
        {
            name: Lang({ children: "Tax" }),
            selector: row => (Number(row.total) * Number(row.tax)/100).toFixed(2),
            sortable: true,
            minWidth:"140px"
        },
        {
            name: Lang({ children: "Total (TTC)" }),
            selector: row => Number(Number(row.total)+(Number(row.total) * Number(row.tax)/100)).toFixed(2),
            sortable: true,
            minWidth:"140px"
        },
        {
            name: Lang({ children: "Date" }),
            selector: row => row.date,
            sortable: true,
            minWidth:"150px"
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <SelectAction options={options } id={row.id} onChange={handleActions} />,
            sortable: false,
            minWidth:"150px"
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